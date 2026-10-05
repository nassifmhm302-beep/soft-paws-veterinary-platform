import { db } from "@/db";
import { bookings, bookingEvents, services, branches, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { bookingSchema } from "@/lib/validation";
import { generateBookingNumber } from "@/lib/booking-number";
import { isBranchOpenOnDate, isSlotStillAvailable, nextBookingHorizonDate, todayDateString } from "@/lib/availability";
import { sendBookingNotification } from "@/lib/email";
import { getClientKey, rateLimit } from "@/lib/rate-limit";
import type { OpeningHours } from "@/lib/availability";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const clientKey = getClientKey(req);
  const limit = rateLimit(`booking:${clientKey}`, 8, 10 * 60 * 1000);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: "عدد محاولات كبير، يرجى المحاولة لاحقًا." },
      { status: 429 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "طلب غير صالح." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || "البيانات المُرسلة غير صحيحة.";
    return Response.json({ ok: false, error: firstError, fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const input = parsed.data;

  // Idempotency: if this exact submission was already processed, return the existing booking.
  const existingByKey = await db
    .select()
    .from(bookings)
    .where(eq(bookings.idempotencyKey, input.idempotencyKey))
    .limit(1);

  if (existingByKey.length > 0) {
    const booking = existingByKey[0];
    return Response.json({ ok: true, booking: serializeBooking(booking), reused: true });
  }

  const [service] = await db.select().from(services).where(eq(services.slug, input.serviceSlug)).limit(1);
  const [branch] = await db.select().from(branches).where(eq(branches.slug, input.branchSlug)).limit(1);
  const [doctor] = await db.select().from(doctors).where(eq(doctors.slug, input.doctorSlug)).limit(1);

  if (!service || !service.active) {
    return Response.json({ ok: false, error: "يرجى اختيار خدمة صحيحة." }, { status: 422 });
  }
  if (!branch || !branch.active) {
    return Response.json({ ok: false, error: "يرجى اختيار فرع صحيح." }, { status: 422 });
  }
  if (!doctor || !doctor.active) {
    return Response.json({ ok: false, error: "يرجى اختيار طبيب صحيح." }, { status: 422 });
  }

  const today = todayDateString();
  const horizon = nextBookingHorizonDate();
  if (input.appointmentDate < today || input.appointmentDate > horizon) {
    return Response.json({ ok: false, error: "التاريخ المختار خارج نطاق الحجز المتاح." }, { status: 422 });
  }

  const openingHours = branch.openingHours as OpeningHours;
  if (!isBranchOpenOnDate(openingHours, input.appointmentDate)) {
    return Response.json({ ok: false, error: "الفرع مغلق في هذا التاريخ، يرجى اختيار تاريخ آخر." }, { status: 422 });
  }

  // Re-check real-time availability right before committing — a slot can become taken
  // between the time the user picked it and the moment they submit the form.
  const stillAvailable = await isSlotStillAvailable({
    branchId: branch.id,
    doctorId: doctor.id,
    date: input.appointmentDate,
    time: input.appointmentTime,
  });

  if (!stillAvailable) {
    return Response.json(
      { ok: false, error: "هذا الموعد لم يعد متاحًا. يرجى اختيار موعد آخر.", code: "SLOT_TAKEN" },
      { status: 409 }
    );
  }

  const bookingNumber = generateBookingNumber("VET");

  let insertedId: number;
  try {
    const result = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(bookings)
        .values({
          bookingNumber,
          status: "pending",
          petType: input.petType,
          petName: input.petName,
          petAge: input.petAge || null,
          petGender: input.petGender,
          petNotes: input.petNotes || null,
          serviceId: service.id,
          serviceName: service.name,
          branchId: branch.id,
          branchName: branch.name,
          doctorId: doctor.id,
          doctorName: doctor.name,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerWhatsapp: input.customerWhatsapp || null,
          customerEmail: input.customerEmail || null,
          customerAddress: input.customerAddress || null,
          customerCity: input.customerCity || null,
          customerNotes: input.customerNotes || null,
          idempotencyKey: input.idempotencyKey,
          emailStatus: "pending",
        })
        .returning();

      await tx.insert(bookingEvents).values({
        bookingId: created.id,
        eventType: "booking_created",
        metadata: { source: "website_booking_flow" },
      });

      return created;
    });
    insertedId = result.id;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("idempotency_key")) {
      const [existing] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.idempotencyKey, input.idempotencyKey))
        .limit(1);
      if (existing) return Response.json({ ok: true, booking: serializeBooking(existing), reused: true });
    }
    console.error("Booking insert failed", error);
    return Response.json({ ok: false, error: "تعذر إنشاء الحجز، يرجى المحاولة مرة أخرى." }, { status: 500 });
  }

  const [persisted] = await db.select().from(bookings).where(eq(bookings.id, insertedId)).limit(1);

  // Email notification — never blocks the booking from succeeding.
  const emailResult = await sendBookingNotification({
    bookingNumber: persisted.bookingNumber,
    petType: persisted.petType,
    petName: persisted.petName,
    serviceName: persisted.serviceName,
    branchName: persisted.branchName,
    doctorName: persisted.doctorName,
    appointmentDate: persisted.appointmentDate,
    appointmentTime: persisted.appointmentTime,
    customerName: persisted.customerName,
    customerPhone: persisted.customerPhone,
    customerEmail: persisted.customerEmail,
    customerNotes: persisted.customerNotes,
  });

  const emailStatus = emailResult.ok ? "sent" : emailResult.skipped ? "skipped" : "failed";

  await db
    .update(bookings)
    .set({
      emailStatus,
      emailSentAt: emailResult.ok ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(bookings.id, insertedId));

  await db.insert(bookingEvents).values({
    bookingId: insertedId,
    eventType: emailResult.ok ? "email_sent" : "email_failed",
    metadata: { error: emailResult.error || null },
  });

  const [final] = await db.select().from(bookings).where(eq(bookings.id, insertedId)).limit(1);

  return Response.json({ ok: true, booking: serializeBooking(final), emailStatus });
}

function serializeBooking(booking: typeof bookings.$inferSelect) {
  return {
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    petName: booking.petName,
    petType: booking.petType,
    serviceName: booking.serviceName,
    branchName: booking.branchName,
    doctorName: booking.doctorName,
    appointmentDate: booking.appointmentDate,
    appointmentTime: booking.appointmentTime,
    emailStatus: booking.emailStatus,
  };
}

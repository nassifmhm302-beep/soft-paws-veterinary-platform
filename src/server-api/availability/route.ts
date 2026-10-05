import { db } from "@/db";
import { branches, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAvailableSlots, isBranchOpenOnDate, nextBookingHorizonDate, todayDateString } from "@/lib/availability";
import type { OpeningHours } from "@/lib/availability";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const clientKey = getClientKey(req);
  const limit = rateLimit(`availability:${clientKey}`, 60, 60 * 1000);
  if (!limit.allowed) {
    return Response.json({ ok: false, error: "طلبات كثيرة جدًا." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const branchSlug = searchParams.get("branch");
  const doctorSlug = searchParams.get("doctor");
  const date = searchParams.get("date");

  if (!branchSlug || !doctorSlug || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ ok: false, error: "معطيات غير صحيحة." }, { status: 400 });
  }

  const today = todayDateString();
  const horizon = nextBookingHorizonDate();
  if (date < today || date > horizon) {
    return Response.json({ ok: true, open: false, slots: [], reason: "OUT_OF_RANGE" });
  }

  const [branch] = await db.select().from(branches).where(eq(branches.slug, branchSlug)).limit(1);
  const [doctor] = await db.select().from(doctors).where(eq(doctors.slug, doctorSlug)).limit(1);

  if (!branch || !doctor) {
    return Response.json({ ok: false, error: "الفرع أو الطبيب غير موجود." }, { status: 404 });
  }

  const openingHours = branch.openingHours as OpeningHours;
  const open = isBranchOpenOnDate(openingHours, date);

  if (!open) {
    return Response.json({ ok: true, open: false, slots: [], reason: "CLOSED" });
  }

  const slots = await getAvailableSlots({
    branchId: branch.id,
    doctorId: doctor.id,
    date,
    openingHours,
  });

  return Response.json({ ok: true, open: true, slots });
}

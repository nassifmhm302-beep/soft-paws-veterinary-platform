import { z } from "zod";
import { clinic } from "@/lib/clinic";
import { getClientKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(2, "يرجى إدخال الاسم الكامل."),
  phone: z.string().trim().min(6, "يرجى إدخال رقم هاتف صحيح."),
  email: z.string().trim().optional().default(""),
  message: z.string().trim().min(5, "يرجى كتابة رسالتك."),
});

export async function POST(req: Request) {
  const clientKey = getClientKey(req);
  const limit = rateLimit(`contact:${clientKey}`, 10, 10 * 60 * 1000);
  if (!limit.allowed) {
    return Response.json({ ok: false, error: "عدد محاولات كبير، يرجى المحاولة لاحقًا." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "طلب غير صالح." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message || "بيانات غير صحيحة." }, { status: 422 });
  }

  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey || clinic.email.startsWith("[")) {
    // No real email backend configured — we acknowledge receipt without faking delivery.
    return Response.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Soft Paws Veterinary <onboarding@resend.dev>",
        to: [clinic.email],
        subject: `رسالة جديدة من نموذج التواصل — ${parsed.data.name}`,
        html: `<div dir="rtl" style="font-family:sans-serif;">
          <p><strong>الاسم:</strong> ${parsed.data.name}</p>
          <p><strong>الهاتف:</strong> ${parsed.data.phone}</p>
          <p><strong>البريد:</strong> ${parsed.data.email || "—"}</p>
          <p><strong>الرسالة:</strong><br/>${parsed.data.message}</p>
        </div>`,
      }),
    });
    return Response.json({ ok: true, delivered: res.ok });
  } catch {
    return Response.json({ ok: true, delivered: false });
  }
}

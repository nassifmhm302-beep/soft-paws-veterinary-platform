import { clinic } from "./clinic";

type EmailResult = { ok: boolean; skipped?: boolean; error?: string };

/**
 * Sends a transactional HTML email through the Resend API.
 * Reads the secret key from the server-only environment variable EMAIL_API_KEY.
 * If no key is configured, the booking/order is still created but the email
 * is marked as "skipped" — we never fake a successful send.
 */
async function sendEmail(params: { to: string; subject: string; html: string }): Promise<EmailResult> {
  const apiKey = process.env.EMAIL_API_KEY;
  if (!apiKey) {
    return { ok: false, skipped: true, error: "EMAIL_API_KEY is not configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Soft Paws Veterinary <onboarding@resend.dev>",
        to: [params.to],
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { ok: false, error: `Resend API error ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Unknown email error" };
  }
}

function emailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="utf-8" /><title>${title}</title></head>
<body style="margin:0;padding:0;background:#F3ECE2;font-family:'IBM Plex Sans Arabic',Tahoma,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3ECE2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:560px;background:#FAF7F1;border-radius:20px;overflow:hidden;">
          <tr>
            <td style="background:#742F3A;padding:28px 32px;">
              <p style="margin:0;color:#EEE5D8;font-size:12px;letter-spacing:2px;text-transform:uppercase;">${clinic.name}</p>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">${title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;color:#2E2927;font-size:14px;line-height:1.9;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 32px;background:#EEE5D8;color:#54202A;font-size:12px;">
              هذه رسالة آلية من نظام الحجز الإلكتروني — ${clinic.name}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 0;color:#82404A;font-size:12px;width:140px;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;color:#2E2927;font-size:14px;font-weight:600;">${value}</td>
  </tr>`;
}

export async function sendBookingNotification(booking: {
  bookingNumber: string;
  petType: string;
  petName: string;
  serviceName: string;
  branchName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  customerNotes?: string | null;
}): Promise<EmailResult> {
  if (!clinic.email.startsWith("[")) {
    const html = emailShell(
      `طلب حجز جديد — ${booking.bookingNumber}`,
      `<p style="margin:0 0 16px;">وصل طلب حجز جديد عبر الموقع الإلكتروني، بانتظار المراجعة والتواصل مع العميل لتأكيد الموعد.</p>
       <table role="presentation" width="100%" style="border-collapse:collapse;">
         ${row("رقم الطلب", booking.bookingNumber)}
         ${row("الحيوان", `${booking.petName} (${booking.petType === "dog" ? "كلب" : booking.petType === "cat" ? "قطة" : "أخرى"})`)}
         ${row("الخدمة", booking.serviceName)}
         ${row("الفرع", booking.branchName)}
         ${row("الطبيب", booking.doctorName)}
         ${row("التاريخ المطلوب", booking.appointmentDate)}
         ${row("الوقت المطلوب", booking.appointmentTime)}
         ${row("اسم العميل", booking.customerName)}
         ${row("رقم الهاتف", booking.customerPhone)}
         ${row("البريد الإلكتروني", booking.customerEmail || "—")}
         ${row("ملاحظات", booking.customerNotes || "—")}
         ${row("الحالة", "قيد المراجعة (Pending)")}
       </table>`
    );
    return sendEmail({ to: clinic.email, subject: `طلب حجز جديد — ${booking.bookingNumber}`, html });
  }
  return { ok: false, skipped: true, error: "CLINIC_EMAIL is not configured" };
}

export async function sendOrderNotification(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  total: string;
  city: string;
  items: { name: string; quantity: number }[];
}): Promise<EmailResult> {
  if (!clinic.email.startsWith("[")) {
    const itemsHtml = order.items
      .map((item) => `<li style="margin-bottom:4px;">${item.name} × ${item.quantity}</li>`)
      .join("");
    const html = emailShell(
      `طلب شراء جديد — ${order.orderNumber}`,
      `<p style="margin:0 0 16px;">تم استلام طلب شراء جديد من المتجر الإلكتروني.</p>
       <table role="presentation" width="100%" style="border-collapse:collapse;">
         ${row("رقم الطلب", order.orderNumber)}
         ${row("العميل", order.customerName)}
         ${row("الهاتف", order.customerPhone)}
         ${row("المدينة", order.city)}
         ${row("الإجمالي", `${order.total} ر.س`)}
       </table>
       <p style="margin:16px 0 6px;color:#82404A;font-size:12px;">المنتجات</p>
       <ul style="margin:0;padding-inline-start:18px;">${itemsHtml}</ul>`
    );
    return sendEmail({ to: clinic.email, subject: `طلب شراء جديد — ${order.orderNumber}`, html });
  }
  return { ok: false, skipped: true, error: "CLINIC_EMAIL is not configured" };
}

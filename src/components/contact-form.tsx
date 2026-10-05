"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/icons";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "تعذر إرسال رسالتك، يرجى المحاولة مرة أخرى.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-burgundy text-white">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="heading-section text-lg text-dark">تم إرسال رسالتك بنجاح</h3>
        <p className="text-sm text-dark/60">سيتواصل معك فريقنا في أقرب وقت ممكن.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div>
        <label className="field-label" htmlFor="name">الاسم الكامل</label>
        <input id="name" name="name" required minLength={2} className="field-input" placeholder="اكتب اسمك" />
      </div>
      <div>
        <label className="field-label" htmlFor="phone">رقم الهاتف</label>
        <input id="phone" name="phone" required dir="ltr" className="field-input" placeholder="05xxxxxxxx" />
      </div>
      <div>
        <label className="field-label" htmlFor="email">البريد الإلكتروني (اختياري)</label>
        <input id="email" name="email" type="email" dir="ltr" className="field-input" placeholder="example@email.com" />
      </div>
      <div>
        <label className="field-label" htmlFor="message">رسالتك</label>
        <textarea id="message" name="message" required minLength={5} rows={4} className="field-input" placeholder="كيف يمكننا مساعدتك؟" />
      </div>
      {status === "error" && <p className="field-error">{error}</p>}
      <button type="submit" disabled={status === "loading"} className="btn btn-primary w-full disabled:opacity-60">
        {status === "loading" ? "جاري الإرسال…" : "إرسال الرسالة"}
      </button>
    </form>
  );
}

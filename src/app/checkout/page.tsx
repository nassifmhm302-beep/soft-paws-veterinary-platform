"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useMemo, useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

const SHIPPING_FLAT_RATE = 20;
const FREE_SHIPPING_THRESHOLD = 250;

type Status = "idle" | "loading" | "success" | "error";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const idempotencyKey = useId();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  const snapshotItems = useMemo(() => items, [items]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      customerName: String(form.get("customerName") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      customerWhatsapp: String(form.get("customerWhatsapp") || ""),
      customerEmail: String(form.get("customerEmail") || ""),
      address: String(form.get("address") || ""),
      city: String(form.get("city") || ""),
      notes: String(form.get("notes") || ""),
      paymentMethod: String(form.get("paymentMethod") || "cash_on_delivery"),
      idempotencyKey,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "تعذر إتمام الطلب، يرجى المحاولة مرة أخرى.");
        setStatus("error");
        return;
      }
      setOrderNumber(data.order.orderNumber);
      setStatus("success");
      clearCart();
    } catch {
      setError("حدث خطأ في الاتصال بالخادم، يرجى المحاولة مرة أخرى.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <main className="flex min-h-[80vh] items-center bg-cream pt-32 pb-24 md:pt-40">
        <div className="container-xl max-w-xl text-center">
          <Reveal>
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-burgundy text-white">
              <CheckIcon className="h-7 w-7" />
            </span>
            <h1 className="heading-display mt-6 text-[clamp(1.8rem,3.4vw,2.5rem)] text-dark">
              تم استلام طلبك بنجاح
            </h1>
            <p className="mt-4 text-dark/65">
              شكرًا لك، رقم طلبك هو <span className="font-semibold text-burgundy">{orderNumber}</span>. سيتواصل
              معك فريقنا لتأكيد التفاصيل والتوصيل.
            </p>
            <Link href="/shop" className="btn btn-primary mt-8">
              متابعة التسوق
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </main>
    );
  }

  if (snapshotItems.length === 0 && status !== "loading") {
    return (
      <main className="flex min-h-[70vh] items-center bg-cream pt-32 pb-24 md:pt-40">
        <div className="container-xl max-w-lg text-center">
          <p className="text-dark/60">سلتك فارغة، أضف منتجات أولًا قبل إتمام الطلب.</p>
          <Link href="/shop" className="btn btn-primary mt-7">
            تصفح المتجر
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl">
        <Reveal>
          <p className="eyebrow mb-4 text-burgundy">الدفع</p>
          <h1 className="heading-display text-[clamp(1.9rem,3.6vw,2.75rem)] text-dark">إتمام الطلب</h1>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-[var(--radius-lg)] bg-white p-7">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="customerName">الاسم الكامل</label>
                  <input id="customerName" name="customerName" required minLength={2} className="field-input" />
                </div>
                <div>
                  <label className="field-label" htmlFor="customerPhone">رقم الهاتف</label>
                  <input id="customerPhone" name="customerPhone" required dir="ltr" className="field-input" placeholder="05xxxxxxxx" />
                </div>
                <div>
                  <label className="field-label" htmlFor="customerWhatsapp">رقم الواتساب (اختياري)</label>
                  <input id="customerWhatsapp" name="customerWhatsapp" dir="ltr" className="field-input" placeholder="05xxxxxxxx" />
                </div>
                <div>
                  <label className="field-label" htmlFor="customerEmail">البريد الإلكتروني (اختياري)</label>
                  <input id="customerEmail" name="customerEmail" type="email" dir="ltr" className="field-input" />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="address">العنوان التفصيلي</label>
                <input id="address" name="address" required minLength={5} className="field-input" placeholder="الحي، الشارع، رقم المبنى" />
              </div>
              <div>
                <label className="field-label" htmlFor="city">المدينة</label>
                <input id="city" name="city" required minLength={2} className="field-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="notes">ملاحظات (اختياري)</label>
                <textarea id="notes" name="notes" rows={3} className="field-input" />
              </div>
              <div>
                <span className="field-label">طريقة الدفع</span>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="flex flex-1 items-center gap-3 rounded-[var(--radius-sm)] border border-beige p-4">
                    <input type="radio" name="paymentMethod" value="cash_on_delivery" defaultChecked />
                    الدفع عند الاستلام
                  </label>
                  <label className="flex flex-1 items-center gap-3 rounded-[var(--radius-sm)] border border-beige p-4">
                    <input type="radio" name="paymentMethod" value="bank_transfer" />
                    تحويل بنكي
                  </label>
                </div>
              </div>

              {status === "error" && <p className="field-error">{error}</p>}

              <button type="submit" disabled={status === "loading"} className="btn btn-primary mt-2 w-full disabled:opacity-60">
                {status === "loading" ? "جاري إرسال الطلب…" : "تأكيد الطلب"}
              </button>
            </form>
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-[var(--radius-lg)] bg-white p-7">
              <h2 className="heading-section text-lg text-dark">ملخص الطلب</h2>
              <div className="mt-5 flex flex-col gap-4">
                {snapshotItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold text-dark line-clamp-1">{item.name}</p>
                      <p className="text-dark/50">الكمية: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-burgundy">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2 border-t border-beige pt-5 text-sm">
                <div className="flex justify-between text-dark/60">
                  <span>المجموع الفرعي</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-dark/60">
                  <span>الشحن</span>
                  <span>{shipping === 0 ? "مجاني" : formatCurrency(shipping)}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-beige pt-3 text-base font-semibold text-dark">
                  <span>الإجمالي</span>
                  <span className="text-burgundy">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

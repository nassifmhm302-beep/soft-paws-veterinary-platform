"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import { ArrowIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl">
        <Reveal>
          <p className="eyebrow mb-4 text-burgundy">سلة المشتريات</p>
          <h1 className="heading-display text-[clamp(1.9rem,3.6vw,2.75rem)] text-dark">مراجعة طلبك</h1>
        </Reveal>

        {items.length === 0 ? (
          <Reveal className="mt-16 flex flex-col items-center gap-5 text-center">
            <p className="text-dark/60">سلتك فارغة حاليًا.</p>
            <Link href="/shop" className="btn btn-primary">
              تصفح المتجر
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <Reveal>
              <div className="flex flex-col divide-y divide-beige rounded-[var(--radius-lg)] bg-white">
                {items.map((item) => (
                  <div key={item.productId} className="flex flex-wrap items-center gap-5 p-6">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                      <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs uppercase text-dark/45">{item.brand}</p>
                      <Link href={`/shop/${item.slug}`} className="link-underline font-semibold text-dark">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-dark/50">{formatCurrency(item.price)} / قطعة</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-full border border-beige px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-sand"
                        aria-label="إنقاص الكمية"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-5 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-sand"
                        aria-label="زيادة الكمية"
                        disabled={item.quantity >= item.stock}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="w-24 text-left font-semibold text-burgundy">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      aria-label="إزالة من السلة"
                      className="text-dark/40 hover:text-burgundy"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <Link href="/shop" className="link-arrow text-sm">
                  متابعة التسوق
                  <ArrowIcon className="h-4 w-4" />
                </Link>
                <button type="button" onClick={clearCart} className="text-sm text-dark/50 hover:text-burgundy">
                  إفراغ السلة
                </button>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="rounded-[var(--radius-lg)] bg-white p-7">
                <h2 className="heading-section text-lg text-dark">ملخص الطلب</h2>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <span className="text-dark/60">المجموع الفرعي</span>
                  <span className="font-semibold text-dark">{formatCurrency(subtotal)}</span>
                </div>
                <p className="mt-2 text-xs text-dark/45">يُحسب الشحن عند إتمام الطلب.</p>
                <Link href="/checkout" className="btn btn-primary mt-7 w-full">
                  إتمام الطلب
                  <ArrowIcon className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}

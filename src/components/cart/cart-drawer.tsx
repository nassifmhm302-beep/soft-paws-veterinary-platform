"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./cart-context";
import { formatCurrency } from "@/lib/format";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/icons";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-[1100] transition-opacity duration-300 ${
        isDrawerOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!isDrawerOpen}
    >
      <button
        type="button"
        aria-label="إغلاق السلة"
        onClick={closeDrawer}
        className="absolute inset-0 bg-[rgba(46,41,39,0.45)]"
      />
      <aside
        className={`absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-500`}
        style={{ transform: isDrawerOpen ? "translateX(0)" : "translateX(-100%)", transitionTimingFunction: "cubic-bezier(.22,1,.36,1)" }}
        role="dialog"
        aria-label="سلة المشتريات"
      >
        <div className="flex items-center justify-between border-b border-beige px-6 py-5">
          <h2 className="heading-section text-lg text-dark">سلة المشتريات</h2>
          <button type="button" onClick={closeDrawer} aria-label="إغلاق" className="rounded-full p-2 hover:bg-sand">
            <CloseIcon className="h-5 w-5 text-dark" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <p className="text-dark/60">سلتك فارغة حاليًا</p>
              <Link href="/shop" onClick={closeDrawer} className="link-arrow">
                تصفح المتجر
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-5">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs text-burgundy-soft">{item.brand}</p>
                        <p className="text-sm font-semibold text-dark">{item.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        aria-label="إزالة من السلة"
                        className="text-dark/40 hover:text-burgundy"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-beige px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="grid h-6 w-6 place-items-center rounded-full hover:bg-sand"
                          aria-label="إنقاص الكمية"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="grid h-6 w-6 place-items-center rounded-full hover:bg-sand"
                          aria-label="زيادة الكمية"
                          disabled={item.quantity >= item.stock}
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-burgundy">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-beige px-6 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-dark/60">المجموع الفرعي</span>
              <span className="font-semibold text-dark">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/cart" onClick={closeDrawer} className="btn btn-outline w-full">
                عرض السلة
              </Link>
              <Link href="/checkout" onClick={closeDrawer} className="btn btn-primary w-full">
                إتمام الطلب
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

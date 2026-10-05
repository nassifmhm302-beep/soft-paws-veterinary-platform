"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/cart-context";
import { MinusIcon, PlusIcon } from "@/components/icons";

export function ProductActions({
  product,
}: {
  product: { id: number; slug: string; name: string; brand: string; price: string; imageUrl: string; stock: number };
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: Number(product.price),
        image: product.imageUrl,
        stock: product.stock,
      },
      quantity
    );
  }

  function handleBuyNow() {
    handleAdd();
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="field-label mb-0">الكمية</span>
        <div className="flex items-center gap-3 rounded-full border border-beige px-3 py-1.5">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-sand"
            aria-label="إنقاص الكمية"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-5 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-sand"
            aria-label="زيادة الكمية"
            disabled={quantity >= product.stock}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-dark/50">{outOfStock ? "نفدت الكمية" : `${product.stock} قطعة متوفرة`}</span>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={handleAdd} disabled={outOfStock} className="btn btn-outline flex-1 disabled:opacity-40">
          أضف للسلة
        </button>
        <button type="button" onClick={handleBuyNow} disabled={outOfStock} className="btn btn-primary flex-1 disabled:opacity-40">
          اشترِ الآن
        </button>
      </div>
    </div>
  );
}

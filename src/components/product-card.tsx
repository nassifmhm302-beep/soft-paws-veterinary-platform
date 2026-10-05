"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/cart/cart-context";
import { formatCurrency } from "@/lib/format";
import { StarIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export function ProductCard({
  product,
  index = 0,
}: {
  product: {
    id: number;
    slug: string;
    name: string;
    brand: string;
    price: string;
    rating: string;
    imageUrl: string;
    stock: number;
  };
  index?: number;
}) {
  const { addItem } = useCart();

  return (
    <Reveal delay={(index % 4) * 80}>
      <div className="group flex flex-col">
        <Link href={`/shop/${product.slug}`} className="block">
          <div className="image-reveal active relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-sand">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          </div>
        </Link>
        <div className="mt-4 flex flex-1 flex-col">
          <p className="text-xs uppercase tracking-wide text-dark/45">{product.brand}</p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="mt-1 text-sm font-semibold text-dark line-clamp-1">{product.name}</h3>
          </Link>
          <div className="mt-1 flex items-center gap-1 text-xs text-dark/50">
            <StarIcon className="h-3.5 w-3.5 text-burgundy" />
            {product.rating}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-base font-semibold text-burgundy">{formatCurrency(product.price)}</span>
            <button
              type="button"
              onClick={() =>
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand,
                  price: Number(product.price),
                  image: product.imageUrl,
                  stock: product.stock,
                })
              }
              disabled={product.stock <= 0}
              className="btn btn-ghost btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.stock <= 0 ? "نفدت الكمية" : "أضف للسلة"}
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

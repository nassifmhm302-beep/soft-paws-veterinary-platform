"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: string;
  rating: string;
  imageUrl: string;
  stock: number;
  categoryId: number | null;
  petType: string;
};

type Category = { id: number; name: string; slug: string };

const PAGE_SIZE = 8;
const SORTS = [
  { value: "featured", label: "الأكثر تميزًا" },
  { value: "price-asc", label: "السعر: من الأقل للأعلى" },
  { value: "price-desc", label: "السعر: من الأعلى للأقل" },
  { value: "rating", label: "الأعلى تقييمًا" },
];

export function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [petType, setPetType] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = products.filter((p) => Number(p.price) <= maxPrice);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
    if (petType !== "all") list = list.filter((p) => p.petType === petType || p.petType === "both");

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "rating":
        list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      default:
        break;
    }
    return list;
  }, [products, query, categoryId, petType, maxPrice, sort]);

  const visibleProducts = filtered.slice(0, visible);

  return (
    <div>
      <div className="flex flex-col gap-6 rounded-[var(--radius-lg)] bg-white p-6 shadow-[var(--shadow-soft)] md:flex-row md:items-end md:justify-between">
        <div className="flex-1">
          <label className="field-label" htmlFor="search">ابحث عن منتج</label>
          <input
            id="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            placeholder="اسم المنتج أو الماركة"
            className="field-input"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="pet-type">النوع</label>
          <select
            id="pet-type"
            value={petType}
            onChange={(e) => {
              setPetType(e.target.value);
              setVisible(PAGE_SIZE);
            }}
            className="field-input"
          >
            <option value="all">الكل</option>
            <option value="dog">كلاب</option>
            <option value="cat">قطط</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="sort">الترتيب</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="field-input"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[180px]">
          <label className="field-label" htmlFor="price">الحد الأقصى للسعر: {maxPrice} ر.س</label>
          <input
            id="price"
            type="range"
            min={20}
            max={200}
            step={10}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(Number(e.target.value));
              setVisible(PAGE_SIZE);
            }}
            className="w-full accent-burgundy"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setCategoryId(null);
            setVisible(PAGE_SIZE);
          }}
          className={`btn btn-sm ${categoryId === null ? "btn-primary" : "btn-outline"}`}
        >
          جميع الفئات
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCategoryId(c.id);
              setVisible(PAGE_SIZE);
            }}
            className={`btn btn-sm ${categoryId === c.id ? "btn-primary" : "btn-outline"}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-dark/50">{filtered.length} منتج متاح</p>

      {visibleProducts.length === 0 ? (
        <div className="mt-16 text-center text-dark/50">
          لا توجد منتجات مطابقة لبحثك. جرّب تعديل الفلاتر.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {visibleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {visible < filtered.length && (
        <Reveal className="mt-14 text-center">
          <button type="button" onClick={() => setVisible((v) => v + PAGE_SIZE)} className="btn btn-outline">
            عرض المزيد
          </button>
        </Reveal>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ShopClient } from "@/components/shop/shop-client";
import { getProducts, getProductCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "المتجر",
  description: "تسوق أغذية ومنتجات العناية البيطرية الموثوقة لحيوانك الأليف.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getProductCategories()]);

  return (
    <main className="pt-20">
      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-4 text-burgundy">المتجر</p>
            <h1 className="heading-display text-[clamp(2rem,4vw,3.25rem)] text-dark">
              منتجات مختارة بعناية لحيوانك
            </h1>
            <p className="mt-5 text-base leading-8 text-dark/65">
              تشكيلة من الأغذية ومنتجات العناية والإكسسوارات، جميعها مختارة بمعايير بيطرية موثوقة.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-20">
        <div className="container-xl">
          <ShopClient products={products} categories={categories} />
        </div>
      </section>
    </main>
  );
}

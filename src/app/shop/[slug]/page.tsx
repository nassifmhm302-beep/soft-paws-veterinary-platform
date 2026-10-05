import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { ProductActions } from "@/components/shop/product-actions";
import { StarIcon } from "@/components/icons";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.description };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const allProducts = await getProducts();
  const related = allProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const benefits = (product.benefits as string[]) || [];
  const ingredients = (product.ingredients as string[]) || [];
  const specifications = (product.specifications as { label: string; value: string }[]) || [];

  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl grid gap-14 lg:grid-cols-2">
        <Reveal variant="image" className="active">
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-sand">
            <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width:1024px) 45vw, 90vw" className="object-cover" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-wide text-dark/45">{product.brand}</p>
            <h1 className="heading-display mt-2 text-[clamp(1.7rem,3vw,2.5rem)] text-dark">{product.name}</h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-dark/60">
              <div className="flex items-center gap-1 text-burgundy">
                <StarIcon className="h-4 w-4" />
                {product.rating}
              </div>
              <span>({product.reviewsCount} تقييم)</span>
            </div>
            <p className="mt-5 text-2xl font-semibold text-burgundy">{formatCurrency(product.price)}</p>
            <p className="mt-5 max-w-md text-base leading-8 text-dark/65">{product.description}</p>
          </Reveal>

          <Reveal delay={100} className="mt-8">
            <ProductActions
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                price: product.price,
                imageUrl: product.imageUrl,
                stock: product.stock,
              }}
            />
          </Reveal>

          {benefits.length > 0 && (
            <Reveal delay={150} className="mt-10">
              <h2 className="heading-section text-lg text-dark">الفوائد</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {benefits.map((b) => (
                  <li key={b} className="text-sm leading-7 text-dark/65">— {b}</li>
                ))}
              </ul>
            </Reveal>
          )}

          {ingredients.length > 0 && (
            <Reveal delay={200} className="mt-8">
              <h2 className="heading-section text-lg text-dark">المكونات</h2>
              <p className="mt-3 text-sm leading-7 text-dark/65">{ingredients.join("، ")}</p>
            </Reveal>
          )}

          {product.usage && (
            <Reveal delay={250} className="mt-8">
              <h2 className="heading-section text-lg text-dark">طريقة الاستخدام</h2>
              <p className="mt-3 text-sm leading-7 text-dark/65">{product.usage}</p>
            </Reveal>
          )}

          {product.warnings && (
            <Reveal delay={300} className="mt-8 rounded-[var(--radius-md)] bg-sand p-5">
              <h2 className="text-sm font-semibold text-burgundy">تحذيرات</h2>
              <p className="mt-2 text-sm leading-7 text-dark/65">{product.warnings}</p>
            </Reveal>
          )}

          {specifications.length > 0 && (
            <Reveal delay={350} className="mt-8">
              <h2 className="heading-section text-lg text-dark">المواصفات</h2>
              <dl className="mt-4 flex flex-col divide-y divide-beige">
                {specifications.map((s) => (
                  <div key={s.label} className="flex justify-between py-2 text-sm">
                    <dt className="text-dark/50">{s.label}</dt>
                    <dd className="font-medium text-dark">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="container-xl mt-24">
          <h2 className="heading-section text-2xl text-dark">منتجات ذات صلة</h2>
          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

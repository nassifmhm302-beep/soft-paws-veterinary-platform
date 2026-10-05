import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, PawIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { ShopClient } from "@/components/shop/shop-client";
import { getProducts, getProductCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "متجر المخالب الناعمة",
  description: "أغذية ومنتجات عناية وإكسسوارات مختارة بعناية لحيوانك الأليف.",
};

const categoryColors = ["bg-[#dff4f0]", "bg-[#f8e4c7]", "bg-[#eee5fa]", "bg-[#e4eef8]", "bg-[#f8dfdf]", "bg-[#e9f1df]"];
const categoryIcons = ["🐾", "🥣", "🧴", "🧼", "🐱", "🐶"];

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getProductCategories()]);
  const featured = products.slice(0, 3);

  return (
    <main className="shop-page pt-20">
      <section className="shop-hero">
        <div className="container-xl shop-hero-grid">
          <Reveal className="shop-hero-copy">
            <p className="eyebrow mb-4 text-burgundy">متجر المخالب الناعمة</p>
            <h1 className="heading-display text-[clamp(2.5rem,6vw,5rem)] text-dark">
              كل ما يحتاجه<br />
              <span className="text-burgundy">حيوانك اليوم</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-8 text-dark/65">
              اختيارات موثوقة للأكل والعناية واللعب، يوصي بها فريقنا البيطري لتعيشوا أيامًا أسعد معًا.
            </p>
            <Link href="#products" className="btn btn-primary mt-8">
              تسوق الآن <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
          <Reveal className="shop-hero-art" delay={120}>
            <div className="shop-hero-paw"><PawIcon className="h-12 w-12" /></div>
            <div className="shop-hero-sale"><span>خصم حتى</span><strong>20%</strong></div>
            <Image
              src="https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1000&w=1000"
              alt="كلب سعيد يستعد لاكتشاف منتجات المتجر"
              fill
              priority
              sizes="(max-width: 767px) 90vw, 48vw"
              className="object-contain object-bottom"
            />
          </Reveal>
        </div>
      </section>

      <section className="shop-benefits border-y border-beige/70 bg-white">
        <div className="container-xl grid grid-cols-2 gap-5 py-7 md:grid-cols-4 md:gap-8">
          {[
            ["🚚", "توصيل سريع", "للطلبات داخل الرياض"],
            ["♡", "اختيارات موثوقة", "مراجعة بيطرية دقيقة"],
            ["✦", "دعم متخصص", "نساعدك في اختيار الأفضل"],
            ["✓", "دفع آمن", "تجربة شراء مطمئنة"],
          ].map(([icon, title, text]) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff1e5] text-lg text-burgundy">{icon}</span>
              <div><p className="text-sm font-semibold text-dark">{title}</p><p className="mt-0.5 text-xs text-dark/50">{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream py-14 md:py-20">
        <div className="container-xl">
          <div className="mb-8 text-center"><p className="eyebrow text-burgundy">اكتشف تشكيلتنا</p><h2 className="heading-section mt-3 text-3xl text-dark">تسوق حسب الفئة</h2></div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {categories.slice(0, 6).map((category, index) => (
              <a key={category.id} href={`#category-${category.id}`} className={`shop-category-card ${categoryColors[index % categoryColors.length]}`}>
                <span className="text-3xl">{categoryIcons[index % categoryIcons.length]}</span>
                <span className="mt-4 text-sm font-semibold text-dark">{category.name}</span>
                <span className="mt-1 text-xs text-dark/50">اختيارات متنوعة</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="bg-white py-14 md:py-20">
        <div className="container-xl">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="eyebrow text-burgundy">اختيارات الفريق</p><h2 className="heading-section mt-3 text-3xl text-dark">منتجات مميزة</h2></div>
            <p className="max-w-sm text-sm leading-7 text-dark/55">كل منتج هنا اختير ليضيف راحة وصحة وفرحًا إلى يوم حيوانك الأليف.</p>
          </div>
          <div className="shop-featured-grid">
            {featured.map((product) => (
              <Link key={product.id} href={`/shop/${product.slug}`} className="shop-featured-card group">
                <div className="shop-featured-image"><Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 767px) 90vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                <div className="p-5"><p className="text-xs text-dark/45">{product.brand}</p><h3 className="mt-2 line-clamp-2 font-semibold text-dark">{product.name}</h3><p className="mt-4 font-semibold text-burgundy">{product.price} ر.س</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="category-1" className="bg-sand py-14 md:py-20">
        <div className="container-xl"><div className="mb-8 text-center"><p className="eyebrow text-burgundy">تشكيلة كاملة</p><h2 className="heading-section mt-3 text-3xl text-dark">تصفح كل المنتجات</h2></div><ShopClient products={products} categories={categories} /></div>
      </section>

      <section className="bg-cream pb-20 pt-4">
        <div className="container-xl"><div className="shop-promo"><div><p className="text-sm font-semibold text-burgundy">عرض خاص من المخالب الناعمة</p><h2 className="mt-2 text-2xl font-semibold text-dark md:text-3xl">رفاهية أكثر، وراحة أكبر</h2><p className="mt-2 text-sm text-dark/60">اطلب منتجاتك المفضلة اليوم واستفد من توصيات فريقنا.</p></div><Link href="#products" className="btn btn-primary btn-sm">تصفح باقي المنتجات</Link></div></div>
      </section>
    </main>
  );
}

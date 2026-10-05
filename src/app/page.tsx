import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ServiceRow } from "@/components/service-row";
import { DoctorCard } from "@/components/doctor-card";
import { ProductCard } from "@/components/product-card";
import { BranchCard } from "@/components/branch-card";
import { BlogCard } from "@/components/blog-card";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, StarIcon } from "@/components/icons";
import { getServices, getDoctors, getFeaturedProducts, getBranches } from "@/lib/queries";
import { blogPosts, demoReviews } from "@/lib/content";

const WHY_US = [
  { number: "01", title: "أطباء متخصصون", text: "فريق طبي معتمد بخبرات متنوعة في كل التخصصات البيطرية." },
  { number: "02", title: "رعاية متكاملة", text: "من الفحص إلى الجراحة والمختبر، في منظومة واحدة مترابطة." },
  { number: "03", title: "تجهيزات حديثة", text: "أجهزة تشخيص وأشعة ومختبر داخلي يختصر وقت التشخيص." },
  { number: "04", title: "حجز إلكتروني", text: "احجز موعدك خلال دقائق واختر الطبيب والفرع والوقت المناسب." },
  { number: "05", title: "منتجات موثوقة", text: "تشكيلة مختارة من الأغذية والعناية المعتمدة بيطريًا." },
  { number: "06", title: "اهتمام بكل حالة", text: "نولي كل حيوان وقته الكامل دون استعجال في الفحص أو القرار." },
];

export default async function HomePage() {
  const [services, doctors, featuredProducts, branches] = await Promise.all([
    getServices(),
    getDoctors(),
    getFeaturedProducts(),
    getBranches(),
  ]);

  return (
    <main>
      <Hero />

      {/* INTRODUCTION — editorial, asymmetric */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl grid items-center gap-14 lg:grid-cols-2">
          <Reveal variant="image" className="active order-2 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]">
              <Image
                src="https://images.pexels.com/photos/5495141/pexels-photo-5495141.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1000"
                alt="عائلة تحتضن كلبها الذهبي في جو منزلي دافئ"
                fill
                sizes="(min-width:1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="eyebrow mb-4 text-burgundy">من نحن</p>
              <h2 className="heading-display text-[clamp(1.9rem,3.6vw,3rem)] text-dark">
                رعاية نضع فيها صحة حيوانك أولًا
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-dark/65">
                في المخالب الناعمة، نؤمن أن كل حيوان أليف يستحق رعاية دقيقة في بيئة هادئة، بعيدًا عن أجواء العيادات التقليدية
                الباردة. فريقنا الطبي يرافقك في كل خطوة، من الفحص الأول وحتى المتابعة طويلة المدى.
              </p>
              <Link href="/about" className="link-arrow mt-8 inline-flex text-sm">
                تعرف علينا أكثر
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-sand py-24 md:py-32">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="خدماتنا"
              title="رعاية طبية شاملة تحت سقف واحد"
              description="من الفحص الدوري إلى الجراحة الدقيقة، نقدم كل ما يحتاجه حيوانك الأليف بأيدٍ متخصصة."
            />
            <Reveal>
              <Link href="/services" className="link-arrow hidden text-sm sm:inline-flex">
                جميع الخدمات
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {services.map((service, i) => (
              <ServiceRow
                key={service.id}
                slug={service.slug}
                name={service.name}
                description={service.description}
                imageUrl={service.imageUrl}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US — typography led, no heavy cards */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl">
          <SectionHeading eyebrow="لماذا المخالب الناعمة" title="تفاصيل صغيرة تصنع فرقًا كبيرًا" align="center" />
          <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map((item, i) => (
              <Reveal key={item.number} delay={(i % 3) * 90}>
                <div className="border-t border-beige pt-6">
                  <span className="text-sm font-semibold text-beige">{item.number}</span>
                  <h3 className="heading-section mt-3 text-lg text-dark">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-dark/60">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="bg-sand py-24 md:py-32">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="فريقنا الطبي"
              title="أطباء يثق بهم الآلاف من محبي الحيوانات"
              description="أربعة أطباء متخصصون يجمعون بين الخبرة العلمية والحس الإنساني في التعامل."
            />
            <Reveal>
              <Link href="/doctors" className="link-arrow hidden text-sm sm:inline-flex">
                جميع الأطباء
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {doctors.map((doctor, i) => (
              <DoctorCard
                key={doctor.id}
                slug={doctor.slug}
                name={doctor.name}
                specialty={doctor.specialty}
                bio={doctor.bio}
                imageUrl={doctor.imageUrl}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SHOP PREVIEW */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="المتجر"
              title="منتجات مختارة بعناية لحيوانك"
              description="تشكيلة من الأغذية ومنتجات العناية المعتمدة بيطريًا."
            />
            <Reveal>
              <Link href="/shop" className="link-arrow hidden text-sm sm:inline-flex">
                تصفح المتجر بالكامل
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <Reveal className="mt-10 sm:hidden">
            <Link href="/shop" className="link-arrow text-sm">
              تصفح المتجر بالكامل
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="relative overflow-hidden bg-burgundy py-24 text-center text-white md:py-28">
        <div className="container-xl relative z-10">
          <Reveal className="mx-auto max-w-xl">
            <p className="eyebrow mb-4 text-beige">احجز موعدك</p>
            <h2 className="heading-display text-[clamp(1.9rem,3.6vw,3rem)]">
              حجز إلكتروني في دقائق، بلا انتظار
            </h2>
            <p className="mt-5 text-white/80">
              اختر الخدمة، الفرع، الطبيب، والموعد المناسب لك — وسنتولى الباقي.
            </p>
            <Link href="/booking" className="btn btn-outline-light mt-8">
              ابدأ الحجز الآن
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* BRANCHES */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl">
          <SectionHeading
            eyebrow="فروعنا"
            title="أقرب إليك مما تتصور"
            description="فروع مجهزة بالكامل في مواقع استراتيجية لخدمتك وخدمة حيوانك الأليف."
          />
          <div className="mt-14 flex flex-col gap-10">
            {branches.map((branch, i) => (
              <BranchCard key={branch.id} branch={branch} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="bg-sand py-24 md:py-32">
        <div className="container-xl">
          <SectionHeading eyebrow="آراء العملاء" title="تجارب حقيقية مع فريقنا" align="center" />
          <p className="mx-auto -mt-10 mb-14 max-w-md text-center text-xs text-dark/40">
            * نماذج تجريبية لتوضيح شكل آراء العملاء، وليست مرتبطة بأشخاص حقيقيين.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {demoReviews.map((review, i) => (
              <Reveal key={review.initials} delay={i * 100}>
                <div className="flex h-full flex-col rounded-[var(--radius-md)] bg-white p-7">
                  <div className="flex items-center gap-1 text-burgundy">
                    {Array.from({ length: review.rating }).map((_, s) => (
                      <StarIcon key={s} className="h-4 w-4" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-7 text-dark/70">{review.text}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-beige text-xs font-semibold text-burgundy">
                      {review.initials}
                    </span>
                    <span className="text-xs text-dark/50">صاحب {review.petType}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="المدونة" title="مقالات لرعاية أفضل" />
            <Reveal>
              <Link href="/blog" className="link-arrow hidden text-sm sm:inline-flex">
                جميع المقالات
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {blogPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-burgundy-dark py-24 text-center text-white md:py-28">
        <div className="container-xl">
          <Reveal className="mx-auto max-w-xl">
            <h2 className="heading-display text-[clamp(2rem,4vw,3.25rem)]">جاهزون للعناية بصديقك؟</h2>
            <p className="mt-5 text-white/75">
              احجز موعدك الآن أو اكتشف منتجاتنا المختارة لحيوانك الأليف.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link href="/booking" className="btn btn-primary">
                احجز الآن
              </Link>
              <Link href="/shop" className="btn btn-outline-light">
                تصفح المتجر
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

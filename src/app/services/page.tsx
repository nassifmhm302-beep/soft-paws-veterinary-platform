import type { Metadata } from "next";
import Link from "next/link";
import { ServiceRow } from "@/components/service-row";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";
import { getServices } from "@/lib/queries";

export const metadata: Metadata = {
  title: "خدماتنا",
  description: "تعرف على خدماتنا البيطرية الشاملة: الكشف، التطعيم، الجراحة، الأسنان، الأشعة، المختبر، العناية، وعلاج الطفيليات.",
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main className="pt-20">
      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-4 text-burgundy">خدماتنا</p>
            <h1 className="heading-display text-[clamp(2rem,4vw,3.25rem)] text-dark">
              رعاية طبية شاملة لكل مرحلة من حياة حيوانك
            </h1>
            <p className="mt-5 text-base leading-8 text-dark/65">
              من الفحص الروتيني إلى الجراحات الدقيقة، صممنا منظومة خدمات متكاملة يقدمها أطباء متخصصون بأحدث
              التجهيزات.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="container-xl">
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
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

      <section className="bg-burgundy py-20 text-center text-white">
        <div className="container-xl">
          <Reveal className="mx-auto max-w-lg">
            <h2 className="heading-section text-2xl">لم تجد الخدمة المناسبة؟</h2>
            <p className="mt-3 text-white/80">تواصل معنا وسيساعدك فريقنا في اختيار الخدمة الأنسب لحالة حيوانك.</p>
            <Link href="/contact" className="btn btn-outline-light mt-7">
              تواصل معنا
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

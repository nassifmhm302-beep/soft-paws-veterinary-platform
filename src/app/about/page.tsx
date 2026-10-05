import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";
import { getDoctors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "من نحن",
  description: "تعرف على قصة عيادة المخالب الناعمة، قيمنا، وفريقنا الطبي المتخصص في رعاية الحيوانات الأليفة.",
};

const VALUES = [
  { title: "الشفافية", text: "نوضح كل خطوة وكل تكلفة قبل اتخاذ أي قرار علاجي." },
  { title: "الرفق", text: "نتعامل مع كل حيوان بصبر واحترام لحالته النفسية والجسدية." },
  { title: "الدقة العلمية", text: "نعتمد على أحدث البروتوكولات الطبية البيطرية المعتمدة." },
  { title: "الاستمرارية", text: "نرافقك في متابعة صحة حيوانك على المدى الطويل، لا لمرة واحدة." },
];

export default async function AboutPage() {
  const doctors = await getDoctors();

  return (
    <main className="pt-20">
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-burgundy-dark">
        <div className="hero-media absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/4269274/pexels-photo-4269274.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=1600"
            alt="فريق استقبال العيادة البيطرية في أجواء هادئة واحترافية"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(40,30,28,.75),rgba(40,30,28,.25))]" />
        </div>
        <div className="container-xl relative z-10 pb-16">
          <Reveal>
            <p className="eyebrow mb-4 text-beige">من نحن</p>
            <h1 className="heading-display max-w-2xl text-[clamp(2rem,4.4vw,3.5rem)] text-white">
              قصة عيادة بُنيت على الثقة والاهتمام الحقيقي
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl grid gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-4 text-burgundy">بداياتنا</p>
            <h2 className="heading-section text-[clamp(1.7rem,3vw,2.5rem)] text-dark">
              من فكرة بسيطة إلى تجربة رعاية متكاملة
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-base leading-8 text-dark/65">
              انطلقت عيادة المخالب الناعمة من قناعة بسيطة: أن رعاية الحيوانات الأليفة تستحق نفس مستوى الاهتمام والدقة الذي
              نقدمه لأحبائنا. جمعنا فريقًا من الأطباء المتخصصين، وصممنا بيئة هادئة بعيدة عن التوتر المعتاد لزيارات
              العيادات، مع نظام حجز إلكتروني يحترم وقتك ووقت حيوانك.
            </p>
            <p className="mt-5 text-base leading-8 text-dark/65">
              اليوم، نواصل التوسع بفروع جديدة وخدمات أكثر تكاملًا، لكن المبدأ الأساسي لم يتغير: صحة حيوانك أولًا.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-24 md:py-32">
        <div className="container-xl">
          <SectionHeading eyebrow="قيمنا" title="ما يوجّه كل قرار نتخذه" align="center" />
          <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 90}>
                <div className="border-t border-beige pt-6">
                  <h3 className="heading-section text-lg text-dark">{v.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-dark/60">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-cream py-24 md:py-32">
        <div className="container-xl">
          <SectionHeading eyebrow="فريقنا" title="أربعة أطباء، فريق واحد" align="center" />
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doc) => (
              <Reveal key={doc.id}>
                <Link href={`/doctors/${doc.slug}`} className="group block text-center">
                  <div className="image-reveal active relative mx-auto aspect-square w-32 overflow-hidden rounded-full">
                    <Image src={doc.imageUrl} alt={doc.name} fill sizes="128px" className="object-cover" />
                  </div>
                  <h3 className="heading-section mt-4 text-base text-dark">{doc.name}</h3>
                  <p className="mt-1 text-xs text-burgundy">{doc.specialty}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-burgundy py-20 text-center text-white">
        <div className="container-xl">
          <Reveal className="mx-auto max-w-lg">
            <h2 className="heading-section text-2xl">هل أنت مستعد لزيارتنا؟</h2>
            <Link href="/booking" className="btn btn-outline-light mt-7">
              احجز موعدك الآن
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

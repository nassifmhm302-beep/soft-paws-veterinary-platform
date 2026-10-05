import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { clinic } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية الخاصة بعيادة المخالب الناعمة وكيفية التعامل مع بياناتك.",
};

const SECTIONS = [
  {
    title: "البيانات التي نجمعها",
    body: "نجمع فقط المعلومات التي تقدمها مباشرة عبر نماذج الحجز، المتجر، أو التواصل، مثل الاسم ورقم الهاتف والبريد الإلكتروني وبيانات حيوانك الأليف.",
  },
  {
    title: "كيف نستخدم بياناتك",
    body: "تُستخدم بياناتك حصريًا لإتمام طلبات الحجز والشراء، والتواصل معك بخصوص موعدك أو طلبك، وتحسين جودة خدماتنا.",
  },
  {
    title: "مشاركة البيانات",
    body: "لا نقوم ببيع أو مشاركة بياناتك مع أي طرف ثالث لأغراض تسويقية دون موافقتك الصريحة.",
  },
  {
    title: "أمان البيانات",
    body: "نعتمد على قواعد بيانات محمية وإجراءات تحقق من المدخلات لحماية بياناتك من الوصول غير المصرح به.",
  },
  {
    title: "حقوقك",
    body: "يحق لك طلب الاطلاع على بياناتك أو تعديلها أو حذفها في أي وقت عبر التواصل المباشر مع فريقنا.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl max-w-3xl">
        <Reveal>
          <p className="eyebrow mb-4 text-burgundy">سياسة الخصوصية</p>
          <h1 className="heading-display text-[clamp(1.9rem,3.6vw,2.75rem)] text-dark">خصوصيتك تهمنا</h1>
          <p className="mt-5 text-sm text-dark/50">آخر تحديث: يناير 2026</p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <h2 className="heading-section text-lg text-dark">{s.title}</h2>
              <p className="mt-3 text-base leading-8 text-dark/65">{s.body}</p>
            </Reveal>
          ))}
          <Reveal delay={SECTIONS.length * 80}>
            <h2 className="heading-section text-lg text-dark">تواصل معنا</h2>
            <p className="mt-3 text-base leading-8 text-dark/65">
              لأي استفسار يتعلق بالخصوصية، يرجى مراسلتنا على {clinic.email}.
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

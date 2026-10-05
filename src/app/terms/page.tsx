import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: "الشروط والأحكام الخاصة باستخدام موقع والحجز والشراء من عيادة المخالب الناعمة.",
};

const SECTIONS = [
  {
    title: "الحجز الإلكتروني",
    body: "تقديم طلب حجز عبر الموقع يُعد طلبًا أوليًا قيد المراجعة، وليس تأكيدًا نهائيًا للموعد. سيتواصل فريقنا معك عبر واتساب أو الهاتف لتأكيد الموعد النهائي.",
  },
  {
    title: "إلغاء وتعديل المواعيد",
    body: "يمكنك طلب تعديل أو إلغاء موعدك عبر التواصل المباشر مع العيادة في أقرب وقت ممكن قبل الموعد المحدد.",
  },
  {
    title: "المتجر الإلكتروني",
    body: "تخضع جميع الطلبات لتوفر المخزون. في حال عدم توفر أي منتج بعد الطلب، سيتم التواصل معك لتعديل الطلب أو استرجاع المبلغ.",
  },
  {
    title: "الأسعار",
    body: "جميع الأسعار المعروضة تشمل ضريبة القيمة المضافة ما لم يُذكر خلاف ذلك، وهي قابلة للتغيير دون إشعار مسبق.",
  },
  {
    title: "المسؤولية الطبية",
    body: "المعلومات الطبية المعروضة على الموقع لأغراض تعريفية فقط، ولا تغني عن الفحص والتشخيص المباشر من الطبيب البيطري.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl max-w-3xl">
        <Reveal>
          <p className="eyebrow mb-4 text-burgundy">الشروط والأحكام</p>
          <h1 className="heading-display text-[clamp(1.9rem,3.6vw,2.75rem)] text-dark">
            الشروط والأحكام
          </h1>
          <p className="mt-5 text-sm text-dark/50">آخر تحديث: يناير 2026</p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <h2 className="heading-section text-lg text-dark">{s.title}</h2>
              <p className="mt-3 text-base leading-8 text-dark/65">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}

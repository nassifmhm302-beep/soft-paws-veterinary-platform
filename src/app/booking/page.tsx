import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "الحجز",
  description: "معلومات الحجز والتواصل مع عيادة المخالب الناعمة.",
};

export default function BookingPage() {
  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl max-w-3xl">
        <p className="eyebrow mb-4 text-burgundy">الحجز</p>
        <h1 className="heading-display text-[clamp(2rem,4vw,3.25rem)] text-dark">موعد هادئ يبدأ بخطوة بسيطة</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-dark/65">
          هذه النسخة التعريفية منشورة على GitHub Pages. لإتمام حجز فعلي، يرجى ربط الموقع بخادم وقاعدة بيانات ثم تفعيل بيانات التواصل الخاصة بالعيادة.
        </p>
        <div className="mt-10 rounded-[var(--radius-lg)] bg-sand p-7 md:p-9">
          <h2 className="heading-section text-xl text-dark">تواصل مع فريق المخالب الناعمة</h2>
          <p className="mt-3 text-sm leading-7 text-dark/65">
            أرسل لنا بيانات الحيوان والخدمة المطلوبة، وسيتواصل معك الفريق لتأكيد الموعد.
          </p>
          <Link href="/contact" className="btn btn-primary mt-7">
            صفحة التواصل
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}

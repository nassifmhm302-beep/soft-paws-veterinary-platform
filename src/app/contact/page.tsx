import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ClockIcon, InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { clinic, isPlaceholder, whatsappHref } from "@/lib/clinic";
import { getBranches } from "@/lib/queries";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق عيادة المخالب الناعمة عبر الهاتف أو واتساب أو زيارة أحد فروعنا.",
};

export default async function ContactPage() {
  const branches = await getBranches();
  const waHref = whatsappHref("مرحبًا، لدي استفسار بخصوص خدمات العيادة.");

  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Reveal>
            <p className="eyebrow mb-4 text-burgundy">تواصل معنا</p>
            <h1 className="heading-display text-[clamp(1.9rem,3.6vw,3rem)] text-dark">نسعد بخدمتك ومساعدتك</h1>
            <p className="mt-5 max-w-md text-base leading-8 text-dark/65">
              سواء كان لديك استفسار عام، أو تحتاج مساعدة في اختيار الخدمة المناسبة، فريقنا جاهز للرد عليك.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-10 flex flex-col gap-5">
            <div className="flex items-center gap-3 text-dark/75">
              <PhoneIcon className="h-5 w-5 text-burgundy" />
              <span dir="ltr">{clinic.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-dark/75">
              <MailIcon className="h-5 w-5 text-burgundy" />
              <span>{clinic.email}</span>
            </div>
            {waHref && (
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-dark/75 hover:text-burgundy">
                <WhatsAppIcon className="h-5 w-5 text-burgundy" />
                تواصل عبر واتساب
              </a>
            )}
            {!isPlaceholder(clinic.instagramLink) && (
              <a href={clinic.instagramLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-dark/75 hover:text-burgundy">
                <InstagramIcon className="h-5 w-5 text-burgundy" />
                تابعنا على إنستغرام
              </a>
            )}
          </Reveal>

          <Reveal delay={150} className="mt-12">
            <h2 className="heading-section text-lg text-dark">فروعنا</h2>
            <div className="mt-5 flex flex-col gap-5">
              {branches.map((b) => (
                <div key={b.id} className="flex items-start gap-3 text-sm text-dark/70">
                  <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                  <div>
                    <p className="font-semibold text-dark">{b.name}</p>
                    <p>{b.address}، {b.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="rounded-[var(--radius-lg)] bg-white p-8 shadow-[var(--shadow-soft)]">
            <div className="mb-6 flex items-center gap-2 text-dark/50">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">عادة ما نرد خلال ساعات العمل الرسمية</span>
            </div>
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </main>
  );
}

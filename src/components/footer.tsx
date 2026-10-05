import Link from "next/link";
import { clinic, isPlaceholder } from "@/lib/clinic";
import { PawIcon, InstagramIcon, WhatsAppIcon } from "@/components/icons";

const COLUMNS = [
  {
    title: "الموقع",
    links: [
      { href: "/about", label: "من نحن" },
      { href: "/services", label: "خدماتنا" },
      { href: "/doctors", label: "الأطباء" },
      { href: "/branches", label: "الفروع" },
      { href: "/blog", label: "المدونة" },
    ],
  },
  {
    title: "المتجر",
    links: [
      { href: "/shop", label: "جميع المنتجات" },
      { href: "/cart", label: "سلة المشتريات" },
      { href: "/booking", label: "احجز موعدًا" },
    ],
  },
  {
    title: "الدعم",
    links: [
      { href: "/contact", label: "تواصل معنا" },
      { href: "/privacy", label: "سياسة الخصوصية" },
      { href: "/terms", label: "الشروط والأحكام" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-burgundy-dark text-cream">
      <div className="container-xl grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <PawIcon className="h-6 w-6 text-beige" />
            <span className="text-xl font-semibold text-white">
              المخالب الناعمة
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-7 text-cream/70">
            رعاية بيطرية متكاملة تجمع بين الخبرة الطبية والدفء الإنساني، في بيئة هادئة تضع صحة حيوانك أولًا.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {!isPlaceholder(clinic.whatsappLink) && (
              <a
                href={clinic.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تواصل عبر واتساب"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <WhatsAppIcon className="h-4.5 w-4.5" />
              </a>
            )}
            {!isPlaceholder(clinic.instagramLink) && (
              <a
                href={clinic.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تابعنا على إنستغرام"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <InstagramIcon className="h-4.5 w-4.5" />
              </a>
            )}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-beige/60">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="link-underline text-sm text-cream/85">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-xl flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} عيادة المخالب الناعمة. جميع الحقوق محفوظة.</p>
          <p>{clinic.email}</p>
        </div>
      </div>
    </footer>
  );
}

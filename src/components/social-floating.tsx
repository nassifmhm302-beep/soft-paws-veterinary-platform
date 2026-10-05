import { clinic, isPlaceholder, whatsappHref } from "@/lib/clinic";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons";

export function SocialFloating() {
  const waHref = whatsappHref("مرحبًا، أرغب في الاستفسار عن خدمات العيادة.");
  const hasWhatsapp = Boolean(waHref);
  const hasInstagram = !isPlaceholder(clinic.instagramLink);

  if (!hasWhatsapp && !hasInstagram) return null;

  return (
    <div className="social-floating">
      {hasWhatsapp && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل معنا عبر واتساب"
          className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-white transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon className="h-5 w-5" />
        </a>
      )}
      {hasInstagram && (
        <a
          href={clinic.instagramLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تابعنا على إنستغرام"
          className="grid h-12 w-12 place-items-center rounded-full bg-burgundy text-white transition-transform hover:-translate-y-0.5"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}

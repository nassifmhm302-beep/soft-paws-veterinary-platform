import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export function ServiceRow({
  slug,
  name,
  description,
  imageUrl,
  index,
}: {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  index: number;
}) {
  return (
    <Reveal delay={(index % 2) * 100} as="div">
      <Link href={`/services/${slug}`} className="service-row group block">
        <div className="service-image image-reveal active relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-sand">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
          <div className="service-overlay absolute inset-0 bg-burgundy/20" />
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-burgundy">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="service-title heading-section text-xl text-dark">{name}</h3>
            <p className="mt-2 max-w-sm text-sm leading-7 text-dark/60">{description}</p>
          </div>
          <span className="service-arrow mt-2 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-beige text-burgundy">
            <ArrowIcon className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

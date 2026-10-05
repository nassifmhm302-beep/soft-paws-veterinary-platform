import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";

export function DoctorCard({
  slug,
  name,
  specialty,
  bio,
  imageUrl,
  index = 0,
}: {
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  index?: number;
}) {
  return (
    <Reveal delay={(index % 2) * 100}>
      <Link href={`/doctors/${slug}`} className="group block">
        <div className="image-reveal active relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] bg-sand">
          <Image
            src={imageUrl}
            alt={`${name} — ${specialty}`}
            fill
            sizes="(min-width: 1024px) 24vw, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="mt-5">
          <h3 className="heading-section text-lg text-dark">{name}</h3>
          <p className="mt-1 text-sm font-medium text-burgundy">{specialty}</p>
          <p className="mt-3 line-clamp-2 text-sm leading-7 text-dark/60">{bio}</p>
          <span className="link-arrow mt-4 text-sm">
            عرض الملف الشخصي
            <ArrowIcon className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

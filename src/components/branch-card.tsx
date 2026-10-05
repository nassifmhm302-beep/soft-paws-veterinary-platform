import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { dayLabel } from "@/lib/format";
import type { OpeningHours } from "@/lib/availability";

function todayWindow(openingHours: OpeningHours) {
  const dow = new Date().getDay();
  const windows = openingHours[String(dow)] || [];
  if (windows.length === 0) return `مغلق اليوم (${dayLabel(dow)})`;
  return `اليوم: ${windows.map((w) => `${w[0]} – ${w[1]}`).join("، ")}`;
}

export function BranchCard({
  branch,
  index = 0,
}: {
  branch: {
    slug: string;
    name: string;
    address: string;
    city: string;
    phone: string | null;
    googleMapsUrl: string | null;
    imageUrl: string | null;
    openingHours: unknown;
  };
  index?: number;
}) {
  const hours = branch.openingHours as OpeningHours;
  return (
    <Reveal delay={(index % 2) * 100}>
      <article className="grid gap-6 overflow-hidden rounded-[var(--radius-lg)] bg-white shadow-[var(--shadow-soft)] md:grid-cols-2">
        <div className="image-reveal active relative min-h-[260px]">
          {branch.imageUrl && (
            <Image src={branch.imageUrl} alt={`فرع ${branch.name}`} fill sizes="50vw" className="object-cover" />
          )}
        </div>
        <div className="flex flex-col justify-center p-7">
          <h3 className="heading-section text-xl text-dark">{branch.name}</h3>
          <div className="mt-4 flex flex-col gap-3 text-sm text-dark/70">
            <div className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
              <span>
                {branch.address}، {branch.city}
              </span>
            </div>
            {branch.phone && (
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 shrink-0 text-burgundy" />
                <span dir="ltr">{branch.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 shrink-0 text-burgundy" />
              <span>{todayWindow(hours)}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/booking?branch=${branch.slug}`} className="btn btn-primary btn-sm">
              احجز في هذا الفرع
            </Link>
            <Link href={`/branches/${branch.slug}`} className="btn btn-outline btn-sm">
              تفاصيل الفرع
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

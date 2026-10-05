import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, ClockIcon, MapPinIcon, PhoneIcon } from "@/components/icons";
import { getBranchBySlug, getBranches, getDoctorsForBranch } from "@/lib/queries";
import type { OpeningHours } from "@/lib/availability";
import { dayLabel } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const branches = await getBranches();
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) return {};
  return { title: branch.name, description: `${branch.name} — ${branch.address}، ${branch.city}` };
}

const DAYS = [0, 1, 2, 3, 4, 5, 6];

export default async function BranchDetailPage({ params }: Props) {
  const { slug } = await params;
  const branch = await getBranchBySlug(slug);
  if (!branch) notFound();

  const doctors = await getDoctorsForBranch(branch.id);
  const hours = branch.openingHours as OpeningHours;

  return (
    <main className="pt-20">
      <section className="relative flex min-h-[55vh] items-end overflow-hidden bg-burgundy-dark">
        <div className="hero-media absolute inset-0">
          {branch.imageUrl && (
            <Image src={branch.imageUrl} alt={branch.name} fill priority sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(40,30,28,.78),rgba(40,30,28,.2))]" />
        </div>
        <div className="container-xl relative z-10 pb-16">
          <Reveal>
            <p className="eyebrow mb-4 text-beige">فروعنا</p>
            <h1 className="heading-display text-[clamp(2rem,4.2vw,3.5rem)] text-white">{branch.name}</h1>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl grid gap-14 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <Reveal>
              <h2 className="heading-section text-xl text-dark">معلومات الفرع</h2>
              <div className="mt-5 flex flex-col gap-4 text-dark/70">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-1 h-5 w-5 shrink-0 text-burgundy" />
                  <span>{branch.address}، {branch.city}</span>
                </div>
                {branch.phone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 shrink-0 text-burgundy" />
                    <span dir="ltr">{branch.phone}</span>
                  </div>
                )}
              </div>
              {branch.googleMapsUrl && !branch.googleMapsUrl.startsWith("[") && (
                <a href={branch.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="link-arrow mt-5 inline-flex text-sm">
                  الحصول على الاتجاهات
                  <ArrowIcon className="h-4 w-4" />
                </a>
              )}
            </Reveal>

            <Reveal delay={100} className="mt-12">
              <h2 className="heading-section text-xl text-dark">ساعات العمل</h2>
              <div className="mt-5 flex flex-col divide-y divide-beige">
                {DAYS.map((d) => {
                  const windows = hours[String(d)] || [];
                  return (
                    <div key={d} className="flex items-center justify-between py-3 text-sm">
                      <span className="flex items-center gap-2 text-dark/70">
                        <ClockIcon className="h-4 w-4 text-burgundy" />
                        {dayLabel(d)}
                      </span>
                      <span className={windows.length ? "text-dark" : "text-dark/40"}>
                        {windows.length ? windows.map((w) => `${w[0]} – ${w[1]}`).join("، ") : "مغلق"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div className="flex flex-col gap-8">
            <Reveal className="rounded-[var(--radius-lg)] bg-burgundy p-7 text-white">
              <h3 className="heading-section text-lg">احجز في هذا الفرع</h3>
              <p className="mt-2 text-sm text-white/80">اختر الخدمة والطبيب والموعد المناسب لك في {branch.name}.</p>
              <Link href={`/booking?branch=${branch.slug}`} className="btn btn-outline-light mt-5 w-full">
                ابدأ الحجز
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>

            {doctors.length > 0 && (
              <Reveal delay={100}>
                <h3 className="heading-section text-lg text-dark">الأطباء المتاحون</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {doctors.map((doc) => (
                    <Link key={doc.id} href={`/doctors/${doc.slug}`} className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-sand">
                        <Image src={doc.imageUrl} alt={doc.name} fill sizes="56px" className="object-cover" />
                      </div>
                      <div>
                        <p className="link-underline text-sm font-semibold text-dark">{doc.name}</p>
                        <p className="text-xs text-dark/50">{doc.specialty}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

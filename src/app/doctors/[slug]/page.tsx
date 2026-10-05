import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ArrowIcon, CheckIcon, ClockIcon, MapPinIcon } from "@/components/icons";
import { getDoctorBySlug, getDoctors, getServicesForDoctor, getBranchesForDoctor } from "@/lib/queries";
import type { OpeningHours } from "@/lib/availability";
import { dayLabel } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const doctors = await getDoctors();
  return doctors.map((doctor) => ({ slug: doctor.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return { title: doctor.name, description: `${doctor.name} — ${doctor.specialty}` };
}

export default async function DoctorDetailPage({ params }: Props) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const [services, branches] = await Promise.all([
    getServicesForDoctor(doctor.id),
    getBranchesForDoctor(doctor.id),
  ]);

  const certificates = (doctor.certificates as string[]) || [];

  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <div className="container-xl grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal variant="image" className="active">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)]">
            <Image src={doctor.imageUrl} alt={doctor.name} fill sizes="(min-width:1024px) 35vw, 90vw" className="object-cover" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow mb-3 text-burgundy">{doctor.specialty}</p>
            <h1 className="heading-display text-[clamp(1.9rem,3.6vw,3rem)] text-dark">{doctor.name}</h1>
            {doctor.experience && <p className="mt-2 text-sm text-dark/50">{doctor.experience}</p>}
            <p className="mt-6 max-w-xl text-base leading-8 text-dark/65">{doctor.bio}</p>
          </Reveal>

          {certificates.length > 0 && (
            <Reveal delay={100} className="mt-10">
              <h2 className="heading-section text-lg text-dark">الشهادات والتأهيل</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {certificates.map((c) => (
                  <li key={c} className="flex items-center gap-3 text-sm text-dark/70">
                    <CheckIcon className="h-4 w-4 text-burgundy" />
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {services.length > 0 && (
            <Reveal delay={150} className="mt-10">
              <h2 className="heading-section text-lg text-dark">الخدمات التي يقدمها</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {services.map((s) => (
                  <Link key={s.id} href={`/services/${s.slug}`} className="btn btn-outline btn-sm">
                    {s.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          {branches.length > 0 && (
            <Reveal delay={200} className="mt-10">
              <h2 className="heading-section text-lg text-dark">الفروع المتاح بها</h2>
              <div className="mt-4 flex flex-col gap-4">
                {branches.map((b) => {
                  const hours = b.openingHours as OpeningHours;
                  const dow = new Date().getDay();
                  const windows = hours[String(dow)] || [];
                  return (
                    <div key={b.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[var(--radius-md)] bg-white p-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-dark">
                        <MapPinIcon className="h-4 w-4 text-burgundy" />
                        {b.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-dark/60">
                        <ClockIcon className="h-4 w-4 text-burgundy" />
                        {windows.length ? `${dayLabel(dow)}: ${windows.map((w) => `${w[0]}–${w[1]}`).join("، ")}` : `مغلق اليوم`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          )}

          <Reveal delay={250} className="mt-12">
            <Link href={`/booking?doctor=${doctor.slug}`} className="btn btn-primary">
              احجز موعدًا مع {doctor.name}
              <ArrowIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

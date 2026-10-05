import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { DoctorCard } from "@/components/doctor-card";
import { getDoctors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "الأطباء",
  description: "تعرف على فريقنا الطبي المكوّن من أربعة أطباء بيطريين متخصصين.",
};

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="pt-20">
      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-4 text-burgundy">فريقنا الطبي</p>
            <h1 className="heading-display text-[clamp(2rem,4vw,3.25rem)] text-dark">
              أربعة أطباء، شغف واحد برعاية الحيوان
            </h1>
            <p className="mt-5 text-base leading-8 text-dark/65">
              يجمع فريقنا بين الخبرة العلمية العميقة والحس الإنساني، لتقديم رعاية تراعي الجانب الطبي والنفسي معًا.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="container-xl">
          <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2">
            {doctors.map((doctor, i) => (
              <DoctorCard
                key={doctor.id}
                slug={doctor.slug}
                name={doctor.name}
                specialty={doctor.specialty}
                bio={doctor.bio}
                imageUrl={doctor.imageUrl}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

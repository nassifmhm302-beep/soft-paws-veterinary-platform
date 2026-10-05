import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { BranchCard } from "@/components/branch-card";
import { getBranches } from "@/lib/queries";

export const metadata: Metadata = {
  title: "فروعنا",
  description: "مواقع فروع عيادة المخالب الناعمة، ساعات العمل، وطرق التواصل مع كل فرع.",
};

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <main className="pt-20">
      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-4 text-burgundy">فروعنا</p>
            <h1 className="heading-display text-[clamp(2rem,4vw,3.25rem)] text-dark">أقرب إليك مما تتصور</h1>
            <p className="mt-5 text-base leading-8 text-dark/65">
              فروع مجهزة بالكامل في مواقع استراتيجية، كل فرع يقدّم نفس مستوى الرعاية والاهتمام.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="container-xl flex flex-col gap-10">
          {branches.map((branch, i) => (
            <BranchCard key={branch.id} branch={branch} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { BlogCard } from "@/components/blog-card";
import { blogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "المدونة",
  description: "مقالات ونصائح لرعاية أفضل لحيوانك الأليف من فريق عيادة المخالب الناعمة.",
};

export default function BlogPage() {
  return (
    <main className="pt-20">
      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl">
          <Reveal className="max-w-2xl">
            <p className="eyebrow mb-4 text-burgundy">المدونة</p>
            <h1 className="heading-display text-[clamp(2rem,4vw,3.25rem)] text-dark">مقالات لرعاية أفضل</h1>
            <p className="mt-5 text-base leading-8 text-dark/65">
              نصائح عملية ومقالات موثوقة من فريقنا الطبي لمساعدتك على فهم احتياجات حيوانك الأليف بشكل أعمق.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-sand py-20 md:py-28">
        <div className="container-xl grid gap-10 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}

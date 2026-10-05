import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ArrowIcon } from "@/components/icons";
import { blogPosts } from "@/lib/content";
import { formatDateArabic } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main className="bg-cream pt-32 pb-24 md:pt-40">
      <article className="container-xl max-w-3xl">
        <Reveal>
          <div className="flex items-center gap-3 text-xs text-dark/50">
            <span className="rounded-full bg-sand px-3 py-1 font-semibold text-burgundy">{post.category}</span>
            <span>{formatDateArabic(post.date)}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="heading-display mt-5 text-[clamp(1.8rem,3.6vw,2.75rem)] text-dark">{post.title}</h1>
        </Reveal>

        <Reveal variant="image" className="active mt-10">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)]">
            <Image src={post.image} alt={post.title} fill sizes="(min-width:1024px) 60vw, 90vw" className="object-cover" />
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-10 flex flex-col gap-6">
          {post.content.map((p, i) => (
            <p key={i} className="text-base leading-9 text-dark/70">
              {p}
            </p>
          ))}
        </Reveal>

        <Reveal delay={150} className="mt-14 rounded-[var(--radius-lg)] bg-burgundy p-8 text-center text-white">
          <h2 className="heading-section text-xl">هل لحيوانك احتياج طبي الآن؟</h2>
          <Link href="/booking" className="btn btn-outline-light mt-5">
            احجز موعدًا
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </Reveal>

        {others.length > 0 && (
          <div className="mt-16">
            <h2 className="heading-section text-xl text-dark">مقالات أخرى</h2>
            <div className="mt-6 flex flex-col gap-4">
              {others.map((o) => (
                <Link key={o.slug} href={`/blog/${o.slug}`} className="link-underline text-sm font-semibold text-dark">
                  {o.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { formatDateArabic } from "@/lib/format";
import { ArrowIcon } from "@/components/icons";
import type { BlogPost } from "@/lib/content";

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <Reveal delay={(index % 3) * 100}>
      <Link href={`/blog/${post.slug}`} className="group block">
        <div className="image-reveal active relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)] bg-sand">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width:1024px) 30vw, 90vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="mt-5">
          <div className="flex items-center gap-3 text-xs text-dark/50">
            <span className="rounded-full bg-sand px-3 py-1 font-semibold text-burgundy">{post.category}</span>
            <span>{formatDateArabic(post.date)}</span>
          </div>
          <h3 className="heading-section mt-3 text-lg text-dark">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-dark/60">{post.excerpt}</p>
          <span className="link-arrow mt-4 text-sm">
            قراءة المزيد
            <ArrowIcon className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

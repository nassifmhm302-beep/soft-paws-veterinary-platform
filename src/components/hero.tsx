import Image from "next/image";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-burgundy-dark">
      <div className="hero-media absolute inset-0">
        <Image
          src="https://images.pexels.com/photos/19490691/pexels-photo-19490691.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1600&w=1800"
          alt="كلب وقطة في لحظة ألفة ودفء، يمثلان رعاية متكاملة للحيوانات الأليفة"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_30%] md:object-[75%_40%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(40,30,28,.55) 0%, rgba(40,30,28,.32) 42%, rgba(40,30,28,.08) 70%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{ background: "linear-gradient(to top, rgba(40,30,28,.45), transparent)" }}
        />
      </div>

      <div className="container-xl relative z-10 pt-28 pb-20">
        <div className="max-w-xl">
          <p
            className="eyebrow mb-5 text-beige opacity-0"
            style={{ animation: "heroItemIn .8s .2s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            عيادة المخالب الناعمة
          </p>
          <h1
            className="heading-display text-[clamp(2.4rem,5.4vw,4.25rem)] text-white opacity-0"
            style={{ animation: "heroItemIn .9s .35s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            رعاية متكاملة لحيوانك الأليف
          </h1>
          <p
            className="mt-6 max-w-md text-base leading-8 text-white/85 opacity-0"
            style={{ animation: "heroItemIn .9s .5s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            رعاية بيطرية متخصصة، حجز إلكتروني، ومنتجات موثوقة في مكان واحد.
          </p>
          <div
            className="mt-9 flex flex-wrap items-center gap-4 opacity-0"
            style={{ animation: "heroItemIn .9s .65s cubic-bezier(.22,1,.36,1) forwards" }}
          >
            <Link href="/booking" className="btn btn-primary">
              احجز الآن
              <ArrowIcon className="h-4 w-4" />
            </Link>
            <Link href="/shop" className="btn btn-outline-light">
              تصفح المتجر
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroItemIn {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

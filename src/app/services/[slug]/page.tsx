import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Reveal } from "@/components/reveal";
import { ProductCard } from "@/components/product-card";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { getServiceBySlug, getServices, getDoctorsForService, getRelatedProducts } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [doctors, relatedProducts, allServices] = await Promise.all([
    getDoctorsForService(service.id),
    getRelatedProducts(service.id),
    getServices(),
  ]);

  const whatWeProvide = (service.whatWeProvide as string[]) || [];
  const whenNeeded = (service.whenNeeded as string[]) || [];
  const process = (service.process as { title: string; description: string }[]) || [];
  const faq = (service.faq as { question: string; answer: string }[]) || [];

  const otherServices = allServices.filter((s) => s.id !== service.id).slice(0, 3);

  return (
    <main className="pt-20">
      <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-burgundy-dark">
        <div className="hero-media absolute inset-0">
          <Image src={service.imageUrl} alt={service.name} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(40,30,28,.78),rgba(40,30,28,.2))]" />
        </div>
        <div className="container-xl relative z-10 pb-16">
          <Reveal>
            <p className="eyebrow mb-4 text-beige">خدماتنا</p>
            <h1 className="heading-display max-w-2xl text-[clamp(2rem,4.2vw,3.5rem)] text-white">{service.name}</h1>
            <p className="mt-4 max-w-xl text-white/85">{service.description}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="container-xl grid gap-16 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <Reveal>
              <h2 className="heading-section text-2xl text-dark">نظرة عامة</h2>
              <p className="mt-4 text-base leading-8 text-dark/65">{service.longDescription}</p>
            </Reveal>

            {whatWeProvide.length > 0 && (
              <Reveal delay={100} className="mt-12">
                <h3 className="heading-section text-xl text-dark">ماذا نقدم</h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {whatWeProvide.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-7 text-dark/70">
                      <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-burgundy" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {process.length > 0 && (
              <Reveal delay={150} className="mt-12">
                <h3 className="heading-section text-xl text-dark">خطوات الخدمة</h3>
                <div className="mt-6 flex flex-col gap-6">
                  {process.map((step, i) => (
                    <div key={step.title} className="flex gap-5 border-t border-beige pt-5">
                      <span className="text-sm font-semibold text-beige">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h4 className="font-semibold text-dark">{step.title}</h4>
                        <p className="mt-1 text-sm leading-7 text-dark/60">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            )}

            {faq.length > 0 && (
              <Reveal delay={200} className="mt-12">
                <h3 className="heading-section text-xl text-dark">الأسئلة الشائعة</h3>
                <div className="mt-6 flex flex-col divide-y divide-beige">
                  {faq.map((item) => (
                    <details key={item.question} className="group py-4">
                      <summary className="cursor-pointer list-none font-semibold text-dark">{item.question}</summary>
                      <p className="mt-2 text-sm leading-7 text-dark/60">{item.answer}</p>
                    </details>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <div className="flex flex-col gap-8">
            {whenNeeded.length > 0 && (
              <Reveal className="rounded-[var(--radius-lg)] bg-sand p-7">
                <h3 className="heading-section text-lg text-dark">متى تحتاج هذه الخدمة؟</h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {whenNeeded.map((item) => (
                    <li key={item} className="text-sm leading-7 text-dark/65">
                      — {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal delay={100} className="rounded-[var(--radius-lg)] bg-burgundy p-7 text-white">
              <h3 className="heading-section text-lg">جاهز للحجز؟</h3>
              <p className="mt-2 text-sm text-white/80">احجز هذه الخدمة مباشرة واختر الطبيب والفرع المناسبين.</p>
              <Link href={`/booking?service=${service.slug}`} className="btn btn-outline-light mt-5 w-full">
                احجز هذه الخدمة
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </Reveal>

            {doctors.length > 0 && (
              <Reveal delay={150}>
                <h3 className="heading-section text-lg text-dark">الأطباء المتخصصون</h3>
                <div className="mt-4 flex flex-col gap-4">
                  {doctors.map((doc) => (
                    <Link key={doc.id} href={`/doctors/${doc.slug}`} className="flex items-center gap-3 group">
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

      {relatedProducts.length > 0 && (
        <section className="bg-sand py-20 md:py-28">
          <div className="container-xl">
            <Reveal>
              <p className="eyebrow mb-3 text-burgundy">منتجات مرتبطة</p>
              <h2 className="heading-section text-2xl text-dark">قد يفيدك أيضًا</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
              {relatedProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {otherServices.length > 0 && (
        <section className="bg-cream py-20 md:py-28">
          <div className="container-xl">
            <Reveal>
              <h2 className="heading-section text-2xl text-dark">خدمات أخرى</h2>
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-4">
              {otherServices.map((s) => (
                <Link key={s.id} href={`/services/${s.slug}`} className="btn btn-outline btn-sm">
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

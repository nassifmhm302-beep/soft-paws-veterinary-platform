import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  light?: boolean;
}) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className={`eyebrow mb-3 ${light ? "text-beige" : "text-burgundy"}`}>{eyebrow}</p>
      )}
      <h2 className={`heading-section text-[clamp(1.75rem,3.4vw,2.75rem)] ${light ? "text-white" : "text-dark"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-8 ${light ? "text-white/75" : "text-dark/65"}`}>{description}</p>
      )}
    </Reveal>
  );
}

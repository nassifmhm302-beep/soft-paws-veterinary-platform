// Central, environment-driven clinic configuration.
// Real production values must be supplied through environment variables.
// When a value is not configured we surface an explicit, visible placeholder
// instead of inventing real-looking business information.

function envOrPlaceholder(value: string | undefined, placeholder: string) {
  return value && value.trim().length > 0 ? value.trim() : placeholder;
}

export const clinic = {
  name: "عيادة المخالب الناعمة",
  shortName: "المخالب الناعمة",
  tagline: "رعاية بيطرية راقية، بقلب يهتم بكل تفصيلة",
  phone: envOrPlaceholder(process.env.PHONE_NUMBER, "[PHONE_NUMBER]"),
  email: envOrPlaceholder(process.env.CLINIC_EMAIL, "[CLINIC_EMAIL]"),
  whatsappNumber: envOrPlaceholder(process.env.WHATSAPP_NUMBER, "[WHATSAPP_NUMBER]"),
  whatsappLink: envOrPlaceholder(process.env.WHATSAPP_LINK, "[WHATSAPP_LINK]"),
  instagramLink: envOrPlaceholder(process.env.INSTAGRAM_LINK, "[INSTAGRAM_LINK]"),
};

export function isPlaceholder(value: string) {
  return value.startsWith("[") && value.endsWith("]");
}

export function whatsappHref(message: string) {
  if (isPlaceholder(clinic.whatsappLink)) return undefined;
  const base = clinic.whatsappLink;
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}text=${encodeURIComponent(message)}`;
}

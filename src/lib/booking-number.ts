import { randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function randomSegment(length: number) {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** Generates a human-readable, unique-enough booking reference e.g. VET-20260214-8F42K */
export function generateBookingNumber(prefix: "VET" | "ORD" = "VET") {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${prefix}-${y}${m}${d}-${randomSegment(5)}`;
}

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "قيد المراجعة",
  contacted: "تم التواصل",
  confirmed: "تم التأكيد",
  completed: "مكتمل",
  cancelled: "ملغى",
  failed: "فشل الطلب",
};

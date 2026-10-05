import { db } from "@/db";
import { bookings } from "@/db/schema";
import { and, eq, inArray, notInArray } from "drizzle-orm";

export type OpeningHours = Record<string, [string, string][]>;

const SLOT_MINUTES = 30;
const ACTIVE_STATUSES = ["pending", "contacted", "confirmed"] as const;

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(total: number) {
  const h = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const m = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Returns true if the branch has any opening window on the given date. */
export function isBranchOpenOnDate(openingHours: OpeningHours, dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const dow = date.getDay().toString();
  const windows = openingHours[dow] || [];
  return windows.length > 0;
}

/** Builds the full list of theoretical slots for a branch on a given date (business hours only). */
function buildSlotsForDate(openingHours: OpeningHours, dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const dow = date.getDay().toString();
  const windows = openingHours[dow] || [];
  const slots: string[] = [];

  for (const [start, end] of windows) {
    let cursor = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    while (cursor + SLOT_MINUTES <= endMinutes) {
      slots.push(minutesToTime(cursor));
      cursor += SLOT_MINUTES;
    }
  }
  return slots;
}

/**
 * Returns truly available time slots for a doctor at a branch on a given date,
 * by checking real booking records already stored in the database.
 * Past dates and dates outside the 45-day booking horizon are rejected upstream.
 */
export async function getAvailableSlots(params: {
  branchId: number;
  doctorId: number;
  date: string;
  openingHours: OpeningHours;
}) {
  const allSlots = buildSlotsForDate(params.openingHours, params.date);
  if (allSlots.length === 0) return [];

  const taken = await db
    .select({ time: bookings.appointmentTime })
    .from(bookings)
    .where(
      and(
        eq(bookings.doctorId, params.doctorId),
        eq(bookings.branchId, params.branchId),
        eq(bookings.appointmentDate, params.date),
        inArray(bookings.status, [...ACTIVE_STATUSES])
      )
    );

  const takenSet = new Set(taken.map((t) => t.time));
  return allSlots.filter((slot) => !takenSet.has(slot));
}

/** Re-validates that a specific slot is still free right before confirming a booking. */
export async function isSlotStillAvailable(params: {
  branchId: number;
  doctorId: number;
  date: string;
  time: string;
}) {
  const existing = await db
    .select({ id: bookings.id })
    .from(bookings)
    .where(
      and(
        eq(bookings.doctorId, params.doctorId),
        eq(bookings.branchId, params.branchId),
        eq(bookings.appointmentDate, params.date),
        eq(bookings.appointmentTime, params.time),
        notInArray(bookings.status, ["cancelled", "failed"])
      )
    )
    .limit(1);

  return existing.length === 0;
}

export function nextBookingHorizonDate(days = 45) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayDateString() {
  return new Date().toISOString().slice(0, 10);
}

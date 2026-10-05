"use client";

import { CheckIcon } from "@/components/icons";

export const STEP_LABELS = [
  "الحيوان",
  "الخدمة",
  "الفرع",
  "الطبيب",
  "التاريخ",
  "الوقت",
  "البيانات",
  "المراجعة",
  "التأكيد",
];

export function BookingProgress({ current }: { current: number }) {
  const percent = (current / (STEP_LABELS.length - 1)) * 100;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-dark/50">
        <span>
          الخطوة {String(current + 1).padStart(2, "0")} / {String(STEP_LABELS.length).padStart(2, "0")}
        </span>
        <span className="font-semibold text-burgundy">{STEP_LABELS[current]}</span>
      </div>

      <div className="progress-track mb-5">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {STEP_LABELS.map((label, i) => {
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          return (
            <div key={label} className="flex shrink-0 items-center gap-2 pe-5">
              <span
                className={`step-dot grid h-7 w-7 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                  state === "done"
                    ? "border-burgundy bg-burgundy text-white"
                    : state === "current"
                    ? "border-burgundy text-burgundy"
                    : "border-beige text-dark/35"
                }`}
              >
                {state === "done" ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-xs font-medium ${
                  state === "upcoming" ? "text-dark/35" : "text-dark"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

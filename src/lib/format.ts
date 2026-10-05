export function formatCurrency(value: string | number) {
  const n = typeof value === "string" ? Number(value) : value;
  return `${n.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
}

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function formatDateArabic(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00`);
  return `${WEEKDAYS[d.getDay()]}، ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatTimeArabic(time: string) {
  const [hStr, m] = time.split(":");
  let h = Number(hStr);
  const period = h >= 12 ? "م" : "ص";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

export function dayLabel(index: number) {
  return WEEKDAYS[index];
}

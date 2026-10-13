import { OPEN_STATUSES, type Report, type ReportStatus } from "./types";

export function isOpen(status: ReportStatus): boolean {
  return OPEN_STATUSES.includes(status);
}

/** Sorts newest first; reports without a server timestamp yet go to the top. */
export function sortNewest(reports: Report[]): Report[] {
  return [...reports].sort((a, b) => {
    const at = a.createdAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
    const bt = b.createdAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
    return bt - at;
  });
}

export function formatDate(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(date: Date | null | undefined): string {
  if (!date) return "—";
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

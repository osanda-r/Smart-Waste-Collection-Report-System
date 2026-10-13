import type { Report } from "./types";

export function countBy<T>(items: T[], key: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const k = key(item);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

/** Mean hours from submission to resolution across resolved reports, or null if none. */
export function averageResolutionHours(reports: Report[]): number | null {
  const durations = reports
    .filter((r) => r.status === "resolved" && r.createdAt && r.resolvedAt)
    .map((r) => (r.resolvedAt!.getTime() - r.createdAt!.getTime()) / 3_600_000)
    .filter((hours) => hours >= 0);
  if (durations.length === 0) return null;
  return durations.reduce((sum, h) => sum + h, 0) / durations.length;
}

export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Report counts per local calendar day for the last `days` days, oldest first. */
export function reportsPerDay(
  reports: Report[],
  days: number,
  now: Date,
): { key: string; label: string; count: number }[] {
  const buckets: { key: string; label: string; count: number }[] = [];
  const byKey = new Map<string, number>();
  for (const report of reports) {
    if (!report.createdAt) continue;
    const key = localDateKey(report.createdAt);
    byKey.set(key, (byKey.get(key) ?? 0) + 1);
  }
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = localDateKey(day);
    buckets.push({
      key,
      label: day.toLocaleDateString(undefined, { day: "numeric", month: "short" }),
      count: byKey.get(key) ?? 0,
    });
  }
  return buckets;
}

export type CsvValue = string | number | boolean | null | undefined;

/** Builds a CSV string (RFC 4180 quoting) from plain row objects. */
export function toCsv(rows: Record<string, CsvValue>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: CsvValue) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\r\n");
}

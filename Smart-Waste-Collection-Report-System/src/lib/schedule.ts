import type { Schedule } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Next date/time (on or after `from`) that falls on `dayOfWeek` at `time` ("HH:MM").
 * Uses local time, which is what citizens see on their devices.
 */
export function nextOccurrence(dayOfWeek: number, time: string, from: Date): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const candidate = new Date(from.getFullYear(), from.getMonth(), from.getDate(), hours, minutes, 0, 0);
  const daysAhead = (dayOfWeek - candidate.getDay() + 7) % 7;
  candidate.setDate(candidate.getDate() + daysAhead);
  if (candidate.getTime() < from.getTime()) {
    candidate.setDate(candidate.getDate() + 7);
  }
  return candidate;
}

export type Pickup = { schedule: Schedule; date: Date };

/** All active pickups between `from` and `from + days`, sorted by date. */
export function upcomingPickups(
  schedules: Schedule[],
  from: Date,
  days = 14,
  zoneId?: string | null,
): Pickup[] {
  const until = from.getTime() + days * DAY_MS;
  const pickups: Pickup[] = [];
  for (const schedule of schedules) {
    if (!schedule.active) continue;
    if (zoneId !== undefined && zoneId !== null && schedule.zoneId !== zoneId) continue;
    let date = nextOccurrence(schedule.dayOfWeek, schedule.time, from);
    while (date.getTime() <= until) {
      pickups.push({ schedule, date });
      date = new Date(date.getTime() + 7 * DAY_MS);
    }
  }
  return pickups.sort((a, b) => a.date.getTime() - b.date.getTime());
}

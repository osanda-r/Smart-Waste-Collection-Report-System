import { describe, expect, it } from "vitest";
import { averageResolutionHours, countBy, reportsPerDay, toCsv } from "./analytics";
import { findZoneForPoint, haversineMeters } from "./geo";
import { nextOccurrence, upcomingPickups } from "./schedule";
import type { Report, Schedule, Zone } from "./types";

const north: Zone = { id: "z1", name: "North", center: { lat: 6.95, lng: 79.86 }, radiusM: 2000 };
const south: Zone = { id: "z2", name: "South", center: { lat: 6.85, lng: 79.86 }, radiusM: 2000 };

describe("geo", () => {
  it("measures roughly 111 km per degree of latitude", () => {
    const d = haversineMeters({ lat: 0, lng: 0 }, { lat: 1, lng: 0 });
    expect(d).toBeGreaterThan(110_000);
    expect(d).toBeLessThan(112_000);
  });

  it("finds the zone that contains a point", () => {
    expect(findZoneForPoint({ lat: 6.951, lng: 79.861 }, [north, south])?.id).toBe("z1");
    expect(findZoneForPoint({ lat: 6.851, lng: 79.861 }, [north, south])?.id).toBe("z2");
  });

  it("returns null when no zone covers the point", () => {
    expect(findZoneForPoint({ lat: 7.5, lng: 80.5 }, [north, south])).toBeNull();
  });
});

describe("schedule", () => {
  // 2026-10-13 is a Tuesday (day 2).
  const tuesdayMorning = new Date(2026, 9, 13, 7, 0, 0);

  it("returns later today when the slot has not passed", () => {
    const next = nextOccurrence(2, "08:00", tuesdayMorning);
    expect(next.getDate()).toBe(13);
    expect(next.getHours()).toBe(8);
  });

  it("rolls over to next week when today's slot has passed", () => {
    const next = nextOccurrence(2, "06:00", tuesdayMorning);
    expect(next.getDate()).toBe(20);
  });

  it("finds the next day of week", () => {
    const next = nextOccurrence(5, "09:00", tuesdayMorning); // Friday
    expect(next.getDay()).toBe(5);
    expect(next.getDate()).toBe(16);
  });

  it("lists upcoming pickups for active schedules in a zone only", () => {
    const schedules: Schedule[] = [
      { id: "a", zoneId: "z1", zoneName: "North", wasteType: "General waste", dayOfWeek: 2, time: "08:00", active: true },
      { id: "b", zoneId: "z2", zoneName: "South", wasteType: "Recyclables", dayOfWeek: 4, time: "10:00", active: true },
      { id: "c", zoneId: "z1", zoneName: "North", wasteType: "Organic waste", dayOfWeek: 1, time: "08:00", active: false },
    ];
    const pickups = upcomingPickups(schedules, tuesdayMorning, 14, "z1");
    expect(pickups.every((p) => p.schedule.zoneId === "z1")).toBe(true);
    expect(pickups.every((p) => p.schedule.active)).toBe(true);
    // Tue 13th 08:00 is still ahead of 07:00; Tue 20th is inside the 14-day window, 27th is not.
    expect(pickups.map((p) => p.date.getDate())).toEqual([13, 20]);
  });
});

function report(overrides: Partial<Report>): Report {
  return {
    id: "r",
    title: "t",
    description: "",
    category: "other",
    status: "pending",
    priority: "medium",
    reporterId: "u",
    reporterName: "",
    address: "",
    location: { lat: 0, lng: 0 },
    zoneId: null,
    zoneName: null,
    photoUrls: [],
    completionPhotoUrls: [],
    assignedWorkerId: null,
    assignedWorkerName: null,
    notes: "",
    createdAt: null,
    updatedAt: null,
    resolvedAt: null,
    ...overrides,
  };
}

describe("analytics", () => {
  it("counts by key", () => {
    expect(countBy(["a", "b", "a"], (x) => x)).toEqual({ a: 2, b: 1 });
  });

  it("averages resolution time in hours for resolved reports only", () => {
    const start = new Date(2026, 9, 1, 0, 0);
    const reports = [
      report({ status: "resolved", createdAt: start, resolvedAt: new Date(start.getTime() + 2 * 3_600_000) }),
      report({ status: "resolved", createdAt: start, resolvedAt: new Date(start.getTime() + 4 * 3_600_000) }),
      report({ status: "pending", createdAt: start }),
    ];
    expect(averageResolutionHours(reports)).toBe(3);
    expect(averageResolutionHours([report({})])).toBeNull();
  });

  it("buckets reports per day, oldest first", () => {
    const now = new Date(2026, 9, 13, 12);
    const days = reportsPerDay(
      [report({ createdAt: new Date(2026, 9, 13, 9) }), report({ createdAt: new Date(2026, 9, 11, 9) })],
      3,
      now,
    );
    expect(days.map((d) => d.count)).toEqual([1, 0, 1]);
  });

  it("escapes CSV values", () => {
    const csv = toCsv([{ title: 'Bin, "big"', n: 2 }]);
    expect(csv).toBe('title,n\r\n"Bin, ""big""",2');
  });
});

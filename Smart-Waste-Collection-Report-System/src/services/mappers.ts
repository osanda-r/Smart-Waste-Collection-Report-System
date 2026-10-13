import { Timestamp, type DocumentData } from "firebase/firestore";
import type {
  AppNotification,
  GeoPoint,
  Priority,
  Report,
  ReportCategory,
  ReportEvent,
  ReportStatus,
  Role,
  Schedule,
  UserProfile,
  Zone,
} from "../lib/types";

export function toDate(value: unknown): Date | null {
  return value instanceof Timestamp ? value.toDate() : null;
}

function toGeo(value: unknown): GeoPoint {
  const v = (value ?? {}) as Partial<GeoPoint>;
  return { lat: Number(v.lat ?? 0), lng: Number(v.lng ?? 0) };
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
}

export function mapReport(id: string, d: DocumentData): Report {
  return {
    id,
    title: String(d.title ?? ""),
    description: String(d.description ?? ""),
    category: (d.category ?? "other") as ReportCategory,
    status: (d.status ?? "pending") as ReportStatus,
    priority: (d.priority ?? "medium") as Priority,
    reporterId: String(d.reporterId ?? ""),
    reporterName: String(d.reporterName ?? ""),
    address: String(d.address ?? ""),
    location: toGeo(d.location),
    zoneId: d.zoneId ?? null,
    zoneName: d.zoneName ?? null,
    photoUrls: toStringArray(d.photoUrls),
    completionPhotoUrls: toStringArray(d.completionPhotoUrls),
    assignedWorkerId: d.assignedWorkerId ?? null,
    assignedWorkerName: d.assignedWorkerName ?? null,
    notes: String(d.notes ?? ""),
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
    resolvedAt: toDate(d.resolvedAt),
  };
}

export function mapEvent(id: string, d: DocumentData): ReportEvent {
  return {
    id,
    status: (d.status ?? "pending") as ReportStatus,
    message: String(d.message ?? ""),
    actorId: String(d.actorId ?? ""),
    actorName: String(d.actorName ?? ""),
    createdAt: toDate(d.createdAt),
  };
}

export function mapUser(id: string, d: DocumentData): UserProfile {
  const roleValue = d.role === "collector" ? "worker" : d.role;
  const role: Role =
    roleValue === "worker" || roleValue === "admin" ? roleValue : "citizen";

  return {
    id,
    name: String(d.name ?? ""),
    email: String(d.email ?? ""),
    role,
    zoneId: d.zoneId ?? null,
    createdAt: toDate(d.createdAt),
  };
}

export function mapZone(id: string, d: DocumentData): Zone {
  return {
    id,
    name: String(d.name ?? ""),
    center: toGeo(d.center),
    radiusM: Number(d.radiusM ?? 0),
  };
}

export function mapSchedule(id: string, d: DocumentData): Schedule {
  return {
    id,
    zoneId: String(d.zoneId ?? ""),
    zoneName: String(d.zoneName ?? ""),
    wasteType: String(d.wasteType ?? ""),
    dayOfWeek: Number(d.dayOfWeek ?? 0),
    time: String(d.time ?? "08:00"),
    active: d.active !== false,
  };
}

export function mapNotification(id: string, d: DocumentData): AppNotification {
  return {
    id,
    userId: String(d.userId ?? ""),
    title: String(d.title ?? ""),
    message: String(d.message ?? ""),
    reportId: d.reportId ?? null,
    read: d.read === true,
    createdAt: toDate(d.createdAt),
  };
}

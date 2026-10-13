// Shared domain types and constants for WasteWise.

export type Role = "citizen" | "worker" | "admin";

export const ROLE_HOME: Record<Role, string> = {
  citizen: "/citizen/dashboard",
  worker: "/worker/dashboard",
  admin: "/admin/dashboard",
};

export const ROLE_LOGIN: Record<Role, string> = {
  citizen: "/login",
  worker: "/worker/login",
  admin: "/admin/login",
};

export const ROLE_LABELS: Record<Role, string> = {
  citizen: "Citizen",
  worker: "Worker",
  admin: "Municipal admin",
};

export type GeoPoint = { lat: number; lng: number };

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  zoneId: string | null;
  createdAt: Date | null;
};

export const REPORT_STATUSES = [
  "pending",
  "assigned",
  "in_progress",
  "resolved",
  "rejected",
] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

/** Statuses that still need council or worker action. */
export const OPEN_STATUSES: ReportStatus[] = ["pending", "assigned", "in_progress"];

export const CATEGORY_LABELS = {
  overflowing_bin: "Overflowing bin",
  illegal_dumping: "Illegal dumping",
  missed_collection: "Missed collection",
  bulky_waste: "Bulky waste",
  other: "Other",
} as const;
export type ReportCategory = keyof typeof CATEGORY_LABELS;

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const WASTE_TYPES = [
  "General waste",
  "Recyclables",
  "Organic waste",
  "Bulky waste",
] as const;

export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export type Report = {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  status: ReportStatus;
  priority: Priority;
  reporterId: string;
  reporterName: string;
  address: string;
  location: GeoPoint;
  zoneId: string | null;
  zoneName: string | null;
  photoUrls: string[];
  completionPhotoUrls: string[];
  assignedWorkerId: string | null;
  assignedWorkerName: string | null;
  notes: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  resolvedAt: Date | null;
};

export type ReportEvent = {
  id: string;
  status: ReportStatus;
  message: string;
  actorId: string;
  actorName: string;
  createdAt: Date | null;
};

export type Zone = {
  id: string;
  name: string;
  center: GeoPoint;
  radiusM: number;
};

export type Schedule = {
  id: string;
  zoneId: string;
  zoneName: string;
  wasteType: string;
  dayOfWeek: number; // 0 = Sunday ... 6 = Saturday
  time: string; // "HH:MM" 24h
  active: boolean;
};

export type AppNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  reportId: string | null;
  read: boolean;
  createdAt: Date | null;
};

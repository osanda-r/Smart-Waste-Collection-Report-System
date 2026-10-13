import type { ReportStatus } from "./types";

/** Map pin / chart colours per report status. */
export const STATUS_COLORS: Record<ReportStatus, string> = {
  pending: "#f59e0b",
  assigned: "#3b82f6",
  in_progress: "#8b5cf6",
  resolved: "#10b981",
  rejected: "#64748b",
};

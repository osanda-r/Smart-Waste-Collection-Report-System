import type { ReactNode } from "react";
import {
  CATEGORY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  type Priority,
  type ReportEvent,
  type ReportStatus,
} from "../lib/types";
import { formatDateTime } from "../lib/reports";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-600">{label}</div>
      {hint && <div className="mt-1 text-xs text-slate-400">{hint}</div>}
    </div>
  );
}

const STATUS_STYLES: Record<ReportStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  assigned: "bg-blue-100 text-blue-800",
  in_progress: "bg-violet-100 text-violet-800",
  resolved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-slate-200 text-slate-700",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-sky-100 text-sky-800",
  high: "bg-red-100 text-red-700",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABELS[priority]} priority
    </span>
  );
}

export function CategoryLabel({ category }: { category: keyof typeof CATEGORY_LABELS }) {
  return <span>{CATEGORY_LABELS[category]}</span>;
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
      {label}
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center">
      <div className="font-semibold text-slate-800">{title}</div>
      {children && <div className="mt-1 text-sm text-slate-500">{children}</div>}
    </div>
  );
}

export function Timeline({ events }: { events: ReportEvent[] }) {
  if (events.length === 0) return <p className="text-sm text-slate-500">No updates yet.</p>;
  return (
    <ol className="relative space-y-4 border-l-2 border-emerald-100 pl-5">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 shadow" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={event.status} />
            <span className="text-xs text-slate-500">{formatDateTime(event.createdAt)}</span>
          </div>
          <p className="mt-1 text-sm text-slate-700">{event.message}</p>
          <p className="text-xs text-slate-400">by {event.actorName || "System"}</p>
        </li>
      ))}
    </ol>
  );
}

export function PhotoGallery({ urls, emptyText }: { urls: string[]; emptyText: string }) {
  if (urls.length === 0) return <p className="text-sm text-slate-500">{emptyText}</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {urls.map((url) => (
        <a key={url} href={url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl border border-slate-200">
          <img src={url} alt="Report photo" className="h-32 w-full object-cover transition hover:scale-105" />
        </a>
      ))}
    </div>
  );
}

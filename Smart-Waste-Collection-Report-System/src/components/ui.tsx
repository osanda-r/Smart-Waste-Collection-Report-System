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
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <span className="inline-flex rounded-full bg-[#F0FDF4] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#15803D] ring-1 ring-[#BBF7D0]">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-3 text-[28px] font-[800] leading-tight tracking-[-0.03em] text-[#0F1F16] sm:text-[32px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[14.5px] leading-6 text-[#475569]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[20px] border border-[#E7EFE6] bg-white p-5 shadow-[0_8px_32px_rgba(15,31,22,0.06)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function StatCard({ label, value, hint, icon }: { label: string; value: ReactNode; hint?: string; icon?: ReactNode }) {
  return (
    <div className="group relative overflow-hidden rounded-[20px] border border-[#E7EFE6] bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#C5DBCB]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 via-transparent to-teal-50/0 opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[28px] font-[800] tracking-[-0.02em] text-[#0F1F16]">{value}</div>
          <div className="mt-1 text-[13px] font-semibold text-[#334155]">{label}</div>
          {hint && <div className="mt-1 text-xs font-medium text-[#94A3A8]">{hint}</div>}
        </div>
        {icon && <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#052E16] text-white shadow-sm">{icon}</div>}
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<ReportStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  assigned: "bg-blue-100 text-blue-800 ring-blue-200",
  in_progress: "bg-violet-100 text-violet-800 ring-violet-200",
  resolved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  rejected: "bg-slate-100 text-slate-600 ring-slate-200",
};

export function StatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600 ring-slate-200",
  medium: "bg-sky-100 text-sky-800 ring-sky-200",
  high: "bg-red-100 text-red-700 ring-red-200",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABELS[priority]} priority
    </span>
  );
}

export function CategoryLabel({ category }: { category: keyof typeof CATEGORY_LABELS }) {
  return <span className="font-medium">{CATEGORY_LABELS[category]}</span>;
}

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-[#64748B]">
      <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#E7EFE6] border-t-[#16A34A]" />
      {label}
    </div>
  );
}

export function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{message}</div>
  );
}

export function EmptyState({ title, children, icon }: { title: string; children?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-dashed border-[#CBD5C8] bg-[#FBFCF8] px-6 py-10 text-center">
      {icon && <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-white text-[#94A3A8] shadow-sm">{icon}</div>}
      <div className="font-bold text-[#0F1F16]">{title}</div>
      {children && <div className="mt-1 text-sm font-medium text-[#64748B]">{children}</div>}
    </div>
  );
}

export function Timeline({ events }: { events: ReportEvent[] }) {
  if (events.length === 0) return <p className="text-sm font-medium text-[#64748B]">No updates yet. Your timeline will appear here.</p>;
  return (
    <ol className="relative space-y-5 border-l-[2px] border-[#E7EFE6] pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[29px] top-1.5 h-[10px] w-[10px] rounded-full border-[2.5px] border-white bg-[#16A34A] shadow ring-2 ring-[#DCFCE7]" />
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={event.status} />
            <span className="text-xs font-medium text-[#94A3A8]">{formatDateTime(event.createdAt)}</span>
          </div>
          <p className="mt-1.5 text-sm font-medium leading-6 text-[#1E293B]">{event.message}</p>
          <p className="text-xs font-medium text-[#94A3A8]">by {event.actorName || "System"}</p>
        </li>
      ))}
    </ol>
  );
}

export function PhotoGallery({ urls, emptyText }: { urls: string[]; emptyText: string }) {
  if (urls.length === 0) return <p className="text-sm font-medium text-[#64748B]">{emptyText}</p>;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {urls.map((url) => (
        <a key={url} href={url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-xl border border-[#E7EFE6] bg-[#F6F7F3]">
          <img src={url} alt="Report photo" className="h-36 w-full object-cover transition duration-300 group-hover:scale-[1.04]" />
        </a>
      ))}
    </div>
  );
}

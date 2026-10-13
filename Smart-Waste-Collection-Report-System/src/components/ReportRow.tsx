import { Link } from "react-router-dom";
import { CATEGORY_LABELS, type Report } from "../lib/types";
import { formatDate } from "../lib/reports";
import { PriorityBadge, StatusBadge } from "./ui";

export default function ReportRow({ report, to, showPriority = false }: { report: Report; to: string; showPriority?: boolean }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{report.title}</h3>
            <StatusBadge status={report.status} />
            {showPriority && <PriorityBadge priority={report.priority} />}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {CATEGORY_LABELS[report.category]} · {report.zoneName ?? "Outside zones"} · {formatDate(report.createdAt)}
          </p>
          <p className="mt-1 truncate text-sm text-slate-600">{report.address}</p>
        </div>
        <span className="text-sm font-medium text-emerald-700">Open →</span>
      </div>
    </Link>
  );
}

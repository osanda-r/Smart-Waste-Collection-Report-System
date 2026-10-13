import { Link } from "react-router-dom";
import { CATEGORY_LABELS, type Report } from "../lib/types";
import { formatDate } from "../lib/reports";
import { PriorityBadge, StatusBadge } from "./ui";

export default function ReportRow({ report, to, showPriority = false }: { report: Report; to: string; showPriority?: boolean }) {
  return (
    <Link
      to={to}
      className="group block rounded-[16px] border border-[#E7EFE6] bg-white p-4 transition hover:border-[#BBF7D0] hover:bg-[#F0FDF4]/40 hover:shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold tracking-[-0.01em] text-[#0F1F16] group-hover:text-[#14532D]">{report.title}</h3>
            <StatusBadge status={report.status} />
            {showPriority && <PriorityBadge priority={report.priority} />}
          </div>
          <p className="mt-1 text-[13px] font-medium text-[#64748B]">
            {CATEGORY_LABELS[report.category]} • {report.zoneName ?? "Outside zones"} • {formatDate(report.createdAt)}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-[#475569]">{report.address}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#052E16] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:bg-[#14532D]">
          Open <span>→</span>
        </span>
      </div>
    </Link>
  );
}

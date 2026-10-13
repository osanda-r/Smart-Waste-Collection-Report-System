import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeAllReports } from "../../services/reports";
import { subscribeZones } from "../../services/zones";
import ReportsMap, { StatusLegend } from "../../components/ReportsMap";
import { CATEGORY_LABELS, REPORT_STATUSES, STATUS_LABELS, type ReportStatus } from "../../lib/types";
import { PageHeader, ErrorBlock, LoadingBlock, StatusBadge } from "../../components/ui";
import { formatDate } from "../../lib/reports";

export default function AdminMap() {
  const reports = useLiveData(subscribeAllReports, "all-reports");
  const zones = useLiveData(subscribeZones, "zones");
  const [active, setActive] = useState<Set<ReportStatus>>(() => new Set(["pending", "assigned", "in_progress"]));

  const visible = useMemo(
    () => (reports.data ?? []).filter((r) => active.has(r.status)),
    [reports.data, active],
  );

  function toggle(status: ReportStatus) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeader eyebrow="Live map" title="Reports on the map" description="Pins are coloured by status. Circles show collection zones." />
      <div className="flex flex-wrap items-center gap-2">
        {REPORT_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${active.has(s) ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
          >
            {STATUS_LABELS[s]} ({(reports.data ?? []).filter((r) => r.status === s).length})
          </button>
        ))}
      </div>
      <StatusLegend />
      {reports.loading && <LoadingBlock label="Loading map…" />}
      {reports.error && <ErrorBlock message={reports.error} />}
      {reports.data && <ReportsMap reports={visible} zones={zones.data ?? []} detailBase="/admin/reports" height={560} />}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-900">Showing {visible.length} reports</h2>
        <ul className="mt-3 divide-y divide-slate-100 text-sm">
          {visible.slice(0, 12).map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <Link to={`/admin/reports/${r.id}`} className="font-medium text-slate-800 hover:text-emerald-700">
                {r.title}
              </Link>
              <span className="text-slate-500">{CATEGORY_LABELS[r.category]} · {formatDate(r.createdAt)}</span>
              <StatusBadge status={r.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeAllReports } from "../../services/reports";
import { subscribeWorkers } from "../../services/users";
import { subscribeZones } from "../../services/zones";
import { averageResolutionHours, countBy } from "../../lib/analytics";
import { formatDateTime, isOpen, sortNewest } from "../../lib/reports";
import { REPORT_STATUSES, STATUS_LABELS, CATEGORY_LABELS, type ReportStatus } from "../../lib/types";
import { Card, ErrorBlock, LoadingBlock, PageHeader, StatCard, StatusBadge, PriorityBadge } from "../../components/ui";
import { STATUS_COLORS } from "../../lib/colors";

export default function AdminDashboard() {
  const reports = useLiveData(subscribeAllReports, "all-reports");
  const workers = useLiveData(subscribeWorkers, "workers");
  const zones = useLiveData(subscribeZones, "zones");

  const all = useMemo(() => reports.data ?? [], [reports.data]);
  const statusCounts = useMemo(() => countBy(all, (r) => r.status), [all]);
  const unassigned = all.filter((r) => r.status === "pending").length;
  const avgHours = averageResolutionHours(all);
  const recent = useMemo(() => sortNewest(all).slice(0, 8), [all]);
  const error = reports.error ?? workers.error ?? zones.error;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        eyebrow="Municipal council"
        title="Operations dashboard"
        description="Triage new complaints, assign crews and keep an eye on resolution times."
        actions={
          <>
            <Link to="/admin/reports" className="btn px-4 py-2.5 text-sm">Review reports</Link>
            <Link to="/admin/map" className="btn-outline px-4 py-2.5 text-sm">Open map</Link>
          </>
        }
      />
      {error && <ErrorBlock message={error} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reports" value={reports.data ? all.length : "—"} />
        <StatCard label="Awaiting assignment" value={reports.data ? unassigned : "—"} hint="Pending reports" />
        <StatCard label="Active workers" value={workers.data ? workers.data.length : "—"} hint={`${zones.data?.length ?? 0} collection zones`} />
        <StatCard label="Avg. time to resolve" value={avgHours === null ? "—" : `${avgHours.toFixed(1)} h`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Latest reports</h2>
            <Link to="/admin/reports" className="text-sm font-semibold text-emerald-700">View all →</Link>
          </div>
          {reports.loading && <LoadingBlock />}
          <div className="divide-y divide-slate-100">
            {recent.map((r) => (
              <Link key={r.id} to={`/admin/reports/${r.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:bg-slate-50">
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900">{r.title}</div>
                  <div className="text-sm text-slate-500">
                    {CATEGORY_LABELS[r.category]} · {r.zoneName ?? "Outside zones"} · {formatDateTime(r.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={r.priority} />
                  <StatusBadge status={r.status} />
                </div>
              </Link>
            ))}
            {reports.data && recent.length === 0 && <p className="py-6 text-sm text-slate-500">No reports yet.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Status breakdown</h2>
          <div className="mt-4 space-y-3">
            {REPORT_STATUSES.map((status) => (
              <StatusBar key={status} status={status} count={statusCounts[status] ?? 0} total={all.length} />
            ))}
          </div>
          <p className="mt-5 text-sm text-slate-500">
            {all.filter((r) => isOpen(r.status)).length} reports are still open.
          </p>
        </Card>
      </section>
    </div>
  );
}

function StatusBar({ status, count, total }: { status: ReportStatus; count: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-slate-700">{STATUS_LABELS[status]}</span>
        <span className="text-slate-500">{count}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: STATUS_COLORS[status] }} />
      </div>
    </div>
  );
}

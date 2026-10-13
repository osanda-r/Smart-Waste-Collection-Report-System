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
    <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[28px] border border-[#E7EFE6] bg-gradient-to-br from-white via-[#F6F7F3] to-[#E8F5E9] p-6 shadow-sm sm:p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100 opacity-70 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-100 opacity-50 blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,46,22,0.015)_1px,transparent_1px),linear-gradient(rgba(5,46,22,0.015)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="relative">
          <PageHeader
            eyebrow="Municipal council • Operations HQ"
            title="Operations dashboard"
            description="Triage new complaints, assign the nearest crew, and keep resolution times tight — all from one calm, clear view."
            actions={
              <>
                <Link to="/admin/reports" className="btn px-6">
                  Review reports →
                </Link>
                <Link to="/admin/map" className="btn-outline px-6">
                  Open live map
                </Link>
              </>
            }
          />
        </div>
      </section>

      {error && <ErrorBlock message={error} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reports" value={reports.data ? all.length : "—"} hint="All time • Live sync" icon={<span className="text-sm">◈</span>} />
        <StatCard label="Awaiting assignment" value={reports.data ? unassigned : "—"} hint="Pending • Needs crew" icon={<span className="h-2 w-2 rounded-full bg-amber-400" />} />
        <StatCard label="Active workers" value={workers.data ? workers.data.length : "—"} hint={`${zones.data?.length ?? 0} collection zones`} icon={<span className="text-sm">◎</span>} />
        <StatCard label="Avg. time to resolve" value={avgHours === null ? "—" : `${avgHours.toFixed(1)} h`} hint="Submission → resolved" icon={<span className="text-sm">◷</span>} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.7fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[18px] font-[800] tracking-[-0.02em] text-[#0F1F16]">Latest reports</h2>
            <Link to="/admin/reports" className="rounded-full bg-[#052E16] px-4 py-1.5 text-xs font-bold text-white hover:bg-black">
              View all →
            </Link>
          </div>
          {reports.loading && <LoadingBlock />}
          <div className="divide-y divide-[#E7EFE6]">
            {recent.map((r) => (
              <Link key={r.id} to={`/admin/reports/${r.id}`} className="group flex flex-wrap items-center justify-between gap-3 py-4 hover:bg-[#F6F7F3]/70 -mx-2 px-2 rounded-xl transition">
                <div className="min-w-0">
                  <div className="font-bold tracking-[-0.01em] text-[#0F1F16] group-hover:text-[#14532D]">{r.title}</div>
                  <div className="text-[13px] font-medium text-[#64748B]">
                    {CATEGORY_LABELS[r.category]} • {r.zoneName ?? "Outside zones"} • {formatDateTime(r.createdAt)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={r.priority} />
                  <StatusBadge status={r.status} />
                </div>
              </Link>
            ))}
            {reports.data && recent.length === 0 && <p className="py-10 text-center text-sm font-medium text-[#64748B]">No reports yet — citizen submissions will appear here instantly.</p>}
          </div>
        </Card>

        <Card>
          <h2 className="text-[18px] font-[800] tracking-[-0.02em] text-[#0F1F16]">Status breakdown</h2>
          <p className="mt-1 text-xs font-medium text-[#64748B]">Share of reports by lifecycle stage.</p>
          <div className="mt-5 space-y-4">
            {REPORT_STATUSES.map((status) => (
              <StatusBar key={status} status={status} count={statusCounts[status] ?? 0} total={all.length} />
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-[#F6F7F3] p-4 text-center">
            <div className="text-xl font-extrabold text-[#0F1F16]">{all.filter((r) => isOpen(r.status)).length}</div>
            <div className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Reports still open</div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function StatusBar({ status, count, total }: { status: ReportStatus; count: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <span className="font-semibold text-[#334155]">{STATUS_LABELS[status]}</span>
        <span className="font-bold text-[#0F1F16]">{count} <span className="font-medium text-[#94A3A8]">• {pct}%</span></span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#E7EFE6]">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: STATUS_COLORS[status] }} />
      </div>
    </div>
  );
}

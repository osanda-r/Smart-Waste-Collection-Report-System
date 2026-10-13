import { useMemo } from "react";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeAllReports } from "../../services/reports";
import { subscribeZones } from "../../services/zones";
import { subscribeWorkers } from "../../services/users";
import { averageResolutionHours, countBy, reportsPerDay, toCsv } from "../../lib/analytics";
import { downloadTextFile } from "../../lib/download";
import { CATEGORY_LABELS, PRIORITY_LABELS, STATUS_LABELS, REPORT_STATUSES, type Priority, type ReportCategory, type ReportStatus } from "../../lib/types";
import { Card, ErrorBlock, LoadingBlock, PageHeader, StatCard } from "../../components/ui";

export default function Analytics() {
  const reports = useLiveData(subscribeAllReports, "all-reports");
  const zones = useLiveData(subscribeZones, "zones");
  const workers = useLiveData(subscribeWorkers, "workers");
  const all = useMemo(() => reports.data ?? [], [reports.data]);
  const now = useMemo(() => new Date(), []);

  const byStatus = countBy(all, (r) => r.status);
  const byCategory = countBy(all, (r) => r.category);
  const byPriority = countBy(all, (r) => r.priority);
  const perDay = reportsPerDay(all, 14, now);
  const maxDay = Math.max(1, ...perDay.map((d) => d.count));
  const resolved = byStatus.resolved ?? 0;
  const completionRate = all.length ? Math.round((resolved / all.length) * 100) : 0;
  const avgHours = averageResolutionHours(all);

  const zoneRows = useMemo(() => {
    const names = new Map<string, string>();
    for (const z of zones.data ?? []) names.set(z.id, z.name);
    const groups = new Map<string, typeof all>();
    for (const r of all) {
      const key = r.zoneId ?? "none";
      groups.set(key, [...(groups.get(key) ?? []), r]);
    }
    return [...groups.entries()]
      .map(([zoneId, items]) => ({
        zoneId,
        name: zoneId === "none" ? "Outside zones" : names.get(zoneId) ?? items[0].zoneName ?? "Unknown",
        total: items.length,
        open: items.filter((r) => r.status !== "resolved" && r.status !== "rejected").length,
        resolved: items.filter((r) => r.status === "resolved").length,
        avgHours: averageResolutionHours(items),
      }))
      .sort((a, b) => b.total - a.total);
  }, [all, zones.data]);

  const workerRows = useMemo(() => {
    return (workers.data ?? []).map((w) => {
      const mine = all.filter((r) => r.assignedWorkerId === w.id);
      return {
        name: w.name || w.email,
        assigned: mine.length,
        completed: mine.filter((r) => r.status === "resolved").length,
        active: mine.filter((r) => r.status === "assigned" || r.status === "in_progress").length,
      };
    }).sort((a, b) => b.completed - a.completed);
  }, [all, workers.data]);

  function exportSummary() {
    const rows = zoneRows.map((z) => ({
      zone: z.name,
      total_reports: z.total,
      open: z.open,
      resolved: z.resolved,
      avg_resolution_hours: z.avgHours === null ? "" : z.avgHours.toFixed(1),
    }));
    downloadTextFile(`zone-summary-${now.toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        eyebrow="Waste data"
        title="Analytics"
        description="Volumes, resolution times and workload from every report in the system."
        actions={<button className="btn-outline px-4 py-2 text-sm" onClick={exportSummary} disabled={zoneRows.length === 0}>Export zone summary</button>}
      />
      {reports.loading && <LoadingBlock />}
      {reports.error && <ErrorBlock message={reports.error} />}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reports" value={all.length} />
        <StatCard label="Completion rate" value={`${completionRate}%`} hint={`${resolved} resolved`} />
        <StatCard label="Avg. resolution time" value={avgHours === null ? "—" : `${avgHours.toFixed(1)} h`} hint="Submission → resolved" />
        <StatCard label="High priority open" value={all.filter((r) => r.priority === "high" && r.status !== "resolved" && r.status !== "rejected").length} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-semibold text-slate-900">Reports per day (last 14 days)</h2>
          <div className="mt-6 flex h-48 items-end gap-1.5">
            {perDay.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1" title={`${d.label}: ${d.count}`}>
                <span className="text-[10px] text-slate-500">{d.count || ""}</span>
                <div className="w-full rounded-t bg-emerald-500/80" style={{ height: `${(d.count / maxDay) * 150}px`, minHeight: d.count ? 4 : 1 }} />
                <span className="w-full truncate text-center text-[10px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-900">By status</h2>
          <div className="mt-4 space-y-3">
            {REPORT_STATUSES.map((s) => (
              <Bar key={s} label={STATUS_LABELS[s as ReportStatus]} value={byStatus[s] ?? 0} total={all.length} />
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-900">By issue type</h2>
          <div className="mt-4 space-y-3">
            {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((c) => (
              <Bar key={c} label={CATEGORY_LABELS[c]} value={byCategory[c] ?? 0} total={all.length} />
            ))}
          </div>
          <h3 className="mt-6 text-sm font-semibold text-slate-700">By priority</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {(["high", "medium", "low"] as Priority[]).map((p) => (
              <span key={p} className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{PRIORITY_LABELS[p]}: <strong>{byPriority[p] ?? 0}</strong></span>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-slate-900">Workload by worker</h2>
          {workerRows.length === 0 && <p className="mt-3 text-sm text-slate-500">No workers yet.</p>}
          <table className="mt-4 w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Worker</th><th>Active</th><th>Completed</th><th>Total</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {workerRows.map((w) => (
                <tr key={w.name}><td className="py-2 font-medium text-slate-800">{w.name}</td><td>{w.active}</td><td>{w.completed}</td><td>{w.assigned}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>

      <Card>
        <h2 className="font-semibold text-slate-900">Zone performance</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Zone</th><th>Total</th><th>Open</th><th>Resolved</th><th>Avg. hours</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {zoneRows.map((z) => (
                <tr key={z.zoneId}>
                  <td className="py-2 font-medium text-slate-800">{z.name}</td>
                  <td>{z.total}</td><td>{z.open}</td><td>{z.resolved}</td>
                  <td>{z.avgHours === null ? "—" : z.avgHours.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {zoneRows.length === 0 && <p className="mt-3 text-sm text-slate-500">No reports yet.</p>}
        </div>
      </Card>
    </div>
  );
}

function Bar({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm"><span className="text-slate-700">{label}</span><span className="text-slate-500">{value} · {pct}%</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-600" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeAllReports } from "../../services/reports";
import { subscribeZones } from "../../services/zones";
import { downloadTextFile } from "../../lib/download";
import { toCsv } from "../../lib/analytics";
import { formatDateTime, sortNewest } from "../../lib/reports";
import { CATEGORY_LABELS, PRIORITY_LABELS, PRIORITIES, REPORT_STATUSES, STATUS_LABELS, type ReportCategory, type ReportStatus, type Priority } from "../../lib/types";
import { EmptyState, ErrorBlock, LoadingBlock, PageHeader, PriorityBadge, StatusBadge } from "../../components/ui";

export default function AdminReports() {
  const reports = useLiveData(subscribeAllReports, "all-reports");
  const zones = useLiveData(subscribeZones, "zones");
  const [status, setStatus] = useState<ReportStatus | "all">("all");
  const [category, setCategory] = useState<ReportCategory | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [zoneId, setZoneId] = useState<string | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortNewest(
      (reports.data ?? []).filter(
        (r) =>
          (status === "all" || r.status === status) &&
          (category === "all" || r.category === category) &&
          (priority === "all" || r.priority === priority) &&
          (zoneId === "all" || r.zoneId === zoneId || (zoneId === "none" && !r.zoneId)) &&
          (!q || r.title.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) || r.reporterName.toLowerCase().includes(q)),
      ),
    );
  }, [reports.data, status, category, priority, zoneId, query]);

  function exportCsv() {
    const rows = filtered.map((r) => ({
      id: r.id,
      title: r.title,
      category: CATEGORY_LABELS[r.category],
      status: STATUS_LABELS[r.status],
      priority: PRIORITY_LABELS[r.priority],
      zone: r.zoneName ?? "",
      address: r.address,
      reporter: r.reporterName,
      assigned_worker: r.assignedWorkerName ?? "",
      latitude: r.location.lat,
      longitude: r.location.lng,
      created: r.createdAt?.toISOString() ?? "",
      resolved: r.resolvedAt?.toISOString() ?? "",
    }));
    downloadTextFile(`waste-reports-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  const selectClass = "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm";

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeader
        eyebrow="Complaints"
        title="All reports"
        description={`${filtered.length} of ${reports.data?.length ?? 0} reports shown.`}
        actions={
          <>
            <Link to="/admin/map" className="btn-outline px-4 py-2 text-sm">View on map</Link>
            <button onClick={exportCsv} disabled={filtered.length === 0} className="btn px-4 py-2 text-sm disabled:opacity-50">Export CSV</button>
          </>
        }
      />

      <div className="flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input className={`${selectClass} min-w-56 flex-1`} placeholder="Search title, address or reporter" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value as ReportStatus | "all")}>
          <option value="all">All statuses</option>
          {REPORT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select className={selectClass} value={category} onChange={(e) => setCategory(e.target.value as ReportCategory | "all")}>
          <option value="all">All types</option>
          {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
        </select>
        <select className={selectClass} value={priority} onChange={(e) => setPriority(e.target.value as Priority | "all")}>
          <option value="all">Any priority</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
        </select>
        <select className={selectClass} value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
          <option value="all">All zones</option>
          <option value="none">Outside zones</option>
          {(zones.data ?? []).map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </select>
      </div>

      {reports.loading && <LoadingBlock />}
      {reports.error && <ErrorBlock message={reports.error} />}
      {reports.data && filtered.length === 0 && <EmptyState title="No reports match these filters" />}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Report</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Worker</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-emerald-50/40">
                  <td className="px-4 py-3">
                    <Link to={`/admin/reports/${r.id}`} className="font-semibold text-slate-900 hover:text-emerald-700">{r.title}</Link>
                    <div className="text-xs text-slate-500">{CATEGORY_LABELS[r.category]} · {r.address}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{r.zoneName ?? "—"}</td>
                  <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-slate-700">{r.assignedWorkerName ?? <span className="text-slate-400">Unassigned</span>}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">{formatDateTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

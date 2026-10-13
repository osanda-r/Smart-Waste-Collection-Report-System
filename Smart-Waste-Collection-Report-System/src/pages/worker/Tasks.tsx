import { useMemo, useState } from "react";
import { useProfile } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeAssignedReports } from "../../services/reports";
import { sortNewest } from "../../lib/reports";
import { REPORT_STATUSES, STATUS_LABELS, type Report, type ReportStatus } from "../../lib/types";
import { EmptyState, ErrorBlock, LoadingBlock, PageHeader } from "../../components/ui";
import ReportRow from "../../components/ReportRow";

export default function WorkerTasks() {
  const profile = useProfile();
  const tasks = useLiveData<Report[]>((next, onError) => subscribeAssignedReports(profile.id, next, onError), `tasks:${profile.id}`);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");

  const list = useMemo(
    () => sortNewest((tasks.data ?? []).filter((r) => filter === "all" || r.status === filter)),
    [tasks.data, filter],
  );
  const filters: (ReportStatus | "all")[] = ["all", ...REPORT_STATUSES];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <PageHeader eyebrow="Assigned queue" title="My tasks" description="Open a task to update its progress or upload completion photos." />
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === f ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>
      {tasks.loading && <LoadingBlock />}
      {tasks.error && <ErrorBlock message={tasks.error} />}
      {tasks.data && list.length === 0 && <EmptyState title="Nothing here" />}
      <div className="space-y-3">
        {list.map((r) => (
          <ReportRow key={r.id} report={r} to={`/worker/tasks/${r.id}`} />
        ))}
      </div>
    </div>
  );
}

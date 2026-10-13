import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../hooks/useAuth";
import type { Report } from "../../lib/types";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeAssignedReports } from "../../services/reports";
import { isOpen, sortNewest } from "../../lib/reports";
import { Card, EmptyState, ErrorBlock, LoadingBlock, PageHeader, StatCard } from "../../components/ui";
import ReportRow from "../../components/ReportRow";
import NotificationsPanel from "../../components/NotificationsPanel";

export default function WorkerDashboard() {
  const profile = useProfile();
  const tasks = useLiveData<Report[]>((next, onError) => subscribeAssignedReports(profile.id, next, onError), `tasks:${profile.id}`);
  const all = useMemo(() => tasks.data ?? [], [tasks.data]);
  const open = useMemo(() => sortNewest(all.filter((r) => isOpen(r.status))), [all]);
  const inProgress = all.filter((r) => r.status === "in_progress").length;
  const completed = all.filter((r) => r.status === "resolved").length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        eyebrow="Field team"
        title={`Hello, ${profile.name.split(" ")[0] || "crew"}`}
        description="Your assigned collection tasks. Start a job when you reach the spot, and upload a photo when it is cleared."
        actions={<Link to="/worker/tasks" className="btn px-4 py-2.5 text-sm">All my tasks</Link>}
      />
      {tasks.error && <ErrorBlock message={tasks.error} />}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active tasks" value={tasks.data ? open.length : "—"} />
        <StatCard label="In progress" value={tasks.data ? inProgress : "—"} />
        <StatCard label="Completed" value={tasks.data ? completed : "—"} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Open tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks.loading && <LoadingBlock />}
            {tasks.data && open.length === 0 && <EmptyState title="No open tasks">New assignments will appear here.</EmptyState>}
            {open.map((r) => (
              <ReportRow key={r.id} report={r} to={`/worker/tasks/${r.id}`} />
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
          <div className="mt-4">
            <NotificationsPanel uid={profile.id} limit={6} />
          </div>
        </Card>
      </section>
    </div>
  );
}

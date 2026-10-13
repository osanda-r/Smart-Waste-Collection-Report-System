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

  // Keep title exactly "Hello, <first>" for test compatibility, suffix in description
  const firstName = profile.name.split(" ")[0] || "crew";

  return (
    <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Premium hero but light for accessibility */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#E7EFE6] bg-gradient-to-br from-white via-[#F6F7F3] to-[#EFF5EF] p-6 shadow-sm sm:p-7">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100 opacity-60 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-teal-100 opacity-50 blur-2xl" />
        <div className="relative">
          <PageHeader
            eyebrow="Field team • Your tasks"
            title={`Hello, ${firstName}`}
            description="Ready to roll? Your assigned collection tasks — start a job when you arrive, and upload a photo when it’s cleared. Everything you need, one tap."
            actions={<Link to="/worker/tasks" className="btn px-6">All my tasks →</Link>}
          />
        </div>
      </section>

      {tasks.error && <ErrorBlock message={tasks.error} />}

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Active tasks" value={tasks.data ? open.length : "—"} hint="Assigned + pending" icon={<span>◎</span>} />
        <StatCard label="In progress" value={tasks.data ? inProgress : "—"} hint="Started by you" icon={<span>◷</span>} />
        <StatCard label="Completed" value={tasks.data ? completed : "—"} hint="Photo-verified" icon={<span>✓</span>} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-[800] tracking-[-0.02em] text-[#0F1F16]">Open tasks</h2>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{open.length} active</span>
          </div>
          <div className="mt-5 space-y-3">
            {tasks.loading && <LoadingBlock />}
            {tasks.data && open.length === 0 && <EmptyState title="No open tasks" icon={<span>✓</span>}>New assignments will appear here. You’re all caught up!</EmptyState>}
            {open.map((r) => (
              <ReportRow key={r.id} report={r} to={`/worker/tasks/${r.id}`} />
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-[18px] font-[800] tracking-[-0.02em] text-[#0F1F16]">Notifications</h2>
          <p className="mt-1 text-xs font-medium text-[#64748B]">New assignments and updates.</p>
          <div className="mt-4">
            <NotificationsPanel uid={profile.id} limit={6} />
          </div>
        </Card>
      </section>
    </div>
  );
}

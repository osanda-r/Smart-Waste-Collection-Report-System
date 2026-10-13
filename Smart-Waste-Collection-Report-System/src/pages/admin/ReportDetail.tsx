import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { applyReportUpdate, statusNotification, subscribeReport, subscribeReportEvents, type NotificationInput, type ReportChanges } from "../../services/reports";
import { subscribeWorkers } from "../../services/users";
import { CATEGORY_LABELS, PRIORITIES, PRIORITY_LABELS, REPORT_STATUSES, STATUS_LABELS, type Report, type ReportEvent, type ReportStatus } from "../../lib/types";
import { formatDateTime } from "../../lib/reports";
import { Card, ErrorBlock, LoadingBlock, PageHeader, PhotoGallery, PriorityBadge, StatusBadge, Timeline } from "../../components/ui";
import ReportsMap from "../../components/ReportsMap";

export default function AdminReportDetail() {
  const { id = "" } = useParams();
  const report = useLiveData<Report>((next, onError) => subscribeReport(id, next, onError), `report:${id}`);
  const events = useLiveData<ReportEvent[]>((next, onError) => subscribeReportEvents(id, next, onError), `events:${id}`);
  const workers = useLiveData(subscribeWorkers, "workers");

  if (report.loading) return <LoadingBlock />;
  if (report.error || !report.data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <ErrorBlock message={report.error ?? "Report not found."} />
        <Link to="/admin/reports" className="text-sm font-semibold text-emerald-700">← Back to reports</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link to="/admin/reports" className="text-sm font-semibold text-emerald-700">← All reports</Link>
      <PageHeader
        eyebrow={`${CATEGORY_LABELS[report.data.category]} · ${report.data.zoneName ?? "Outside zones"}`}
        title={report.data.title}
        description={`Reported by ${report.data.reporterName || "a citizen"} on ${formatDateTime(report.data.createdAt)}`}
        actions={
          <>
            <StatusBadge status={report.data.status} />
            <PriorityBadge priority={report.data.priority} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-slate-900">Details</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{report.data.description || "No description."}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Address / landmark</dt><dd className="font-medium text-slate-800">{report.data.address || "—"}</dd></div>
              <div><dt className="text-slate-500">Coordinates</dt><dd className="font-medium text-slate-800">{report.data.location.lat.toFixed(5)}, {report.data.location.lng.toFixed(5)}</dd></div>
              <div><dt className="text-slate-500">Last updated</dt><dd className="font-medium text-slate-800">{formatDateTime(report.data.updatedAt)}</dd></div>
              <div><dt className="text-slate-500">Resolved</dt><dd className="font-medium text-slate-800">{formatDateTime(report.data.resolvedAt)}</dd></div>
            </dl>
            <h3 className="mt-6 text-sm font-semibold text-slate-700">Citizen photos</h3>
            <div className="mt-2"><PhotoGallery urls={report.data.photoUrls} emptyText="No photos attached." /></div>
            <h3 className="mt-6 text-sm font-semibold text-slate-700">Completion photos</h3>
            <div className="mt-2"><PhotoGallery urls={report.data.completionPhotoUrls} emptyText="No completion photos yet." /></div>
          </Card>
          <Card>
            <h2 className="font-semibold text-slate-900">Location</h2>
            <div className="mt-3"><ReportsMap reports={[report.data]} height={280} /></div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-slate-900">Manage report</h2>
            {workers.error && <ErrorBlock message={workers.error} />}
            <ManageForm key={report.data.id} report={report.data} workers={workers.data ?? []} />
          </Card>
          <Card>
            <h2 className="font-semibold text-slate-900">Timeline</h2>
            <div className="mt-4">{events.loading ? <LoadingBlock /> : <Timeline events={events.data ?? []} />}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

type FormValues = {
  status: ReportStatus;
  priority: "low" | "medium" | "high";
  workerId: string;
  notes: string;
};

function ManageForm({ report, workers }: { report: Report; workers: { id: string; name: string }[] }) {
  const auth = useAuth();
  const { user, profile } = auth;
  const authStatus = auth.status;
  const defaults = useMemo<FormValues>(
    () => ({
      status: report.status,
      priority: report.priority,
      workerId: report.assignedWorkerId ?? "",
      notes: report.notes,
    }),
    [report],
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<FormValues>({ defaultValues: defaults });
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(values: FormValues) {
    if (authStatus !== "ready" || !user || !profile) return;
    setSaveError(null);
    setSaved(false);
    const changes: ReportChanges = {};
    const messages: string[] = [];
    const notifications: NotificationInput[] = [];

    const workerId = values.workerId || null;
    const worker = workers.find((w) => w.id === workerId) ?? null;
    let status = values.status;

    if (workerId !== report.assignedWorkerId) {
      changes.assignedWorkerId = workerId;
      changes.assignedWorkerName = worker?.name ?? null;
      messages.push(worker ? `Assigned to ${worker.name}` : "Worker unassigned");
      if (worker && status === "pending") status = "assigned";
      if (worker) {
        notifications.push({
          userId: worker.id,
          title: "New task assigned",
          message: `You have been assigned "${report.title}"${report.zoneName ? ` in ${report.zoneName}` : ""}.`,
        });
      }
    }
    if (status !== report.status) {
      changes.status = status;
      messages.push(`Status set to ${STATUS_LABELS[status]}`);
      if (status !== "pending" && status !== "assigned") {
        // Inform the citizen about meaningful status changes (not internal assignment steps).
        notifications.push({ userId: report.reporterId, ...statusNotification(report.title, status) });
      }
    }
    if (values.priority !== report.priority) {
      changes.priority = values.priority;
      messages.push(`Priority set to ${PRIORITY_LABELS[values.priority]}`);
    }
    if (values.notes !== report.notes) {
      changes.notes = values.notes;
      messages.push("Notes updated");
    }
    if (messages.length === 0) return;

    try {
      await applyReportUpdate({
        report: { id: report.id, status: report.status },
        actor: { id: user.uid, name: profile.name || profile.email },
        changes,
        message: messages.join(". "),
        notifications,
      });
      reset({ status, priority: values.priority, workerId: workerId ?? "", notes: values.notes });
      setSaved(true);
    } catch (err) {
      console.error(err);
      setSaveError("Could not save changes. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <label className="block">
        <div className="mb-1.5 text-sm font-medium text-slate-700">Status</div>
        <select className="field-input" {...register("status")}>
          {REPORT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </label>
      <label className="block">
        <div className="mb-1.5 text-sm font-medium text-slate-700">Priority</div>
        <select className="field-input" {...register("priority")}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
        </select>
      </label>
      <label className="block">
        <div className="mb-1.5 text-sm font-medium text-slate-700">Assigned worker</div>
        <select className="field-input" {...register("workerId")}>
          <option value="">Unassigned</option>
          {workers.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
        {workers.length === 0 && <span className="mt-1 block text-xs text-slate-500">No workers yet. Promote a user to worker in Users.</span>}
      </label>
      <label className="block">
        <div className="mb-1.5 text-sm font-medium text-slate-700">Internal notes</div>
        <textarea className="field-input min-h-24" {...register("notes")} placeholder="Visible to staff and the assigned worker" />
      </label>
      {saveError && <ErrorBlock message={saveError} />}
      {saved && !isDirty && <p className="text-sm text-emerald-700">Changes saved.</p>}
      <button type="submit" className="btn w-full py-3" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import PhotoUpload from "../../components/PhotoUpload";
import ReportsMap from "../../components/ReportsMap";
import { useAuth, useProfile } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { applyReportUpdate, statusNotification, subscribeReport, subscribeReportEvents } from "../../services/reports";
import { uploadPhotos } from "../../services/storage";
import { CATEGORY_LABELS, type Report, type ReportEvent } from "../../lib/types";
import { formatDateTime } from "../../lib/reports";
import { Card, ErrorBlock, LoadingBlock, PageHeader, PhotoGallery, PriorityBadge, StatusBadge, Timeline } from "../../components/ui";

export default function WorkerTaskDetail() {
  const { id = "" } = useParams();
  const profile = useProfile();
  const report = useLiveData<Report>((next, onError) => subscribeReport(id, next, onError), `report:${id}`);
  const events = useLiveData<ReportEvent[]>((next, onError) => subscribeReportEvents(id, next, onError), `events:${id}`);

  if (report.loading) return <LoadingBlock />;
  if (report.error || !report.data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <ErrorBlock message={report.error ?? "Task not found."} />
        <Link to="/worker/tasks" className="text-sm font-semibold text-emerald-700">← My tasks</Link>
      </div>
    );
  }

  const r = report.data;
  const notMine = r.assignedWorkerId !== profile.id;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link to="/worker/tasks" className="text-sm font-semibold text-emerald-700">← My tasks</Link>
      <PageHeader
        eyebrow={`${CATEGORY_LABELS[r.category]} · ${r.zoneName ?? "Outside zones"}`}
        title={r.title}
        description={r.address}
        actions={
          <>
            <StatusBadge status={r.status} />
            <PriorityBadge priority={r.priority} />
          </>
        }
      />
      {notMine && <ErrorBlock message="This task is no longer assigned to you." />}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-slate-900">What to collect</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{r.description || "No description provided."}</p>
            <h3 className="mt-5 text-sm font-semibold text-slate-700">Citizen photos</h3>
            <div className="mt-2"><PhotoGallery urls={r.photoUrls} emptyText="No photos attached." /></div>
          </Card>
          <Card>
            <h2 className="font-semibold text-slate-900">Location</h2>
            <p className="mb-3 text-sm text-slate-500">Reported {formatDateTime(r.createdAt)}</p>
            <ReportsMap reports={[r]} height={280} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-slate-900">Update progress</h2>
            {r.status === "resolved" || r.status === "rejected" ? (
              <div className="mt-3 space-y-3 text-sm text-slate-600">
                <p>This task is {r.status === "resolved" ? "completed" : "closed"}. Thank you.</p>
                <PhotoGallery urls={r.completionPhotoUrls} emptyText="No completion photos." />
              </div>
            ) : (
              <UpdateForm report={r} disabled={notMine} />
            )}
          </Card>
          <Card>
            <h2 className="font-semibold text-slate-900">Activity</h2>
            <div className="mt-4">{events.loading ? <LoadingBlock /> : <Timeline events={events.data ?? []} />}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function UpdateForm({ report, disabled }: { report: Report; disabled: boolean }) {
  const auth = useAuth();
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ notes: string }>({ defaultValues: { notes: report.notes } });

  if (auth.status !== "ready") return null;
  const actor = { id: auth.user.uid, name: auth.profile.name || auth.profile.email };

  async function startJob(notes: string) {
    setError(null);
    setMessage(null);
    try {
      await applyReportUpdate({
        report,
        actor,
        changes: { status: "in_progress", notes },
        message: "Crew started work on site",
      });
      setMessage("Marked as in progress.");
    } catch (err) {
      console.error(err);
      setError("Could not update the task. Try again.");
    }
  }

  async function completeJob(values: { notes: string }) {
    setError(null);
    setMessage(null);
    if (photos.length === 0) {
      setError("Upload at least one completion photo before marking the task complete.");
      return;
    }
    try {
      const urls = await uploadPhotos(`reports/${report.id}/completion`, photos);
      await applyReportUpdate({
        report,
        actor,
        changes: { status: "resolved", notes: values.notes, completionPhotoUrls: [...report.completionPhotoUrls, ...urls] },
        message: `Collection completed by ${actor.name}`,
        notifications: [{ userId: report.reporterId, ...statusNotification(report.title, "resolved") }],
      });
      setPhotos([]);
    } catch (err) {
      console.error(err);
      setError("Could not complete the task. Check your connection and try again.");
    }
  }

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit(completeJob)} noValidate>
      <label className="block">
        <div className="mb-1.5 text-sm font-medium text-slate-700">Field notes</div>
        <textarea className="field-input min-h-24" disabled={disabled} {...register("notes")} placeholder="e.g. Bin emptied, area swept, access blocked by parked van" />
      </label>

      {report.status === "assigned" && (
        <button
          type="button"
          className="btn-outline w-full py-3"
          disabled={disabled || isSubmitting}
          onClick={handleSubmit((v) => startJob(v.notes))}
        >
          Start job
        </button>
      )}

      <div>
        <div className="mb-2 text-sm font-medium text-slate-700">Completion photos</div>
        <PhotoUpload files={photos} onChange={setPhotos} onError={setError} max={5} />
      </div>

      {error && <ErrorBlock message={error} />}
      {message && <p className="text-sm text-emerald-700">{message}</p>}

      <button type="submit" className="btn w-full py-3" disabled={disabled || isSubmitting}>
        {isSubmitting ? "Uploading…" : "Mark as completed"}
      </button>
    </form>
  );
}

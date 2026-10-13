import { Link, useParams } from "react-router-dom";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeReport, subscribeReportEvents } from "../../services/reports";
import { CATEGORY_LABELS } from "../../lib/types";
import { formatDateTime } from "../../lib/reports";
import { Card, ErrorBlock, LoadingBlock, PageHeader, PhotoGallery, PriorityBadge, StatusBadge, Timeline } from "../../components/ui";
import ReportsMap from "../../components/ReportsMap";
import type { Report, ReportEvent } from "../../lib/types";

export default function ReportDetail() {
  const { id = "" } = useParams();
  const report = useLiveData<Report>((next, onError) => subscribeReport(id, next, onError), `report:${id}`);
  const events = useLiveData<ReportEvent[]>((next, onError) => subscribeReportEvents(id, next, onError), `events:${id}`);

  if (report.loading) return <LoadingBlock />;
  if (report.error || !report.data) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <ErrorBlock message={report.error ?? "Report not found."} />
        <Link to="/citizen/dashboard" className="text-sm font-semibold text-emerald-700">← Back to dashboard</Link>
      </div>
    );
  }

  const r = report.data;
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <Link to="/citizen/dashboard" className="text-sm font-semibold text-emerald-700">← Back to dashboard</Link>
      <PageHeader
        eyebrow={`Report · ${CATEGORY_LABELS[r.category]}`}
        title={r.title}
        description={`Submitted ${formatDateTime(r.createdAt)}${r.zoneName ? ` · ${r.zoneName}` : ""}`}
        actions={
          <>
            <StatusBadge status={r.status} />
            <PriorityBadge priority={r.priority} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-semibold text-slate-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{r.description || "No description."}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-slate-800">{r.address || "—"}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Assigned worker</dt>
                <dd className="font-medium text-slate-800">{r.assignedWorkerName ?? "Not yet assigned"}</dd>
              </div>
              {r.resolvedAt && (
                <div>
                  <dt className="text-slate-500">Resolved</dt>
                  <dd className="font-medium text-slate-800">{formatDateTime(r.resolvedAt)}</dd>
                </div>
              )}
            </dl>
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900">Your photos</h2>
            <div className="mt-3">
              <PhotoGallery urls={r.photoUrls} emptyText="No photos were attached." />
            </div>
            {r.completionPhotoUrls.length > 0 && (
              <>
                <h3 className="mt-6 font-semibold text-slate-900">Completion photos</h3>
                <div className="mt-3">
                  <PhotoGallery urls={r.completionPhotoUrls} emptyText="" />
                </div>
              </>
            )}
          </Card>

          <Card>
            <h2 className="font-semibold text-slate-900">Location</h2>
            <div className="mt-3">
              <ReportsMap reports={[r]} height={300} />
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <h2 className="font-semibold text-slate-900">Progress timeline</h2>
          <p className="mb-5 mt-1 text-sm text-slate-500">Every update the council or crew makes appears here.</p>
          {events.loading ? <LoadingBlock /> : <Timeline events={events.data ?? []} />}
          {events.error && <ErrorBlock message={events.error} />}
        </Card>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useProfile } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeMyNotifications, markAllNotificationsRead, markNotificationRead } from "../../services/notifications";
import { formatDateTime } from "../../lib/reports";
import type { AppNotification } from "../../lib/types";
import { EmptyState, ErrorBlock, LoadingBlock, PageHeader } from "../../components/ui";

export default function Notifications() {
  const profile = useProfile();
  const notifications = useLiveData<AppNotification[]>(
    (next, onError) => subscribeMyNotifications(profile.id, next, onError),
    `notifications:${profile.id}`,
  );
  const items = notifications.data ?? [];
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <PageHeader
        eyebrow="Updates"
        title="Notifications"
        description="We let you know when your report changes status or a collection is scheduled."
        actions={
          unread > 0 && (
            <button className="btn-outline px-4 py-2 text-sm" onClick={() => void markAllNotificationsRead(items)}>
              Mark all read ({unread})
            </button>
          )
        }
      />
      {notifications.loading && <LoadingBlock />}
      {notifications.error && <ErrorBlock message={notifications.error} />}
      {notifications.data && items.length === 0 && <EmptyState title="You're all caught up" />}
      <div className="space-y-3">
        {items.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border p-4 ${n.read ? "border-slate-200 bg-white" : "border-emerald-200 bg-emerald-50/60"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-900">{n.title}</div>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
                <div className="mt-2 text-xs text-slate-400">{formatDateTime(n.createdAt)}</div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2 text-sm">
                {n.reportId && (
                  <Link to={`/citizen/reports/${n.reportId}`} className="font-semibold text-emerald-700">
                    View
                  </Link>
                )}
                {!n.read && (
                  <button className="text-slate-500 hover:text-slate-800" onClick={() => void markNotificationRead(n.id)}>
                    Mark read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

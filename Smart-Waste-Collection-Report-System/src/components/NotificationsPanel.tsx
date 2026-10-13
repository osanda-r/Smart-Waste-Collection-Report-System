import { Link } from "react-router-dom";
import { useLiveData } from "../hooks/useLiveData";
import { subscribeMyNotifications, markNotificationRead } from "../services/notifications";
import { formatDateTime } from "../lib/reports";
import { EmptyState, ErrorBlock, LoadingBlock } from "./ui";
import type { AppNotification } from "../lib/types";

export default function NotificationsPanel({
  uid,
  limit = 5,
  seeAllTo,
}: {
  uid: string;
  limit?: number;
  seeAllTo?: string;
}) {
  const live = useLiveData<AppNotification[]>(
    (next, onError) => subscribeMyNotifications(uid, next, onError),
    `notifications:${uid}`,
  );

  if (live.loading) return <LoadingBlock label="Loading notifications…" />;
  if (live.error) return <ErrorBlock message={live.error} />;
  const items = (live.data ?? []).slice(0, limit);

  return (
    <div className="space-y-3">
      {items.length === 0 && <EmptyState title="No notifications yet" />}
      {items.map((n) => (
        <button
          key={n.id}
          type="button"
          onClick={() => !n.read && void markNotificationRead(n.id)}
          className={`block w-full rounded-xl px-4 py-3 text-left text-sm leading-6 transition ${
            n.read ? "bg-slate-50 text-slate-600" : "bg-emerald-50 text-slate-800 ring-1 ring-emerald-200"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold">{n.title}</span>
            {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-600" />}
          </div>
          <div>{n.message}</div>
          <div className="text-xs text-slate-400">{formatDateTime(n.createdAt)}</div>
        </button>
      ))}
      {seeAllTo && items.length > 0 && (
        <Link to={seeAllTo} className="block text-center text-sm font-semibold text-emerald-700">
          See all notifications
        </Link>
      )}
    </div>
  );
}

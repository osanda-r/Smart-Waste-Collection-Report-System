import type { Pickup } from "../lib/schedule";
import { DAY_NAMES } from "../lib/types";
import { formatTime } from "../lib/reports";
import { EmptyState } from "./ui";

export default function UpcomingPickups({ pickups, emptyText = "No collections scheduled in the next two weeks." }: { pickups: Pickup[]; emptyText?: string }) {
  if (pickups.length === 0) return <EmptyState title={emptyText} />;
  return (
    <div className="space-y-3">
      {pickups.map((p) => (
        <div key={`${p.schedule.id}-${p.date.toISOString()}`} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
          <div>
            <div className="font-medium text-slate-900">
              {p.date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })}
            </div>
            <div className="text-sm text-slate-500">
              {p.schedule.zoneName} · {p.schedule.wasteType}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-emerald-700">{formatTime(p.schedule.time)}</div>
            <div className="text-xs text-slate-400">{DAY_NAMES[p.schedule.dayOfWeek]}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

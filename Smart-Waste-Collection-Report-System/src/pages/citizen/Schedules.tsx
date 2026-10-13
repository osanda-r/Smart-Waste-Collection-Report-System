import { useMemo } from "react";
import { useProfile } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeSchedules } from "../../services/schedules";
import { subscribeZones } from "../../services/zones";
import { upcomingPickups } from "../../lib/schedule";
import { DAY_NAMES, type Schedule } from "../../lib/types";
import { formatTime } from "../../lib/reports";
import { Card, ErrorBlock, LoadingBlock, PageHeader } from "../../components/ui";
import UpcomingPickups from "../../components/UpcomingPickups";

export default function Schedules() {
  const profile = useProfile();
  const schedules = useLiveData(subscribeSchedules, "schedules");
  const zones = useLiveData(subscribeZones, "zones");

  const myPickups = useMemo(
    () => upcomingPickups(schedules.data ?? [], new Date(), 14, profile.zoneId),
    [schedules.data, profile.zoneId],
  );

  const byZone = useMemo(() => {
    const groups = new Map<string, { name: string; items: Schedule[] }>();
    for (const zone of zones.data ?? []) groups.set(zone.id, { name: zone.name, items: [] });
    for (const s of schedules.data ?? []) {
      if (!s.active) continue;
      const group = groups.get(s.zoneId) ?? { name: s.zoneName, items: [] };
      group.items.push(s);
      groups.set(s.zoneId, group);
    }
    return [...groups.entries()].filter(([, g]) => g.items.length > 0);
  }, [schedules.data, zones.data]);

  const loading = schedules.loading || zones.loading;
  const error = schedules.error ?? zones.error;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <PageHeader
        eyebrow="Collection schedules"
        title="When your waste is collected"
        description="Put bins out the evening before, and at the time shown on the day."
      />
      {loading && <LoadingBlock />}
      {error && <ErrorBlock message={error} />}

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Your zone · next 14 days</h2>
          <p className="mb-4 text-sm text-slate-500">
            {profile.zoneId ? "Based on the zone selected on your dashboard." : "Select your zone on the dashboard to personalise this."}
          </p>
          {profile.zoneId && <UpcomingPickups pickups={myPickups} />}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-slate-900">Weekly timetable by zone</h2>
          <div className="mt-4 space-y-6">
            {byZone.length === 0 && !loading && <p className="text-sm text-slate-500">No schedules have been published yet.</p>}
            {byZone.map(([zoneId, group]) => (
              <div key={zoneId} className={zoneId === profile.zoneId ? "rounded-xl bg-emerald-50/60 p-3 ring-1 ring-emerald-200" : ""}>
                <h3 className="font-semibold text-slate-800">
                  {group.name} {zoneId === profile.zoneId && <span className="ml-2 text-xs text-emerald-700">Your zone</span>}
                </h3>
                <ul className="mt-2 divide-y divide-slate-100 text-sm">
                  {group.items
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time))
                    .map((s) => (
                      <li key={s.id} className="flex justify-between py-2">
                        <span className="text-slate-700">
                          {DAY_NAMES[s.dayOfWeek]} · {s.wasteType}
                        </span>
                        <span className="font-semibold text-emerald-700">{formatTime(s.time)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

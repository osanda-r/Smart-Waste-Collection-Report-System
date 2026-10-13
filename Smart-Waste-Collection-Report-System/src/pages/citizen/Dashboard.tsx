import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, useProfile } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { subscribeMyReports } from "../../services/reports";
import { subscribeZones } from "../../services/zones";
import { subscribeSchedules } from "../../services/schedules";
import { subscribeMyNotifications } from "../../services/notifications";
import { updateOwnProfile } from "../../services/users";
import { upcomingPickups } from "../../lib/schedule";
import { isOpen, sortNewest } from "../../lib/reports";
import { StatCard, LoadingBlock, ErrorBlock, EmptyState, Card } from "../../components/ui";
import ReportRow from "../../components/ReportRow";
import NotificationsPanel from "../../components/NotificationsPanel";
import UpcomingPickups from "../../components/UpcomingPickups";
import type { AppNotification, Report } from "../../lib/types";

export default function CitizenDashboard() {
  const profile = useProfile();
  const { refreshProfile } = useAuth();
  const [savingZone, setSavingZone] = useState(false);
  const [zoneError, setZoneError] = useState<string | null>(null);

  const reports = useLiveData<Report[]>(
    (next, onError) => subscribeMyReports(profile.id, next, onError),
    `my-reports:${profile.id}`,
  );
  const zones = useLiveData(subscribeZones, "zones");
  const schedules = useLiveData(subscribeSchedules, "schedules");
  const notifications = useLiveData<AppNotification[]>(
    (next, onError) => subscribeMyNotifications(profile.id, next, onError),
    `notifications:${profile.id}`,
  );

  const myReports = useMemo(() => sortNewest(reports.data ?? []), [reports.data]);
  const unread = (notifications.data ?? []).filter((n) => !n.read).length;
  const open = myReports.filter((r) => isOpen(r.status)).length;
  const resolved = myReports.filter((r) => r.status === "resolved").length;
  const pickups = useMemo(
    () => upcomingPickups(schedules.data ?? [], new Date(), 7, profile.zoneId),
    [schedules.data, profile.zoneId],
  );

  async function changeZone(zoneId: string) {
    setSavingZone(true);
    setZoneError(null);
    try {
      await updateOwnProfile(profile.id, { zoneId: zoneId || null });
      await refreshProfile();
    } catch (err) {
      console.error(err);
      setZoneError("Could not save your zone. Please try again.");
    } finally {
      setSavingZone(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-tr from-green-900 to-teal-700 p-6 text-white shadow-xl lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white_0,transparent_35%)] opacity-20" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
              Citizen workspace
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Hi {profile.name.split(" ")[0] || "there"}, how can we help today?
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Report waste issues, track progress and check your collection days.
            </p>
          </div>
          <Link to="/citizen/report/new" className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-800 shadow-sm hover:shadow-md">
            + Create report
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your reports" value={reports.data ? myReports.length : "—"} />
        <StatCard label="Open" value={reports.data ? open : "—"} hint="Pending, assigned or in progress" />
        <StatCard label="Unread notifications" value={notifications.data ? unread : "—"} hint={`${resolved} resolved`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your reports</h2>
              <p className="text-sm text-slate-500">Track complaint status from submission to resolution.</p>
            </div>
          </div>
          {reports.loading && <LoadingBlock />}
          {reports.error && <ErrorBlock message={reports.error} />}
          {reports.data && myReports.length === 0 && (
            <EmptyState title="No reports yet">Create your first report to get started.</EmptyState>
          )}
          <div className="space-y-3">
            {myReports.slice(0, 6).map((report) => (
              <ReportRow key={report.id} report={report} to={`/citizen/reports/${report.id}`} />
            ))}
          </div>
          {myReports.length > 6 && <p className="mt-3 text-sm text-slate-500">Showing the 6 most recent reports.</p>}
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
            <div className="mt-4">
              <NotificationsPanel uid={profile.id} limit={4} seeAllTo="/citizen/notifications" />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-slate-900">Your collection zone</h2>
            <label className="mt-3 block">
              <select
                className="field-input"
                value={profile.zoneId ?? ""}
                disabled={savingZone}
                onChange={(e) => void changeZone(e.target.value)}
              >
                <option value="">Not set</option>
                {(zones.data ?? []).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
            {zoneError && <p className="mt-2 text-sm text-red-600">{zoneError}</p>}
            <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-500">Next 7 days</h3>
            <div className="mt-3">
              {profile.zoneId ? (
                <UpcomingPickups pickups={pickups} emptyText="No collections in the next 7 days." />
              ) : (
                <p className="text-sm text-slate-500">Choose your zone to see your pickup days.</p>
              )}
            </div>
            <Link to="/citizen/schedules" className="mt-4 block text-center text-sm font-semibold text-emerald-700">
              View all schedules
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

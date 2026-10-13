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
import heroBg from "../../assets/ecotrack-hero-bg.jpg";
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
    <div className="mx-auto max-w-[1280px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-[28px] border border-[#E7EFE6] bg-white shadow-[0_8px_32px_rgba(15,31,22,0.06)]">
        <div className="absolute inset-0 hidden sm:block">
          <img src={heroBg} alt="" className="h-full w-full object-cover opacity-[0.08]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F0FDF4] via-white/70 to-transparent" />
        </div>
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#052E16] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Citizen workspace
            </span>
            <h1 className="mt-4 text-[26px] font-[800] leading-tight tracking-[-0.03em] text-[#0F1F16] sm:text-[30px]">
              Hi {profile.name.split(" ")[0] || "there"}, let’s keep your street spotless.
            </h1>
            <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#475569]">
              Report in seconds, track to resolution, and never miss a collection. Everything calm, clear, and one tap away.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">30-second report</span>
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">Photo + pin</span>
              <span className="rounded-full bg-teal-50 px-3 py-1.5 text-teal-800">Live timeline</span>
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <Link to="/citizen/report/new" className="btn w-full justify-center py-4 text-[16px] shadow-lg lg:w-auto lg:px-8">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15">＋</span> Create report
            </Link>
            <p className="text-center text-xs font-medium text-[#94A3A8] lg:text-right">Takes 30 seconds • Add 1–3 photos • Pin on map</p>
            <div className="hidden items-center gap-2 rounded-full bg-[#F6F7F3] px-4 py-2 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-[#0F1F16]">{open} open • {resolved} resolved • {myReports.length} total</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Your reports" value={reports.data ? myReports.length : "—"} hint="All time" icon={<span className="text-[18px]">◈</span>} />
        <StatCard label="Open" value={reports.data ? open : "—"} hint="Pending • Assigned • In progress" icon={<span className="h-2 w-2 rounded-full bg-amber-400" />} />
        <StatCard label="Unread" value={notifications.data ? unread : "—"} hint={`${resolved} resolved`} icon={<span className="text-[16px]">✉</span>} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.75fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[18px] font-[800] tracking-[-0.02em] text-[#0F1F16]">Your reports</h2>
              <p className="text-sm font-medium text-[#64748B]">Tap any report to see timeline & proof.</p>
            </div>
            <Link to="/citizen/report/new" className="hidden rounded-full bg-[#F0FDF4] px-4 py-2 text-xs font-bold text-[#15803D] ring-1 ring-[#BBF7D0] hover:bg-[#DCFCE7] sm:inline-flex">
              New report
            </Link>
          </div>
          {reports.loading && <LoadingBlock />}
          {reports.error && <ErrorBlock message={reports.error} />}
          {reports.data && myReports.length === 0 && (
            <EmptyState title="No reports yet" icon={<span>◈</span>}>Create your first report — it helps the whole neighbourhood.</EmptyState>
          )}
          <div className="space-y-3">
            {myReports.slice(0, 6).map((report) => (
              <ReportRow key={report.id} report={report} to={`/citizen/reports/${report.id}`} />
            ))}
          </div>
          {myReports.length > 6 && <p className="mt-4 text-center text-sm font-medium text-[#64748B]">Showing the 6 most recent • {myReports.length} total</p>}
        </Card>

        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-[800] tracking-[-0.01em] text-[#0F1F16]">Inbox</h2>
              <span className="rounded-full bg-[#052E16] px-2.5 py-1 text-xs font-bold text-white">{unread} new</span>
            </div>
            <div className="mt-4">
              <NotificationsPanel uid={profile.id} limit={4} seeAllTo="/citizen/notifications" />
            </div>
          </Card>

          <Card>
            <h2 className="text-[16px] font-[800] tracking-[-0.01em] text-[#0F1F16]">Your collection zone</h2>
            <p className="mt-1 text-xs font-medium text-[#64748B]">Pick your zone to see exact pickup days. One tap, always accurate.</p>
            <label className="mt-4 block">
              <select
                className="field-input"
                value={profile.zoneId ?? ""}
                disabled={savingZone}
                onChange={(e) => void changeZone(e.target.value)}
              >
                <option value="">Not set — choose zone</option>
                {(zones.data ?? []).map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </label>
            {zoneError && <p className="mt-2 text-sm font-medium text-red-600">{zoneError}</p>}
            <div className="mt-5 rounded-2xl bg-[#F6F7F3] p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#5B7A6A]">Next 7 days</h3>
              <div className="mt-3">
                {profile.zoneId ? (
                  <UpcomingPickups pickups={pickups} emptyText="No collections in the next 7 days — you’re all set." />
                ) : (
                  <p className="text-sm font-medium text-[#64748B]">Choose your zone to see your pickup days.</p>
                )}
              </div>
            </div>
            <Link to="/citizen/schedules" className="mt-4 flex items-center justify-center gap-1 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#15803D] ring-1 ring-[#BBF7D0] hover:bg-[#F0FDF4]">
              View all schedules →
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

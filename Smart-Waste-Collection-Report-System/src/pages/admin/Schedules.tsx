import { useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import { useLiveData } from "../../hooks/useLiveData";
import { deleteSchedule, saveSchedule, subscribeSchedules } from "../../services/schedules";
import { subscribeZones } from "../../services/zones";
import { DAY_NAMES, WASTE_TYPES, type Schedule } from "../../lib/types";
import { formatTime } from "../../lib/reports";
import { Card, EmptyState, ErrorBlock, LoadingBlock, PageHeader } from "../../components/ui";

type Editing = { mode: "new" } | { mode: "edit"; schedule: Schedule } | null;

export default function Schedules() {
  const schedules = useLiveData(subscribeSchedules, "schedules");
  const zones = useLiveData(subscribeZones, "zones");
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...(schedules.data ?? [])].sort(
    (a, b) => a.zoneName.localeCompare(b.zoneName) || a.dayOfWeek - b.dayOfWeek || a.time.localeCompare(b.time),
  );

  async function handleDelete(s: Schedule) {
    if (!window.confirm(`Delete the ${s.wasteType} pickup for ${s.zoneName} on ${DAY_NAMES[s.dayOfWeek]}?`)) return;
    try {
      await deleteSchedule(s.id);
    } catch (err) {
      console.error(err);
      setError("Could not delete the schedule.");
    }
  }

  async function toggleActive(s: Schedule) {
    try {
      await saveSchedule(s.id, { zoneId: s.zoneId, zoneName: s.zoneName, wasteType: s.wasteType, dayOfWeek: s.dayOfWeek, time: s.time, active: !s.active });
    } catch (err) {
      console.error(err);
      setError("Could not update the schedule.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeader
        eyebrow="Collection timetable"
        title="Schedules"
        description="Recurring weekly pickups per zone. Citizens see these on their dashboard and schedule page."
        actions={<button className="btn px-4 py-2.5 text-sm" onClick={() => setEditing({ mode: "new" })}>+ Add pickup</button>}
      />
      {(error || schedules.error || zones.error) && <ErrorBlock message={error ?? schedules.error ?? zones.error ?? ""} />}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          {schedules.loading && <LoadingBlock />}
          {schedules.data && sorted.length === 0 && <EmptyState title="No schedules yet">Add the first weekly pickup.</EmptyState>}
          {sorted.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2">Zone</th><th>Day</th><th>Time</th><th>Waste</th><th>Status</th><th />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sorted.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-medium text-slate-900">{s.zoneName}</td>
                      <td>{DAY_NAMES[s.dayOfWeek]}</td>
                      <td>{formatTime(s.time)}</td>
                      <td>{s.wasteType}</td>
                      <td>
                        <button onClick={() => void toggleActive(s)} className={`rounded-full px-2.5 py-1 text-xs font-semibold ${s.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
                          {s.active ? "Active" : "Paused"}
                        </button>
                      </td>
                      <td className="whitespace-nowrap text-right">
                        <button className="text-emerald-700 hover:underline" onClick={() => setEditing({ mode: "edit", schedule: s })}>Edit</button>
                        <button className="ml-3 text-red-600 hover:underline" onClick={() => void handleDelete(s)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          {editing ? (
            <ScheduleForm
              key={editing.mode === "edit" ? editing.schedule.id : "new"}
              schedule={editing.mode === "edit" ? editing.schedule : null}
              zones={zones.data ?? []}
              onDone={() => setEditing(null)}
              onError={setError}
            />
          ) : (
            <p className="text-sm text-slate-500">Add a pickup or pick an existing row to edit it.</p>
          )}
        </Card>
      </div>
    </div>
  );
}

type FormValues = { zoneId: string; wasteType: string; dayOfWeek: number; time: string; active: boolean };

function ScheduleForm({
  schedule,
  zones,
  onDone,
  onError,
}: {
  schedule: Schedule | null;
  zones: { id: string; name: string }[];
  onDone: () => void;
  onError: (m: string) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      zoneId: schedule?.zoneId ?? zones[0]?.id ?? "",
      wasteType: schedule?.wasteType ?? WASTE_TYPES[0],
      dayOfWeek: schedule?.dayOfWeek ?? 1,
      time: schedule?.time ?? "08:00",
      active: schedule?.active ?? true,
    },
  });

  async function onSubmit(v: FormValues) {
    const zone = zones.find((z) => z.id === v.zoneId);
    if (!zone) {
      onError("Choose a zone for this pickup.");
      return;
    }
    try {
      await saveSchedule(schedule?.id ?? null, {
        zoneId: zone.id,
        zoneName: zone.name,
        wasteType: v.wasteType,
        dayOfWeek: Number(v.dayOfWeek),
        time: v.time,
        active: v.active,
      });
      onDone();
    } catch (err) {
      console.error(err);
      onError("Could not save the schedule.");
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{schedule ? "Edit pickup" : "New pickup"}</h2>
      {zones.length === 0 && <p className="mt-2 text-sm text-amber-700">Create a zone first.</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
        <label className="block">
          <div className="mb-1.5 text-sm font-medium text-slate-700">Zone</div>
          <select className="field-input" {...register("zoneId", { required: true })}>
            {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </select>
        </label>
        <label className="block">
          <div className="mb-1.5 text-sm font-medium text-slate-700">Waste type</div>
          <select className="field-input" {...register("wasteType")}>
            {WASTE_TYPES.map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="mb-1.5 text-sm font-medium text-slate-700">Day</div>
            <select className="field-input" {...register("dayOfWeek", { valueAsNumber: true })}>
              {DAY_NAMES.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
          </label>
          <FormInput label="Time" type="time" error={errors.time?.message} {...register("time", { required: "Pick a time" })} />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 accent-emerald-600" {...register("active")} /> Active (visible to citizens)
        </label>
        <div className="flex gap-3">
          <button type="submit" className="btn px-5 py-2.5" disabled={isSubmitting || zones.length === 0}>{isSubmitting ? "Saving…" : "Save pickup"}</button>
          <button type="button" className="btn-outline px-5 py-2.5" onClick={onDone}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

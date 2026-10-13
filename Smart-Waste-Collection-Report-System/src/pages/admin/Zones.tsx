import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import FormInput from "../../components/FormInput";
import LocationPicker from "../../components/LocationPicker";
import { useLiveData } from "../../hooks/useLiveData";
import { deleteZone, saveZone, subscribeZones, type ZoneInput } from "../../services/zones";
import { subscribeAllReports } from "../../services/reports";
import { countBy } from "../../lib/analytics";
import { DEFAULT_CENTER } from "../../lib/geo";
import type { GeoPoint, Zone } from "../../lib/types";
import { Card, EmptyState, ErrorBlock, LoadingBlock, PageHeader } from "../../components/ui";
import ReportsMap from "../../components/ReportsMap";

type Editing = { mode: "new" } | { mode: "edit"; zone: Zone } | null;

export default function Zones() {
  const zones = useLiveData(subscribeZones, "zones");
  const reports = useLiveData(subscribeAllReports, "all-reports");
  const [editing, setEditing] = useState<Editing>(null);
  const [error, setError] = useState<string | null>(null);

  const counts = useMemo(() => countBy(reports.data ?? [], (r) => r.zoneId ?? "none"), [reports.data]);

  async function handleDelete(zone: Zone) {
    if (!window.confirm(`Delete zone "${zone.name}"? Existing reports keep their zone name, but schedules for it will need updating.`)) return;
    try {
      await deleteZone(zone.id);
      if (editing?.mode === "edit" && editing.zone.id === zone.id) setEditing(null);
    } catch (err) {
      console.error(err);
      setError("Could not delete the zone.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeader
        eyebrow="Collection zones"
        title="Zones"
        description="Each zone is a circle on the map. New reports are assigned to the zone that contains their pin."
        actions={<button className="btn px-4 py-2.5 text-sm" onClick={() => setEditing({ mode: "new" })}>+ New zone</button>}
      />
      {error && <ErrorBlock message={error} />}
      {zones.error && <ErrorBlock message={zones.error} />}

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          {zones.loading && <LoadingBlock />}
          {zones.data && zones.data.length === 0 && <EmptyState title="No zones yet">Create the first collection zone.</EmptyState>}
          <div className="divide-y divide-slate-100">
            {(zones.data ?? []).map((zone) => (
              <div key={zone.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-semibold text-slate-900">{zone.name}</div>
                  <div className="text-sm text-slate-500">
                    Radius {zone.radiusM} m · {counts[zone.id] ?? 0} reports
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <button className="btn-outline px-3 py-1.5" onClick={() => setEditing({ mode: "edit", zone })}>Edit</button>
                  <button className="rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50" onClick={() => void handleDelete(zone)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          {editing ? (
            <ZoneForm
              key={editing.mode === "edit" ? editing.zone.id : "new"}
              zone={editing.mode === "edit" ? editing.zone : null}
              onDone={() => setEditing(null)}
              onError={setError}
            />
          ) : (
            <p className="text-sm text-slate-500">Select a zone to edit, or create a new one.</p>
          )}
        </Card>
      </div>

      {reports.data && (
        <ReportsMap reports={reports.data} zones={zones.data ?? []} detailBase="/admin/reports" height={420} />
      )}
    </div>
  );
}

function ZoneForm({ zone, onDone, onError }: { zone: Zone | null; onDone: () => void; onError: (m: string) => void }) {
  const [center, setCenter] = useState<GeoPoint | null>(zone?.center ?? null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ name: string; radiusM: number }>({
    defaultValues: { name: zone?.name ?? "", radiusM: zone?.radiusM ?? 1000 },
  });

  async function onSubmit(values: { name: string; radiusM: number }) {
    if (!center) {
      onError("Click the map to set the zone centre.");
      return;
    }
    const input: ZoneInput = { name: values.name.trim(), center, radiusM: Number(values.radiusM) };
    try {
      await saveZone(zone?.id ?? null, input);
      onDone();
    } catch (err) {
      console.error(err);
      onError("Could not save the zone. Check your permissions and try again.");
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-slate-900">{zone ? `Edit ${zone.name}` : "New zone"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
        <FormInput
          label="Zone name"
          placeholder="e.g. Colombo 07"
          error={errors.name?.message}
          {...register("name", { required: "Name the zone" })}
        />
        <FormInput
          label="Radius (metres)"
          type="number"
          min={50}
          step={50}
          error={errors.radiusM?.message}
          {...register("radiusM", { required: "Enter a radius", min: { value: 50, message: "At least 50 m" }, valueAsNumber: true })}
        />
        <div>
          <div className="mb-1.5 text-sm font-medium text-slate-700">Centre</div>
          <LocationPicker value={center} onChange={setCenter} radiusM={undefined} height={260} />
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn px-5 py-2.5" disabled={isSubmitting}>{isSubmitting ? "Saving…" : "Save zone"}</button>
          <button type="button" className="btn-outline px-5 py-2.5" onClick={onDone}>Cancel</button>
        </div>
      </form>
      <p className="mt-3 text-xs text-slate-500">Default map centre: {DEFAULT_CENTER.lat.toFixed(4)}, {DEFAULT_CENTER.lng.toFixed(4)}.</p>
    </div>
  );
}

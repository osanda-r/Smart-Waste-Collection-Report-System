import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import PhotoUpload from "../../components/PhotoUpload";
import LocationPicker from "../../components/LocationPicker";
import { useProfile } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { createReport } from "../../services/reports";
import { subscribeZones } from "../../services/zones";
import { findZoneForPoint } from "../../lib/geo";
import { CATEGORY_LABELS, type GeoPoint, type ReportCategory } from "../../lib/types";

type FormData = {
  title: string;
  category: ReportCategory;
  description: string;
  address: string;
};

const steps = ["Describe the issue", "Pin the location", "Add photos", "Submit for review"];

export default function ReportForm() {
  const profile = useProfile();
  const navigate = useNavigate();
  const zones = useLiveData(subscribeZones, "zones");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { category: "overflowing_bin" } });
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(data: FormData) {
    setError(null);
    if (!location) {
      setError("Mark the location on the map so the team can find the spot.");
      return;
    }
    try {
      const zone = findZoneForPoint(location, zones.data ?? []);
      const id = await createReport({
        reporterId: profile.id,
        reporterName: profile.name,
        title: data.title.trim(),
        description: data.description.trim(),
        category: data.category,
        address: data.address.trim(),
        location,
        zone: zone ? { id: zone.id, name: zone.name } : null,
        photos,
      });
      navigate(`/citizen/reports/${id}`);
    } catch (err) {
      console.error(err);
      setError("We could not submit your report. Check your connection and try again.");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <section className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="bg-linear-to-br from-green-900 to-teal-700 px-6 py-8 text-white lg:px-8 lg:py-10">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90">
              New complaint
            </span>
            <h1 className="mt-4 text-3xl font-semibold leading-tight">Report a waste problem</h1>
            <p className="mt-3 text-sm leading-6 text-white/85">
              Clear details, an exact pin and a photo help the council send the right crew quickly.
            </p>
            <ol className="mt-8 space-y-3">
              {steps.map((step, index) => (
                <li key={step} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-white font-semibold text-green-800">{index + 1}</div>
                  <div className="font-medium">{step}</div>
                </li>
              ))}
            </ol>
          </aside>

          <div className="p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Report details</h2>
            <p className="mb-6 mt-1 text-sm text-slate-500">Everything here is shared with the municipal team and the crew assigned to it.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <FormInput
                label="Title"
                placeholder="e.g. Overflowing bin near the school gate"
                error={errors.title?.message}
                {...register("title", { required: "Give the report a short title", maxLength: { value: 120, message: "Keep it under 120 characters" } })}
              />

              <label className="block">
                <div className="mb-1.5 text-sm font-medium text-slate-700">Type of issue</div>
                <select className="field-input" {...register("category", { required: true })}>
                  {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_LABELS[key]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="mb-1.5 text-sm font-medium text-slate-700">Description</div>
                <textarea
                  {...register("description", { required: "Describe what you saw", minLength: { value: 10, message: "Add a little more detail" } })}
                  placeholder="What is the problem, how long has it been there, and any landmarks nearby?"
                  className="min-h-32 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
                {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description.message}</div>}
              </label>

              <FormInput
                label="Address or landmark"
                placeholder="e.g. 14 Main Street, opposite the bus stand"
                error={errors.address?.message}
                {...register("address", { required: "Add a nearby address or landmark" })}
              />

              <div>
                <div className="mb-1.5 text-sm font-medium text-slate-700">Pin the exact location</div>
                <LocationPicker value={location} onChange={setLocation} />
                {location && zones.data && (
                  <p className="mt-2 text-sm text-slate-600">
                    Collection zone: <strong>{findZoneForPoint(location, zones.data)?.name ?? "not inside a mapped zone"}</strong>
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
                <div className="mb-2 text-sm font-medium text-slate-700">Photo evidence (up to 3)</div>
                <PhotoUpload files={photos} onChange={setPhotos} onError={setError} />
                <p className="mt-2 text-xs text-slate-500">JPG or PNG, up to 8 MB each.</p>
              </div>

              {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="submit" className="btn px-5 py-3" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit report"}
                </button>
                <button type="button" className="btn-outline px-5 py-3" onClick={() => navigate("/citizen/dashboard")}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

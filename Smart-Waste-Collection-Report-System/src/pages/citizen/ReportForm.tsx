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

const steps = [
  { n: "01", title: "Describe", desc: "Clear title & details" },
  { n: "02", title: "Pin", desc: "Exact location on map" },
  { n: "03", title: "Prove", desc: "Up to 3 photos" },
  { n: "04", title: "Submit", desc: "We’ll notify progress" },
];

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
    <div className="mx-auto max-w-[1160px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[28px] border border-[#E7EFE6] bg-white shadow-[0_16px_48px_rgba(15,31,22,0.08)]">
        <div className="grid lg:grid-cols-[380px_1fr]">
          {/* Left panel */}
          <aside className="relative overflow-hidden bg-[#052E16] p-7 text-white lg:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-[#14532D] via-[#0F766E]/40 to-transparent" />
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ring-white/20 backdrop-blur">
                New complaint • 30s
              </span>
              <h1 className="mt-4 text-[28px] font-[800] leading-tight tracking-[-0.02em]">Report a waste problem</h1>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Clear details, an exact pin and a photo help the council send the right crew quickly. You’ll get live updates.
              </p>
              <ol className="mt-8 grid gap-3">
                {steps.map((step) => (
                  <li key={step.n} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-white font-extrabold text-[#052E16] text-sm shadow-sm">{step.n}</div>
                    <div>
                      <div className="text-sm font-bold">{step.title}</div>
                      <div className="text-xs font-medium text-white/70">{step.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <div className="text-sm font-bold">Easy for every user</div>
                <p className="mt-1 text-xs leading-5 text-white/70">Big buttons, plain language, accessible contrast. No training needed.</p>
              </div>
            </div>
          </aside>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[22px] font-[800] tracking-[-0.02em] text-[#0F1F16]">Report details</h2>
                <p className="mt-1 text-sm font-medium text-[#64748B]">Everything here is shared with the municipal team and the crew assigned to it.</p>
              </div>
              <span className="hidden rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-bold text-[#15803D] ring-1 ring-[#BBF7D0] sm:inline-flex">Draft auto-saved</span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
              <FormInput
                label="Title"
                placeholder="e.g. Overflowing bin near the school gate"
                error={errors.title?.message}
                {...register("title", { required: "Give the report a short title", maxLength: { value: 120, message: "Keep it under 120 characters" } })}
              />

              <label className="block">
                <div className="mb-1.5 text-sm font-semibold text-[#0F1F16]">Type of issue</div>
                <select className="field-input" {...register("category", { required: true })}>
                  {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_LABELS[key]}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="mb-1.5 text-sm font-semibold text-[#0F1F16]">Description</div>
                <textarea
                  {...register("description", { required: "Describe what you saw", minLength: { value: 10, message: "Add a little more detail" } })}
                  placeholder="What is the problem, how long has it been there, and any landmarks nearby?"
                  className="min-h-32 w-full rounded-[14px] border-[1.5px] border-[#DDE8DE] bg-[#FBFEFB] px-4 py-3 text-[15px] font-medium text-[#0F1F16] placeholder:text-[#94A3A8] outline-none transition focus:border-[#22C55E] focus:bg-white focus:shadow-[0_0_0_4px_rgba(34,197,94,0.12)]"
                />
                {errors.description && <div className="mt-1.5 text-sm font-medium text-red-600">{errors.description.message}</div>}
              </label>

              <FormInput
                label="Address or landmark"
                placeholder="e.g. 14 Main Street, opposite the bus stand"
                error={errors.address?.message}
                {...register("address", { required: "Add a nearby address or landmark" })}
              />

              <div>
                <div className="mb-1.5 text-sm font-semibold text-[#0F1F16]">Pin the exact location <span className="font-normal text-[#64748B]">• Drag or tap the map</span></div>
                <div className="overflow-hidden rounded-[16px] border border-[#E7EFE6] shadow-sm">
                  <LocationPicker value={location} onChange={setLocation} />
                </div>
                {location && zones.data && (
                  <p className="mt-2 inline-flex rounded-full bg-[#F0FDF4] px-3 py-1 text-sm font-semibold text-[#15803D] ring-1 ring-[#BBF7D0]">
                    Collection zone: {findZoneForPoint(location, zones.data)?.name ?? "not inside a mapped zone"}
                  </p>
                )}
              </div>

              <div className="rounded-[16px] border border-dashed border-[#86EFAC] bg-[#F0FDF4]/60 p-4">
                <div className="mb-2 text-sm font-bold text-[#0F1F16]">Photo evidence <span className="font-medium text-[#64748B]">• up to 3</span></div>
                <PhotoUpload files={photos} onChange={setPhotos} onError={setError} />
                <p className="mt-2 text-xs font-medium text-[#64748B]">JPG or PNG, up to 8 MB each. Clear photos get faster collection.</p>
              </div>

              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="submit" className="btn px-7 py-3 text-[15px]" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit report →"}
                </button>
                <button type="button" className="btn-outline px-7 py-3" onClick={() => navigate("/citizen/dashboard")}>
                  Cancel
                </button>
                <span className="text-xs font-medium text-[#94A3A8]">You’ll get notified at every status change</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

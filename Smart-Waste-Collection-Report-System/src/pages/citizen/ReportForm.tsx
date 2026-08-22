import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import PhotoUpload from "../../components/PhotoUpload";

type FormData = {
  title: string;
  description: string;
};

export default function ReportForm() {
  const { register, handleSubmit } = useForm<FormData>();
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const formSteps = ["Describe the issue", "Add a photo", "Submit for review"];

  function onSubmit(data: FormData) {
    console.log("submit report", data, file);
    navigate("/citizen/dashboard");
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="bg-linear-to-br from-green-900 to-teal-700 px-6 py-8 text-white lg:px-8 lg:py-10">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90">
              New complaint
            </span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">
              Create a report with clear details and a photo.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/85">
              Give the municipal team the location, description, and visual
              evidence they need to resolve waste issues faster.
            </p>

            <div className="mt-8 space-y-3">
              {formSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-green-800 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{step}</div>
                    <div className="text-xs text-white/75">
                      Step {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </aside>

          <div className="p-6 lg:p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-slate-900">
                Report details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Fill in the form below to send your complaint to the council.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                label="Title"
                placeholder="e.g. Overflowing bin near the school"
                {...register("title", { required: true })}
              />
              <label className="block">
                <div className="mb-1 text-sm font-medium text-slate-700">
                  Description
                </div>
                <textarea
                  {...register("description", { required: true })}
                  placeholder="Add the location, what you saw, and any important details..."
                  className="min-h-40 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
                <div className="mb-2 text-sm font-medium text-slate-700">
                  Photo evidence
                </div>
                <PhotoUpload onFile={setFile} />
                <p className="text-xs text-slate-500">
                  Upload a clear photo to help the team verify the issue.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button type="submit" className="btn px-5 py-3">
                  Submit report
                </button>
                <button
                  type="button"
                  className="btn-outline px-5 py-3"
                  onClick={() => navigate("/citizen/dashboard")}
                >
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

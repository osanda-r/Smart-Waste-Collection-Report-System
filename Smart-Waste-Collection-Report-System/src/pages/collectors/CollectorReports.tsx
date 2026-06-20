import { useEffect, useState } from "react";

type Report = {
  id: string;
  location: string;
  status: string;
  priority: string;
};

export default function CollectorReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    setReports([
      { id: "r1", location: "North District", status: "Pending", priority: "High" },
      { id: "r2", location: "Market Road", status: "Collected", priority: "Medium" },
      { id: "r3", location: "Green Lane", status: "Assigned", priority: "Low" },
    ]);
  }, []);

  const filters = ["All", "Pending", "Assigned", "Collected"];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Assigned queue
            </span>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Assigned Reports
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review each report, confirm collection, and keep the route moving.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  filter === "All"
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {reports.map((report) => (
            <article
              key={report.id}
              className="rounded-2xl border border-slate-200 p-5 transition hover:border-emerald-200 hover:bg-emerald-50/40"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {report.location}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {report.priority} priority
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">Report ID: {report.id}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {report.status}
                  </span>
                  <button className="btn-outline px-4 py-2.5 text-sm">
                    Update status
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

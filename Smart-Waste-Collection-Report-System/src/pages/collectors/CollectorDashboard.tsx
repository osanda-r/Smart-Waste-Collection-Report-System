import { useNavigate } from "react-router-dom";

export default function CollectorDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: "Assigned jobs", value: "12" },
    { label: "Collected today", value: "7" },
    { label: "Pending routes", value: "3" },
    { label: "Alerts", value: "2" },
  ];

  const tasks = [
    {
      title: "Overflowing bins in North District",
      status: "Pending pickup",
      time: "08:30 AM",
    },
    {
      title: "Illegal dumping near Market Road",
      status: "In progress",
      time: "10:15 AM",
    },
    {
      title: "Missed collection on Green Lane",
      status: "Completed",
      time: "12:45 PM",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="rounded-3xl bg-linear-to-br from-slate-950 via-green-950 to-teal-800 p-6 text-white shadow-xl lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Collector workspace
            </span>
            <h2 className="mt-4 text-3xl font-bold">Collector Dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Manage assigned reports, keep collection routes on schedule, and
              update status as jobs progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/collectors/reports")}
              className="inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5"
            >
              View reports
            </button>
            <button
              onClick={() => navigate("/collectors/login")}
              className="inline-flex rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/10 p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="mt-1 text-sm text-white/75">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                Today\'s jobs
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Review the current collection queue and update progress.
              </p>
            </div>
            <button
              onClick={() => navigate("/collectors/reports")}
              className="btn px-4 py-2.5"
            >
              Open queue
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.title}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {task.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">{task.time}</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {task.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">
            Quick actions
          </h3>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              Mark reports complete after pickup and add notes for the office.
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              Check routes before leaving the depot to avoid missed collections.
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              Keep an eye on urgent overflow alerts from citizens.
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

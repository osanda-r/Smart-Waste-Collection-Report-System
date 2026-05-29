import { Link } from "react-router-dom";

export default function Dashboard() {
  const reports = [
    {
      id: "r1",
      title: "Overflowing bin",
      status: "pending",
      zone: "North District",
    },
    {
      id: "r2",
      title: "Illegal dumping",
      status: "assigned",
      zone: "Market Road",
    },
    {
      id: "r3",
      title: "Missed collection",
      status: "resolved",
      zone: "Green Lane",
    },
  ];

  const features = [
    {
      title: "Create reports",
      description: "Submit waste issues with location details and notes.",
    },
    {
      title: "Upload photos",
      description: "Attach clear evidence to help the council respond faster.",
    },
    {
      title: "Track complaint status",
      description: "Follow every report from pending to resolved.",
    },
    {
      title: "Receive notifications",
      description: "Stay updated when your complaint changes status.",
    },
    {
      title: "View collection schedules",
      description: "See the next pickup day for your collection zone.",
    },
  ];

  const notifications = [
    "Your report #r3 was marked resolved this morning.",
    "Collection is scheduled for tomorrow in North District.",
    "A new update is available for report #r1.",
  ];

  const schedules = [
    { day: "Today", route: "North District", time: "08:00 AM" },
    { day: "Tomorrow", route: "Market Road", time: "10:30 AM" },
    { day: "Friday", route: "Green Lane", time: "09:00 AM" },
  ];

  const statusStyles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    assigned: "bg-blue-100 text-blue-800",
    resolved: "bg-emerald-100 text-emerald-800",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white_0,transparent_35%)]" />
        <div className="relative grid gap-8 px-6 py-10 lg:grid-cols-[1.4fr_0.9fr] lg:px-10 lg:py-12">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/95">
              Citizen workspace
            </span>
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
                Report waste issues, track progress, and stay informed.
              </h2>
              <p className="text-sm leading-6 text-white/90 sm:text-base">
                Submit complaints, monitor schedules, and receive updates in a
                single polished workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/citizen/report/new"
                className="inline-flex items-center gap-2 rounded-lg bg-white text-emerald-700 px-4 py-2 text-sm font-medium shadow-sm hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create report
              </Link>
              <a
                href="#reports"
                className="inline-flex items-center justify-center rounded-md border border-white/40 px-4 py-2 text-sm font-medium text-white/95 transition hover:bg-white/10"
              >
                View reports
              </a>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-semibold">12</div>
                <div className="mt-1 text-xs text-white/75">Reports</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-semibold">5</div>
                <div className="mt-1 text-xs text-white/75">Open</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-semibold">3</div>
                <div className="mt-1 text-xs text-white/75">Alerts</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 text-slate-800">
              <div className="text-sm font-medium text-slate-500">
                Next pickup
              </div>
              <div className="mt-2 text-lg font-semibold">
                Tomorrow, 08:00 AM
              </div>
              <div className="mt-1 text-sm text-slate-600">
                North District collection zone
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md flex gap-4"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section id="reports" className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
              />
            </svg>
            <input
              placeholder="Search reports"
              className="w-full rounded-lg border border-slate-200 px-10 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Your reports
              </h3>
              <p className="text-sm text-slate-500">
                Track complaint status from submission to resolution.
              </p>
            </div>
            <Link to="/citizen/report/new" className="btn">
              Create report
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-slate-900">
                        {report.title}
                      </h4>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[report.status]}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Report ID {report.id}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">{report.zone}</p>
                  </div>
                  <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800">
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Notifications
            </h3>
            <div className="mt-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification}
                  className="rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-slate-700"
                >
                  {notification}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Collection schedule
            </h3>
            <div className="mt-4 space-y-3">
              {schedules.map((schedule) => (
                <div
                  key={schedule.day}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3"
                >
                  <div>
                    <div className="font-medium text-slate-900">
                      {schedule.day}
                    </div>
                    <div className="text-sm text-slate-500">
                      {schedule.route}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700">
                    {schedule.time}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

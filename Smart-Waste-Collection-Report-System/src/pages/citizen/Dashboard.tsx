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
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 via-emerald-500 to-lime-500 text-white shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,white_0,transparent_35%)]" />
        <div className="relative grid gap-8 px-6 py-10 lg:grid-cols-[1.4fr_0.9fr] lg:px-10 lg:py-12">
          <div className="space-y-5">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-white/90">
              Citizen workspace
            </span>
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Report waste issues, track progress, and stay informed in one
                place.
              </h2>
              <p className="text-sm leading-6 text-white/85 sm:text-base">
                A clean dashboard for citizens to submit complaints, monitor
                collection schedules, and receive updates without chasing the
                council.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/citizen/report/new"
                className="btn bg-white text-emerald-700 hover:bg-emerald-50"
              >
                Create new report
              </Link>
              <a
                href="#reports"
                className="inline-flex items-center justify-center rounded-md border border-white/40 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/10"
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
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 grid place-items-center font-semibold">
              {feature.title.slice(0, 1)}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section id="reports" className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
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

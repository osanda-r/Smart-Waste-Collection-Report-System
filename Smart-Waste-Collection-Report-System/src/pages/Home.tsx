import { Link } from "react-router-dom";

const highlights = [
  "Report overflowing bins and illegal dumping",
  "Track collection progress in real time",
  "Separate citizen and collector access flows",
];

export default function Home() {
  const roleCards = [
    {
      title: "Citizen portal",
      description:
        "Submit waste complaints, attach photos, and monitor each report.",
      to: "/citizen/dashboard",
      cta: "Open citizen dashboard",
      accent: "from-green-800 to-teal-600",
    },
    {
      title: "Collector portal",
      description:
        "Review assigned jobs, update collection progress, and stay organized.",
      to: "/collectors/dashboard",
      cta: "Open collector dashboard",
      accent: "from-slate-800 to-slate-600",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-14">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-green-950 via-green-800 to-teal-700 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_28%)]" />
        <div className="relative grid gap-10 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-16">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
              Smart Waste Collection
            </span>
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                A cleaner city starts with faster reporting and better routing.
              </h1>
              <p className="text-base leading-7 text-white/88 sm:text-lg">
                Give citizens a clear way to report waste issues and collectors
                a focused workspace to resolve them.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                Citizen sign up
              </Link>
              <Link
                to="/collectors/login"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Collector login
              </Link>
            </div>
          </div>

          <div className="grid gap-4 rounded-3xl border border-white/20 bg-white/12 p-5 backdrop-blur-sm">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold">24</div>
                <div className="mt-1 text-xs text-white/75">Reports today</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold">6</div>
                <div className="mt-1 text-xs text-white/75">Routes open</div>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <div className="text-2xl font-bold">92%</div>
                <div className="mt-1 text-xs text-white/75">Resolved</div>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-5 text-slate-800">
              <div className="text-sm font-medium text-slate-500">
                Live status
              </div>
              <div className="mt-2 text-lg font-semibold">
                North District route dispatched
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Citizens can log issues while the collector team updates job
                status from the field.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
              ✓
            </div>
            <p className="text-sm leading-6 text-slate-700">{item}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        {roleCards.map((card) => (
          <article
            key={card.title}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className={`h-2 bg-linear-to-r ${card.accent}`} />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {card.description}
              </p>
              <Link
                to={card.to}
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
              >
                {card.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

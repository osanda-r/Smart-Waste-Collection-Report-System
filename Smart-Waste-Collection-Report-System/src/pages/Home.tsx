import { Link } from "react-router-dom";

const steps = [
  "Spot an overflowing bin or illegal dumping and report it with a photo and map pin.",
  "The council sees it on the live map, assigns the nearest worker and updates the status.",
  "Follow progress, get notified when it is resolved and check your zone's collection days.",
];

export default function Home() {
  const portals = [
    {
      title: "Citizen portal",
      description: "Submit waste complaints, attach photos, track each report and view collection schedules.",
      to: "/citizen/dashboard",
      cta: "Open citizen portal",
      accent: "from-green-800 to-teal-600",
    },
    {
      title: "Worker portal",
      description: "See the tasks assigned to you, update progress and upload completion photos.",
      to: "/worker/login",
      cta: "Worker login",
      accent: "from-slate-800 to-slate-600",
    },
    {
      title: "Municipal admin",
      description: "View reports on the map, assign workers, manage zones and schedules, and analyse waste data.",
      to: "/admin/login",
      cta: "Staff login",
      accent: "from-emerald-900 to-slate-800",
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
            <div className="max-w-2xl space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                A cleaner city starts with faster reporting and better routing.
              </h1>
              <p className="text-base leading-7 text-white/88 sm:text-lg">
                Citizens report garbage problems, councils manage and route the work, and field workers close it out with photo evidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-green-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                Citizen sign up
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Citizen login
              </Link>
            </div>
          </div>

          <ol className="grid gap-4 rounded-3xl border border-white/20 bg-white/12 p-5 backdrop-blur-sm">
            {steps.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl bg-white p-5 text-slate-800">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-800 font-bold text-white">{i + 1}</div>
                <p className="text-sm leading-6">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        {portals.map((card) => (
          <article key={card.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className={`h-2 bg-linear-to-r ${card.accent}`} />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-900">{card.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
              <Link to={card.to} className="mt-5 inline-flex items-center justify-center rounded-lg bg-green-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900">
                {card.cta}
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

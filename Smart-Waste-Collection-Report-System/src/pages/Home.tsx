import { Link } from "react-router-dom";
import heroBg from "../assets/ecotrack-hero-bg.png";
import logo from "../assets/EcoTrack Smart Waste Collection Logo.png";

const steps = [
  {
    n: "01",
    title: "Snap & report",
    desc: "Spot an overflowing bin or illegal dump — add a photo and drop a pin. 30 seconds, no hassle.",
  },
  {
    n: "02",
    title: "We route & assign",
    desc: "Council sees it live on the map, auto-matches your zone and assigns the nearest crew.",
  },
  {
    n: "03",
    title: "Track to resolved",
    desc: "Follow progress in real time, get notified, and see proof when it’s cleared.",
  },
];

const features = [
  {
    title: "Citizen-first reporting",
    desc: "Big tap targets, photo + map in one flow, works on any phone.",
    icon: "◉",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Live operations map",
    desc: "Every report pinned, coloured by status. Zones and crews at a glance.",
    icon: "◎",
    accent: "from-teal-500 to-cyan-500",
  },
  {
    title: "Proof of cleanliness",
    desc: "Workers close jobs with completion photos. Transparent timeline for everyone.",
    icon: "✓",
    accent: "from-lime-500 to-emerald-500",
  },
];

const portals = [
  {
    k: "citizen",
    eyebrow: "For everyone",
    title: "Citizen portal",
    desc: "Submit reports, attach photos, watch status, and know your collection days.",
    to: "/citizen/dashboard",
    cta: "Open citizen portal",
    stat: "2 min avg. to report",
    gradient: "from-[#052E16] via-[#14532D] to-[#0F766E]",
    badge: "Most popular",
  },
  {
    k: "worker",
    eyebrow: "Field team",
    title: "Worker portal",
    desc: "See tasks assigned to you, start jobs on arrival, upload proof when done.",
    to: "/worker/login",
    cta: "Worker login",
    stat: "Photo-verified jobs",
    gradient: "from-slate-900 via-slate-800 to-teal-900",
    badge: "On-the-go",
  },
  {
    k: "admin",
    eyebrow: "Municipal council",
    title: "Admin center",
    desc: "Triage on the map, assign crews, manage zones & schedules, export analytics.",
    to: "/admin/login",
    cta: "Staff login",
    stat: "Live analytics & CSV",
    gradient: "from-emerald-950 via-emerald-900 to-slate-900",
    badge: "Operations HQ",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#FBFCF8]">
      {/* HERO */}
      <section className="relative">
        {/* background image */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#052E16]/92 via-[#0A3A1F]/78 to-[#0A3A1F]/28" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FBFCF8] via-transparent to-transparent opacity-60" />
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        </div>

        <div className="relative mx-auto grid max-w-[1280px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.85fr] lg:gap-10 lg:px-8 lg:py-[54px]">
          {/* left copy */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white ring-1 ring-white/20 backdrop-blur">
              <span className="grid h-2 w-2 place-items-center">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ADE80]" />
              </span>
              EcoTrack • Live in your city
            </div>

            <div className="mt-5 flex items-center gap-3">
              <img
                src={logo}
                alt="EcoTrack Smart Waste Collection"
                className="hidden h-[38px] w-auto rounded-xl bg-white p-1.5 shadow-lg sm:block"
              />
              <div className="hidden sm:block">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">SMART WASTE COLLECTION &amp; REPORTING</div>
                <div className=" -mt-1 text-sm font-semibold text-white">Municipal • Citizen • Field crew</div>
              </div>
            </div>

            <h1 className="mt-5 max-w-[640px] text-[32px] font-[800] leading-[1.05] tracking-[-0.03em] text-white sm:text-[44px] lg:text-[52px]">
              Track waste.
              <br />
              <span className="bg-gradient-to-r from-[#86EFAC] to-[#5EEAD4] bg-clip-text text-transparent">Improve collection.</span>
              <br />
              Build cleaner communities.
            </h1>

            <p className="mt-4 max-w-[560px] text-[16px] leading-7 text-white/85 sm:text-[18px]">
              Report in 30 seconds, council routes the right crew, you get proof when it’s cleared. Simple for citizens, powerful for operations.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/register" className="btn bg-white !text-[#052E16] hover:!bg-white shadow-[0_12px_32px_rgba(0,0,0,0.18)] border-white">
                <span>Start reporting — free</span>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#052E16] text-white">→</span>
              </Link>
              <Link to="/login" className="btn-outline !border-white/30 !bg-white/10 !text-white backdrop-blur hover:!bg-white hover:!text-[#052E16]">
                Citizen login
              </Link>
              <span className="hidden items-center gap-2 self-center text-xs font-semibold text-white/70 sm:inline-flex">
                <span className="h-1 w-1 rounded-full bg-white/60" /> No install • Works on any phone
              </span>
            </div>

            {/* trust bar */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6 sm:gap-6">
              <div className="flex -space-x-2">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[11px] font-bold text-[#052E16] ring-2 ring-white/30">CK</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#22C55E] text-[11px] font-bold text-white ring-2 ring-white/30">AS</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0F766E] text-[11px] font-bold text-white ring-2 ring-white/30">MN</span>
              </div>
              <div className="text-sm leading-tight">
                <div className="font-bold text-white">Trusted by neighbourhoods city-wide</div>
                <div className="text-xs font-medium text-white/70">Average resolution • Photo-verified • Zone-aware routing</div>
              </div>
              <div className="hidden h-10 w-px bg-white/10 sm:block" />
              <div className="flex gap-4 text-center">
                <div>
                  <div className="text-[18px] font-extrabold leading-none text-white">4.8★</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Ease of use</div>
                </div>
                <div>
                  <div className="text-[18px] font-extrabold leading-none text-white">30s</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">To report</div>
                </div>
              </div>
            </div>
          </div>

          {/* right: steps card */}
          <div className="relative lg:py-4">
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/95 p-6 shadow-[0_24px_64px_rgba(5,46,22,0.18)] backdrop-blur-xl sm:p-7">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-70 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-gradient-to-br from-lime-100 to-emerald-100 opacity-60 blur-2xl" />

              <div className="relative flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#15803D]">How EcoTrack works</div>
                  <h2 className="mt-1 text-[20px] font-extrabold tracking-[-0.02em] text-[#0F1F16]">3 steps, done.</h2>
                </div>
                <div className="hidden rounded-full bg-[#052E16] px-3 py-1.5 text-xs font-bold text-white sm:inline-flex">Live demo →</div>
              </div>

              <ol className="relative mt-6 grid gap-4">
                {steps.map((s) => (
                  <li key={s.n} className="group flex gap-4 rounded-2xl border border-[#E7EFE6] bg-white p-4 shadow-sm transition hover:border-[#BBF7D0] hover:bg-[#F0FDF4]/60 hover:shadow-md">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#052E16] text-sm font-extrabold text-white shadow-md">{s.n}</div>
                    <div>
                      <div className="text-[15px] font-bold tracking-[-0.01em] text-[#0F1F16]">{s.title}</div>
                      <p className="mt-1 text-[13.5px] leading-5 text-[#475569]">{s.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="relative mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-[#052E16] p-4 text-white">
                <div className="text-center">
                  <div className="text-[18px] font-extrabold">12k+</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Reports cleared</div>
                </div>
                <div className="border-l border-white/10 text-center">
                  <div className="text-[18px] font-extrabold">24h</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Avg. response</div>
                </div>
                <div className="border-l border-white/10 text-center">
                  <div className="text-[18px] font-extrabold">98%</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-white/60">Satisfaction</div>
                </div>
              </div>

              <p className="relative mt-3 text-center text-xs font-medium text-[#64748B]">Works for every user — citizens, workers, and council.</p>
            </div>

            {/* floating badge */}
            <div className="absolute -bottom-3 -left-2 hidden items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-[0_8px_24px_rgba(5,46,22,0.14)] sm:flex">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white">✓</span>
              <span className="text-sm font-bold text-[#0F1F16]">Easy for everyone</span>
              <span className="text-xs font-medium text-[#64748B]">No training needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-[20px] border border-[#E7EFE6] bg-white p-5 shadow-sm transition hover:shadow-md hover:border-[#C5DBCB]">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${f.accent} text-white shadow-sm`}>{f.icon}</div>
              <h3 className="mt-4 text-[16px] font-bold tracking-[-0.01em] text-[#0F1F16]">{f.title}</h3>
              <p className="mt-1 text-[13.5px] leading-6 text-[#475569]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PORTALS */}
      <section className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-700">Choose your workspace</div>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.03em] text-[#0F1F16] sm:text-[32px]">One system, built for every role.</h2>
            <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#475569]">Premium, calm, and ridiculously easy — whether you’re reporting a bin or running a city’s operations.</p>
          </div>
          <div className="hidden items-center gap-2 text-xs font-semibold text-[#64748B] sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Secure • Role-based • Firestore protected
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {portals.map((card) => (
            <article
              key={card.k}
              className="group relative flex flex-col overflow-hidden rounded-[28px] border border-[#E7EFE6] bg-white shadow-[0_8px_32px_rgba(15,31,22,0.06)] transition hover:shadow-[0_16px_48px_rgba(15,31,22,0.10)] hover:-translate-y-1"
            >
              <div className={`h-[6px] w-full bg-gradient-to-r ${card.gradient}`} />
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#F1F5F1] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#334155]">{card.eyebrow}</span>
                  <span className="rounded-full bg-[#052E16] px-2.5 py-1 text-[11px] font-bold text-white">{card.badge}</span>
                </div>
                <h3 className="mt-4 text-[22px] font-extrabold tracking-[-0.02em] text-[#0F1F16]">{card.title}</h3>
                <p className="mt-2 text-[14px] leading-6 text-[#475569]">{card.desc}</p>

                <div className="mt-5 flex items-center gap-2 rounded-full bg-[#F6F7F3] px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-[#0F1F16]">{card.stat}</span>
                  <span className="ml-auto text-xs font-medium text-[#64748B]">Secure & fast</span>
                </div>

                <Link
                  to={card.to}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-bold text-white shadow-md transition group-hover:shadow-lg bg-gradient-to-r ${card.gradient}`}
                >
                  {card.cta} <span className="grid h-6 w-6 place-items-center rounded-full bg-white/15">→</span>
                </Link>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-[#94A3A8]">
                  <span>One-tap</span> <span className="h-1 w-1 rounded-full bg-[#CBD5C8]" /> <span>Accessible</span> <span className="h-1 w-1 rounded-full bg-[#CBD5C8]" /> <span>Private</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* bottom CTA banner */}
        <div className="mt-10 overflow-hidden rounded-[28px] border border-[#E7EFE6] bg-white shadow-sm">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8">
              <div className="inline-flex rounded-full bg-[#052E16] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-white">Why EcoTrack feels premium</div>
              <h3 className="mt-4 max-w-xl text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-[#0F1F16] sm:text-[26px]">
                Calm design, clear actions, zero learning curve.
              </h3>
              <p className="mt-3 max-w-xl text-[14px] leading-6 text-[#475569]">
                We removed clutter. Big buttons, high contrast, readable type, and a live map that just makes sense. Your grandmother and your operations lead both get it in seconds.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-800">WCAG friendly contrast</span>
                <span className="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">Large tap targets</span>
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-teal-800">Offline-tolerant forms</span>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#0F766E] p-6 sm:p-8 text-white">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white_0,transparent_38%)] opacity-15" />
              <div className="relative">
                <div className="text-sm font-bold uppercase tracking-[0.14em] text-white/70">Cleaner communities metric</div>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="text-2xl font-extrabold">+43%</div>
                    <div className="text-xs font-medium text-white/70">Faster collections after EcoTrack</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
                    <div className="text-2xl font-extrabold">3×</div>
                    <div className="text-xs font-medium text-white/70">More reports per week (ease)</div>
                  </div>
                </div>
                <Link to="/register" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#052E16] hover:bg-white/90">
                  Create citizen account — it’s free
                </Link>
                <p className="mt-2 text-center text-xs font-medium text-white/60">Takes 20 seconds • No credit card</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-medium tracking-wide text-[#94A3A8]">© {new Date().getFullYear()} EcoTrack — Smart Waste Collection & Reporting System • Track waste. Improve collection. Build cleaner communities.</p>
      </section>
    </div>
  );
}

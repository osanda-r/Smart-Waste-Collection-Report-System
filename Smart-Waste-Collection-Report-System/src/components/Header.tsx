import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/auth";
import { ROLE_LABELS, type Role } from "../lib/types";

const NAV: Record<Role, { to: string; label: string; icon?: string }[]> = {
  citizen: [
    { to: "/citizen/dashboard", label: "Dashboard" },
    { to: "/citizen/report/new", label: "Report" },
    { to: "/citizen/schedules", label: "Schedules" },
    { to: "/citizen/notifications", label: "Inbox" },
  ],
  worker: [
    { to: "/worker/dashboard", label: "Dashboard" },
    { to: "/worker/tasks", label: "My Tasks" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/reports", label: "Reports" },
    { to: "/admin/map", label: "Map" },
    { to: "/admin/zones", label: "Zones" },
    { to: "/admin/schedules", label: "Schedules" },
    { to: "/admin/analytics", label: "Analytics" },
    { to: "/admin/users", label: "Team" },
  ],
};

function EcoLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="relative grid h-[44px] w-[44px] place-items-center overflow-hidden rounded-[14px] bg-[#052E16] shadow-[0_8px_20px_rgba(5,46,22,0.22)] ring-1 ring-white/10 transition group-hover:shadow-[0_10px_28px_rgba(5,46,22,0.28)] group-hover:scale-[1.02]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#14532D] to-[#0F766E] opacity-100" />
        {/* bin icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="relative">
          <path d="M16 7C16 7 9 7 9 9.6L9 11.2L23 11.2L23 9.6C23 7 16 7 16 7Z" fill="white" fillOpacity="0.96" />
          <path d="M10.5 12.6L21.5 12.6L20.2 24.8C20.2 25.8 19.35 26.6 18.35 26.6H13.65C12.65 26.6 11.8 25.8 11.8 24.8L10.5 12.6Z" fill="#DCFCE7" />
          <path d="M13 7C13 5 14.2 3.6 16 3.6C17.8 3.6 19 5 19 7" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M16.2 16.2C13.2 14 10 11 11.2 7.2C12.9 5.9 15.2 5 17 6.4C15.9 9 14 13.2 16.2 16.2Z" fill="#22C55E" />
          <rect x="13.7" y="16.5" width="1.5" height="6.5" rx="0.75" fill="#16A34A" opacity="0.28" />
          <rect x="16.8" y="16.5" width="1.5" height="6.5" rx="0.75" fill="#16A34A" opacity="0.28" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-[14px] ring-1 ring-white/10" />
      </div>

      <div className={compact ? "hidden sm:block" : "block"}>
        <div className="flex items-baseline gap-[1px] leading-none">
          <span className="text-[22px] font-[800] tracking-[-0.03em] text-[#052E16]">Eco</span>
          <span className="text-[22px] font-[800] tracking-[-0.03em] text-[#15803D]">Track</span>
        </div>
        <div className=" -mt-[2px] text-[9.5px] font-bold tracking-[0.16em] text-[#5B7A6A]">SMART WASTE COLLECTION</div>
      </div>
    </Link>
  );
}

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logoutUser();
    navigate("/");
    setMobileOpen(false);
  }

  const initials =
    auth.status === "ready"
      ? auth.profile.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "ET"
      : "ET";
  const navItems = auth.status === "ready" ? (NAV[auth.profile.role] ?? []) : [];

  return (
    <header className="sticky top-0 z-40 border-b border-[#E7EFE6]/90 bg-white/80 backdrop-blur-[18px] supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 py-[10px] sm:px-6 lg:px-8">
        <EcoLogo />

        {/* Desktop nav */}
        {auth.status === "ready" ? (
          <>
            <nav className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-[14px] py-[7px] text-[13.5px] font-semibold tracking-[-0.01em] transition ${
                      isActive
                        ? "bg-[#052E16] text-white shadow-[0_6px_16px_rgba(5,46,22,0.18)]"
                        : "text-[#475569] hover:bg-[#F1F5F1] hover:text-[#0F1F16]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <div className="hidden text-right leading-tight xl:block">
                <div className="text-[13px] font-bold tracking-[-0.01em] text-[#0F1F16]">{auth.profile.name || auth.profile.email}</div>
                <div className="text-[11px] font-semibold tracking-wide text-[#64748B]">{ROLE_LABELS[auth.profile.role]} • {auth.profile.email}</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#14532D] to-[#0F766E] text-[12px] font-bold text-white shadow-md ring-2 ring-[#DCFCE7]">
                {initials}
              </div>
              <button onClick={handleLogout} className="btn-ghost border border-[#E2E8E2] bg-white px-4 py-2 text-[13px] font-semibold shadow-sm hover:border-[#C5DBCB]">
                Log out
              </button>
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#E7EFE6] bg-white text-[#0F1F16] shadow-sm lg:hidden"
              aria-label="Toggle menu"
            >
              <span className="relative block h-3.5 w-4">
                <span className={`absolute left-0 top-0 h-0.5 w-4 rounded bg-current transition ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[6px] h-0.5 w-4 rounded bg-current transition ${mobileOpen ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 top-[12px] h-0.5 w-4 rounded bg-current transition ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`} />
              </span>
            </button>
          </>
        ) : (
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link to="/login" className="hidden rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#334155] hover:bg-[#F1F5F1] hover:text-[#0F1F16] sm:inline-flex">
              Citizen
            </Link>
            <Link to="/register" className="hidden rounded-full px-4 py-2 text-[13.5px] font-semibold text-[#334155] hover:bg-[#F1F5F1] sm:inline-flex">
              Sign up
            </Link>
            <Link to="/worker/login" className="rounded-full border border-[#E2E8E2] bg-white px-4 py-2 text-[13.5px] font-semibold text-[#334155] shadow-sm hover:border-[#C5DBCB] hover:text-[#0F1F16]">
              Worker
            </Link>
            <Link to="/admin/login" className="rounded-full bg-[#0F1F16] px-4 py-2 text-[13.5px] font-bold text-white shadow-[0_6px_16px_rgba(15,31,22,0.16)] hover:bg-black">
              Staff login
            </Link>
            {/* Mobile also burger for unauth? hide */}
          </nav>
        )}
      </div>

      {/* Mobile drawer */}
      {auth.status === "ready" && mobileOpen && (
        <div className="border-t border-[#E7EFE6] bg-white/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-[1280px] px-4 py-4 sm:px-6">
            <div className="grid gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${
                      isActive ? "bg-[#052E16] text-white" : "bg-[#F6F7F3] text-[#0F1F16] hover:bg-[#EFF5EF]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#F6F7F3] p-4">
                <div>
                  <div className="text-sm font-bold text-[#0F1F16]">{auth.profile.name || auth.profile.email}</div>
                  <div className="text-xs font-medium text-[#64748B]">{ROLE_LABELS[auth.profile.role]}</div>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#052E16] text-sm font-bold text-white">{initials}</div>
              </div>
              <button onClick={handleLogout} className="mt-1 w-full rounded-full border border-[#E2E8E2] bg-white py-3 text-sm font-bold text-[#0F1F16]">
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium top accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-[#22C55E] via-[#06B6D4] to-[#22C55E] opacity-20" />
    </header>
  );
}

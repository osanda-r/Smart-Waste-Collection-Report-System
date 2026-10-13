import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/auth";
import { ROLE_LABELS, type Role } from "../lib/types";
import logo from "../assets/EcoTrack Smart Waste Collection Logo.png";

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
      <img
        src={logo}
        alt="EcoTrack Smart Waste Collection"
        className={compact ? "h-11 w-auto" : "h-12 w-auto"}
      />
      <span className="text-xl font-extrabold tracking-tight text-[#15803D]">
        EcoTrack
      </span>
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

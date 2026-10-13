import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../services/auth";
import { ROLE_LABELS, type Role } from "../lib/types";

const NAV: Record<Role, { to: string; label: string }[]> = {
  citizen: [
    { to: "/citizen/dashboard", label: "Dashboard" },
    { to: "/citizen/report/new", label: "New report" },
    { to: "/citizen/schedules", label: "Schedules" },
    { to: "/citizen/notifications", label: "Notifications" },
  ],
  worker: [
    { to: "/worker/dashboard", label: "Dashboard" },
    { to: "/worker/tasks", label: "My tasks" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/reports", label: "Reports" },
    { to: "/admin/map", label: "Map" },
    { to: "/admin/zones", label: "Zones" },
    { to: "/admin/schedules", label: "Schedules" },
    { to: "/admin/analytics", label: "Analytics" },
    { to: "/admin/users", label: "Users" },
  ],
};

export default function Header() {
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate("/");
  }

  const initials =
    auth.status === "ready"
      ? auth.profile.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "WW"
      : "WW";
  const navItems =
    auth.status === "ready" ? (NAV[auth.profile.role] ?? []) : [];

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-green-700 to-teal-700 text-sm font-extrabold tracking-tight text-white shadow-lg shadow-green-950/20">
            W
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">WasteWise</span>
        </Link>

        {auth.status === "ready" ? (
          <nav className="flex min-w-0 items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-600 hover:text-emerald-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="ml-2 hidden items-center gap-2 border-l border-slate-200 pl-3 md:flex">
              <div className="text-right leading-tight">
                <div className="text-sm font-semibold text-slate-800">{auth.profile.name || auth.profile.email}</div>
                <div className="text-xs text-slate-500">{ROLE_LABELS[auth.profile.role]}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="ml-2 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Log out
            </button>
            <div className="ml-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white ring-2 ring-emerald-100">
              {initials}
            </div>
          </nav>
        ) : (
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-600 sm:gap-4">
            <Link to="/login" className="hover:text-emerald-700">Citizen login</Link>
            <Link to="/register" className="hidden hover:text-emerald-700 sm:inline">Register</Link>
            <Link to="/worker/login" className="hover:text-emerald-700">Worker</Link>
            <Link to="/admin/login" className="rounded-full bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800">
              Staff login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 text-sm font-extrabold tracking-tight text-white shadow-lg shadow-emerald-900/15">
              W
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              WasteWise
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/citizen/dashboard"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 transition hover:bg-emerald-100"
          >
            Dashboard
          </Link>
          <Link
            to="/login"
            className="px-2 py-1 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="hidden px-2 py-1 text-sm font-medium text-slate-600 transition hover:text-emerald-700 sm:inline"
          >
            Register
          </Link>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-bold text-white ring-2 ring-emerald-100">
            WW
          </div>
        </nav>
      </div>
    </header>
  );
}

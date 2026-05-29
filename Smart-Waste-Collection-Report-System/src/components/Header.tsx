import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-white/70 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 grid place-items-center text-white font-bold">
              SW
            </div>
            <span className="text-lg font-semibold text-slate-900">
              Smart Waste
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            to="/citizen/dashboard"
            className="hidden sm:inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
          >
            Dashboard
          </Link>
          <Link
            to="/login"
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm text-slate-700 hover:text-slate-900"
          >
            Register
          </Link>
          <div className="h-8 w-8 rounded-full bg-slate-200 grid place-items-center text-sm text-slate-700">
            U
          </div>
        </nav>
      </div>
    </header>
  );
}

import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-900">
          Smart Waste
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-slate-700 hover:text-primary-700"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-sm text-slate-700 hover:text-primary-700"
          >
            Register
          </Link>
          <Link
            to="/citizen/dashboard"
            className="ml-2 inline-block px-3 py-1 rounded-md text-white bg-primary"
          >
            Citizen
          </Link>
        </nav>
      </div>
    </header>
  );
}

import { useNavigate } from "react-router-dom";

export default function CollectorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-md shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Collector Dashboard</h2>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/collectors/reports")}
            className="btn"
          >
            Reports
          </button>
          <button onClick={() => navigate("/collectors/login")} className="btn">
            Logout
          </button>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-slate-600">
          Welcome, collector — this is your dashboard.
        </p>
      </div>
    </div>
  );
}

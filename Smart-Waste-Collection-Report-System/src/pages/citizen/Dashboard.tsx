import { Link } from "react-router-dom";

export default function Dashboard() {
  const reports = [
    { id: "r1", title: "Overflowing bin", status: "pending" },
    { id: "r2", title: "Illegal dumping", status: "assigned" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Citizen Dashboard</h2>
          <p className="text-sm text-slate-600">
            Welcome — view your reports and create a new one.
          </p>
        </div>
        <div>
          <Link to="/citizen/report/new">
            <button className="btn">Create Report</button>
          </Link>
        </div>
      </div>

      <section className="mt-6 bg-white rounded-md shadow-sm p-4">
        <h3 className="font-medium mb-3">Your reports</h3>
        <ul>
          {reports.map((r) => (
            <li key={r.id} className="py-2 border-b last:border-b-0">
              <div className="flex items-center justify-between">
                <div>
                  <strong>{r.title}</strong>
                  <div className="text-sm text-slate-500">#{r.id}</div>
                </div>
                <div className="text-sm text-slate-700">{r.status}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

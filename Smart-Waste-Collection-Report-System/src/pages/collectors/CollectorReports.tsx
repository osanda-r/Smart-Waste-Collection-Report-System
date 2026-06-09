import { useEffect, useState } from "react";

type Report = {
  id: string;
  location: string;
  status: string;
};

export default function CollectorReports() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Placeholder sample data; replace with API call
    setReports([
      { id: "r1", location: "Zone A", status: "Pending" },
      { id: "r2", location: "Zone B", status: "Collected" },
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Assigned Reports</h2>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="p-3 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.location}</div>
                <div className="text-sm text-slate-600">Report ID: {r.id}</div>
              </div>
              <div className="text-sm">{r.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

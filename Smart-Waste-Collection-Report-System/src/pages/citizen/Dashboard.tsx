import { Link } from "react-router-dom";

export default function Dashboard() {
  // stubbed sample data
  const reports = [
    { id: "r1", title: "Overflowing bin", status: "pending" },
    { id: "r2", title: "Illegal dumping", status: "assigned" },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "24px auto" }}>
      <h2>Citizen Dashboard</h2>
      <p>Welcome — view your reports and create a new one.</p>
      <div style={{ marginTop: 16 }}>
        <Link to="/citizen/report/new">
          <button style={{ padding: "8px 12px" }}>Create Report</button>
        </Link>
      </div>

      <section style={{ marginTop: 20 }}>
        <h3>Your reports</h3>
        <ul>
          {reports.map((r) => (
            <li
              key={r.id}
              style={{ padding: 8, borderBottom: "1px solid #eee" }}
            >
              <strong>{r.title}</strong> — <em>{r.status}</em>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

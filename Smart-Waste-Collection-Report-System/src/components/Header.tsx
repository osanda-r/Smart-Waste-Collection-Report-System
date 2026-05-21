import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        padding: "12px 20px",
        borderBottom: "1px solid #e6e6e6",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link
        to="/"
        style={{ textDecoration: "none", color: "#111", fontWeight: 700 }}
      >
        Smart Waste
      </Link>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/citizen/dashboard">Citizen</Link>
      </nav>
    </header>
  );
}

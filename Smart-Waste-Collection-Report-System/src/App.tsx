import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/citizen/Dashboard";
import ReportForm from "./pages/citizen/ReportForm";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <div style={{ padding: 24 }}>
                Home.{" "}
                <Link to="/citizen/dashboard">Go to Citizen Dashboard</Link>
              </div>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/citizen/dashboard" element={<Dashboard />} />
          <Route path="/citizen/report/new" element={<ReportForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

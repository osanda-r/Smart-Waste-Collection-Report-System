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
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route
            path="/"
            element={
              <div className="p-6">
                Home.{" "}
                <Link
                  to="/citizen/dashboard"
                  className="text-primary underline"
                >
                  Go to Citizen Dashboard
                </Link>
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

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/citizen/Dashboard";
import ReportForm from "./pages/citizen/ReportForm";
import CollectorLogin from "./pages/collectors/CollectorLogin";
import CollectorRegister from "./pages/collectors/CollectorRegister";
import CollectorDashboard from "./pages/collectors/CollectorDashboard";
import CollectorReports from "./pages/collectors/CollectorReports";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/citizen/dashboard" element={<Dashboard />} />
          <Route path="/citizen/report/new" element={<ReportForm />} />
          <Route path="/collectors/login" element={<CollectorLogin />} />
          <Route path="/collectors/register" element={<CollectorRegister />} />
          <Route
            path="/collectors/dashboard"
            element={<CollectorDashboard />}
          />
          <Route path="/collectors/reports" element={<CollectorReports />} />
          <Route
            path="*"
            element={
              <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                  Page not found
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  The page you requested does not exist in this demo.
                </p>
                <Link
                  to="/"
                  className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                >
                  Return home
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

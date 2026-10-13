import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RequireRole from "./components/RequireRole";
import { AuthProvider } from "./context/AuthProvider";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import CitizenDashboard from "./pages/citizen/Dashboard";
import ReportForm from "./pages/citizen/ReportForm";
import CitizenReportDetail from "./pages/citizen/ReportDetail";
import CitizenSchedules from "./pages/citizen/Schedules";
import CitizenNotifications from "./pages/citizen/Notifications";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminReports from "./pages/admin/Reports";
import AdminReportDetail from "./pages/admin/ReportDetail";
import AdminMap from "./pages/admin/Map";
import AdminZones from "./pages/admin/Zones";
import AdminSchedules from "./pages/admin/Schedules";
import AdminUsers from "./pages/admin/Users";
import AdminAnalytics from "./pages/admin/Analytics";
import WorkerDashboard from "./pages/worker/Dashboard";
import WorkerTasks from "./pages/worker/Tasks";
import WorkerTaskDetail from "./pages/worker/TaskDetail";

function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">The page you requested does not exist.</p>
      <Link to="/" className="mt-6 inline-flex rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white">
        Return home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Public auth */}
            <Route path="/login" element={<LoginPage role="citizen" />} />
            <Route path="/register" element={<RegisterPage role="citizen" />} />
            <Route path="/worker/login" element={<LoginPage role="worker" />} />
            <Route path="/worker/register" element={<RegisterPage role="worker" />} />
            <Route path="/admin/login" element={<LoginPage role="admin" />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Citizen */}
            <Route path="/citizen/dashboard" element={<RequireRole roles={["citizen"]}><CitizenDashboard /></RequireRole>} />
            <Route path="/citizen/report/new" element={<RequireRole roles={["citizen"]}><ReportForm /></RequireRole>} />
            <Route path="/citizen/reports/:id" element={<RequireRole roles={["citizen"]}><CitizenReportDetail /></RequireRole>} />
            <Route path="/citizen/schedules" element={<RequireRole roles={["citizen"]}><CitizenSchedules /></RequireRole>} />
            <Route path="/citizen/notifications" element={<RequireRole roles={["citizen"]}><CitizenNotifications /></RequireRole>} />

            {/* Municipal admin */}
            <Route path="/admin/dashboard" element={<RequireRole roles={["admin"]}><AdminDashboard /></RequireRole>} />
            <Route path="/admin/reports" element={<RequireRole roles={["admin"]}><AdminReports /></RequireRole>} />
            <Route path="/admin/reports/:id" element={<RequireRole roles={["admin"]}><AdminReportDetail /></RequireRole>} />
            <Route path="/admin/map" element={<RequireRole roles={["admin"]}><AdminMap /></RequireRole>} />
            <Route path="/admin/zones" element={<RequireRole roles={["admin"]}><AdminZones /></RequireRole>} />
            <Route path="/admin/schedules" element={<RequireRole roles={["admin"]}><AdminSchedules /></RequireRole>} />
            <Route path="/admin/analytics" element={<RequireRole roles={["admin"]}><AdminAnalytics /></RequireRole>} />
            <Route path="/admin/users" element={<RequireRole roles={["admin"]}><AdminUsers /></RequireRole>} />

            {/* Workers */}
            <Route path="/worker/dashboard" element={<RequireRole roles={["worker"]}><WorkerDashboard /></RequireRole>} />
            <Route path="/worker/tasks" element={<RequireRole roles={["worker"]}><WorkerTasks /></RequireRole>} />
            <Route path="/worker/tasks/:id" element={<RequireRole roles={["worker"]}><WorkerTaskDetail /></RequireRole>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

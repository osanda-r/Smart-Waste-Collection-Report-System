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
import logo from "./assets/EcoTrack Smart Waste Collection Logo.png";

function NotFound() {
  return (
    <div className="mx-auto max-w-[560px] px-4 py-16 text-center">
      <div className="rounded-[28px] border border-[#E7EFE6] bg-white p-10 shadow-[0_16px_48px_rgba(15,31,22,0.08)]">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F0FDF4] text-[#15803D] ring-1 ring-[#BBF7D0]">◎</div>
        <h1 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] text-[#0F1F16]">Page not found</h1>
        <p className="mt-2 text-sm font-medium leading-6 text-[#64748B]">The page you requested does not exist or you don’t have access. Let’s get you back.</p>
        <Link to="/" className="btn mt-6 px-7">
          Return to EcoTrack home →
        </Link>
        <p className="mt-4 text-xs font-medium text-[#94A3A8]">EcoTrack • Track waste. Improve collection. Build cleaner communities.</p>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E7EFE6] bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="EcoTrack Smart Waste Collection" className="h-8 w-auto" />
          <span className="hidden text-xs font-medium text-[#94A3A8] sm:block">© {new Date().getFullYear()} EcoTrack</span>
        </div>
        <div className="text-xs font-medium leading-5 text-[#64748B] sm:text-right">
          <span className="font-bold text-[#0F1F16]">Smart Waste Collection & Reporting System</span> • Track waste. Improve collection. Build cleaner communities.
          <br className="hidden sm:block" />
          <span className="text-[#94A3A8]">Premium • Accessible • Secure • Built for every user</span>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="min-h-[calc(100vh-64px)] bg-[#FBFCF8]">
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
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

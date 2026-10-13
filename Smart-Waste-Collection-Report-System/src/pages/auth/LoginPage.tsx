import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/auth";
import { ROLE_HOME, type Role } from "../../lib/types";
import heroBg from "../../assets/ecotrack-hero-bg.png";

const COPY: Record<Role, { eyebrow: string; title: string; description: string; badge: string; accent: string }> = {
  citizen: {
    eyebrow: "Citizen portal",
    title: "Welcome back",
    description: "Sign in to report an issue or follow your collection updates.",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    accent: "from-[#052E16] via-[#14532D] to-[#0F766E]",
  },
  worker: {
    eyebrow: "Field team • Worker",
    title: "Worker sign in",
    description: "Open your assigned tasks, update progress and upload completion photos.",
    badge: "bg-slate-900 text-white ring-slate-800",
    accent: "from-slate-900 via-slate-800 to-teal-900",
  },
  admin: {
    eyebrow: "Municipal staff • Secure",
    title: "Admin sign in",
    description: "Review reports, assign workers, manage zones, schedules and analytics.",
    badge: "bg-[#052E16] text-white ring-[#052E16]",
    accent: "from-emerald-950 via-emerald-900 to-slate-900",
  },
};

type FormData = { email: string; password: string };

export default function LoginPage({ role }: { role: Role }) {
  const copy = COPY[role];
  const auth = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  if (auth.status === "ready") return <Navigate to={ROLE_HOME[auth.profile.role]} replace />;

  async function onSubmit(data: FormData) {
    setServerError(undefined);
    const res = await loginUser({ email: data.email, password: data.password, expectedRole: role });
    if (!res.ok) setServerError(res.error);
    else {
      await auth.refreshProfile();
      navigate(ROLE_HOME[res.value.role], { replace: true });
    }
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FBFCF8]">
      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1280px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left brand panel */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className={`absolute inset-0 bg-gradient-to-br ${copy.accent} opacity-[0.88]`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 rounded-2xl bg-white p-2 pr-4 shadow-xl">
                <img src="/ecotrack-logo.svg" alt="EcoTrack" className="h-10" />
              </Link>
              <div className="mt-8 max-w-[480px]">
                <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ring-white/20 backdrop-blur">
                  ● EcoTrack • Cleaner communities
                </div>
                <h1 className="mt-4 text-[36px] font-[800] leading-[1.05] tracking-[-0.03em]">
                  Track waste.
                  <br />
                  <span className="text-[#86EFAC]">Improve collection.</span>
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-white/85">
                  “A cleaner city starts with faster reporting and better routing.” — Join thousands making their neighbourhoods shine.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/15">
                    <div className="text-xl font-extrabold">30s</div>
                    <div className="text-xs font-medium text-white/70">To report</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/15">
                    <div className="text-xl font-extrabold">Live</div>
                    <div className="text-xs font-medium text-white/70">Map & updates</div>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/15">
                    <div className="text-xl font-extrabold">Proof</div>
                    <div className="text-xs font-medium text-white/70">Photo-verified</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs font-medium text-white/60">© {new Date().getFullYear()} EcoTrack • Smart Waste Collection & Reporting System</div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-[radial-gradient(600px_400px_at_20%_0%,rgba(34,197,94,0.08),transparent_60%),radial-gradient(700px_500px_at_95%_10%,rgba(13,148,136,0.06),transparent_60%)]">
          <div className="w-full max-w-[420px]">
            <div className="rounded-[24px] border border-[#E7EFE6] bg-white p-7 shadow-[0_24px_64px_rgba(15,31,22,0.10)] sm:p-8">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ${copy.badge}`}>
                {copy.eyebrow}
              </span>
              <h2 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] text-[#0F1F16]">{copy.title}</h2>
              <p className="mt-2 text-[14px] leading-6 text-[#64748B]">{copy.description}</p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
                <FormInput
                  label="Email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
                  })}
                />

                <label className="block">
                  <div className="mb-1.5 text-sm font-semibold text-[#0F1F16]">Password</div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      {...register("password", { required: "Password is required" })}
                      className="field-input pr-[72px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-1.5 top-1.5 rounded-full bg-[#F1F5F1] px-3 py-1.5 text-xs font-bold text-[#334155] hover:bg-[#E7EFE6]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {errors.password && <div className="mt-1.5 text-sm font-medium text-red-600">{errors.password.message}</div>}
                </label>

                <div className="flex items-center justify-between pt-1">
                  <Link to="/forgot-password" className="text-sm font-semibold text-[#15803D] hover:text-[#14532D]">
                    Forgot password?
                  </Link>
                  <span className="text-xs font-medium text-[#94A3A8]">Secure • Encrypted</span>
                </div>

                {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>}

                <button type="submit" className="btn w-full py-[13px] text-[15px]" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in…" : "Sign in →"}
                </button>

                <div className="flex items-center gap-3 py-1">
                  <span className="h-px flex-1 bg-[#E7EFE6]" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3A8]">Easy access</span>
                  <span className="h-px flex-1 bg-[#E7EFE6]" />
                </div>

                {role === "citizen" && (
                  <Link to="/register" className="btn-outline w-full">
                    Create a citizen account
                  </Link>
                )}
                {role === "worker" && (
                  <Link to="/worker/register" className="btn-outline w-full">
                    New worker? Register
                  </Link>
                )}
              </form>

              {role === "citizen" ? (
                <div className="mt-6 text-center text-sm font-medium text-[#64748B]">
                  New here?{" "}
                  <Link to="/register" className="font-bold text-[#15803D] hover:text-[#14532D]">
                    Create a citizen account
                  </Link>
                </div>
              ) : role === "worker" ? (
                <div className="mt-6 text-center text-sm">
                  <Link to="/login" className="font-medium text-[#64748B] hover:text-[#0F1F16]">
                    Citizen? Go to citizen login →
                  </Link>
                </div>
              ) : (
                <div className="mt-6 text-center text-sm">
                  <Link to="/login" className="font-medium text-[#64748B] hover:text-[#0F1F16]">
                    Citizen? Go to citizen login →
                  </Link>
                </div>
              )}

              <p className="mt-4 text-center text-[11px] font-medium leading-4 text-[#94A3A8]">
                By signing in you agree to our Terms and confirm this is your assigned role. Role check is enforced on the server.
              </p>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-[#94A3A8]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Works on any device • No app needed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

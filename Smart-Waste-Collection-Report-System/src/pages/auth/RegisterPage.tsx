import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { registerUser } from "../../services/auth";
import { ROLE_HOME, type Role } from "../../lib/types";
import heroBg from "../../assets/ecotrack-hero-bg.jpg";

type FormData = { name: string; email: string; password: string };

export default function RegisterPage({ role }: { role: Exclude<Role, "admin"> }) {
  const isWorker = role === "worker";
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
    const res = await registerUser({ ...data, role });
    if (!res.ok) {
      setServerError(res.error);
      return;
    }
    await auth.refreshProfile();
    navigate(ROLE_HOME[role], { replace: true });
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#FBFCF8]">
      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1280px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left brand */}
        <div className="relative hidden overflow-hidden lg:block">
          <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className={`absolute inset-0 ${isWorker ? "bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900" : "bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#0F766E]"} opacity-[0.88]`} />
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
            <div>
              <Link to="/" className="inline-flex items-center gap-3 rounded-2xl bg-white p-2 pr-4 shadow-xl">
                <img src="/ecotrack-logo.svg" alt="EcoTrack" className="h-10" />
              </Link>
              <div className="mt-8 max-w-[480px]">
                <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ring-white/20 backdrop-blur">
                  {isWorker ? "● Field team onboarding" : "● Join the cleaner community"}
                </div>
                <h1 className="mt-4 text-[36px] font-[800] leading-[1.05] tracking-[-0.03em]">
                  {isWorker ? "Help the city shine." : "Be the reason your street stays clean."}
                </h1>
                <p className="mt-4 text-[16px] leading-7 text-white/85">
                  {isWorker
                    ? "Create a worker account. Get assigned, work with the map, and close jobs with photo proof."
                    : "Create your account in 20 seconds. Report, track, and celebrate a cleaner neighbourhood."}
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/15">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#052E16] font-bold">1</span>
                    <div>
                      <div className="text-sm font-bold">Fast, guided reporting</div>
                      <div className="text-xs text-white/70">Photo + pin + address — all in one flow</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur ring-1 ring-white/15">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#22C55E] text-white font-bold">2</span>
                    <div>
                      <div className="text-sm font-bold">Live updates</div>
                      <div className="text-xs text-white/70">Notifications when your report moves</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs font-medium text-white/60">EcoTrack • Track waste. Improve collection. Build cleaner communities.</div>
          </div>
        </div>

        {/* Right form */}
        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-[radial-gradient(600px_400px_at_20%_0%,rgba(34,197,94,0.08),transparent_60%)]">
          <div className="w-full max-w-[440px]">
            <div className="rounded-[24px] border border-[#E7EFE6] bg-white p-7 shadow-[0_24px_64px_rgba(15,31,22,0.10)] sm:p-8">
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ring-1 ${isWorker ? "bg-slate-900 text-white ring-slate-900" : "bg-emerald-50 text-emerald-700 ring-emerald-200"}`}>
                {isWorker ? "Team access • Worker" : "Citizen portal • Free"}
              </span>
              <h2 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] text-[#0F1F16]">{isWorker ? "Join the field team" : "Create your account"}</h2>
              <p className="mt-2 text-[14px] leading-6 text-[#64748B]">
                {isWorker ? "Municipal admins assign you to collection tasks." : "Report waste, track progress and get collection updates for your zone."}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-7 space-y-4">
                <FormInput
                  label="Full name"
                  type="text"
                  placeholder="e.g. Amara Perera"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register("name", { required: "Full name is required" })}
                />
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
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
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Use at least 6 characters" },
                      })}
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

                {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>}

                <button type="submit" className="btn w-full py-[13px] text-[15px]" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account…" : "Create account →"}
                </button>

                <p className="text-center text-xs font-medium leading-4 text-[#94A3A8]">Secure & private • Your data stays in your zone • Role-protected</p>
              </form>

              <div className="mt-6 text-center text-sm font-medium text-[#64748B]">
                Already have an account?{" "}
                <Link to={isWorker ? "/worker/login" : "/login"} className="font-bold text-[#15803D] hover:text-[#14532D]">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

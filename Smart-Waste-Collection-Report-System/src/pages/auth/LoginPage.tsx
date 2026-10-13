import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/auth";
import { ROLE_HOME, type Role } from "../../lib/types";

const COPY: Record<Role, { eyebrow: string; title: string; description: string; badge: string }> = {
  citizen: {
    eyebrow: "Citizen portal",
    title: "Welcome back",
    description: "Sign in to report an issue or follow your collection updates.",
    badge: "bg-emerald-50 text-emerald-700",
  },
  worker: {
    eyebrow: "Team access",
    title: "Worker sign in",
    description: "Open your assigned tasks, update progress and upload completion photos.",
    badge: "bg-slate-100 text-slate-700",
  },
  admin: {
    eyebrow: "Municipal staff",
    title: "Admin sign in",
    description: "Review reports, assign workers, manage zones, schedules and analytics.",
    badge: "bg-slate-900 text-white",
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
    <div className="auth-shell">
      <div className="auth-card">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${copy.badge}`}>
          {copy.eyebrow}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{copy.title}</h2>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">{copy.description}</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
            })}
          />

          <label className="mb-3 block">
            <div className="mb-1.5 text-sm font-medium text-slate-700">Password</div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password", { required: "Password is required" })}
                className="field-input pr-16"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <div className="mt-1 text-sm text-red-600">{errors.password.message}</div>}
          </label>

          <div className="mb-3 text-right text-sm">
            <Link to="/forgot-password" className="font-medium text-emerald-700">
              Forgot password?
            </Link>
          </div>

          {serverError && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>}

          <button type="submit" className="btn w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {role === "citizen" && (
          <div className="mt-5 text-center text-sm text-slate-600">
            New here?{" "}
            <Link to="/register" className="font-semibold text-emerald-700">
              Create a citizen account
            </Link>
          </div>
        )}
        {role === "worker" && (
          <div className="mt-5 text-center text-sm text-slate-600">
            New field worker?{" "}
            <Link to="/worker/register" className="font-semibold text-emerald-700">
              Register
            </Link>
          </div>
        )}
        {role !== "citizen" && (
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-slate-500 hover:text-slate-700">
              Citizen? Go to the citizen login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

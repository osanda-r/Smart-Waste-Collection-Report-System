import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { registerUser } from "../../services/auth";
import { ROLE_HOME, type Role } from "../../lib/types";

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
    // The auth listener may have run before the profile document existed; reload it now.
    await auth.refreshProfile();
    navigate(ROLE_HOME[role], { replace: true });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
            isWorker ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isWorker ? "Team access" : "Citizen portal"}
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
          {isWorker ? "Join the field team" : "Create your account"}
        </h2>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">
          {isWorker
            ? "Create a worker account. Municipal admins assign you to collection tasks."
            : "Report waste issues, track progress and get collection updates for your zone."}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormInput
            label="Full name"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name", { required: "Full name is required" })}
          />
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
                autoComplete="new-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Use at least 6 characters" },
                })}
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

          {serverError && <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>}

          <button type="submit" className="btn w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to={isWorker ? "/worker/login" : "/login"} className="font-semibold text-emerald-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

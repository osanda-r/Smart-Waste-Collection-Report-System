import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../../components/FormInput";
import { loginUser } from "../../services/auth";

type FormData = {
  email: string;
  password: string;
};

export default function CollectorLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  function onSubmit(data: FormData) {
    setServerError(undefined);
    setLoading(true);
    loginUser({ email: data.email, password: data.password, role: "collector" })
      .then((res) => {
        if (!res.ok) setServerError(res.error);
        else navigate("/collectors/dashboard");
      })
      .catch((err) => setServerError(String(err)))
      .finally(() => setLoading(false));
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">Team access</span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Collector sign in</h2>
      <p className="mt-2 mb-6 text-sm leading-6 text-slate-500">Open your route, manage assigned work, and update collection status.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
          })}
        />
        {errors.email && (
          <div className="text-sm text-red-600 mb-2">
            {errors.email.message}
          </div>
        )}

        <label className="block mb-3">
          <div className="mb-1 text-sm text-slate-700">Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
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
        </label>
        {errors.password && (
          <div className="text-sm text-red-600 mb-2">
            {errors.password.message}
          </div>
        )}

        {serverError && (
          <div className="text-sm text-red-600 mb-2">{serverError}</div>
        )}
        <div className="mt-3">
          <button type="submit" className="btn w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/collectors/register" className="font-semibold text-emerald-700">
            Register
          </Link>
        </div>
      </form>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

type FormData = {
  name: string;
  email: string;
  password: string;
};

export default function Register() {
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
    import("../services/auth").then(({ registerUser }) => {
      registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: "citizen",
      })
        .then((res) => {
          if (!res.ok) setServerError(res.error);
          else navigate("/citizen/dashboard");
        })
        .catch((err) => setServerError(String(err)))
        .finally(() => setLoading(false));
    });
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-md shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Citizen Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput
          label="Full name"
          type="text"
          {...register("name", { required: "Full name is required" })}
        />
        {errors.name && (
          <div className="text-sm text-red-600 mb-2">{errors.name.message}</div>
        )}

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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </div>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

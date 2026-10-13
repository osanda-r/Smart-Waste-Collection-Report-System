import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import { sendPasswordReset } from "../services/auth";

type FormData = { email: string };

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | undefined>();

  async function onSubmit(data: FormData) {
    setServerError(undefined);
    const res = await sendPasswordReset(data.email);
    if (res.ok) setSentTo(data.email);
    else setServerError(res.error);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Account recovery
        </span>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Reset your password</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the email attached to your account and we will send you a link to choose a new password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <FormInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
            })}
          />

          {sentTo && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              If an account exists for <strong>{sentTo}</strong>, a reset link is on its way. Check your spam folder too.
            </div>
          )}
          {serverError && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</div>}

          <button type="submit" className="btn w-full py-3" disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send reset link"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/login" className="font-medium text-emerald-700">Citizen login</Link>
          <Link to="/admin/login" className="text-slate-600">Staff login</Link>
        </div>
      </div>
    </div>
  );
}

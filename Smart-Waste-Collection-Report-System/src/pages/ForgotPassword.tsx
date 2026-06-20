import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";

type FormData = {
  email: string;
};

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [sent, setSent] = useState(false);

  function onSubmit() {
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          Account recovery
        </span>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">
          Reset your password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the email attached to your account and we will send recovery
          instructions.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <div className="text-sm text-red-600">{errors.email.message}</div>
          )}

          {sent && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Recovery instructions were prepared for this demo. Connect this
              form to your mail service when you are ready.
            </div>
          )}

          <button type="submit" className="btn w-full py-3">
            Send reset link
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/login" className="font-medium text-emerald-700">
            Back to login
          </Link>
          <Link to="/collectors/login" className="text-slate-600">
            Collector login
          </Link>
        </div>
      </div>
    </div>
  );
}

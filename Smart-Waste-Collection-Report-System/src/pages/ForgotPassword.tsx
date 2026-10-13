import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import FormInput from "../components/FormInput";
import { sendPasswordReset } from "../services/auth";
import heroBg from "../assets/ecotrack-hero-bg.png";

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
    <div className="min-h-[calc(100vh-65px)] bg-[#FBFCF8]">
      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1280px] lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden lg:block">
          <img src={heroBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#0F766E] opacity-[0.88]" />
          <div className="absolute inset-0 p-10 flex flex-col justify-between text-white">
            <Link to="/" className="inline-flex w-fit items-center gap-3 rounded-2xl bg-white p-2 pr-4 shadow-xl">
              <img src="/ecotrack-logo.svg" alt="EcoTrack" className="h-10" />
            </Link>
            <div className="max-w-[480px]">
              <h1 className="text-[36px] font-[800] leading-[1.05] tracking-[-0.03em]">We’ll get you back in.</h1>
              <p className="mt-4 text-[16px] leading-7 text-white/85">Secure recovery for every role — citizen, worker, and council. No stress, just a link.</p>
            </div>
            <div className="text-xs font-medium text-white/60">EcoTrack • Premium support • One link, any device</div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-[420px] rounded-[24px] border border-[#E7EFE6] bg-white p-7 shadow-[0_24px_64px_rgba(15,31,22,0.10)] sm:p-8">
            <span className="inline-flex rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#15803D] ring-1 ring-[#BBF7D0]">
              Account recovery
            </span>
            <h2 className="mt-4 text-[28px] font-[800] tracking-[-0.03em] text-[#0F1F16]">Reset your password</h2>
            <p className="mt-2 text-[14px] leading-6 text-[#64748B]">Enter the email attached to your account and we’ll send you a link to choose a new password.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
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
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  If an account exists for <strong>{sentTo}</strong>, a reset link is on its way. Check your spam folder too.
                </div>
              )}
              {serverError && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{serverError}</div>}

              <button type="submit" className="btn w-full py-[13px]" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send reset link →"}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-between text-sm font-semibold">
              <Link to="/login" className="text-[#15803D] hover:text-[#14532D]">Citizen login</Link>
              <Link to="/admin/login" className="text-[#64748B] hover:text-[#0F1F16]">Staff login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

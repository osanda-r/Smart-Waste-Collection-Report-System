import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const FormInput = forwardRef<HTMLInputElement, Props>(function FormInput({ label, error, ...rest }, ref) {
  return (
    <label className="block">
      {label && <div className="mb-1.5 text-sm font-medium text-slate-700">{label}</div>}
      <input ref={ref} {...rest} className="field-input" />
      {error && <div className="mt-1 text-sm text-red-600">{error}</div>}
    </label>
  );
});

export default FormInput;

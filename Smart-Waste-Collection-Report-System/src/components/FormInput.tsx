import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function FormInput({ label, ...rest }: Props) {
  return (
    <label className="block mb-4">
      {label && <div className="mb-1.5 text-sm font-medium text-slate-700">{label}</div>}
      <input
        {...rest}
        className="field-input"
      />
    </label>
  );
}

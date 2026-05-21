import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function FormInput({ label, ...rest }: Props) {
  return (
    <label className="block mb-3">
      {label && <div className="mb-1 text-sm text-slate-700">{label}</div>}
      <input
        {...rest}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </label>
  );
}

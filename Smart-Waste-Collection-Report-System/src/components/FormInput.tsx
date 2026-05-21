import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function FormInput({ label, ...rest }: Props) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      {label && <div style={{ marginBottom: 6, fontSize: 14 }}>{label}</div>}
      <input
        {...rest}
        style={{ padding: "8px 10px", width: "100%", boxSizing: "border-box" }}
      />
    </label>
  );
}

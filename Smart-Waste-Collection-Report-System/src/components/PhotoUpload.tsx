import { useState } from "react";

type Props = {
  onFile?: (file: File | null) => void;
};

export default function PhotoUpload({ onFile }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setPreview(url);
      onFile?.(f);
    } else {
      setPreview(null);
      onFile?.(null);
    }
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <div style={{ marginTop: 8 }}>
          <img
            src={preview}
            alt="preview"
            style={{ maxWidth: "160px", borderRadius: 6 }}
          />
        </div>
      )}
    </div>
  );
}

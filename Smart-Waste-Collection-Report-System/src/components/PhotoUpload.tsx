import { useEffect, useMemo } from "react";
import { MAX_PHOTO_BYTES } from "../services/storage";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  onError?: (message: string) => void;
};

/** Multi-image picker with local previews and size/type validation. */
export default function PhotoUpload({ files, onChange, max = 3, onError }: Props) {
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  useEffect(() => {
    return () => previews.forEach((u) => URL.revokeObjectURL(u));
  }, [previews]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    const valid: File[] = [];
    for (const file of picked) {
      if (!file.type.startsWith("image/")) {
        onError?.(`"${file.name}" is not an image.`);
      } else if (file.size > MAX_PHOTO_BYTES) {
        onError?.(`"${file.name}" is larger than 8 MB.`);
      } else {
        valid.push(file);
      }
    }
    const combined = [...files, ...valid].slice(0, max);
    if (files.length + valid.length > max) onError?.(`You can attach up to ${max} photos.`);
    onChange(combined);
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        aria-label="Upload photos"
        onChange={handleChange}
        disabled={files.length >= max}
        className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-3 file:py-2 file:font-semibold file:text-white disabled:opacity-50"
      />
      {previews.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div key={src} className="relative">
              <img src={src} alt={`Selected photo ${i + 1}`} className="h-24 w-24 rounded-lg object-cover ring-1 ring-slate-200" />
              <button
                type="button"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-slate-900 text-xs text-white"
                aria-label={`Remove photo ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

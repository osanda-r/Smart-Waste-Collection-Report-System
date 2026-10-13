import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

/** Uploads image files under `folder` and returns their download URLs. */
export async function uploadPhotos(folder: string, files: File[]): Promise<string[]> {
  return Promise.all(
    files.map(async (file) => {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const fileRef = ref(storage, `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safeName}`);
      await uploadBytes(fileRef, file, { contentType: file.type });
      return getDownloadURL(fileRef);
    }),
  );
}

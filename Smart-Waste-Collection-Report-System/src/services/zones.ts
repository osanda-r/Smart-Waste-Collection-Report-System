import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, type FirestoreError } from "firebase/firestore";
import { db } from "./firebase";
import { mapZone } from "./mappers";
import type { GeoPoint, Zone } from "../lib/types";
import type { ErrorListener, Listener } from "./users";

export function subscribeZones(next: Listener<Zone[]>, onError: ErrorListener) {
  return onSnapshot(
    collection(db, "zones"),
    (snap) => next(snap.docs.map((d) => mapZone(d.id, d.data())).sort((a, b) => a.name.localeCompare(b.name))),
    (err: FirestoreError) => onError(err),
  );
}

export type ZoneInput = { name: string; center: GeoPoint; radiusM: number };

export async function saveZone(id: string | null, input: ZoneInput): Promise<void> {
  if (id) {
    await updateDoc(doc(db, "zones", id), { ...input });
  } else {
    await addDoc(collection(db, "zones"), { ...input });
  }
}

export async function deleteZone(id: string): Promise<void> {
  await deleteDoc(doc(db, "zones", id));
}

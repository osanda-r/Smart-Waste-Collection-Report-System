import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc, type FirestoreError } from "firebase/firestore";
import { db } from "./firebase";
import { mapSchedule } from "./mappers";
import type { Schedule } from "../lib/types";
import type { ErrorListener, Listener } from "./users";

export function subscribeSchedules(next: Listener<Schedule[]>, onError: ErrorListener) {
  return onSnapshot(
    collection(db, "schedules"),
    (snap) => next(snap.docs.map((d) => mapSchedule(d.id, d.data()))),
    (err: FirestoreError) => onError(err),
  );
}

export type ScheduleInput = Omit<Schedule, "id">;

export async function saveSchedule(id: string | null, input: ScheduleInput): Promise<void> {
  if (id) {
    await updateDoc(doc(db, "schedules", id), { ...input });
  } else {
    await addDoc(collection(db, "schedules"), { ...input });
  }
}

export async function deleteSchedule(id: string): Promise<void> {
  await deleteDoc(doc(db, "schedules", id));
}

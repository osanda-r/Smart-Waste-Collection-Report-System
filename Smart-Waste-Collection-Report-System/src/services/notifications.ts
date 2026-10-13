import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import { mapNotification } from "./mappers";
import type { AppNotification } from "../lib/types";
import type { ErrorListener, Listener } from "./users";

export function subscribeMyNotifications(uid: string, next: Listener<AppNotification[]>, onError: ErrorListener) {
  return onSnapshot(
    query(collection(db, "notifications"), where("userId", "==", uid)),
    (snap) =>
      next(
        snap.docs
          .map((d) => mapNotification(d.id, d.data()))
          .sort((a, b) => (b.createdAt?.getTime() ?? Date.now()) - (a.createdAt?.getTime() ?? Date.now())),
      ),
    (err: FirestoreError) => onError(err),
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

export async function markAllNotificationsRead(notifications: AppNotification[]): Promise<void> {
  const unread = notifications.filter((n) => !n.read);
  if (unread.length === 0) return;
  const batch = writeBatch(db);
  for (const n of unread) {
    batch.update(doc(db, "notifications", n.id), { read: true });
  }
  await batch.commit();
}

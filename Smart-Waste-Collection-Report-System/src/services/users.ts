import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type FirestoreError,
} from "firebase/firestore";
import { db } from "./firebase";
import { mapUser } from "./mappers";
import type { Role, UserProfile } from "../lib/types";

export type Listener<T> = (value: T) => void;
export type ErrorListener = (error: Error) => void;

const usersCol = () => collection(db, "users");

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? mapUser(snap.id, snap.data()) : null;
}

export async function createUserProfile(
  uid: string,
  profile: { name: string; email: string; role: Exclude<Role, "admin"> },
): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    name: profile.name,
    email: profile.email,
    role: profile.role,
    zoneId: null,
    createdAt: serverTimestamp(),
  });
}

/** Users may only change their display name and preferred zone; role changes go through admins. */
export async function updateOwnProfile(uid: string, changes: { name?: string; zoneId?: string | null }) {
  await updateDoc(doc(db, "users", uid), changes);
}

export function subscribeAllUsers(next: Listener<UserProfile[]>, onError: ErrorListener) {
  return onSnapshot(
    usersCol(),
    (snap) => next(snap.docs.map((d) => mapUser(d.id, d.data()))),
    (err: FirestoreError) => onError(err),
  );
}

export function subscribeWorkers(next: Listener<UserProfile[]>, onError: ErrorListener) {
  return onSnapshot(
    query(usersCol(), where("role", "==", "worker")),
    (snap) => next(snap.docs.map((d) => mapUser(d.id, d.data()))),
    (err: FirestoreError) => onError(err),
  );
}

export async function setUserRole(uid: string, role: Role): Promise<void> {
  await updateDoc(doc(db, "users", uid), { role });
}

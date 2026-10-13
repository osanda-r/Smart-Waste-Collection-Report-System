import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebase";

export type Role = "citizen" | "collector";

export type User = {
  id: string;
  name?: string;
  email: string;
  role: Role;
};

type StoredRole = {
  email: string;
  role: Role;
  name?: string;
};

const ROLE_STORAGE_KEY = "swcrs_user_roles";

function loadStoredRoles(): Record<string, StoredRole> {
  try {
    const raw = localStorage.getItem(ROLE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredRole>) : {};
  } catch {
    return {};
  }
}

function saveStoredRole(userId: string, profile: StoredRole) {
  localStorage.setItem(
    ROLE_STORAGE_KEY,
    JSON.stringify({ ...loadStoredRoles(), [userId]: profile }),
  );
}

function toUser(firebaseUser: FirebaseUser, profile: StoredRole): User {
  return {
    id: firebaseUser.uid,
    name: profile.name ?? firebaseUser.displayName ?? undefined,
    email: firebaseUser.email ?? "",
    role: profile.role,
  };
}

function getFirebaseErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email or password.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      case "auth/invalid-email":
        return "Enter a valid email address.";
      default:
        return "Authentication failed. Please try again.";
    }
  }
  return "Authentication failed. Please try again.";
}

export async function registerUser(payload: {
  name?: string;
  email: string;
  password: string;
  role: Role;
}): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const roles = loadStoredRoles();
    const existingRole = Object.values(roles).find(
      (profile) =>
        profile.email === payload.email && profile.role === payload.role,
    );
    if (existingRole) {
      return {
        ok: false,
        error: "An account with this email already exists for the selected role.",
      };
    }

    const credential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password,
    );
    if (payload.name) {
      await updateProfile(credential.user, { displayName: payload.name });
    }
    const profile = {
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    saveStoredRole(credential.user.uid, profile);
    return { ok: true, user: toUser(credential.user, profile) };
  } catch (error) {
    return { ok: false, error: getFirebaseErrorMessage(error) };
  }
}

export async function loginUser(payload: {
  email: string;
  password: string;
  role: Role;
}): Promise<{ ok: boolean; user?: User; error?: string }> {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      payload.email,
      payload.password,
    );
    const profile = loadStoredRoles()[credential.user.uid];
    if (!profile || profile.role !== payload.role) {
      await signOut(auth);
      return { ok: false, error: "No account found for that email and role." };
    }
    return { ok: true, user: toUser(credential.user, profile) };
  } catch (error) {
    return { ok: false, error: getFirebaseErrorMessage(error) };
  }
}

import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, getUserProfile } from "./users";
import { ROLE_LABELS, type Role, type UserProfile } from "../lib/types";

export type AuthResult<T = void> = { ok: true; value: T } | { ok: false; error: string };

function errorMessage(error: unknown): string {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code: unknown }).code) : "";
  switch (code) {
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
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "permission-denied":
      return "Your account does not have permission for this action.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/** Creates the Firebase Auth user and their Firestore profile with the given role. */
export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "admin">;
}): Promise<AuthResult<UserProfile>> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
    await updateProfile(credential.user, { displayName: payload.name });
    await createUserProfile(credential.user.uid, {
      name: payload.name,
      email: payload.email,
      role: payload.role,
    });
    const profile = await getUserProfile(credential.user.uid);
    if (!profile) throw new Error("profile missing");
    return { ok: true, value: profile };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

/** Signs in, then verifies the account's stored role matches the portal being used. */
export async function loginUser(payload: {
  email: string;
  password: string;
  expectedRole: Role;
}): Promise<AuthResult<UserProfile>> {
  try {
    const credential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
    const profile = await getUserProfile(credential.user.uid);
    if (!profile) {
      await signOut(auth);
      return {
        ok: false,
        error:
          payload.expectedRole === "admin"
            ? "This account has no admin profile. Create users/{uid} in Firestore and set role to admin."
            : "No profile was found for this account. Contact the council.",
      };
    }
    if (profile.role !== payload.expectedRole) {
      await signOut(auth);
      return {
        ok: false,
        error: `This account is not registered as a ${ROLE_LABELS[payload.expectedRole].toLowerCase()}. Use the correct login page.`,
      };
    }
    return { ok: true, value: profile };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true, value: undefined };
  } catch (error) {
    return { ok: false, error: errorMessage(error) };
  }
}

export { errorMessage as authErrorMessage };

import { createContext } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import type { UserProfile } from "../lib/types";

export type AuthState =
  | { status: "loading"; user: null; profile: null }
  | { status: "signed-out"; user: null; profile: null }
  | { status: "ready"; user: FirebaseUser; profile: UserProfile }
  | { status: "incomplete"; user: FirebaseUser; profile: null };

export type AuthContextValue = AuthState & {
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

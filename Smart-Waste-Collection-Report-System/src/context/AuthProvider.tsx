import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserProfile } from "../services/users";
import { AuthContext, type AuthState } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null, profile: null });

  const loadProfile = useCallback(async (user: NonNullable<AuthState["user"]>) => {
    try {
      const profile = await getUserProfile(user.uid);
      setState(profile ? { status: "ready", user, profile } : { status: "incomplete", user, profile: null });
    } catch (error) {
      console.error("Failed to load profile", error);
      setState({ status: "incomplete", user, profile: null });
    }
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (!user) {
        setState({ status: "signed-out", user: null, profile: null });
        return;
      }
      setState({ status: "loading", user: null, profile: null });
      void loadProfile(user);
    });
  }, [loadProfile]);

  const refreshProfile = useCallback(async () => {
    const user = auth.currentUser;
    if (user) await loadProfile(user);
  }, [loadProfile]);

  const value = useMemo(() => ({ ...state, refreshProfile }), [state, refreshProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

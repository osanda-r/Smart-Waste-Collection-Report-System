import { useContext } from "react";
import { AuthContext, type AuthContextValue } from "../context/authContext";

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

/** For protected pages: returns the signed-in profile, or throws if used outside a guarded route. */
export function useProfile() {
  const auth = useAuth();
  if (auth.status !== "ready") throw new Error("Profile is not loaded");
  return auth.profile;
}

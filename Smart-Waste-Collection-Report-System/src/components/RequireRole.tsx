import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLE_HOME, ROLE_LOGIN, type Role } from "../lib/types";
import { LoadingBlock } from "./ui";
import { logoutUser } from "../services/auth";

/**
 * Route guard. Renders children only when the user is signed in with one of
 * `roles`; otherwise sends them to the matching login page or their own home.
 */
export default function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.status === "loading") return <LoadingBlock />;

  if (auth.status === "signed-out") {
    return <Navigate to={ROLE_LOGIN[roles[0]]} state={{ from: location.pathname }} replace />;
  }

  if (auth.status === "incomplete") {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Account setup incomplete</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          You are signed in, but your profile could not be loaded. Try again, or sign out and back in.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn" onClick={() => void auth.refreshProfile()}>
            Try again
          </button>
          <button className="btn-outline" onClick={() => void logoutUser()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  if (!roles.includes(auth.profile.role)) {
    return <Navigate to={ROLE_HOME[auth.profile.role]} replace />;
  }

  return <>{children}</>;
}

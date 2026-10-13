import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useLiveData } from "../../hooks/useLiveData";
import { setUserRole, subscribeAllUsers } from "../../services/users";
import { ROLE_LABELS, type Role } from "../../lib/types";
import { formatDate } from "../../lib/reports";
import { EmptyState, ErrorBlock, LoadingBlock, PageHeader } from "../../components/ui";

const ROLES: Role[] = ["citizen", "worker", "admin"];

export default function Users() {
  const { user } = useAuth();
  const users = useLiveData(subscribeAllUsers, "all-users");
  const [filter, setFilter] = useState<Role | "all">("all");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const list = (users.data ?? []).filter((u) => filter === "all" || u.role === filter);

  async function changeRole(uid: string, role: Role, name: string) {
    if (role === "admin" && !window.confirm(`Give ${name} full municipal admin access?`)) return;
    setError(null);
    setPending(uid);
    try {
      await setUserRole(uid, role);
    } catch (err) {
      console.error(err);
      setError(`Could not change the role for ${name}.`);
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <PageHeader
        eyebrow="Access control"
        title="Users & workers"
        description="Promote field workers, or grant admin access. Citizens self-register; workers and admins are set here."
        actions={
          <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" value={filter} onChange={(e) => setFilter(e.target.value as Role | "all")}>
            <option value="all">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}s</option>)}
          </select>
        }
      />
      {error && <ErrorBlock message={error} />}
      {users.error && <ErrorBlock message={users.error} />}
      {users.loading && <LoadingBlock />}
      {users.data && list.length === 0 && <EmptyState title="No users in this group" />}

      {list.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Joined</th><th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((u) => {
                const isSelf = u.id === user?.uid;
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{u.name || "—"} {isSelf && <span className="ml-1 text-xs text-slate-400">(you)</span>}</td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5"
                        value={u.role}
                        disabled={isSelf || pending === u.id}
                        onChange={(e) => void changeRole(u.id, e.target.value as Role, u.name || u.email)}
                        aria-label={`Role for ${u.name || u.email}`}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

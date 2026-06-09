export type Role = "citizen" | "collector";

export type User = {
  id: string;
  name?: string;
  email: string;
  password: string;
  role: Role;
};

const STORAGE_KEY = "swcrs_users";

function delay(ms = 400) {
  return new Promise((res) => setTimeout(res, ms));
}

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function registerUser(payload: {
  name?: string;
  email: string;
  password: string;
  role: Role;
}): Promise<{ ok: boolean; user?: User; error?: string }> {
  await delay();
  const users = loadUsers();
  const exists = users.find(
    (u) => u.email === payload.email && u.role === payload.role,
  );
  if (exists)
    return {
      ok: false,
      error: "An account with this email already exists for the selected role.",
    };

  const newUser: User = {
    id: `u_${Date.now().toString(36)}`,
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
  };
  users.push(newUser);
  saveUsers(users);
  return { ok: true, user: newUser };
}

export async function loginUser(payload: {
  email: string;
  password: string;
  role: Role;
}): Promise<{ ok: boolean; user?: User; error?: string }> {
  await delay();
  const users = loadUsers();
  const user = users.find(
    (u) => u.email === payload.email && u.role === payload.role,
  );
  if (!user)
    return { ok: false, error: "No account found for that email and role." };
  if (user.password !== payload.password)
    return { ok: false, error: "Invalid password." };
  return { ok: true, user };
}

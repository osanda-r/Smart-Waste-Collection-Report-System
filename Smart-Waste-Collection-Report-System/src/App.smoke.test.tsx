// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

// Firebase is replaced with in-memory stubs so the real app code runs without a network.
type FakeUser = { uid: string; displayName: string | null; email: string | null };
const authState: { user: FakeUser | null; profile: { role: string; name: string } | null } = { user: null, profile: null };

vi.mock("./services/firebase", () => ({ app: {}, auth: { currentUser: null }, db: {}, storage: {} }));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (_auth: unknown, cb: (u: FakeUser | null) => void) => {
    queueMicrotask(() => cb(authState.user));
    return () => {};
  },
  signOut: vi.fn(async () => {}),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock("firebase/storage", () => ({ getDownloadURL: vi.fn(), ref: vi.fn(), uploadBytes: vi.fn() }));

vi.mock("firebase/firestore", () => {
  class Timestamp {
    private readonly ms: number;
    constructor(ms: number) {
      this.ms = ms;
    }
    toDate() {
      return new Date(this.ms);
    }
  }
  return {
    Timestamp,
    collection: vi.fn(() => ({})),
    doc: vi.fn(() => ({ id: "x" })),
    query: vi.fn((q: unknown) => q),
    where: vi.fn(),
    orderBy: vi.fn(),
    getDoc: vi.fn(async () => ({ exists: () => false, data: () => ({}) })),
    getDocs: vi.fn(async () => ({ docs: [] })),
    setDoc: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    writeBatch: vi.fn(() => ({ update: vi.fn(), set: vi.fn(), commit: vi.fn() })),
    serverTimestamp: vi.fn(),
    onSnapshot: vi.fn((_q: unknown, next: (s: { docs: unknown[] }) => void) => {
      queueMicrotask(() => next({ docs: [] }));
      return () => {};
    }),
  };
});

vi.mock("./services/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./services/users")>();
  return {
    ...actual,
    getUserProfile: vi.fn(async () =>
      authState.profile
        ? { id: "u1", email: "u@example.com", zoneId: null, createdAt: null, ...authState.profile }
        : null,
    ),
  };
});

// Imported after mocks are registered.
const { default: App } = await import("./App");

function renderAt(path: string) {
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("app routing and role guards", () => {
  beforeEach(() => {
    authState.user = null;
    authState.profile = null;
  });

  it("sends signed-out visitors from a staff page to the staff login", async () => {
    renderAt("/admin/dashboard");
    expect(await screen.findByText("Admin sign in")).toBeTruthy();
  });

  it("shows the citizen login at /login", async () => {
    renderAt("/login");
    expect(await screen.findByText("Welcome back")).toBeTruthy();
  });

  it("redirects a signed-in worker away from admin pages to the worker dashboard", async () => {
    authState.user = { uid: "u1", displayName: "Sam Perera", email: "sam@example.com" };
    authState.profile = { role: "worker", name: "Sam Perera" };
    renderAt("/admin/dashboard");
    await waitFor(() => expect(window.location.pathname).toBe("/worker/dashboard"));
    expect(await screen.findByText("Hello, Sam")).toBeTruthy();
    expect(await screen.findByText("Open tasks")).toBeTruthy();
  });
});

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ENGINEERS, type Engineer } from "@/data/engineers";
import type { Project } from "@/data/app";

/**
 * A guest's live session lives only in this provider's React state, which
 * unmounts when they leave /app for /signup or /login. Stashing a snapshot
 * here lets those pages hand the conversation back once the account exists -
 * see the matching read in signup/login's submit handlers.
 */
export const GUEST_SESSION_STORAGE_KEY = "snapdev_guest_session";

export type TextMessage = { id: string; role: "you" | "engineer"; text: string };
export type SessionMessage = TextMessage | { id: string; role: "share-card" } | { id: string; role: "call-card" };

export type SessionGoal = { id: string; text: string; done: boolean };
export type SessionNote = { id: string; text: string; time: string };
export type SessionFollowup = { length: 30 | 60 };
export type SharedItem = { id: string; kind: "file" | "image" | "snippet"; name: string; meta: string };

const DEFAULT_GOALS: Omit<SessionGoal, "id">[] = [
  { text: "Reproduce the issue", done: true },
  { text: "Identify the root cause", done: false },
  { text: "Ship a working fix", done: false },
];

export type ActiveSession = {
  engineer: Engineer;
  project?: Project;
  extraProjects: Project[];
  messages: SessionMessage[];
  startedAt: number;
  goals: SessionGoal[];
  notes: SessionNote[];
  followup: SessionFollowup | null;
  sharedItems: SharedItem[];
  /** Visitor hasn't created an account yet - stays true for the session's whole lifetime. */
  guest: boolean;
};

/** A finished session's transcript, kept around for the Messages page. */
export type Thread = {
  id: string;
  engineer: Engineer;
  project?: Project;
  messages: TextMessage[];
  endedAt: number;
};

/** Recap shown as a toast right after a session ends. */
export type SessionSummary = {
  engineer: Engineer;
  projectName?: string;
  minutes: number;
  messages: number;
  notes: string[];
};

type SessionContextValue = {
  session: ActiveSession | null;
  threads: Thread[];
  summary: SessionSummary | null;
  dismissSummary: () => void;
  startSession: (
    engineer: Engineer,
    project: Project | undefined,
    problem: string,
    opts?: { pending?: boolean },
  ) => void;
  endSession: () => void;
  sendMessage: (text: string) => void;
  dismissCard: (kind: "share-card" | "call-card") => void;
  attachProject: (project: Project) => void;
  toggleGoal: (id: string) => void;
  addGoal: () => void;
  editGoal: (id: string, text: string) => void;
  addNote: (text: string) => void;
  deleteNote: (id: string) => void;
  bookFollowup: (length: 30 | 60) => void;
  cancelFollowup: () => void;
  addSharedItem: (item: Omit<SharedItem, "id" | "meta">) => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

function engineer(name: string) {
  return ENGINEERS.find((e) => e.name === name)!;
}

function seedThreads(): Thread[] {
  const now = Date.now();
  return [
    {
      id: "seed-1",
      engineer: engineer("Khalil"),
      messages: [
        { id: "m1", role: "you", text: "My Vercel build passes locally but fails in CI with a type error." },
        { id: "m2", role: "engineer", text: "Can you paste the exact error? Usually it's a stricter tsconfig in CI." },
        { id: "m3", role: "you", text: "It's complaining about an implicit any on a map callback." },
        { id: "m4", role: "engineer", text: "Yep, add an explicit param type there and it'll go green." },
      ],
      endedAt: now - 1000 * 60 * 24,
    },
    {
      id: "seed-2",
      engineer: engineer("Wajahat A."),
      messages: [
        { id: "m5", role: "you", text: "Trying to wire OpenAI streaming into a Next.js route handler." },
        { id: "m6", role: "engineer", text: "Use a ReadableStream and pipe the SDK's stream into it - I can show you the pattern." },
        { id: "m7", role: "you", text: "That worked, thank you!" },
      ],
      endedAt: now - 1000 * 60 * 60 * 5,
    },
    {
      id: "seed-3",
      engineer: engineer("Abbas R."),
      messages: [
        { id: "m8", role: "you", text: "Postgres query is timing out on a table with ~2M rows." },
        { id: "m9", role: "engineer", text: "Let's check EXPLAIN ANALYZE first - my guess is a missing index on the filter column." },
      ],
      endedAt: now - 1000 * 60 * 60 * 26,
    },
  ];
}

/** Client-only "live session" state backing the full-screen chat window. */
/**
 * Called from the signup/login submit handlers once the (mock) account is
 * created - flips the stashed guest session, if any, to a full one so it
 * comes back unlocked. Returns whether there was one, so the caller can
 * decide where to send the user next.
 */
export function claimGuestSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = sessionStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    if (!raw) return false;
    const restored = JSON.parse(raw) as ActiveSession;
    sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify({ ...restored, guest: false }));
    return true;
  } catch {
    return false;
  }
}

function restoreGuestSession(): ActiveSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(GUEST_SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ActiveSession) : null;
  } catch {
    return null;
  }
}

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<ActiveSession | null>(restoreGuestSession);
  const [threads, setThreads] = useState<Thread[]>(seedThreads);
  const [summary, setSummary] = useState<SessionSummary | null>(null);

  // Keep a snapshot around only while a guest is mid-session, so it survives
  // the /signup or /login detour (see GUEST_SESSION_STORAGE_KEY above).
  // Anything else - no session, or one that's no longer a guest's - is
  // cleared so a stale snapshot never resurfaces later.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (session?.guest) {
      sessionStorage.setItem(GUEST_SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      sessionStorage.removeItem(GUEST_SESSION_STORAGE_KEY);
    }
  }, [session]);

  const startSession: SessionContextValue["startSession"] = (engineer, project, problem, opts) => {
    // A pending (not-yet-signed-up) session shows only what the visitor typed -
    // the engineer hasn't actually joined yet, so no reply or follow-up cards.
    const messages: SessionMessage[] = problem
      ? [{ id: crypto.randomUUID(), role: "you", text: problem }]
      : [];
    if (!opts?.pending) {
      if (!problem) messages.push({ id: crypto.randomUUID(), role: "you", text: "Hey, could use a hand." });
      messages.push({
        id: crypto.randomUUID(),
        role: "engineer",
        text: "Hey! Read your note, I've untangled this kind of thing plenty. What have you tried so far?",
      });
      if (!project) messages.push({ id: crypto.randomUUID(), role: "share-card" });
      messages.push({ id: crypto.randomUUID(), role: "call-card" });
    }

    setSession({
      engineer,
      project,
      extraProjects: [],
      messages,
      startedAt: Date.now(),
      goals: DEFAULT_GOALS.map((g) => ({ ...g, id: crypto.randomUUID() })),
      notes: [],
      followup: null,
      sharedItems: [],
      guest: !!opts?.pending,
    });
  };

  const endSession = () => {
    if (session) {
      const transcript = session.messages.filter(
        (m): m is TextMessage => m.role === "you" || m.role === "engineer",
      );
      if (transcript.length > 0) {
        const thread: Thread = {
          id: crypto.randomUUID(),
          engineer: session.engineer,
          project: session.project,
          messages: transcript,
          endedAt: Date.now(),
        };
        setThreads((t) => [thread, ...t]);
      }
      setSummary({
        engineer: session.engineer,
        projectName: session.project?.name,
        minutes: Math.max(1, Math.round((Date.now() - session.startedAt) / 60000)),
        messages: transcript.length,
        notes: session.notes.map((n) => n.text),
      });
    }
    setSession(null);
  };

  const dismissSummary = () => setSummary(null);

  const sendMessage: SessionContextValue["sendMessage"] = (text) => {
    const value = text.trim();
    if (!value) return;
    setSession((prev) => {
      if (!prev) return prev;
      const mine: SessionMessage = { id: crypto.randomUUID(), role: "you", text: value };
      return { ...prev, messages: [...prev.messages, mine] };
    });
    setTimeout(() => {
      setSession((prev) => {
        if (!prev) return prev;
        const reply: SessionMessage = {
          id: crypto.randomUUID(),
          role: "engineer",
          text: "Got it. Let me pull up the code and I'll walk you through it.",
        };
        return { ...prev, messages: [...prev.messages, reply] };
      });
    }, 900);
  };

  const dismissCard: SessionContextValue["dismissCard"] = (kind) => {
    setSession((prev) => (prev ? { ...prev, messages: prev.messages.filter((m) => m.role !== kind) } : prev));
  };

  const attachProject: SessionContextValue["attachProject"] = (project) => {
    setSession((prev) => {
      if (!prev) return prev;
      if (!prev.project) return { ...prev, project };
      if (prev.project.id === project.id || prev.extraProjects.some((p) => p.id === project.id)) return prev;
      return { ...prev, extraProjects: [...prev.extraProjects, project] };
    });
  };

  const toggleGoal: SessionContextValue["toggleGoal"] = (id) => {
    setSession((prev) =>
      prev
        ? { ...prev, goals: prev.goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g)) }
        : prev,
    );
  };

  const addGoal = () => {
    setSession((prev) =>
      prev ? { ...prev, goals: [...prev.goals, { id: crypto.randomUUID(), text: "", done: false }] } : prev,
    );
  };

  const editGoal: SessionContextValue["editGoal"] = (id, text) => {
    setSession((prev) =>
      prev ? { ...prev, goals: prev.goals.map((g) => (g.id === id ? { ...g, text } : g)) } : prev,
    );
  };

  const addNote: SessionContextValue["addNote"] = (text) => {
    const value = text.trim();
    if (!value) return;
    setSession((prev) =>
      prev
        ? {
            ...prev,
            notes: [
              { id: crypto.randomUUID(), text: value, time: "Just now" },
              ...prev.notes,
            ],
          }
        : prev,
    );
  };

  const deleteNote: SessionContextValue["deleteNote"] = (id) => {
    setSession((prev) => (prev ? { ...prev, notes: prev.notes.filter((n) => n.id !== id) } : prev));
  };

  const bookFollowup: SessionContextValue["bookFollowup"] = (length) => {
    setSession((prev) => (prev ? { ...prev, followup: { length } } : prev));
  };

  const cancelFollowup = () => {
    setSession((prev) => (prev ? { ...prev, followup: null } : prev));
  };

  const addSharedItem: SessionContextValue["addSharedItem"] = (item) => {
    setSession((prev) =>
      prev
        ? {
            ...prev,
            sharedItems: [{ ...item, id: crypto.randomUUID(), meta: "You · just now" }, ...prev.sharedItems],
          }
        : prev,
    );
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        threads,
        summary,
        dismissSummary,
        startSession,
        endSession,
        sendMessage,
        dismissCard,
        attachProject,
        toggleGoal,
        addGoal,
        editGoal,
        addNote,
        deleteNote,
        bookFollowup,
        cancelFollowup,
        addSharedItem,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}

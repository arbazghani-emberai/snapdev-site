"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Clock,
  MoreHorizontal,
  PanelLeft,
  Paperclip,
  ArrowUp,
  Mic,
  Phone,
  FileText,
  ImageIcon,
  Code,
  Download,
  Plus,
  Link2,
  Globe,
  Package,
  LogOut,
  Lock,
  type IconComponent,
} from "@/components/icons";
import { useSession } from "./SessionProvider";
import { useProjects } from "./ProjectsProvider";
import { usePlan } from "./PlanProvider";
import ConnectProjectDrawer from "./ConnectProjectDrawer";
import ScheduleModal from "./ScheduleModal";
import type { Project } from "@/data/app";
import type { Engineer } from "@/data/engineers";

const SOURCE_ICON: Record<Project["source"], IconComponent> = {
  GitHub: Link2,
  "Live URL": Globe,
  Upload: Package,
};

const SHARED_ITEM_ICON: Record<"file" | "image" | "snippet", IconComponent> = {
  file: FileText,
  image: ImageIcon,
  snippet: Code,
};

function formatElapsed(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Closes an open popover on any click outside of `ref`'s element. */
function useClickOutside(ref: React.RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open, ref, onClose]);
}

function EngineerAvatar({ engineer, size }: { engineer: Engineer; size: number }) {
  const initials = engineer.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size, backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
    >
      {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes={`${size}px`} />}
      {!engineer.img && (
        <span className="text-ink-2 flex h-full items-center justify-center text-[11px] font-semibold">
          {initials}
        </span>
      )}
    </span>
  );
}

export default function ChatSession({ guest = false }: { guest?: boolean }) {
  const {
    session,
    endSession,
    sendMessage,
    dismissCard,
    attachProject,
    addNote,
    deleteNote,
    bookFollowup,
    cancelFollowup,
    addSharedItem,
  } = useSession();
  const { projects } = useProjects();
  const { plan } = usePlan();

  const [now, setNow] = useState(() => Date.now());
  const [connecting, setConnecting] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [snippetMode, setSnippetMode] = useState(false);
  const [snippetDraft, setSnippetDraft] = useState("");
  const projectCountAtOpenRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const [attachProjectMenuOpen, setAttachProjectMenuOpen] = useState(false);
  const attachProjectMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(kebabRef, kebabOpen, () => setKebabOpen(false));
  useClickOutside(attachMenuRef, attachMenuOpen, () => {
    setAttachMenuOpen(false);
    setSnippetMode(false);
    setSnippetDraft("");
  });
  useClickOutside(attachProjectMenuRef, attachProjectMenuOpen, () => setAttachProjectMenuOpen(false));

  useEffect(() => {
    // A guest session is pending account creation - it hasn't actually
    // started, so the elapsed clock stays frozen instead of ticking up.
    if (!session || guest) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session, guest]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [session?.messages.length]);

  // Every entry point (Get Unstuck, an engineer's "Start session", Message
  // again, Book again) drops straight into a fresh session - show a brief
  // "connecting" beat here instead of duplicating it at each call site.
  // Reset during render (not the effect body) whenever a new session starts,
  // per React's "adjusting state when props change" pattern.
  const [prevStartedAt, setPrevStartedAt] = useState(session?.startedAt);
  if (session && session.startedAt !== prevStartedAt) {
    setPrevStartedAt(session.startedAt);
    setConnecting(true);
    // Default the side panel closed on phones (where it's a full overlay
    // covering the chat) but open on tablet/desktop, matching the md:
    // breakpoint where the panel already renders docked, not as an overlay.
    setSidebarOpen(window.innerWidth >= 768);
  }

  useEffect(() => {
    if (!connecting) return;
    const timer = setTimeout(() => setConnecting(false), 3200);
    return () => clearTimeout(timer);
  }, [connecting]);

  if (!session) return null;

  if (connecting) {
    return (
      <div className="animate-session-in fixed inset-0 z-50 grid place-items-center bg-surface-2 text-center">
        <div>
          <div className="mx-auto grid size-14 place-items-center">
            <span className="border-line border-t-brand size-9 animate-spin rounded-full border-[3px]" />
          </div>
          <h2 className="font-heading mt-5 text-[22px] font-semibold tracking-tight">
            Connecting with engineer
          </h2>
          <p className="text-ink-2 mx-auto mt-2 max-w-xs text-[14.5px] leading-relaxed">
            The session will start as soon as the engineer accepts.
          </p>
          <button
            type="button"
            onClick={() => setScheduleOpen(true)}
            className="border-line hover:border-ink mx-auto mt-6 flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[13px] font-semibold transition"
          >
            <Phone className="size-3.5" strokeWidth={2} />
            Book a call instead
          </button>
        </div>
        <ScheduleModal engineer={scheduleOpen ? session.engineer : null} onClose={() => setScheduleOpen(false)} />
      </div>
    );
  }

  const engineerFirstName = session.engineer.name.split(" ")[0];
  const attachedIds = new Set([session.project?.id, ...session.extraProjects.map((p) => p.id)].filter(Boolean));
  const attachableProjects = projects.filter((p) => !attachedIds.has(p.id));

  const openConnect = () => {
    projectCountAtOpenRef.current = projects.length;
    setConnectOpen(true);
    setAttachMenuOpen(false);
  };

  const closeConnect = () => {
    setConnectOpen(false);
    if (projects.length > projectCountAtOpenRef.current) attachProject(projects[0]);
  };

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  const toggleMic = () => {
    setListening(true);
    setTimeout(() => setListening(false), 1600);
  };

  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteDraft.trim()) return;
    addNote(noteDraft);
    setNoteDraft("");
  };

  const openFilePicker = (kind: "file" | "image") => {
    const input = fileInputRef.current;
    if (input) {
      input.accept = kind === "image" ? "image/*" : "";
      input.dataset.kind = kind;
      input.click();
    }
    setAttachMenuOpen(false);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const kind = e.target.dataset.kind === "image" ? "image" : "file";
    if (file) addSharedItem({ kind, name: file.name });
    e.target.value = "";
  };

  const submitSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    const value = snippetDraft.trim();
    if (!value) return;
    const label = value.split("\n")[0].slice(0, 40);
    addSharedItem({ kind: "snippet", name: label });
    setSnippetDraft("");
    setSnippetMode(false);
    setAttachMenuOpen(false);
  };

  return (
    <div className="animate-session-in fixed inset-0 z-50 flex flex-col bg-surface-2">
      {/* Header */}
      <div className="border-line bg-surface flex items-center gap-2.5 border-b px-3 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5">
        <EngineerAvatar engineer={session.engineer} size={32} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[14px] font-semibold">{session.engineer.name}</div>
          <div className="text-ink-2 flex items-center gap-1.5 truncate text-[12px]">
            <span className="bg-online size-1.5 shrink-0 rounded-full" />
            <span className="truncate">{guest ? "Online · waiting to start" : "Online · replies in ~2 min"}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setScheduleOpen(true)}
          className="bg-brand hover:bg-brand-ink hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold text-white transition sm:flex"
        >
          <Phone className="size-3.5" strokeWidth={1.75} />
          Book a call
        </button>

        <div ref={kebabRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setKebabOpen((v) => !v)}
            aria-label="More"
            className="border-line hover:bg-surface-2 grid size-9 place-items-center rounded-full border transition"
          >
            <MoreHorizontal className="text-ink-2 size-4" strokeWidth={1.75} />
          </button>
          {kebabOpen && (
            <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+8px)] right-0 z-20 w-44 origin-top-right rounded-lg border p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setKebabOpen(false)}
                className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
              >
                <Download className="size-4" strokeWidth={1.75} />
                Export transcript
              </button>
              <button
                type="button"
                onClick={endSession}
                className="text-danger hover:bg-danger-wash flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
              >
                <LogOut className="size-4" strokeWidth={1.75} />
                End session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close side panel"
            onClick={() => setSidebarOpen(false)}
            className="bg-scrim absolute inset-0 z-20 md:hidden"
          />
        )}
        <aside
          className={`border-line bg-surface flex shrink-0 flex-col transition-all duration-200 md:static md:z-auto md:shadow-none ${
            sidebarOpen
              ? "absolute inset-y-0 left-0 z-30 w-[85vw] max-w-[300px] gap-3 overflow-y-auto border-r p-4 shadow-2xl md:w-[300px]"
              : "hidden w-11 items-center overflow-hidden p-2 md:flex"
          }`}
        >
          <div className={`flex items-center ${sidebarOpen ? "w-full justify-between" : "justify-center"}`}>
            {guest && sidebarOpen ? (
              <span className="group relative">
                <span
                  aria-hidden="true"
                  className="bg-surface-2 text-ink-2 grid size-7 shrink-0 place-items-center rounded-lg"
                >
                  <Lock className="size-3.5" strokeWidth={1.75} />
                </span>
                <span className="border-line bg-surface text-ink pointer-events-none absolute top-[calc(100%+8px)] left-0 z-20 w-52 origin-top-left rounded-md border px-2.5 py-2 text-[12px] leading-relaxed opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100">
                  Create an account to use all the chat features.
                </span>
              </span>
            ) : (
              sidebarOpen && <span />
            )}
            <button
              type="button"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Toggle side panel"
              className="border-line bg-surface text-ink-2 hover:text-ink hover:bg-surface-2 grid size-7 shrink-0 place-items-center rounded-lg border transition"
            >
              <PanelLeft className="size-3.5" strokeWidth={1.75} />
            </button>
          </div>

          {sidebarOpen && (
            <div className={guest ? "pointer-events-none flex flex-col gap-3 opacity-50" : "contents"}>
            {/* Notes */}
            <div className="border-line bg-surface rounded-lg border p-4.5">
              <div className="mb-3 text-[13px] font-semibold">Notes</div>
              <div className="flex flex-col gap-2">
                {session.notes.map((n) => (
                  <div key={n.id} className="flex items-center gap-2.5">
                    <span className="min-w-0 flex-1 text-[13px]">{n.text}</span>
                    <button
                      type="button"
                      onClick={() => deleteNote(n.id)}
                      aria-label="Delete note"
                      className="text-ink-3 hover:text-danger shrink-0"
                    >
                      <X className="size-3" strokeWidth={2} />
                    </button>
                  </div>
                ))}
                <form onSubmit={submitNote}>
                  <input
                    type="text"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    placeholder="Add a note"
                    className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
                  />
                </form>
              </div>
            </div>

            {/* Project context */}
            <div className="border-line bg-surface rounded-lg border p-4.5">
              <div className="mb-3 text-[13px] font-semibold">Project context</div>
              {session.project ? (
                <div className="flex flex-col gap-2">
                  {[session.project, ...session.extraProjects].map((p) => {
                    const Icon = SOURCE_ICON[p.source];
                    return (
                      <div key={p.id} className="bg-surface-2 flex items-center gap-2.5 rounded-lg p-2.5">
                        <span className="bg-ink grid size-7 shrink-0 place-items-center rounded-md text-bg">
                          <Icon className="size-3.5" strokeWidth={2} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12.5px] font-semibold">{p.name}</div>
                          <div className="text-ink-2 truncate text-[11.5px]">Connected</div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={attachProjectMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setAttachProjectMenuOpen((v) => !v)}
                      className="border-ink-3 text-ink-2 hover:border-brand hover:text-brand flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-[12.5px] font-semibold transition"
                    >
                      <Plus className="size-3" strokeWidth={2.5} />
                      Attach another project
                    </button>
                    {attachProjectMenuOpen && (
                      <div className="animate-menu-in border-line bg-surface absolute bottom-[calc(100%+6px)] left-0 z-20 w-full origin-bottom rounded-xl border p-1.5 shadow-xl">
                        <div className="text-ink-3 px-2.5 pt-1 pb-1.5 text-[10px] font-bold tracking-[0.08em] uppercase">
                          Your projects
                        </div>
                        {attachableProjects.length === 0 && (
                          <p className="text-ink-3 px-2.5 py-2 text-[12px]">No other projects yet.</p>
                        )}
                        {attachableProjects.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              attachProject(p);
                              setAttachProjectMenuOpen(false);
                            }}
                            className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition"
                          >
                            <span className="truncate">{p.name}</span>
                          </button>
                        ))}
                        <div className="bg-line my-1 h-px" />
                        <button
                          type="button"
                          onClick={openConnect}
                          className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[12.5px] font-semibold transition"
                        >
                          <Plus className="size-3" strokeWidth={2.5} />
                          Connect a new project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-ink-2 mb-2.5 text-[12.5px] leading-relaxed">
                    Share a repo or file so your engineer can read the code directly.
                  </p>
                  <button
                    type="button"
                    onClick={openConnect}
                    className="border-ink-3 text-ink hover:border-brand hover:text-brand w-full rounded-lg border border-dashed py-2 text-[12.5px] font-semibold transition"
                  >
                    + Connect project
                  </button>
                </div>
              )}
            </div>

            {/* Shared items */}
            <div className="border-line bg-surface rounded-lg border p-4.5">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-[13px] font-semibold">Shared items</span>
                {session.sharedItems.length > 0 && (
                  <span className="bg-surface-2 text-ink-3 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                    {session.sharedItems.length}
                  </span>
                )}
              </div>
              {session.sharedItems.length === 0 ? (
                <p className="text-ink-3 text-[12.5px] leading-relaxed">
                  Nothing shared yet. Attach a file, screenshot, or snippet from the message box.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {session.sharedItems.map((item) => {
                    const Icon = SHARED_ITEM_ICON[item.kind];
                    return (
                      <div key={item.id} className="bg-surface-2 flex items-center gap-2.5 rounded-lg p-2.5">
                        <span className="bg-surface text-ink-2 grid size-6.5 shrink-0 place-items-center rounded-md">
                          <Icon className="size-3.5" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[12.5px] font-semibold">{item.name}</div>
                          <div className="text-ink-2 text-[11px]">{item.meta}</div>
                        </div>
                        <Download className="text-ink-3 size-3.5 shrink-0" strokeWidth={1.75} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Book a call */}
            <div className="border-line bg-surface rounded-lg border p-4.5">
              <div className="mb-3 text-[13px] font-semibold">Book a call</div>
              {session.followup ? (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-ink-2 text-[12.5px] leading-relaxed">
                    Booked · Tomorrow, 10:00 · <span className="text-ink font-medium">{session.followup.length} min</span>
                  </p>
                  <button
                    type="button"
                    onClick={cancelFollowup}
                    className="text-ink-3 hover:text-danger shrink-0 text-[12px] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-ink-2 text-[12.5px] leading-relaxed">
                    Next availability with {engineerFirstName}:{" "}
                    <span className="text-ink font-medium">Tomorrow, 10:00</span>
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => bookFollowup(30)}
                      className="bg-surface-2 border-line hover:border-ink flex-1 rounded-lg border py-2 text-[12.5px] font-semibold transition"
                    >
                      30 min
                    </button>
                    <button
                      type="button"
                      onClick={() => bookFollowup(60)}
                      className="bg-surface-2 border-line hover:border-ink flex-1 rounded-lg border py-2 text-[12.5px] font-semibold transition"
                    >
                      60 min
                    </button>
                  </div>
                </div>
              )}
            </div>

            </div>
          )}
        </aside>

        {/* Chat column */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open side panel"
              className="border-line bg-surface text-ink-2 hover:text-ink mx-4 mt-3 grid size-7 shrink-0 place-items-center self-start rounded-lg border transition md:hidden"
            >
              <PanelLeft className="size-3.5" strokeWidth={1.75} />
            </button>
          )}
          <div className="flex flex-1 justify-center overflow-y-auto px-4 py-5">
            <div className="flex w-full max-w-[720px] flex-col gap-3.5">
              <div className="text-ink-3 text-center text-[12.5px]">
                Today · your first session is on us, up to 30 min
              </div>

              {session.messages.map((m) => {
                if (m.role === "you") {
                  return (
                    <div key={m.id} className="flex justify-end">
                      <div className="bg-brand-wash text-ink max-w-[70%] rounded-xl px-4.5 py-2.5 text-[14.5px] leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                  );
                }
                if (m.role === "engineer") {
                  return (
                    <div key={m.id} className="flex items-start gap-3">
                      <EngineerAvatar engineer={session.engineer} size={32} />
                      <div className="border-line bg-surface max-w-[70%] rounded-md border px-4.5 py-3 text-[14.5px] leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                  );
                }
                if (m.role === "share-card") {
                  return (
                    <div key={m.id} className="border-line bg-surface ml-11 max-w-[560px] rounded-md border p-5">
                      <div className="flex items-center gap-2 text-[15px] font-semibold">
                        <Paperclip className="size-4" strokeWidth={2} />
                        Share your project <span className="text-ink-3 font-normal">· optional</span>
                      </div>
                      <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
                        Link a repo, paste a URL, or drop a file and {engineerFirstName} can read the code
                        directly. Or skip it, you can also do this together on a call.
                      </p>
                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={openConnect}
                          className="bg-ink hover:bg-ink/85 rounded-lg px-4 py-2.5 text-[13.5px] font-semibold text-bg transition"
                        >
                          Connect my project
                        </button>
                        <button
                          type="button"
                          onClick={() => dismissCard("share-card")}
                          className="border-line hover:border-ink-3 rounded-lg border px-4 py-2.5 text-[13.5px] font-semibold transition"
                        >
                          Maybe later
                        </button>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={m.id} className="border-line bg-surface ml-11 max-w-[560px] rounded-md border p-5">
                    <div className="flex items-center gap-2 text-[15px] font-semibold">
                      <Phone className="size-4" strokeWidth={2} />
                      Want to hop on a quick call?
                    </div>
                    <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
                      Often faster live, I can share my screen and walk you through connecting your project
                      while we&apos;re at it.
                    </p>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setScheduleOpen(true)}
                        className="border-ink text-ink hover:bg-ink rounded-lg border px-4 py-2.5 text-[13.5px] font-semibold transition hover:text-bg"
                      >
                        Book a call
                      </button>
                      <button
                        type="button"
                        onClick={() => dismissCard("call-card")}
                        className="border-line hover:border-ink-3 rounded-lg border px-4 py-2.5 text-[13.5px] font-semibold transition"
                      >
                        Keep chatting
                      </button>
                    </div>
                  </div>
                );
              })}

              {guest && session.messages.some((m) => m.role === "you") && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start gap-3">
                    <EngineerAvatar engineer={session.engineer} size={32} />
                    <div className="border-line bg-surface max-w-[70%] rounded-md border px-4.5 py-3 text-[14.5px] leading-relaxed">
                      Hey! Read your note, I&apos;ve untangled this kind of thing plenty. What have you tried so far?
                    </div>
                  </div>
                  <div className="ml-11 flex items-center gap-1.5">
                    <Link
                      href="/signup"
                      className="bg-ink hover:bg-ink/85 rounded-full px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap text-bg transition"
                    >
                      Create account
                    </Link>
                    <Link
                      href="/login"
                      className="border-line hover:bg-surface-2 rounded-full border px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap transition"
                    >
                      Log in
                    </Link>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {guest ? (
            <div className="flex justify-center px-4 pt-3 pb-4">
              <div className="border-line bg-surface flex w-full max-w-[720px] items-center justify-between gap-3 rounded-full border py-2.5 pr-2.5 pl-4">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="bg-surface-2 text-ink-2 grid size-7 shrink-0 place-items-center rounded-full">
                    <Lock className="size-3.5" strokeWidth={2} />
                  </span>
                  <span className="truncate text-[13.5px] font-medium">
                    Create your account to start your free chat
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href="/login"
                    className="border-line hover:bg-surface-2 hidden rounded-full border px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap transition sm:block"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-ink hover:bg-ink/85 rounded-full px-4 py-2 text-[12.5px] font-semibold whitespace-nowrap text-bg transition"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          ) : (
          <form onSubmit={submitMessage} className="flex justify-center px-4 pt-3 pb-4">
            <div className="relative w-full max-w-[720px]">
              <div ref={attachMenuRef} className="absolute top-1/2 left-1.5 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setAttachMenuOpen((v) => !v)}
                  aria-label="Attach"
                  className="text-ink-2 hover:bg-surface-2 hover:text-ink grid size-8 place-items-center rounded-full transition"
                >
                  <Paperclip className="size-4" strokeWidth={1.75} />
                </button>
                {attachMenuOpen && (
                  <div className="animate-menu-in border-line bg-surface absolute bottom-[calc(100%+8px)] left-0 z-20 w-56 origin-bottom-left rounded-md border p-1.5 shadow-xl">
                    {snippetMode ? (
                      <form onSubmit={submitSnippet} className="flex flex-col gap-2 p-1.5">
                        <textarea
                          autoFocus
                          value={snippetDraft}
                          onChange={(e) => setSnippetDraft(e.target.value)}
                          rows={4}
                          placeholder="Paste code here..."
                          className="border-line focus:border-brand bg-surface-2 w-full resize-none rounded-lg border p-2.5 font-mono text-[12px] outline-none transition"
                        />
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSnippetMode(false);
                              setSnippetDraft("");
                            }}
                            className="border-line hover:border-ink-3 flex-1 rounded-lg border py-2 text-[12.5px] font-semibold transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-ink hover:bg-ink/85 flex-1 rounded-lg py-2 text-[12.5px] font-semibold text-bg transition"
                          >
                            Share
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={openConnect}
                          className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
                        >
                          <Link2 className="size-3.5" strokeWidth={1.75} />
                          Connect a repo
                        </button>
                        <button
                          type="button"
                          onClick={() => openFilePicker("file")}
                          className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
                        >
                          <Download className="size-3.5 -rotate-90" strokeWidth={1.75} />
                          Upload a file
                        </button>
                        <button
                          type="button"
                          onClick={() => openFilePicker("image")}
                          className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
                        >
                          <ImageIcon className="size-3.5" strokeWidth={1.75} />
                          Share a screenshot
                        </button>
                        <button
                          type="button"
                          onClick={() => setSnippetMode(true)}
                          className="hover:bg-surface-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
                        >
                          <Code className="size-3.5" strokeWidth={1.75} />
                          Paste a snippet
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" onChange={handleFileSelected} className="hidden" />

              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                autoComplete="off"
                placeholder={`Message ${engineerFirstName}...`}
                className="border-line focus:border-brand bg-surface w-full rounded-full border py-3.5 pr-14 pl-11 text-[16px] outline-none transition sm:text-[14.5px]"
              />

              {draft.trim() ? (
                <button
                  type="submit"
                  aria-label="Send"
                  className="bg-ink hover:bg-ink/85 absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-full text-bg transition"
                >
                  <ArrowUp className="size-4" strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleMic}
                  aria-label="Voice input"
                  className={`absolute top-1/2 right-1.5 grid size-9 -translate-y-1/2 place-items-center rounded-full transition ${
                    listening ? "bg-brand text-white" : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <Mic className="size-4" strokeWidth={1.75} />
                </button>
              )}
            </div>
          </form>
          )}
        </div>
      </div>

      <ConnectProjectDrawer open={connectOpen} onClose={closeConnect} />
      <ScheduleModal engineer={scheduleOpen ? session.engineer : null} onClose={() => setScheduleOpen(false)} />
    </div>
  );
}

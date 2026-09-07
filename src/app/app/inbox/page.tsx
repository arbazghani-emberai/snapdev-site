"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  MessageSquareText,
  Phone,
  FileText,
  Download,
  ArrowLeft,
  ArrowUp,
  Paperclip,
  Mic,
  Link2,
  ImageIcon,
  Code,
  Globe,
  Package,
  Plus,
  Lock,
  MoreHorizontal,
  LogOut,
  X,
  type IconComponent,
} from "@/components/icons";
import ScheduleModal from "@/components/ScheduleModal";
import ConnectProjectDrawer from "@/components/ConnectProjectDrawer";
import { useSession } from "@/components/SessionProvider";
import { useProjects } from "@/components/ProjectsProvider";
import { ONLINE_ENGINEERS, type Project } from "@/data/app";
import { ENGINEERS, type Engineer } from "@/data/engineers";

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

function Avatar({ engineer, size }: { engineer: Engineer; size: number }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full"
      style={{ width: size, height: size, backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
    >
      {engineer.img && <Image src={engineer.img} alt="" fill className="object-cover" sizes={`${size}px`} />}
    </span>
  );
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

function InboxPageInner() {
  const searchParams = useSearchParams();
  const {
    session,
    startSession,
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

  // Everyone's a first-time chat here, so there's nothing to pick from - the
  // list is just "is there a live conversation right now or not".
  const [selected, setSelected] = useState(!!session);
  const [scheduleEngineer, setScheduleEngineer] = useState<Engineer | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const projectCountAtOpenRef = useRef(0);

  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [snippetMode, setSnippetMode] = useState(false);
  const [snippetDraft, setSnippetDraft] = useState("");
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [noteDraft, setNoteDraft] = useState("");
  const [attachProjectMenuOpen, setAttachProjectMenuOpen] = useState(false);
  const attachProjectMenuRef = useRef<HTMLDivElement>(null);
  const [kebabOpen, setKebabOpen] = useState(false);
  const kebabRef = useRef<HTMLDivElement>(null);
  const [connecting, setConnecting] = useState(false);

  useClickOutside(attachMenuRef, attachMenuOpen, () => {
    setAttachMenuOpen(false);
    setSnippetMode(false);
    setSnippetDraft("");
  });
  useClickOutside(attachProjectMenuRef, attachProjectMenuOpen, () => setAttachProjectMenuOpen(false));
  useClickOutside(kebabRef, kebabOpen, () => setKebabOpen(false));

  // A guest arriving from the marketing hero (via /chat) hasn't started a
  // session yet - kick one off once from the forwarded params.
  const startedGuestRef = useRef(false);
  useEffect(() => {
    if (startedGuestRef.current) return;
    if (session || searchParams.get("guest") !== "1") return;
    startedGuestRef.current = true;
    const engineerName = searchParams.get("engineer");
    const detail = searchParams.get("detail") ?? "";
    const engineer =
      ENGINEERS.find((e) => e.name === engineerName) ?? ONLINE_ENGINEERS[0] ?? ENGINEERS[0];
    startSession(engineer, undefined, detail, { pending: true });
    // Runs once on mount to consume the redirect's query params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever a new session starts (guest bootstrap or "Get unstuck"), jump
  // the detail pane to it and show a brief "connecting" beat - reset during
  // render, not an effect, per React's "adjusting state when props change" pattern.
  const [prevStartedAt, setPrevStartedAt] = useState(session?.startedAt);
  if (session && session.startedAt !== prevStartedAt) {
    setPrevStartedAt(session.startedAt);
    setSelected(true);
    setConnecting(true);
  }

  useEffect(() => {
    if (!connecting) return;
    const timer = setTimeout(() => setConnecting(false), 1600);
    return () => clearTimeout(timer);
  }, [connecting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [session?.messages.length, selected]);

  const openConnectDrawer = () => {
    projectCountAtOpenRef.current = projects.length;
    setConnectOpen(true);
  };
  const closeConnectDrawer = () => {
    setConnectOpen(false);
    if (session && projects.length > projectCountAtOpenRef.current) attachProject(projects[0]);
  };

  const toggleMic = () => {
    setListening(true);
    setTimeout(() => setListening(false), 1600);
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
  const submitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteDraft.trim()) return;
    addNote(noteDraft);
    setNoteDraft("");
  };
  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  const guest = !!session?.guest;
  const engineerFirstName = session?.engineer.name.split(" ")[0];
  const attachedIds = session
    ? new Set([session.project?.id, ...session.extraProjects.map((p) => p.id)].filter(Boolean))
    : new Set();
  const attachableProjects = projects.filter((p) => !attachedIds.has(p.id));
  const lastLiveMessage = session
    ? [...session.messages].reverse().find((m): m is { id: string; role: "you" | "engineer"; text: string } => m.role === "you" || m.role === "engineer")
    : undefined;

  const showLive = selected && !!session;

  return (
    <div className="bg-surface fixed inset-x-0 bottom-0 top-16 grid grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <div
        className={`border-line-2 flex-col border-b md:flex md:border-r md:border-b-0 ${selected ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4">
          <h1 className="font-heading text-[17px] font-semibold tracking-tight">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {session ? (
            <button
              type="button"
              onClick={() => setSelected(true)}
              className={`flex w-full items-center gap-3 rounded-sm p-3 text-left transition ${
                showLive ? "bg-brand-wash" : "hover:bg-surface-2"
              }`}
            >
              <Avatar engineer={session.engineer} size={36} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13.5px] font-semibold">{session.engineer.name}</span>
                  <span className="text-online flex shrink-0 items-center gap-1 text-[11px] font-semibold">
                    <span className="bg-online size-1.5 rounded-full" />
                    Now
                  </span>
                </span>
                <span className="text-ink-2 block truncate text-[12.5px]">
                  {lastLiveMessage?.text ?? "New conversation"}
                </span>
              </span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="bg-surface-2 text-ink-3 grid size-11 place-items-center rounded-full">
                <MessageSquareText className="size-5" strokeWidth={1.75} />
              </span>
              <div className="text-[14px] font-semibold">No conversations yet</div>
              <p className="text-ink-3 text-[12.5px] leading-relaxed">
                Start a chat and it&apos;ll show up here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail */}
      {showLive && session ? (
        <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col overflow-hidden">
            <div className="border-line-2 flex items-center gap-3 border-b p-4">
              <button
                type="button"
                onClick={() => setSelected(false)}
                aria-label="Back to messages"
                className="text-ink-2 hover:text-ink -ml-1 shrink-0 p-1 md:hidden"
              >
                <ArrowLeft className="size-4" strokeWidth={2} />
              </button>
              <Avatar engineer={session.engineer} size={36} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold">{session.engineer.name}</div>
                <div className="text-ink-2 flex items-center gap-1.5 truncate text-[12px]">
                  <span className="bg-online size-1.5 shrink-0 rounded-full" />
                  <span className="truncate">{guest ? "Online · waiting to start" : "Online · replies in ~2 min"}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setScheduleEngineer(session.engineer)}
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
                      onClick={() => {
                        setKebabOpen(false);
                        endSession();
                        setSelected(false);
                      }}
                      className="text-danger hover:bg-danger-wash flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition"
                    >
                      <LogOut className="size-4" strokeWidth={1.75} />
                      End session
                    </button>
                  </div>
                )}
              </div>
            </div>

            {connecting ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <span className="border-line border-t-brand size-9 animate-spin rounded-full border-[3px]" />
                <p className="text-ink-2 text-[13.5px]">Connecting with {engineerFirstName}...</p>
              </div>
            ) : (
              <>
                <div className="flex flex-1 justify-center overflow-y-auto px-4 py-5">
                  <div className="flex w-full max-w-[640px] flex-col gap-3.5">
                    <div className="text-ink-3 text-center text-[12.5px]">
                      Today · your first session is on us, up to 30 min
                    </div>

                    {session.messages.map((m) => {
                      if (m.role === "you") {
                        return (
                          <div key={m.id} className="flex justify-end">
                            <div className="bg-brand-wash text-ink max-w-[75%] rounded-md px-4 py-2.5 text-[14px] leading-relaxed">
                              {m.text}
                            </div>
                          </div>
                        );
                      }
                      if (m.role === "engineer") {
                        return (
                          <div key={m.id} className="flex items-start gap-2.5">
                            <Avatar engineer={session.engineer} size={28} />
                            <div className="border-line bg-surface max-w-[75%] rounded-md border px-4 py-2.5 text-[14px] leading-relaxed">
                              {m.text}
                            </div>
                          </div>
                        );
                      }
                      if (m.role === "share-card") {
                        return (
                          <div key={m.id} className="border-line bg-surface ml-9 max-w-[520px] rounded-md border p-5">
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
                                onClick={openConnectDrawer}
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
                        <div key={m.id} className="border-line bg-surface ml-9 max-w-[520px] rounded-md border p-5">
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
                              onClick={() => setScheduleEngineer(session.engineer)}
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
                        <div className="flex items-start gap-2.5">
                          <Avatar engineer={session.engineer} size={28} />
                          <div className="border-line bg-surface max-w-[75%] rounded-md border px-4 py-2.5 text-[14px] leading-relaxed">
                            Hey! Read your note, I&apos;ve untangled this kind of thing plenty. What have you tried
                            so far?
                          </div>
                        </div>
                        <div className="ml-9 flex items-center gap-1.5">
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
                    <div className="border-line bg-surface flex w-full max-w-[640px] items-center justify-between gap-3 rounded-full border py-2.5 pr-2.5 pl-4">
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
                    <div className="relative w-full max-w-[640px]">
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
                                  onClick={() => {
                                    openConnectDrawer();
                                    setAttachMenuOpen(false);
                                  }}
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
              </>
            )}
          </div>

          {/* Session modules */}
          <div
            className={`border-line-2 flex flex-col gap-5 overflow-y-auto border-t p-5 lg:border-t-0 lg:border-l ${
              guest ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {guest && (
              <p className="text-ink-3 text-[12px] leading-relaxed">
                Create an account to use notes, project context, and the rest of the chat features.
              </p>
            )}

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
                          onClick={openConnectDrawer}
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
                    onClick={openConnectDrawer}
                    className="border-ink-3 text-ink hover:border-brand hover:text-brand w-full rounded-lg border border-dashed py-2 text-[12.5px] font-semibold transition"
                  >
                    + Connect project
                  </button>
                </div>
              )}
            </div>

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

            <div className="border-line bg-surface rounded-lg border p-4.5">
              <div className="mb-3 text-[13px] font-semibold">Book a call</div>
              {session.followup ? (
                <div className="flex items-center justify-between gap-2">
                  <p className="text-ink-2 text-[12.5px] leading-relaxed">
                    Booked · Tomorrow, 10:00 ·{" "}
                    <span className="text-ink font-medium">{session.followup.length} min</span>
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
        </div>
      ) : (
        <div className="hidden flex-1 place-items-center p-10 text-center md:grid">
          <div>
            <div className="text-[15px] font-semibold">No conversations yet</div>
            <p className="text-ink-3 mt-1 text-[13px]">Start a chat and it&apos;ll show up here.</p>
          </div>
        </div>
      )}

      <ScheduleModal engineer={scheduleEngineer} onClose={() => setScheduleEngineer(null)} />
      <ConnectProjectDrawer open={connectOpen} onClose={closeConnectDrawer} />
    </div>
  );
}

export default function InboxPage() {
  return (
    <Suspense fallback={null}>
      <InboxPageInner />
    </Suspense>
  );
}

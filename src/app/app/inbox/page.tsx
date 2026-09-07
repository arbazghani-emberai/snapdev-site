"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Search,
  MessageSquareText,
  Phone,
  FileText,
  Hammer,
  Download,
  ArrowLeft,
  ArrowUp,
  Paperclip,
  Mic,
  Link2,
  ImageIcon,
  Code,
} from "@/components/icons";
import ScheduleModal from "@/components/ScheduleModal";
import ConnectProjectDrawer from "@/components/ConnectProjectDrawer";
import { useSession } from "@/components/SessionProvider";
import { SESSION_LOG, type LoggedSession } from "@/data/sessions";
import type { Engineer } from "@/data/engineers";

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

export default function InboxPage() {
  const { startSession } = useSession();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<LoggedSession | null>(null);
  const [rebookEngineer, setRebookEngineer] = useState<Engineer | null>(null);
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [snippetMode, setSnippetMode] = useState(false);
  const [snippetDraft, setSnippetDraft] = useState("");
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useClickOutside(attachMenuRef, attachMenuOpen, () => {
    setAttachMenuOpen(false);
    setSnippetMode(false);
    setSnippetDraft("");
  });

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
    if (file) setDraft((d) => (d ? `${d} ` : "") + `📎 ${file.name}`);
    e.target.value = "";
  };

  const submitSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    const value = snippetDraft.trim();
    if (!value) return;
    setDraft((d) => (d ? `${d}\n\n` : "") + "```\n" + value + "\n```");
    setSnippetDraft("");
    setSnippetMode(false);
    setAttachMenuOpen(false);
  };

  const q = query.toLowerCase();
  const filteredLog = SESSION_LOG.filter(
    (s) => s.engineer.name.toLowerCase().includes(q) || s.topic.toLowerCase().includes(q),
  );

  const active = selected;

  // Reset the draft during render (not an effect) whenever the selected
  // session log changes, so leftover text doesn't carry over between them.
  const [prevActiveId, setPrevActiveId] = useState(active?.id);
  if (active?.id !== prevActiveId) {
    setPrevActiveId(active?.id);
    setDraft("");
  }

  return (
    <div className="bg-surface fixed inset-x-0 bottom-0 top-16 grid grid-cols-1 overflow-hidden md:grid-cols-[320px_1fr]">
      {/* Session log list */}
      <div
        className={`border-line-2 flex-col border-b md:flex md:border-r md:border-b-0 ${selected ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4">
          <div className="border-line focus-within:border-ink-3 flex items-center gap-2 rounded-full border p-3">
            <Search className="text-ink-3 size-4 shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search session logs"
              className="w-full text-[13.5px] outline-none placeholder:text-ink-3"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {filteredLog.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="bg-surface-2 text-ink-3 grid size-11 place-items-center rounded-full">
                <MessageSquareText className="size-5" strokeWidth={1.75} />
              </span>
              <div className="text-[14px] font-semibold">No session logs found</div>
              <p className="text-ink-3 text-[12.5px] leading-relaxed">Try a different search.</p>
            </div>
          ) : (
            filteredLog.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s)}
                className={`flex w-full items-center gap-3 rounded-sm p-3 text-left transition ${
                  active?.id === s.id ? "bg-brand-wash" : "hover:bg-surface-2"
                }`}
              >
                <Avatar engineer={s.engineer} size={36} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="truncate text-[13.5px] font-semibold">{s.engineer.name}</span>
                    <span className="text-ink-3 shrink-0 text-[11px]">{s.date}</span>
                  </span>
                  <span className="text-ink-2 block truncate text-[12.5px]">{s.topic}</span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail: read-only chat on one side, session info on the other */}
      {!active ? (
        <div className="hidden flex-1 place-items-center p-10 text-center md:grid">
          <div>
            <div className="text-[15px] font-semibold">Select a session log</div>
            <p className="text-ink-3 mt-1 text-[13px]">Pick one on the left to see how it went.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col overflow-hidden">
            <div className="border-line-2 flex items-center gap-3 border-b p-4">
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Back to session logs"
                className="text-ink-2 hover:text-ink -ml-1 shrink-0 p-1 md:hidden"
              >
                <ArrowLeft className="size-4" strokeWidth={2} />
              </button>
              <Avatar engineer={active.engineer} size={36} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold">{active.topic}</div>
                <div className="text-ink-2 truncate text-[12px]">
                  with {active.engineer.name} · {active.date} · {active.duration}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRebookEngineer(active.engineer)}
                className="border-line hover:bg-surface-2 flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition"
              >
                <Phone className="size-3" strokeWidth={2} />
                Book a call
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3.5">
                {active.transcript.map((m, i) =>
                  m.role === "you" ? (
                    <div key={i} className="flex justify-end">
                      <div className="bg-brand-wash text-ink max-w-[75%] rounded-md px-4 py-2.5 text-[14px] leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="flex items-start gap-2.5">
                      <Avatar engineer={active.engineer} size={28} />
                      <div className="border-line bg-surface max-w-[75%] rounded-md border px-4 py-2.5 text-[14px] leading-relaxed">
                        {m.text}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!draft.trim()) return;
                startSession(active.engineer, undefined, draft.trim());
                setDraft("");
              }}
              className="flex justify-center px-4 pt-3 pb-4"
            >
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
                              setConnectOpen(true);
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
                  placeholder={`Message ${active.engineer.name}...`}
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

            <ConnectProjectDrawer open={connectOpen} onClose={() => setConnectOpen(false)} />
          </div>

          <div className="border-line-2 flex flex-col gap-5 overflow-y-auto border-t p-5 lg:border-t-0 lg:border-l">
            <div>
              <div className="text-ink-3 mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase">
                <FileText className="size-3.5" strokeWidth={2} />
                Notes
              </div>
              <ul className="flex flex-col gap-1.5">
                {active.noteTexts.map((n, i) => (
                  <li key={i} className="text-ink-2 text-[13px] leading-relaxed">
                    {n}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-ink-3 mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] uppercase">
                <Hammer className="size-3.5" strokeWidth={2} />
                Diffs
              </div>
              <ul className="flex flex-col gap-1.5">
                {active.diffFiles.map((d) => (
                  <li key={d.file} className="text-[13px] leading-relaxed">
                    <span className="font-mono text-[12px]">{d.file}</span>
                    <span className="text-ink-3 block">{d.stat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {active.artifacts.length > 0 && (
              <div>
                <div className="text-ink-3 mb-2 text-[11px] font-bold tracking-[0.06em] uppercase">Artifacts</div>
                <div className="flex flex-wrap gap-2">
                  {active.artifacts.map((a) => (
                    <span
                      key={a}
                      className="border-line bg-surface-2 text-ink-2 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium"
                    >
                      <Download className="size-3.5" strokeWidth={2} />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ScheduleModal engineer={rebookEngineer} onClose={() => setRebookEngineer(null)} />
    </div>
  );
}

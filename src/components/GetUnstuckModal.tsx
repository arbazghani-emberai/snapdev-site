"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bug,
  Compass,
  Hammer,
  Rocket,
  Sparkles,
  ChevronDown,
  FolderGit2,
  type IconComponent,
} from "@/components/icons";
import Modal from "./Modal";
import { useProjects } from "./ProjectsProvider";
import { useSession } from "./SessionProvider";
import { INTENT_OPTIONS, ONLINE_ENGINEERS } from "@/data/app";
import type { Engineer } from "@/data/engineers";

const ICONS: Record<string, IconComponent> = { debug: Bug, plan: Compass, build: Hammer, deploy: Rocket };

function ProjectSelect({
  projectId,
  onChange,
  projects,
}: {
  projectId: string;
  onChange: (id: string) => void;
  projects: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="border-line hover:border-ink-3 flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="bg-surface-2 text-ink-2 grid size-9 shrink-0 place-items-center rounded-lg">
            {selected ? <FolderGit2 className="size-4" strokeWidth={2} /> : <Sparkles className="size-4" strokeWidth={2} />}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold">
              {selected ? selected.name : "Just an idea for now"}
            </span>
            <span className="text-ink-2 block truncate text-[12.5px] leading-snug">
              {selected ? "Attached to this session" : "Nothing to connect yet"}
            </span>
          </span>
        </span>
        <ChevronDown className={`text-ink-3 size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {open && (
        <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+6px)] left-0 z-20 w-full origin-top rounded-xl border p-1.5 shadow-xl">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                onChange(p.id);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition ${
                p.id === projectId ? "bg-brand-wash" : "hover:bg-surface-2"
              }`}
            >
              <FolderGit2 className="text-ink-2 size-3.5 shrink-0" strokeWidth={2} />
              <span className="truncate">{p.name}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onChange("idea");
              setOpen(false);
            }}
            className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition ${
              projectId === "idea" ? "bg-brand-wash" : "hover:bg-surface-2"
            }`}
          >
            <Sparkles className="text-ink-2 size-3.5 shrink-0" strokeWidth={2} />
            Just an idea for now
          </button>
        </div>
      )}
    </div>
  );
}

export default function GetUnstuckModal({
  open,
  onClose,
  initialProjectId,
  initialEngineer,
}: {
  open: boolean;
  onClose: () => void;
  /** Preselects a project, e.g. when opened from that project's "Start session" button. */
  initialProjectId?: string;
  /** Skips auto-matching, e.g. when opened from an engineer's own "Start session" button. */
  initialEngineer?: Engineer;
}) {
  const [intent, setIntent] = useState<string | null>(null);
  const [project, setProject] = useState<string>("idea");
  const [message, setMessage] = useState("");
  const { projects } = useProjects();
  const { startSession } = useSession();
  const router = useRouter();

  // Re-sync the preselected project every time the modal is opened, since
  // this instance stays mounted across opens (Modal just renders null while
  // closed) rather than remounting with fresh initial state.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProject(initialProjectId ?? "idea");
  }, [open, initialProjectId]);

  const offlineEngineerName = initialEngineer && initialEngineer.status !== "Online" ? initialEngineer.name : null;
  const canSubmit = intent !== null && message.trim() !== "" && !offlineEngineerName;

  const close = () => {
    onClose();
    setTimeout(() => {
      setIntent(null);
      setProject("idea");
      setMessage("");
    }, 200);
  };

  // Hands off to the Messages screen, where the live conversation actually
  // lives - there's no separate full-screen chat surface anymore.
  const submit = () => {
    const engineer = initialEngineer ?? ONLINE_ENGINEERS[0];
    const selectedProject = projects.find((p) => p.id === project);
    startSession(engineer, selectedProject, message);
    close();
    router.push("/app/inbox");
  };

  return (
    <Modal open={open} onClose={close} className="max-w-lg">
      {initialEngineer && (
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="relative size-8 shrink-0 overflow-hidden rounded-full"
            style={{ backgroundColor: `oklch(0.90 0.045 ${initialEngineer.hue})` }}
          >
            {initialEngineer.img && (
              <Image src={initialEngineer.img} alt="" fill className="object-cover" sizes="32px" />
            )}
          </span>
          <div className="leading-tight">
            <div className="text-ink-3 text-[10px] font-bold tracking-[0.08em] uppercase">Meet with</div>
            <div className="text-[13.5px] font-semibold">{initialEngineer.name}</div>
          </div>
        </div>
      )}

      {offlineEngineerName && (
        <p className="bg-surface-2 text-ink-2 mb-4 rounded-lg px-3.5 py-2.5 text-[12.5px] leading-relaxed">
          {offlineEngineerName} is offline right now, so a chat session can&apos;t start immediately. Schedule a
          time with them instead, or check back once they&apos;re online.
        </p>
      )}
      <h2 className="font-heading text-[24px] font-semibold tracking-tight">
        What can we help with?
      </h2>
      <p className="text-ink-2 mt-1.5 text-[14px] leading-relaxed">
        Pick what you need and the project, and we&apos;ll line up the engineer who fits fastest.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {INTENT_OPTIONS.map((opt) => {
          const Icon = ICONS[opt.icon];
          const selected = intent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setIntent(opt.id)}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-md border px-4 py-4 text-center text-[14px] font-semibold transition ${
                selected ? "border-ink" : "border-line hover:border-ink-3"
              }`}
            >
              <Icon className="size-5" strokeWidth={2} />
              {opt.label}
            </button>
          );
        })}
      </div>

      <label className="text-ink-3 mt-6 block text-[12.5px] font-semibold tracking-[0.04em] uppercase">
        On this project
      </label>
      <div className="mt-3">
        <ProjectSelect projectId={project} onChange={setProject} projects={projects} />
      </div>

      {project === "idea" && (
        <p className="bg-surface-2 text-ink-2 mt-3 rounded-lg px-3.5 py-2.5 text-[12.5px] leading-relaxed">
          No project attached. Your engineer starts from whatever you tell them.
        </p>
      )}

      <label className="text-ink-3 mt-6 block text-[12.5px] font-semibold tracking-[0.04em] uppercase">
        What&apos;s going on?
      </label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder={`e.g. "Login works locally but breaks after I deploy to Vercel."`}
        className="border-line focus:border-brand mt-3 w-full resize-y rounded-md border p-3.5 text-[14px] leading-relaxed outline-none transition"
      />

      <button
        type="button"
        disabled={!canSubmit}
        onClick={submit}
        className="bg-brand hover:bg-brand-ink disabled:bg-surface-2 disabled:text-ink-3 mt-6 w-full rounded-full py-3.5 text-[15px] font-semibold text-white transition disabled:cursor-not-allowed"
      >
        {initialEngineer ? "Start session" : "Connect me with an engineer"}
      </button>
    </Modal>
  );
}

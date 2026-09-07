"use client";

import { useEffect, useRef, useState } from "react";
import {
  Link2,
  Globe,
  Package,
  ArrowLeft,
  Check,
  ChevronDown,
  type IconComponent,
} from "@/components/icons";
import Drawer from "./Drawer";
import { useProjects } from "./ProjectsProvider";
import type { Project, ProjectStatus } from "@/data/app";

type Method = "github" | "url" | "upload";

const METHODS: { id: Method; icon: IconComponent; label: string; blurb: string }[] = [
  {
    id: "github",
    icon: Link2,
    label: "Read a GitHub repo",
    blurb: "Best signal. We read your manifests, never your code.",
  },
  {
    id: "url",
    icon: Globe,
    label: "Paste a live URL",
    blurb: "We read the page to work out what it's built with.",
  },
  {
    id: "upload",
    icon: Package,
    label: "Upload a zip or .html",
    blurb: "Processed in memory and discarded. Your code is never stored.",
  },
];

const STEPS = ["Source", "Details", "Review"];

/** Stand-in for real stack detection, keyed off how the project came in. */
const DETECTED_STACK: Record<Method, string[]> = {
  github: ["Next.js", "React", "TypeScript", "Postgres"],
  url: ["React", "Tailwind", "Vercel"],
  upload: ["HTML", "CSS", "JavaScript"],
};

/** The extra artifacts we claim to have scanned, alongside the source itself. */
const SCAN_SOURCES: Record<Method, string> = {
  github: "package.json, README.md",
  url: "meta tags, page source",
  upload: "package.json",
};

const FIELD_LABEL: Record<Method, string> = {
  github: "Repository",
  url: "Live URL",
  upload: "File",
};

const PLACEHOLDER: Record<Method, string> = {
  github: "github.com/you/your-repo",
  url: "your-app.vercel.app",
  upload: "",
};

const SOURCE_LABEL: Record<Method, Project["source"]> = {
  github: "GitHub",
  url: "Live URL",
  upload: "Upload",
};

const STATUS_OPTIONS: { value: ProjectStatus; dot: string }[] = [
  { value: "New", dot: "bg-online" },
  { value: "Active", dot: "bg-online" },
  { value: "Paused", dot: "bg-ink-3" },
];

/** Pulls a sensible project name out of whatever the user pasted. */
function deriveName(method: Method, value: string) {
  if (method === "upload") return value || "Uploaded project";
  const last = value.trim().replace(/\/+$/, "").split("/").pop() ?? "";
  const cleaned = last.replace(/\.(git|zip|html)$/i, "").replace(/^www\./, "");
  return cleaned || "New project";
}

function joinStack(stack: string[]) {
  if (stack.length <= 1) return stack[0] ?? "a modern stack";
  return `${stack.slice(0, -1).join(", ")} and ${stack[stack.length - 1]}`;
}

/** Stand-in for a generated project summary, referencing the source and stack. */
function buildSummary(method: Method, value: string, stack: string[]) {
  const stackText = joinStack(stack);
  if (method === "github") {
    return `A project cloned from ${value || "your repo"}. Uses ${stackText}.`;
  }
  if (method === "url") {
    return `A live site at ${value || "your URL"}. Uses ${stackText}.`;
  }
  return `An uploaded project${value ? ` (${value})` : ""}. Uses ${stackText}.`;
}

function StatusSelect({
  value,
  onChange,
}: {
  value: ProjectStatus;
  onChange: (v: ProjectStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = STATUS_OPTIONS.find((o) => o.value === value) ?? STATUS_OPTIONS[0];

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
        className="border-line focus:border-brand flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition"
      >
        <span className="flex items-center gap-2">
          <span className={`size-1.5 rounded-full ${current.dot}`} />
          {current.value}
        </span>
        <ChevronDown className={`text-ink-3 size-4 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2} />
      </button>

      {open && (
        <div className="animate-menu-in border-line bg-surface absolute top-[calc(100%+6px)] left-0 z-20 w-full origin-top rounded-lg border p-1 shadow-xl">
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`hover:bg-surface-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13.5px] font-medium transition ${
                o.value === value ? "bg-brand-wash" : ""
              }`}
            >
              <span className={`size-1.5 rounded-full ${o.dot}`} />
              {o.value}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConnectProjectDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method | null>(null);
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [techStack, setTechStack] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("New");
  const [done, setDone] = useState(false);
  const { addProject } = useProjects();

  const close = () => {
    onClose();
    // Reset after the drawer has animated out, so the reset isn't visible.
    setTimeout(() => {
      setStep(0);
      setMethod(null);
      setValue("");
      setName("");
      setSummary("");
      setTechStack("");
      setStatus("New");
      setDone(false);
    }, 250);
  };

  // Auto-dismiss the confirmation screen instead of waiting on a "Done" click.
  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(close, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  const pickMethod = (id: Method) => {
    setMethod(id);
    setValue("");
    setStep(1);
  };

  const goReview = () => {
    if (!method) return;
    const stack = DETECTED_STACK[method];
    setName(deriveName(method, value));
    setSummary(buildSummary(method, value, stack));
    setTechStack(stack.join(" · "));
    setStatus("New");
    setStep(2);
  };

  const confirm = () => {
    if (!method) return;
    const stack = techStack
      .split(/[·,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    addProject({
      name: name.trim() || deriveName(method, value),
      source: SOURCE_LABEL[method],
      stack: stack.length > 0 ? stack : DETECTED_STACK[method],
      status,
    });
    setDone(true);
  };

  const canContinue =
    step === 0
      ? method !== null
      : step === 1
        ? method === "upload" || value.trim() !== ""
        : name.trim() !== "";

  if (done) {
    return (
      <Drawer open={open} onClose={close}>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="bg-online/15 text-online grid size-14 place-items-center rounded-full">
            <Check className="size-6" strokeWidth={2.5} />
          </div>
          <h2 className="font-heading mt-5 text-[22px] font-semibold tracking-tight">
            {name || "Project"} connected
          </h2>
          <p className="text-ink-2 mt-2 max-w-[34ch] text-[14.5px] leading-relaxed">
            We&apos;ll use its stack to match you with the right engineer automatically.
          </p>
        </div>
      </Drawer>
    );
  }

  return (
    <Drawer open={open} onClose={close}>
      <div className="px-6 pt-5">
        <h2 className="font-heading pr-14 text-[21px] leading-tight font-semibold tracking-tight">
          {step === 0
            ? "Bring in what you've built"
            : step === 1
              ? method === "upload"
                ? "Choose your file"
                : `Point us at it`
              : "Check this looks right"}
        </h2>

        <div className="bg-surface-2 mt-4 flex w-full overflow-hidden rounded-full">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-1 flex-1 border-r-2 border-surface last:border-r-0 transition-colors duration-300 ${
                i <= step ? "bg-ink" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>

      {/* key re-mounts the body per step so each panel animates in. */}
      <div key={step} className="animate-step-in flex-1 overflow-y-auto px-6 py-5">
        {step === 0 && (
          <div className="flex h-full flex-col">
            <p className="text-ink-2 shrink-0 text-[13.5px] leading-relaxed">
              We&apos;ll use the name, summary, and stack to match you with the right engineer.
            </p>
            <div className="mt-4 flex flex-1 flex-col gap-2.5">
              {METHODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => pickMethod(m.id)}
                  className={`group flex flex-1 flex-col items-center justify-center gap-2.5 rounded-xl border p-4 text-center transition ${
                    method === m.id
                      ? "border-brand bg-brand-wash"
                      : "border-line hover:border-ink-3 hover:bg-surface-2"
                  }`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-lg transition ${
                      method === m.id ? "bg-brand text-white" : "bg-surface-2 text-ink-2"
                    }`}
                  >
                    <m.icon className="size-[18px]" strokeWidth={2} />
                  </span>
                  <span className="max-w-[26ch]">
                    <span className="block text-[14px] font-semibold">{m.label}</span>
                    <span className="text-ink-2 block text-[12.5px] leading-snug">{m.blurb}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && method && (
          <>
            <label className="text-ink-3 block text-[12px] font-semibold tracking-[0.04em] uppercase">
              {FIELD_LABEL[method]}
            </label>

            {method === "upload" ? (
              <label className="border-ink-3 hover:bg-surface-2 mt-2 flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center transition">
                <Package className="text-ink-3 size-6" strokeWidth={1.5} />
                <span className="text-ink-2 text-[13px] font-medium">
                  {value || "Click to choose a .zip or .html file"}
                </span>
                <input
                  type="file"
                  accept=".zip,.html"
                  className="hidden"
                  onChange={(e) => setValue(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={PLACEHOLDER[method]}
                autoFocus
                className="border-line focus:border-brand mt-2 w-full rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition"
              />
            )}

            <p className="text-ink-3 mt-3 text-[12.5px] leading-relaxed">
              {method === "github"
                ? "Public repos work straight away. For private ones, connect GitHub in Settings first."
                : method === "url"
                  ? "Any reachable page works, staging URLs included."
                  : "Nothing is written to disk, the file is parsed and dropped."}
            </p>
          </>
        )}

        {step === 2 && method && (
          <>
            <div className="text-online flex items-center gap-2 text-[14.5px] font-semibold">
              <Check className="size-4" strokeWidth={2.5} />
              Here&apos;s what we found. Fix anything that&apos;s off.
            </div>
            <p className="text-ink-3 mt-1.5 text-[12.5px]">
              Read from {value || FIELD_LABEL[method].toLowerCase()}, {SCAN_SOURCES[method]}
            </p>

            <label className="text-ink mt-5 block text-[13px] font-semibold">Project name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-line focus:border-brand mt-2 w-full rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition"
            />

            <label className="text-ink mt-4 block text-[13px] font-semibold">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="border-line focus:border-brand mt-2 w-full resize-y rounded-lg border px-3.5 py-2.5 text-[14px] leading-relaxed outline-none transition"
            />

            <label className="text-ink mt-4 block text-[13px] font-semibold">Tech stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="border-line focus:border-brand mt-2 w-full rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition"
            />

            <label className="text-ink mt-4 block text-[13px] font-semibold">Status</label>
            <div className="mt-2">
              <StatusSelect value={status} onChange={setStatus} />
            </div>

            <label className="text-ink mt-4 block text-[13px] font-semibold">
              {FIELD_LABEL[method]}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border-line focus:border-brand mt-2 w-full rounded-lg border px-3.5 py-2.5 text-[14px] outline-none transition"
            />
          </>
        )}
      </div>

      {step > 0 && (
        <div className="border-line-2 flex items-center gap-3 border-t p-5">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="text-ink-2 hover:bg-surface-2 flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-[13.5px] font-medium transition"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} />
            Back
          </button>
          <button
            type="button"
            disabled={!canContinue}
            onClick={() => {
              if (step === 1) goReview();
              else confirm();
            }}
            className="bg-ink hover:bg-ink/85 disabled:bg-surface-2 disabled:text-ink-3 flex-1 rounded-full py-2.5 text-[14px] font-semibold text-bg transition disabled:cursor-not-allowed"
          >
            {step === 2 ? "Connect project" : "Continue"}
          </button>
        </div>
      )}
    </Drawer>
  );
}

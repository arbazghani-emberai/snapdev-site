"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import {
  Plus,
  ArrowRight,
  Link2,
  Globe,
  Package,
  type IconComponent,
} from "@/components/icons";
import Reveal from "@/components/Reveal";
import GetUnstuckModal from "@/components/GetUnstuckModal";
import ConnectProjectDrawer from "@/components/ConnectProjectDrawer";
import ScheduleModal from "@/components/ScheduleModal";
import { useProjects } from "@/components/ProjectsProvider";
import { ENGINEERS, type Engineer } from "@/data/engineers";
import type { Project } from "@/data/app";
import {
  BUILDER_TOOLS,
  STUCK_POINTS,
  readOnboardingAnswers,
  type OnboardingAnswers,
} from "@/data/onboarding";

/** Matches the source icons offered in the connect-a-project drawer. */
const SOURCE_ICON: Record<Project["source"], IconComponent> = {
  GitHub: Link2,
  "Live URL": Globe,
  Upload: Package,
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** How well an engineer's skills line up with a project's stack, 0 when there's no project. */
function matchScore(engineer: Engineer, project: Project | undefined) {
  if (!project || project.stack.length === 0) return 0;
  const stack = project.stack.map((s) => s.toLowerCase());
  return engineer.skills.filter((s) => stack.includes(s.toLowerCase())).length;
}

/** 1 when the engineer's capability matches what the signup onboarding said
 *  the visitor was stuck on, so they float to the top before a project (with
 *  its own, more specific stack match) has been connected. */
function stuckPointScore(engineer: Engineer, capability: string | undefined) {
  return capability && engineer.capability === capability ? 1 : 0;
}

function EngineerCard({
  engineer,
  onGetUnstuck,
  onBookCall,
}: {
  engineer: Engineer;
  onGetUnstuck: () => void;
  onBookCall: () => void;
}) {
  const {
    name,
    role,
    status,
    skills,
    img,
    hue,
    specialty,
    capability,
    cardRating,
    cardReviewCount,
    cardSessionCount,
  } = engineer;
  const hasReviews = cardRating !== undefined && cardReviewCount !== undefined;
  const online = status === "Online";

  return (
    <div className="border-line bg-surface flex flex-col overflow-hidden rounded-lg border">
      <div
        className="relative aspect-[0.93] overflow-hidden"
        style={{
          backgroundColor: `oklch(0.90 0.045 ${hue})`,
          color: `oklch(0.32 0.05 ${hue})`,
        }}
      >
        {img ? (
          <Image
            src={img}
            alt=""
            width={290}
            height={290}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-[44px] font-semibold tracking-tight">
            {initials(name)}
          </span>
        )}
        <span className="bg-surface/95 text-ink-3 absolute bottom-2.5 left-2.5 flex max-w-[calc(100%-20px)] items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap shadow-sm">
          {hasReviews ? (
            <>
              <span className="text-star">★</span>
              <span className="text-ink">{cardRating!.toFixed(1)}</span>
              <span className="text-ink-2 truncate font-normal">
                ({cardReviewCount}) · {cardSessionCount} sessions
              </span>
            </>
          ) : (
            "No reviews yet"
          )}
        </span>
        <span
          className="bg-surface/95 absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full shadow-sm"
          title="Verified"
        >
          <BadgeCheck
            className="text-brand size-[18px]"
            fill="currentColor"
            stroke="white"
            strokeWidth={2}
          />
        </span>
      </div>

      <div className="p-4">
        <div className="font-heading text-[20px] leading-tight font-semibold tracking-tight">
          {name}
        </div>

        <div className="mt-0.5 flex items-center gap-2.5 text-[12.5px]">
          <span className="text-ink-2 truncate font-medium">{role}</span>
          <span aria-hidden="true" className="bg-line h-3.5 w-px shrink-0" />
          <span className="text-ink-2 flex shrink-0 items-center gap-1.5 font-medium">
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${online ? "bg-online" : "bg-ink-3"}`}
            />
            {status}
          </span>
        </div>

        {specialty && (
          <p className="text-ink-2 mt-1 text-[13px] leading-snug">
            {specialty}
          </p>
        )}

        <div className="mt-2.5 flex flex-nowrap items-center gap-1.5 overflow-hidden">
          {skills[0] && (
            <span className="border-line bg-surface text-ink-2 shrink-0 rounded-full border px-3 py-1 text-[12px] font-medium whitespace-nowrap">
              {skills[0]}
            </span>
          )}
          {capability && (
            <span className="border-line bg-surface text-ink-2 shrink-0 truncate rounded-full border px-3 py-1 text-[12px] font-medium">
              {capability}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto flex gap-2 px-4 pb-4">
        <button
          type="button"
          onClick={onBookCall}
          className="border-line hover:bg-surface-2 flex-1 rounded-full border py-2.5 text-[13px] font-semibold transition"
        >
          Book a call
        </button>
        <button
          type="button"
          onClick={onGetUnstuck}
          className="bg-brand hover:bg-brand-ink flex-1 rounded-full py-2.5 text-[13px] font-semibold text-white transition"
        >
          Get unstuck
        </button>
      </div>
    </div>
  );
}

export default function AppHome() {
  const { projects, addProject } = useProjects();
  const [selectedId, setSelectedId] = useState<string | undefined>(
    projects[0]?.id,
  );
  const [connectOpen, setConnectOpen] = useState(false);
  const [unstuckOpen, setUnstuckOpen] = useState(false);
  const [unstuckEngineer, setUnstuckEngineer] = useState<Engineer | undefined>(
    undefined,
  );
  const [bookEngineer, setBookEngineer] = useState<Engineer | null>(null);

  // What the signup onboarding wizard captured, if this visitor went through
  // it - read once on mount (sessionStorage isn't available during SSR, so
  // the lazy initializer just falls back to null there, same trick the guest
  // session helpers use).
  const [onboarding] = useState<OnboardingAnswers | null>(() =>
    readOnboardingAnswers(),
  );
  const stuckPoint = STUCK_POINTS.find(
    (p) => p.id === onboarding?.stuckPointId,
  );
  const tools = BUILDER_TOOLS.filter((t) => onboarding?.toolIds.includes(t.id));
  const toolsLabel =
    tools.length <= 1
      ? tools[0]?.label
      : `${tools
          .slice(0, -1)
          .map((t) => t.label)
          .join(", ")} and ${tools[tools.length - 1].label}`;

  // The newest project (ProjectsProvider prepends on add) is always
  // projects[0] - that also covers the "exactly one project" case, since
  // there's nothing else it could be. Projects are never removed, so the
  // only thing that can change the first id is a fresh add; re-preselect it
  // during render (not an effect) per React's "adjusting state when props
  // change" pattern, the same one AppHeader uses for its route reset.
  const [prevFirstId, setPrevFirstId] = useState(projects[0]?.id);
  if (projects[0]?.id !== prevFirstId) {
    setPrevFirstId(projects[0]?.id);
    setSelectedId(projects[0]?.id);
  }

  const selectedProject = projects.find((p) => p.id === selectedId);

  const suitableEngineers = useMemo(() => {
    return [...ENGINEERS].sort((a, b) => {
      const scoreDiff =
        matchScore(b, selectedProject) - matchScore(a, selectedProject);
      if (scoreDiff !== 0) return scoreDiff;
      // Once a project's connected, its stack is a stronger signal than the
      // onboarding answer from signup - only break ties with it here.
      const stuckDiff =
        stuckPointScore(b, stuckPoint?.capability) -
        stuckPointScore(a, stuckPoint?.capability);
      if (stuckDiff !== 0) return stuckDiff;
      const onlineDiff =
        Number(b.status === "Online") - Number(a.status === "Online");
      if (onlineDiff !== 0) return onlineDiff;
      return (b.cardRating ?? 0) - (a.cardRating ?? 0);
    });
  }, [selectedProject, stuckPoint]);

  const topOnline = suitableEngineers.find((e) => e.status === "Online");

  const openGetUnstuck = (engineer?: Engineer) => {
    setUnstuckEngineer(engineer);
    setUnstuckOpen(true);
  };

  return (
    <div className="pb-28">
      <div className="relative left-1/2 w-screen -translate-x-1/2 lg:flex lg:items-start">
        {/* left menu */}
        <Reveal className="border-line-2 px-3.5 py-3.5 lg:sticky lg:top-16 lg:w-[280px] lg:shrink-0 lg:border-r xl:w-[320px]">
          <h2 className="text-ink-3 px-1 text-[11px] font-bold tracking-[0.06em] uppercase">
            Projects
          </h2>

          <div className="mt-3 flex flex-col gap-1">
            {projects.map((p) => {
              const SourceIcon = SOURCE_ICON[p.source];
              const active = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`flex items-center gap-2.5 rounded-lg p-2.5 text-left transition ${
                    active ? "bg-surface-2" : "hover:bg-surface-2"
                  }`}
                >
                  <span className="bg-surface text-ink-2 border-line grid size-8 shrink-0 place-items-center rounded-md border">
                    <SourceIcon className="size-3.5" strokeWidth={2} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[13.5px] ${active ? "text-ink font-semibold" : "text-ink-2 font-medium"}`}
                    >
                      {p.name}
                    </span>
                    <span className="text-ink-3 flex items-center gap-1 text-[11.5px]">
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${p.status === "Paused" ? "bg-ink-3" : "bg-online"}`}
                      />
                      {p.status}
                    </span>
                  </span>
                </button>
              );
            })}

            {projects.length === 0 && (
              <p className="text-ink-3 px-1 text-[13px] leading-relaxed">
                No projects yet. Connect one so we can match engineers against
                your actual stack.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => setConnectOpen(true)}
            className="border-line hover:bg-surface-2 mt-4 flex w-full items-center justify-center gap-1.5 rounded-full border py-2.5 text-[13px] font-semibold transition"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
            Add new project
          </button>
        </Reveal>

        {/* right: engineers for the selected project */}
        <div className="min-w-0 flex-1 px-3.5 py-3.5">
          <Reveal>
            <h1 className="font-heading text-[22px] font-semibold tracking-tight">
              {selectedProject
                ? `Engineers for ${selectedProject.name}`
                : stuckPoint
                  ? "Suggested for you"
                  : "Engineers"}
            </h1>
            <p className="text-ink-2 mt-1 text-[13.5px]">
              {selectedProject
                ? "Sorted by how closely their skills match your stack."
                : stuckPoint
                  ? `Prioritized for "${stuckPoint.label.toLowerCase()}"${toolsLabel ? ` after building with ${toolsLabel}` : ""}.`
                  : "Connect a project for a matched list - showing everyone for now."}
            </p>
          </Reveal>

          <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {suitableEngineers.map((e, i) => (
              <Reveal key={`${e.name}-${i}`} delay={Math.min(i * 0.04, 0.3)}>
                <EngineerCard
                  engineer={e}
                  onGetUnstuck={() => openGetUnstuck(e)}
                  onBookCall={() => setBookEngineer(e)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* sticky bottom bar */}
      {topOnline && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4">
          <div className="bg-ink border-line-2 flex w-full max-w-xl items-center gap-3 rounded-full border py-2.5 pr-2.5 pl-4 shadow-2xl">
            <span
              aria-hidden="true"
              className="bg-online block size-2 shrink-0 rounded-full"
            />
            <span className="text-bg min-w-0 flex-1 truncate text-[13.5px] font-medium">
              {topOnline.name} is online right now
            </span>
            <button
              type="button"
              onClick={() => openGetUnstuck(topOnline)}
              className="border-bg/25 text-bg hover:bg-bg/10 flex shrink-0 items-center gap-1.5 rounded-full border py-2 pr-3.5 pl-4 text-[13px] font-semibold transition"
            >
              Get unstuck
              <ArrowRight className="size-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => setBookEngineer(topOnline)}
              className="bg-brand hover:bg-brand-ink text-bg shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition"
            >
              Book a call
            </button>
          </div>
        </div>
      )}

      <GetUnstuckModal
        open={unstuckOpen}
        onClose={() => setUnstuckOpen(false)}
        initialProjectId={selectedId}
        initialEngineer={unstuckEngineer}
      />
      <ScheduleModal
        engineer={bookEngineer}
        fixedLength={20}
        onClose={() => setBookEngineer(null)}
      />
      <ConnectProjectDrawer
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
      />
    </div>
  );
}

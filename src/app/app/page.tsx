"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ArrowRight, Play, Link2, Globe, Package, Crown, type IconComponent } from "@/components/icons";
import Reveal from "@/components/Reveal";
import TopoLines from "@/components/TopoLines";
import GetUnstuckModal from "@/components/GetUnstuckModal";
import ConnectProjectDrawer from "@/components/ConnectProjectDrawer";
import FindTeammateModal from "@/components/FindTeammateModal";
import UpgradeRequiredModal from "@/components/UpgradeRequiredModal";
import ScheduleModal from "@/components/ScheduleModal";
import { useProjects } from "@/components/ProjectsProvider";
import { usePlan } from "@/components/PlanProvider";
import { ONLINE_ENGINEERS, USAGE, type Project } from "@/data/app";
import type { DirectoryEngineer } from "@/data/engineer-directory";

/** Matches the source icons offered in the connect-a-project drawer. */
const SOURCE_ICON: Record<Project["source"], IconComponent> = {
  GitHub: Link2,
  "Live URL": Globe,
  Upload: Package,
};

export default function AppHome() {
  const [unstuckOpen, setUnstuckOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [startProjectId, setStartProjectId] = useState<string | undefined>(undefined);
  const [teammateOpen, setTeammateOpen] = useState(false);
  const [teammateUpgradeOpen, setTeammateUpgradeOpen] = useState(false);
  const [teammateEngineer, setTeammateEngineer] = useState<DirectoryEngineer | null>(null);
  const { projects } = useProjects();
  const { plan, hasPlanAtLeast } = usePlan();
  const isGrowthPlus = hasPlanAtLeast("growth");

  const startSession = (projectId?: string) => {
    setStartProjectId(projectId);
    setUnstuckOpen(true);
  };

  const findTeammate = () => {
    if (hasPlanAtLeast("growth")) setTeammateOpen(true);
    else setTeammateUpgradeOpen(true);
  };

  const getUnstuckButton = isGrowthPlus ? (
    <button
      type="button"
      onClick={() => startSession()}
      className="border-ink text-ink hover:bg-ink flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-[14px] font-semibold transition hover:text-bg"
    >
      Get unstuck
      <ArrowRight className="size-3.5" strokeWidth={2.5} />
    </button>
  ) : (
    <button
      type="button"
      onClick={() => startSession()}
      className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-[#131313] transition hover:bg-white/90"
    >
      Get unstuck
      <ArrowRight className="size-3.5" strokeWidth={2.5} />
    </button>
  );

  const findTeammateButton = (
    <button
      type="button"
      onClick={findTeammate}
      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-5 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90"
    >
      <Crown className="size-3.5" strokeWidth={2} />
      Find your teammate
    </button>
  );

  return (
    <div className="py-10">
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[1fr_240px]">
        <Reveal
          className={`relative w-full overflow-hidden rounded-xl p-6 sm:p-8 ${
            isGrowthPlus ? "border-line bg-surface border" : "bg-hero"
          }`}
        >
          <TopoLines seed={isGrowthPlus ? 13 : 12} opacityScale={isGrowthPlus ? 1 : 0.3} stroke={isGrowthPlus ? "#d4d4d8" : undefined} />
          <div className="relative flex h-full flex-col">
            <div>
              <h1
                className={`font-heading text-[28px] leading-tight font-semibold tracking-tight sm:text-[34px] ${
                  isGrowthPlus ? "" : "text-white"
                }`}
              >
                {isGrowthPlus ? "Build with one engineer" : "Need a hand? Chat with an engineer."}
              </h1>
              <p
                className={`mt-2 text-[14.5px] font-medium ${
                  isGrowthPlus ? "text-ink-2 sm:whitespace-nowrap" : "text-white/70"
                }`}
              >
                {isGrowthPlus
                  ? "Pair with an engineer who holds your context and books time with you."
                  : "Matched in under two minutes, draws from your monthly hours."}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isGrowthPlus ? (
                <>
                  {findTeammateButton}
                  {getUnstuckButton}
                </>
              ) : (
                <>
                  {getUnstuckButton}
                  {findTeammateButton}
                  <div className="flex items-center gap-2.5">
                    <div className="flex -space-x-2.5">
                      {ONLINE_ENGINEERS.slice(0, 4).map((e) => (
                        <span
                          key={e.name}
                          className="relative size-7 overflow-hidden rounded-full border-2 border-white/40"
                          style={{ backgroundColor: `oklch(0.90 0.045 ${e.hue})` }}
                        >
                          {e.img && <Image src={e.img} alt="" fill className="object-cover" sizes="28px" />}
                        </span>
                      ))}
                    </div>
                    <span className="text-[13px] font-medium text-white/70">Free right now</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} className="bg-surface-2 flex flex-col rounded-xl p-5">
          <span className="text-ink text-[13px] font-semibold">Time this month</span>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-ink-2 text-[13px]">Remaining</span>
            <span className="text-[14px] font-semibold">{plan.hoursPerMonth} hr</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-ink-2 text-[13px]">Used</span>
            <span className="text-[14px] font-semibold">{USAGE.hoursUsed} hr</span>
          </div>

          <Link
            href="/app/settings?tab=plan#hour-packs"
            className="border-line bg-surface hover:border-ink-3 mt-auto rounded-full border py-2.5 text-center text-[13px] font-semibold transition"
          >
            Buy more time
          </Link>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-9">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-[19px] font-semibold tracking-tight">Your projects</h2>
            <p className="text-ink-3 mt-1 text-[13px]">
              The stack you list here is what we match an engineer against.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConnectOpen(true)}
            className="bg-ink hover:bg-ink/85 flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold text-bg transition"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
            New project
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p) => {
            const SourceIcon = SOURCE_ICON[p.source];
            return (
            <div key={p.id} className="border-line bg-surface flex flex-col justify-between rounded-xl border p-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-surface-2 text-ink-2 grid size-9 place-items-center rounded-lg">
                    <SourceIcon className="size-4" strokeWidth={2} />
                  </span>
                  <span className="text-ink-2 flex items-center gap-1.5 text-[11.5px] font-medium">
                    <span
                      className={`size-1.5 rounded-full ${p.status === "Paused" ? "bg-ink-3" : "bg-online"}`}
                    />
                    {p.status}
                  </span>
                </div>
                <div className="mt-3 text-[15px] font-semibold">{p.name}</div>
                <div className="text-ink-3 mt-0.5 text-[12.5px]">{p.source}</div>
                {p.stack.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.stack.map((tag) => (
                      <span
                        key={tag}
                        className="bg-surface-2 text-ink-2 rounded-full px-2.5 py-1 text-[11.5px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => startSession(p.id)}
                className="bg-ink hover:bg-ink/85 mt-4 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[12.5px] font-semibold text-bg transition"
              >
                <Play className="size-3" strokeWidth={0} />
                Start session
              </button>
            </div>
            );
          })}

          <button
            type="button"
            onClick={() => setConnectOpen(true)}
            className={`border-ink-3 hover:border-ink hover:bg-surface-2 flex min-h-[172px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center transition ${
              projects.length === 0 ? "col-span-full" : ""
            }`}
          >
            <span className="bg-surface-2 text-ink-2 grid size-11 place-items-center rounded-full">
              <Plus className="size-5" strokeWidth={2} />
            </span>
            <span className="text-[14.5px] font-semibold">
              {projects.length === 0 ? "Connect your first project" : "Connect another project"}
            </span>
            <span className="text-ink-3 text-[12.5px]">Link a repo, paste a URL, or drop a file</span>
          </button>
        </div>
      </Reveal>

      <GetUnstuckModal
        open={unstuckOpen}
        onClose={() => setUnstuckOpen(false)}
        initialProjectId={startProjectId}
      />
      <ConnectProjectDrawer open={connectOpen} onClose={() => setConnectOpen(false)} />
      <FindTeammateModal
        open={teammateOpen}
        onClose={() => setTeammateOpen(false)}
        onBook={(engineer) => {
          setTeammateOpen(false);
          setTeammateEngineer(engineer);
        }}
      />
      <ScheduleModal
        engineer={teammateEngineer}
        fixedLength={20}
        onClose={() => setTeammateEngineer(null)}
      />
      <UpgradeRequiredModal
        open={teammateUpgradeOpen}
        onClose={() => setTeammateUpgradeOpen(false)}
        title="Upgrade plan to use this feature"
        message="Pairing with a dedicated teammate is included with the Growth plan and above."
      />
    </div>
  );
}

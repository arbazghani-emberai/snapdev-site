"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, Lock, SlidersHorizontal, Check } from "@/components/icons";
import Reveal from "@/components/Reveal";
import Modal from "@/components/Modal";
import { ENGINEER_DIRECTORY, CATEGORIES, type DirectoryEngineer } from "@/data/engineer-directory";
import { usePlan } from "@/components/PlanProvider";

const PAGE_SIZE = 9;

/** Most common skills across the roster, capped so the sidebar stays scannable. */
const TOP_SKILLS = (() => {
  const counts = new Map<string, number>();
  for (const e of ENGINEER_DIRECTORY) {
    for (const s of e.skills) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill]) => skill);
})();

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px]">
      <span className="relative inline-flex shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <span
          className={`grid size-3.5 place-items-center rounded-[4px] border transition ${
            checked ? "border-ink bg-ink" : "border-line-2 peer-focus-visible:border-ink-3"
          }`}
        >
          {checked && <Check className="text-bg size-2.5" strokeWidth={3} />}
        </span>
      </span>
      {label}
    </label>
  );
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-ink" : "bg-line"}`}
    >
      <span
        className={`bg-bg absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

type FilterState = {
  specialty: "All" | (typeof CATEGORIES)[number];
  setSpecialty: (v: "All" | (typeof CATEGORIES)[number]) => void;
  skillFilters: Set<string>;
  toggleSkill: (skill: string) => void;
};

function SpecialtyAndSkills({ specialty, setSpecialty, skillFilters, toggleSkill }: FilterState) {
  return (
    <>
      <div>
        <div className="text-ink-3 mb-2 text-[11px] font-bold tracking-[0.06em] uppercase">Specialty</div>
        <div className="flex flex-wrap gap-1.5">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSpecialty(c)}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition ${
                specialty === c ? "border-ink bg-surface-2 text-ink" : "border-line hover:border-ink-3 text-ink-2"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-ink-3 mb-2 text-[11px] font-bold tracking-[0.06em] uppercase">Skills</div>
        <div className="flex flex-col gap-2">
          {TOP_SKILLS.map((skill) => (
            <Checkbox
              key={skill}
              checked={skillFilters.has(skill)}
              onChange={() => toggleSkill(skill)}
              label={skill}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const PILL_CLASS =
  "border-line bg-surface-2 text-ink-2 shrink-0 rounded-full border px-2.5 py-1 text-[11.5px] font-medium whitespace-nowrap";
const BADGE_CLASS = "text-ink-3 shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-medium";
const PILL_GAP = 6; // gap-1.5

/** Fits as many skill pills as the row's actual width allows, folding the rest into a "+N" badge. */
function SkillPills({ skills }: { skills: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(skills.length);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const recalc = () => {
      const containerWidth = container.offsetWidth;
      const items = Array.from(measure.querySelectorAll<HTMLElement>("[data-pill]"));
      const badge = measure.querySelector<HTMLElement>("[data-badge]");
      const badgeWidth = badge ? badge.offsetWidth : 0;

      let used = 0;
      let count = 0;
      for (let i = 0; i < items.length; i++) {
        const width = items[i].offsetWidth;
        const withPill = used + (i === 0 ? 0 : PILL_GAP) + width;
        const remaining = items.length - (i + 1);
        const total = remaining > 0 ? withPill + PILL_GAP + badgeWidth : withPill;
        if (total <= containerWidth) {
          used = withPill;
          count = i + 1;
        } else {
          break;
        }
      }
      setVisibleCount(count);
    };

    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(container);
    return () => ro.disconnect();
  }, [skills]);

  const visibleSkills = skills.slice(0, visibleCount);
  const overflow = skills.length - visibleSkills.length;

  return (
    <div className="relative mt-2.5">
      <div ref={containerRef} className="flex flex-nowrap gap-1.5 overflow-hidden">
        {visibleSkills.map((s) => (
          <span key={s} className={PILL_CLASS}>
            {s}
          </span>
        ))}
        {overflow > 0 && <span className={BADGE_CLASS}>+{overflow}</span>}
      </div>
      <div ref={measureRef} className="invisible absolute top-0 left-0 flex gap-1.5" aria-hidden="true">
        {skills.map((s) => (
          <span key={s} data-pill className={PILL_CLASS}>
            {s}
          </span>
        ))}
        <span data-badge className={BADGE_CLASS}>
          +{skills.length}
        </span>
      </div>
    </div>
  );
}

function EngineerCard({ engineer, id }: { engineer: DirectoryEngineer; id: number }) {
  const online = engineer.status === "Online";

  return (
    <Link href={`/app/engineers/${id}`} className="group block">
      <div
        className="relative aspect-[0.93] overflow-hidden rounded-md"
        style={{ backgroundColor: `oklch(0.90 0.045 ${engineer.hue})` }}
      >
        {engineer.img && (
          <Image
            src={engineer.img}
            alt=""
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        )}
        {engineer.rating ? (
          <span className="bg-surface/95 text-ink absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-semibold shadow-sm">
            <Star className="text-star size-3 fill-current" strokeWidth={0} />
            {engineer.rating}
            <span className="text-ink-3 font-medium">({engineer.reviews})</span>
          </span>
        ) : (
          <span className="bg-surface/95 text-ink-3 absolute bottom-2.5 left-2.5 rounded-full px-2.5 py-1 text-[12px] font-semibold shadow-sm">
            No reviews yet
          </span>
        )}
      </div>

      <div className="font-heading mt-4 text-[17px] leading-tight font-semibold tracking-tight">
        {engineer.name}
      </div>

      <div className="mt-1 flex items-center gap-2 text-[12.5px]">
        <span className="text-ink-2 truncate font-medium">{engineer.role}</span>
        <span aria-hidden="true" className="bg-line h-3 w-px shrink-0" />
        <span className="text-ink-2 flex shrink-0 items-center gap-1.5 font-medium">
          <span aria-hidden="true" className={`size-1.5 rounded-full ${online ? "bg-online" : "bg-ink-3"}`} />
          {engineer.status}
        </span>
      </div>

      <SkillPills skills={engineer.skills} />
    </Link>
  );
}

export default function EngineersPage() {
  const { hasPlanAtLeast } = usePlan();
  const [query, setQuery] = useState("");
  const [availableNow, setAvailableNow] = useState(false);
  const [specialty, setSpecialty] = useState<"All" | (typeof CATEGORIES)[number]>("All");
  const [skillFilters, setSkillFilters] = useState<Set<string>>(new Set());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const onlineEngineers = useMemo(() => ENGINEER_DIRECTORY.filter((e) => e.status === "Online"), []);
  const activeFilterCount = (availableNow ? 1 : 0) + (specialty !== "All" ? 1 : 0) + skillFilters.size;

  const toggleSkill = (skill: string) => {
    setSkillFilters((prev) => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill);
      else next.add(skill);
      return next;
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ENGINEER_DIRECTORY.filter((e) => {
      if (availableNow && e.status !== "Online") return false;
      if (specialty !== "All" && e.category !== specialty) return false;
      if (skillFilters.size > 0 && ![...skillFilters].every((s) => e.skills.includes(s))) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [query, availableNow, specialty, skillFilters]);

  // All engineers are already in memory - this just paces how many mount at
  // once, so switching a filter doesn't dump dozens of cards in one frame.
  // Reset during render (not an effect) per React's "adjusting state when
  // props change" pattern, since this only fires on an actual filter change.
  const filterKey = `${query}:${availableNow}:${specialty}:${[...skillFilters].sort().join(",")}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((v) => Math.min(v + PAGE_SIZE, results.length));
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [results.length]);

  const visible = results.slice(0, visibleCount);

  if (!hasPlanAtLeast("growth")) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center py-10 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed]">
          <Lock className="size-6 text-white" strokeWidth={2} />
        </span>
        <h1 className="font-heading mt-5 text-[22px] font-semibold tracking-tight">This page is locked</h1>
        <p className="text-ink-2 mx-auto mt-2 max-w-xs text-[14.5px] leading-relaxed">
          You need to upgrade to the Growth plan in order to view this page.
        </p>
        <Link
          href="/app/settings?tab=plan"
          className="bg-ink hover:bg-ink/85 text-bg mt-5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition"
        >
          View plans
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Reveal>
        <h1 className="font-heading text-[28px] font-semibold tracking-tight">Browse Vetted Engineers</h1>
        <p className="text-ink-2 mt-1.5 text-[14.5px]">
          {ENGINEER_DIRECTORY.length} experts · {onlineEngineers.length} available right now
        </p>
      </Reveal>

      {/* Mobile/tablet: search + a button that opens the filters in a modal */}
      <Reveal delay={0.06} className="mt-6 flex items-center gap-2 lg:hidden">
        <div className="border-line focus-within:border-ink-3 flex w-full items-center gap-2 rounded-full border p-3">
          <Search className="text-ink-3 size-4 shrink-0" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, stacks, names…"
            className="w-full text-[13px] outline-none placeholder:text-ink-3"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="border-line hover:border-ink-3 relative flex shrink-0 items-center gap-1.5 rounded-full border p-3 text-[13px] font-semibold transition"
        >
          <SlidersHorizontal className="size-4" strokeWidth={1.75} />
          {activeFilterCount > 0 && (
            <span className="bg-ink text-bg absolute -top-1 -right-1 grid size-4 place-items-center rounded-full text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </Reveal>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} className="max-w-sm">
        <h2 className="font-heading text-[19px] font-semibold tracking-tight">Filters</h2>

        <div className="mt-5 flex flex-col gap-5">
          <label className="flex items-center justify-between gap-2 text-[13.5px] font-medium">
            Available now
            <Switch checked={availableNow} onChange={setAvailableNow} />
          </label>

          <SpecialtyAndSkills
            specialty={specialty}
            setSpecialty={setSpecialty}
            skillFilters={skillFilters}
            toggleSkill={toggleSkill}
          />
        </div>

        <div className="mt-6 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setAvailableNow(false);
              setSpecialty("All");
              setSkillFilters(new Set());
            }}
            className="border-line hover:bg-surface-2 rounded-full border px-4 py-2.5 text-[13.5px] font-semibold transition"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="bg-ink hover:bg-ink/85 text-bg flex-1 rounded-full py-2.5 text-[13.5px] font-semibold transition"
          >
            Show {results.length} engineer{results.length === 1 ? "" : "s"}
          </button>
        </div>
      </Modal>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:mt-6 lg:grid-cols-[240px_1fr]">
        <Reveal delay={0.06} className="hidden flex-col gap-5 lg:sticky lg:top-20 lg:flex lg:self-start">
          <div className="border-line focus-within:border-ink-3 flex w-full items-center gap-2 rounded-full border p-3">
            <Search className="text-ink-3 size-4 shrink-0" strokeWidth={2} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills, stacks, names…"
              className="w-full text-[13px] outline-none placeholder:text-ink-3"
            />
          </div>

          <Checkbox checked={availableNow} onChange={() => setAvailableNow((v) => !v)} label="Available now" />

          <SpecialtyAndSkills
            specialty={specialty}
            setSpecialty={setSpecialty}
            skillFilters={skillFilters}
            toggleSkill={toggleSkill}
          />
        </Reveal>

        <div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((e, i) => (
              <Reveal key={`${e.name}-${i}`} delay={Math.min(i * 0.04, 0.3)} className="h-full">
                <EngineerCard engineer={e} id={ENGINEER_DIRECTORY.indexOf(e)} />
              </Reveal>
            ))}
          </div>

          {visibleCount < results.length && <div ref={sentinelRef} className="h-1" />}

          {results.length === 0 && (
            <p className="text-ink-3 mt-10 text-center text-[14px]">No engineers match that search.</p>
          )}
        </div>
      </div>
    </div>
  );
}

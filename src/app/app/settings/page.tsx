"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CreditCard, Clock, Check, Minus, User, Camera, Download, FileText, Plus } from "@/components/icons";
import Reveal from "@/components/Reveal";
import Modal from "@/components/Modal";
import { usePlan } from "@/components/PlanProvider";
import {
  PLANS,
  CURRENT_USER,
  USAGE,
  BILLING_HISTORY,
  HOUR_PACKS,
  MEMBER_SINCE,
  PLAN_RENEWS_ON,
  type PlanTier,
} from "@/data/app";
import { SESSION_LOG } from "@/data/sessions";

const TABS = [
  { id: "profile", label: "Account", icon: User },
  { id: "plan", label: "Plan & billing", icon: CreditCard },
  { id: "usage", label: "Usage & sessions", icon: Clock },
] as const;

type TabId = (typeof TABS)[number]["id"];

function ProfileTab() {
  const [name, setName] = useState(CURRENT_USER.name);
  const [email, setEmail] = useState(CURRENT_USER.email);
  const [bio, setBio] = useState(CURRENT_USER.bio);
  const [avatarUrl, setAvatarUrl] = useState(CURRENT_USER.avatarUrl);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
    e.target.value = "";
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="mt-8">
      <h2 className="font-heading text-[19px] font-semibold tracking-tight">Account</h2>
      <p className="text-ink-2 mt-1 text-[14px]">How you show up to engineers and teammates.</p>

      <div className="border-line-2 bg-surface mt-5 rounded-xl border p-6">
        <div className="flex items-center gap-4">
          <span className="bg-brand-wash text-brand-ink relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full text-[18px] font-semibold">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill className="object-cover" sizes="64px" />
            ) : (
              initials || "?"
            )}
          </span>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-line hover:bg-surface-2 flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition"
            >
              <Camera className="size-3.5" strokeWidth={1.75} />
              Change photo
            </button>
            <p className="text-ink-3 mt-1.5 text-[11.5px]">JPG or PNG, square works best.</p>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="text-ink-3 text-[12px] font-semibold tracking-[0.04em] uppercase">Name</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-line focus:border-ink mt-1.5 w-full rounded-lg border p-3 text-[14px] outline-none transition"
            />
          </label>
          <label className="block">
            <span className="text-ink-3 text-[12px] font-semibold tracking-[0.04em] uppercase">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-line focus:border-ink mt-1.5 w-full rounded-lg border p-3 text-[14px] outline-none transition"
            />
          </label>
          <label className="block">
            <span className="text-ink-3 text-[12px] font-semibold tracking-[0.04em] uppercase">
              Description
            </span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="What are you working on? What should an engineer know about you?"
              className="border-line focus:border-ink mt-1.5 w-full resize-y rounded-md border p-3 text-[14px] leading-relaxed outline-none transition"
            />
          </label>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            className="bg-ink hover:bg-ink/85 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-bg transition"
          >
            Save changes
          </button>
          {saved && (
            <span className="text-online flex items-center gap-1.5 text-[13px] font-semibold">
              <Check className="size-3.5" strokeWidth={2.5} />
              Saved
            </span>
          )}
        </div>
      </div>

      <div className="border-line-2 bg-surface mt-4 rounded-xl border p-5">
        <div className="text-[14px] font-semibold">Password</div>
        <p className="text-ink-2 mt-1.5 text-[13px]">We&apos;ll email you a link to set a new one. The link expires after an hour.</p>
        <button
          type="button"
          className="border-line hover:bg-surface-2 mt-3.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition"
        >
          Email me a reset link
        </button>
      </div>

      <Link href="/" className="text-ink-3 hover:text-ink mt-6 inline-block text-[13.5px] font-medium underline underline-offset-4">
        Sign out
      </Link>
    </div>
  );
}

function SwitchPlanModal({
  current,
  target,
  onClose,
  onConfirm,
}: {
  current: PlanTier;
  target: PlanTier | null;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [timing, setTiming] = useState<"immediate" | "cycle_end">("cycle_end");
  const [working, setWorking] = useState(false);

  // Reset to the default choice each time a new switch is opened (reset
  // during render, not an effect, per React's "adjusting state when props
  // change" pattern).
  const [prevTargetId, setPrevTargetId] = useState(target?.id);
  if (target?.id !== prevTargetId) {
    setPrevTargetId(target?.id);
    setTiming("cycle_end");
    setWorking(false);
  }

  if (!target) return null;

  const confirm = () => {
    setWorking(true);
    setTimeout(() => {
      onConfirm();
    }, 700);
  };

  return (
    <Modal open={!!target} onClose={onClose} className="max-w-md">
      <h2 className="font-heading text-[20px] font-semibold tracking-tight">When should this take effect?</h2>
      <p className="text-ink-2 mt-2 text-[13.5px]">
        You&apos;re moving from {current.name} (${current.price}/mo) to {target.name} (${target.price}/mo).
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition ${
            timing === "immediate" ? "border-ink bg-surface-2" : "border-line hover:border-ink-3"
          }`}
        >
          <input
            type="radio"
            checked={timing === "immediate"}
            onChange={() => setTiming("immediate")}
            className="accent-ink mt-0.5 size-3.5 shrink-0"
          />
          <span>
            <span className="block text-[13.5px] font-semibold">Switch immediately</span>
            <span className="text-ink-2 mt-0.5 block text-[12.5px] leading-relaxed">
              Your {target.hoursPerMonth} engineering hours unlock today, billed at the prorated amount.
            </span>
          </span>
        </label>
        <label
          className={`flex cursor-pointer items-start gap-3 rounded-md border p-3.5 transition ${
            timing === "cycle_end" ? "border-ink bg-surface-2" : "border-line hover:border-ink-3"
          }`}
        >
          <input
            type="radio"
            checked={timing === "cycle_end"}
            onChange={() => setTiming("cycle_end")}
            className="accent-ink mt-0.5 size-3.5 shrink-0"
          />
          <span>
            <span className="block text-[13.5px] font-semibold">At end of billing cycle</span>
            <span className="text-ink-2 mt-0.5 block text-[12.5px] leading-relaxed">
              Stay on {current.name} with your current hours, then move to {target.name} next cycle.
            </span>
          </span>
        </label>
      </div>

      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="border-line hover:border-ink-3 flex-1 rounded-full border py-2.5 text-[13.5px] font-semibold transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={working}
          className="bg-ink hover:bg-ink/85 text-bg flex-1 rounded-full py-2.5 text-[13.5px] font-semibold transition disabled:opacity-60"
        >
          {working ? "Working…" : timing === "immediate" ? "Confirm switch" : "Schedule change"}
        </button>
      </div>
    </Modal>
  );
}

function CancelSubscriptionModal({
  open,
  planName,
  onClose,
  onConfirm,
}: {
  open: boolean;
  planName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-sm text-center">
      <h2 className="font-heading text-[19px] font-semibold tracking-tight">Cancel subscription?</h2>
      <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">
        You&apos;ll move to the Starter plan at the end of your current billing cycle. You can resubscribe anytime.
      </p>
      <div className="mt-5 flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="border-line hover:border-ink-3 flex-1 rounded-full border py-2.5 text-[13.5px] font-semibold transition"
        >
          Keep {planName}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-danger hover:bg-danger/85 flex-1 rounded-full py-2.5 text-[13.5px] font-semibold text-white transition"
        >
          Cancel plan
        </button>
      </div>
    </Modal>
  );
}

function PlanTab() {
  const { plan: currentPlan, setPlanId } = usePlan();
  const [purchasedPack, setPurchasedPack] = useState<string | null>(null);
  const [switchTarget, setSwitchTarget] = useState<PlanTier | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [customHours, setCustomHours] = useState("");

  const buyPack = (id: string) => {
    setPurchasedPack(id);
    setTimeout(() => setPurchasedPack((prev) => (prev === id ? null : prev)), 1800);
  };

  // Mock per-hour rate for a custom top-up, priced a bit above the smallest
  // preset pack's rate since it's the least-committed option.
  const CUSTOM_HOUR_RATE = 12;
  const customHoursNum = Math.max(0, Math.floor(Number(customHours) || 0));
  const customPrice = customHoursNum * CUSTOM_HOUR_RATE;

  const buyCustomHours = () => {
    if (customHoursNum <= 0) return;
    setPurchasedPack("custom");
    setCustomHours("");
    setTimeout(() => setPurchasedPack((prev) => (prev === "custom" ? null : prev)), 1800);
  };

  return (
    <div className="mt-8">
      <h2 className="font-heading text-[19px] font-semibold tracking-tight">Plan & billing</h2>
      <p className="text-ink-2 mt-1 text-[14px]">Pick a plan to start working with an engineer.</p>

      <div className="bg-ink text-bg mt-6 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-bg/60 text-[11px] font-bold tracking-[0.06em] uppercase">Current plan</span>
            <div className="mt-1 flex items-center gap-2.5">
              <span className="font-heading text-[26px] font-semibold tracking-tight">{currentPlan.name}</span>
              <span className="bg-bg/10 rounded-full px-2.5 py-1 text-[12.5px] font-semibold">
                ${currentPlan.price}/mo
              </span>
            </div>
            <p className="text-bg/70 mt-2 max-w-md text-[13px] leading-relaxed">{currentPlan.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {currentPlan.id !== "starter" && (
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="border-bg/25 text-bg hover:bg-bg/10 rounded-full border px-4 py-2 text-[13px] font-semibold transition"
              >
                Cancel subscription
              </button>
            )}
          </div>
        </div>
        <div className="border-bg/15 mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t pt-4 text-[12.5px]">
          <span className="text-bg/60">
            Engineering hours <span className="text-bg font-semibold">{currentPlan.hoursPerMonth} hrs / mo</span>
          </span>
          <span className="text-bg/60">
            Renews <span className="text-bg font-semibold">{PLAN_RENEWS_ON}</span>
          </span>
          <span className="text-bg/60">
            Member since <span className="text-bg font-semibold">{MEMBER_SINCE}</span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan.id;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border p-5 ${
                plan.highlight ? "border-brand bg-brand-wash" : "border-line bg-surface"
              }`}
            >
              {plan.highlight && (
                <span className="bg-brand absolute -top-2.5 left-5 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide text-white uppercase">
                  Popular
                </span>
              )}
              {isCurrent && (
                <span className="border-line bg-surface text-ink-2 absolute -top-2.5 left-5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide uppercase">
                  Current
                </span>
              )}
              <div className="text-[15px] font-semibold">{plan.name}</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-heading text-[28px] font-semibold tracking-tight">${plan.price}</span>
                <span className="text-ink-3 text-[13px]">/mo</span>
              </div>
              <div className="text-ink-3 mt-1 text-[12.5px]">{plan.hours}</div>

              <ul className="mt-4 flex flex-1 flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2 text-[12.5px]">
                    {f.included ? (
                      <Check className="text-online size-3.5 shrink-0" strokeWidth={2.5} />
                    ) : (
                      <Minus className="text-ink-3 size-3.5 shrink-0" strokeWidth={2.5} />
                    )}
                    <span className={f.included ? "text-ink" : "text-ink-3"}>{f.label}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => setSwitchTarget(plan)}
                className={`mt-5 rounded-full py-2.5 text-[13.5px] font-semibold transition ${
                  isCurrent
                    ? "bg-surface-2 text-ink-3 cursor-default"
                    : plan.highlight
                      ? "bg-brand hover:bg-brand-ink text-white"
                      : "bg-ink hover:bg-ink/85 text-bg"
                }`}
              >
                {isCurrent ? "Current plan" : `Buy ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <div id="hour-packs" className="border-line bg-surface mt-6 scroll-mt-24 rounded-md border p-5">
        <h3 className="font-heading text-[16px] font-semibold tracking-tight">Need more hours?</h3>
        <p className="text-ink-2 mt-1 text-[13px]">Add extra hours on top of your current plan - no need to upgrade.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {HOUR_PACKS.map((pack) => {
            const justBought = purchasedPack === pack.id;
            return (
              <div key={pack.id} className="border-line flex items-center justify-between gap-3 rounded-md border p-4">
                <div>
                  <div className="text-[14.5px] font-semibold">+{pack.hours} hrs</div>
                  <div className="text-ink-2 text-[12.5px]">${pack.price} one-time</div>
                </div>
                <button
                  type="button"
                  onClick={() => buyPack(pack.id)}
                  disabled={justBought}
                  className={`flex shrink-0 items-center gap-1 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition ${
                    justBought
                      ? "border-online bg-online/10 text-online"
                      : "border-line hover:border-ink text-ink"
                  }`}
                >
                  {justBought ? (
                    <>
                      <Check className="size-3" strokeWidth={3} />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="size-3" strokeWidth={2.5} />
                      Buy
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="border-line mt-3 flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold">Custom amount</div>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={customHours}
                onChange={(e) => setCustomHours(e.target.value)}
                placeholder="Hours"
                aria-label="Custom hours"
                className="border-line focus:border-ink w-20 rounded-sm border px-2.5 py-1.5 text-[13px] outline-none transition"
              />
              <span className="text-ink-2 text-[12.5px]">
                hrs{customHoursNum > 0 ? ` · $${customPrice} one-time` : ""}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={buyCustomHours}
            disabled={customHoursNum <= 0}
            className={`flex shrink-0 items-center gap-1 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition ${
              purchasedPack === "custom"
                ? "border-online bg-online/10 text-online"
                : "border-line hover:border-ink text-ink disabled:hover:border-line disabled:cursor-not-allowed disabled:opacity-50"
            }`}
          >
            {purchasedPack === "custom" ? (
              <>
                <Check className="size-3" strokeWidth={3} />
                Added
              </>
            ) : (
              <>
                <Plus className="size-3" strokeWidth={2.5} />
                Buy
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="font-heading text-[17px] font-semibold tracking-tight">Billing history</h3>
        <p className="text-ink-2 mt-1 text-[13.5px]">Past invoices for your account.</p>

        <div className="border-line bg-surface mt-4 rounded-md border">
          {BILLING_HISTORY.length === 0 ? (
            <p className="text-ink-3 px-5 py-8 text-center text-[13px]">No invoices yet.</p>
          ) : (
            BILLING_HISTORY.map((invoice) => (
              <div
                key={invoice.id}
                className="border-line-2 flex flex-wrap items-center gap-x-3 gap-y-2 border-t px-5 py-3.5 first:border-t-0"
              >
                <span className="bg-surface-2 text-ink-2 grid size-8 shrink-0 place-items-center rounded-full">
                  <FileText className="size-3.5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold">{invoice.description}</div>
                  <div className="text-ink-2 text-[12px]">{invoice.date}</div>
                </div>
                <span className="text-ink-2 flex shrink-0 items-center gap-1.5 text-[12px]">
                  <CreditCard className="size-3.5" strokeWidth={1.75} />
                  {invoice.payment.kind === "apple_pay" ? "Apple Pay · " : ""}
                  {invoice.payment.brand} •••• {invoice.payment.last4}
                </span>
                <span className="bg-online/10 text-online shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold">
                  {invoice.status}
                </span>
                <span className="w-14 shrink-0 text-right text-[13.5px] font-semibold">${invoice.amount}</span>
                <button
                  type="button"
                  aria-label={`Download invoice for ${invoice.date}`}
                  className="border-line hover:bg-surface-2 grid size-8 shrink-0 place-items-center rounded-full border transition"
                >
                  <Download className="size-3.5" strokeWidth={1.75} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <SwitchPlanModal
        current={currentPlan}
        target={switchTarget}
        onClose={() => setSwitchTarget(null)}
        onConfirm={() => {
          if (switchTarget) setPlanId(switchTarget.id);
          setSwitchTarget(null);
        }}
      />
      <CancelSubscriptionModal
        open={cancelOpen}
        planName={currentPlan.name}
        onClose={() => setCancelOpen(false)}
        onConfirm={() => {
          setPlanId("starter");
          setCancelOpen(false);
        }}
      />
    </div>
  );
}

function UsageTab() {
  const { plan } = usePlan();
  const hoursAvailable = plan.hoursPerMonth;
  const total = hoursAvailable + USAGE.hoursUsed;
  const percent = total > 0 ? Math.round((hoursAvailable / total) * 100) : 0;

  return (
    <div className="mt-8">
      <h2 className="font-heading text-[19px] font-semibold tracking-tight">This billing period</h2>

      <div className="border-line-2 bg-surface mt-5 rounded-xl border p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-ink-3 text-[11.5px] font-semibold tracking-[0.06em] uppercase">
            Hours remaining
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className="font-heading text-[26px] font-semibold tracking-tight">
              {hoursAvailable} hr
            </span>
            <span className="text-ink-3 text-[13px]">of {total} hr</span>
          </span>
        </div>
        <div className="bg-surface-2 mt-3.5 h-2 w-full overflow-hidden rounded-full">
          <div className="bg-brand h-full rounded-full" style={{ width: `${percent}%` }} />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-4">
          <div>
            <div className="text-ink-2 text-[12.5px]">Monthly allocation</div>
            <div className="mt-0.5 text-[16px] font-bold">{total} hr</div>
          </div>
          <div>
            <div className="text-ink-2 text-[12.5px]">Rolled over</div>
            <div className="mt-0.5 text-[16px] font-bold">0 hr</div>
          </div>
          <div>
            <div className="text-ink-2 text-[12.5px]">Used</div>
            <div className="mt-0.5 text-[16px] font-bold">{USAGE.hoursUsed} hr</div>
          </div>
        </div>
      </div>

      <h2 className="font-heading mt-8 text-[17px] font-semibold tracking-tight">Your sessions</h2>
      {SESSION_LOG.length === 0 ? (
        <p className="text-ink-2 mt-3 text-[14px]">No sessions yet. Your first one will show up here.</p>
      ) : (
        <div className="border-line-2 bg-surface mt-3 overflow-hidden rounded-xl border">
          {SESSION_LOG.map((s) => (
            <div key={s.id} className="border-line-2 flex items-center gap-4 border-t p-4 first:border-t-0">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold">{s.topic}</div>
                <div className="text-ink-2 text-[12.5px]">
                  with {s.engineer.name} · {s.date}
                </div>
              </div>
              <div className="shrink-0 text-[13px] font-semibold">{s.duration}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function isTabId(value: string | null): value is TabId {
  return TABS.some((t) => t.id === value);
}

function SettingsPageInner() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [tab, setTab] = useState<TabId>(isTabId(initialTab) ? initialTab : "profile");

  return (
    <div className="py-10">
      <Reveal>
        <h1 className="font-heading text-[28px] font-semibold tracking-tight">Settings</h1>
      </Reveal>

      <Reveal delay={0.05} className="no-scrollbar mt-6 flex flex-nowrap gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] font-semibold whitespace-nowrap transition ${
              tab === t.id ? "border-ink bg-surface-2 text-ink" : "border-line hover:bg-surface-2 text-ink-2"
            }`}
          >
            <t.icon className="size-3.5" strokeWidth={2} />
            {t.label}
          </button>
        ))}
      </Reveal>

      <div className="bg-line mt-6 h-px" />

      {tab === "profile" && <ProfileTab />}
      {tab === "plan" && <PlanTab />}
      {tab === "usage" && <UsageTab />}    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsPageInner />
    </Suspense>
  );
}

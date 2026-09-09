"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bug, Rocket, ShieldCheck, Users } from "lucide-react";
import { ENGINEERS } from "@/data/engineers";

const INTENTS = [
  { value: "debug", label: "Something's broken", icon: Bug },
  { value: "deploy", label: "Help me deploy", icon: Rocket },
  { value: "review", label: "Review my code", icon: ShieldCheck },
  { value: "build", label: "Build with me", icon: Users },
];

const ONLINE_ENGINEERS = ENGINEERS.filter((e) => e.status === "Online");
const ONLINE_COUNT = ONLINE_ENGINEERS.length;
const STACK = ENGINEERS.slice(0, 4);

export default function ChatWidget() {
  const router = useRouter();
  const [intent, setIntent] = useState<string | null>(null);
  const [detail, setDetail] = useState("");

  return (
    <form
      className="border-line bg-surface w-full rounded-lg border p-6 sm:p-7"
      aria-labelledby="free-session-heading"
      onSubmit={(e) => {
        e.preventDefault();
        const engineer = ONLINE_ENGINEERS[Math.floor(Math.random() * ONLINE_ENGINEERS.length)] ?? ENGINEERS[0];
        const params = new URLSearchParams({ engineer: engineer.name });
        if (detail) params.set("detail", detail);
        router.push(`/chat?${params.toString()}`);
      }}
    >
      <h2 id="free-session-heading" className="sr-only">
        Chat with an engineer
      </h2>

      <fieldset>
        <legend className="sr-only">Pick what you need help with.</legend>
        <div className="flex flex-wrap gap-2.5">
          {INTENTS.map((o) => {
            const Icon = o.icon;
            const active = intent === o.value;
            return (
              <label
                key={o.value}
                className={`flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2.5 text-[14.5px] font-medium transition ${
                  active
                    ? "border-ink-3 bg-surface text-ink"
                    : "border-line bg-surface text-ink hover:border-ink-3"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name="intent"
                  value={o.value}
                  checked={active}
                  onChange={() => setIntent(o.value)}
                />
                <Icon className="size-4" strokeWidth={2} />
                {o.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <textarea
        rows={2}
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="Describe it in plain English, paste an error, drop a repo link, or just vent. Our AI routes you to the right engineer."
        aria-label="Describe what you are stuck on"
        className="bg-surface-2 text-ink placeholder:text-ink-3 focus:ring-ink/10 mt-4 w-full resize-y rounded-md px-4.5 py-3.5 text-[15px] leading-[1.5] focus:ring-2 focus:outline-none"
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {STACK.map((e) => (
              <Image
                key={e.name}
                src={e.img ?? "/engineers/khalil.jpg"}
                alt=""
                width={36}
                height={36}
                className="border-surface size-9 rounded-full border-2 object-cover"
              />
            ))}
          </div>
          <span className="text-ink-2 flex items-center gap-1.5 text-[14px] font-medium">
            <span aria-hidden="true" className="bg-online size-[7px] rounded-full" />
            {ONLINE_COUNT} engineers online now
          </span>
        </div>

        <span className="text-ink-3 hidden text-[13px] sm:inline">
          First session free · up to 30 min · no card
        </span>

        <button
          type="submit"
          className="bg-brand hover:bg-brand-ink rounded-full px-7 py-3 text-[15px] font-semibold text-white transition disabled:opacity-60"
        >
          Chat now
        </button>
      </div>
    </form>
  );
}

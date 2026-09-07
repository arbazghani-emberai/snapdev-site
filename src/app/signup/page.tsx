"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import GoogleLogo from "@/components/GoogleLogo";
import GithubLogo from "@/components/GithubLogo";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthLayout heading="Create account" subheading="Start your first session free, up to 30 min.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/app");
        }}
        className="flex flex-col gap-4"
      >
        <label className="block">
          <span className="text-[13.5px] font-medium">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="border-line focus:border-ink placeholder:text-ink-3 mt-1.5 w-full rounded-lg border p-3 text-[14px] outline-none transition"
          />
        </label>

        <label className="block">
          <span className="text-[13.5px] font-medium">Email address</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="border-line focus:border-ink placeholder:text-ink-3 mt-1.5 w-full rounded-lg border p-3 text-[14px] outline-none transition"
          />
        </label>

        <label className="block">
          <span className="text-[13.5px] font-medium">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="border-line focus:border-ink placeholder:text-ink-3 mt-1.5 w-full rounded-lg border p-3 text-[14px] outline-none transition"
          />
        </label>

        <button
          type="submit"
          className="bg-ink hover:bg-ink/85 mt-1 w-full rounded-lg py-3 text-[14.5px] font-semibold text-white transition"
        >
          Create account
        </button>

        <div className="my-1 flex items-center gap-3">
          <span className="bg-line h-px flex-1" />
          <span className="text-ink-3 text-[11px] font-semibold tracking-[0.08em]">OR</span>
          <span className="bg-line h-px flex-1" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="border-line hover:bg-surface-2 flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[13.5px] font-medium transition"
          >
            <GithubLogo className="size-4" />
            GitHub
          </button>
          <button
            type="button"
            className="border-line hover:bg-surface-2 flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-[13.5px] font-medium transition"
          >
            <GoogleLogo className="size-4" />
            Google
          </button>
        </div>

        <p className="text-ink-2 mt-2 text-center text-[13.5px]">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-ink font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

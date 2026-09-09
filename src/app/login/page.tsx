"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import GoogleLogo from "@/components/GoogleLogo";
import GithubLogo from "@/components/GithubLogo";
import { claimGuestSession } from "@/components/SessionProvider";
import { Eye, EyeOff } from "@/components/icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthLayout heading="Sign in" subheading="Welcome back! Enter your details below.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(claimGuestSession() ? "/app/inbox" : "/app");
        }}
        className="flex flex-col gap-4"
      >
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
          <div className="flex items-center justify-between">
            <span className="text-[13.5px] font-medium">Password</span>
            <Link href="#" className="text-ink-2 hover:text-ink text-[12.5px] font-medium">
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border-line focus:border-ink placeholder:text-ink-3 w-full rounded-lg border p-3 pr-11 text-[14px] outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="text-ink-3 hover:text-ink-2 absolute top-1/2 right-3 -translate-y-1/2 transition"
            >
              {showPassword ? <EyeOff className="size-[18px]" strokeWidth={1.75} /> : <Eye className="size-[18px]" strokeWidth={1.75} />}
            </button>
          </div>
        </label>

        <label className="flex items-center gap-2 text-[13.5px]">
          <input
            type="checkbox"
            checked={keepLoggedIn}
            onChange={(e) => setKeepLoggedIn(e.target.checked)}
            className="accent-ink size-3.5"
          />
          Keep me logged in
        </label>

        <button
          type="submit"
          className="bg-ink hover:bg-ink/85 mt-1 w-full rounded-lg py-3 text-[14.5px] font-semibold text-white transition"
        >
          Sign in
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
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-ink font-semibold">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

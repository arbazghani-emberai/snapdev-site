"use client";

import Link from "next/link";
import Modal from "./Modal";
import { Lock } from "@/components/icons";

export default function UpgradeRequiredModal({
  open,
  onClose,
  title = "Upgrade to unlock",
  message = "You need to upgrade to the Growth plan in order to view this page.",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} className="max-w-sm text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed]">
        <Lock className="size-5 text-white" strokeWidth={2} />
      </span>
      <h2 className="font-heading mt-4 text-[19px] font-semibold tracking-tight">{title}</h2>
      <p className="text-ink-2 mt-2 text-[13.5px] leading-relaxed">{message}</p>
      <Link
        href="/app/settings?tab=plan"
        onClick={onClose}
        className="bg-ink hover:bg-ink/85 text-bg mt-5 flex w-full items-center justify-center rounded-full px-5 py-2.5 text-[13.5px] font-semibold transition"
      >
        View plans
      </Link>
    </Modal>
  );
}

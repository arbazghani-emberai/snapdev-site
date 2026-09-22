import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function PromoBar() {
  return (
    <Link
      href="/signup"
      className="bg-ink hover:bg-ink/85 block w-full py-2.5 text-center text-[13px] font-medium text-white transition"
    >
      Get a senior engineer on your team. No $150k salary. No equity.{" "}
      <ArrowRight className="inline size-3.5 -translate-y-px" strokeWidth={2} />
    </Link>
  );
}

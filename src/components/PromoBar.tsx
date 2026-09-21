import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function PromoBar() {
  return (
    <Link
      href="/signup"
      className="bg-ink hover:bg-ink/85 block w-full py-2.5 text-center text-[13px] font-medium text-white transition"
    >
      The first 1,000 hours are free. <strong className="font-semibold underline">588 left</strong>, no card needed{" "}
      <ArrowRight className="inline size-3.5 -translate-y-px" strokeWidth={2} />
    </Link>
  );
}

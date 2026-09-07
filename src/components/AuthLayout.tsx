import Link from "next/link";
import Wordmark from "./Wordmark";
import TopoLines from "./TopoLines";
import HeroGradient from "./HeroGradient";

export default function AuthLayout({
  heading,
  subheading,
  children,
}: {
  heading: string;
  subheading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="hidden p-4 lg:block">
        <div className="from-wash-blue via-wash-blue-soft relative h-full overflow-hidden rounded-xl bg-gradient-to-b to-white">
          <HeroGradient />
          <TopoLines seed={44} opacityScale={0.5} />

          <Link href="/" className="absolute top-8 left-8">
            <Wordmark className="h-[30px] w-auto" />
          </Link>

          <div className="absolute right-8 bottom-10 left-8">
            <h2 className="font-heading text-ink max-w-md text-[32px] leading-[1.1] font-semibold">
              Build something amazing today.
            </h2>
            <p className="text-ink-2 mt-3 max-w-sm text-[14.5px] leading-relaxed">
              Match with a vetted engineer and work through your problem live, whenever you get stuck.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-9 block lg:hidden">
            <Wordmark />
          </Link>

          <h1 className="font-heading text-[28px] font-semibold tracking-tight">{heading}</h1>
          <p className="text-ink-2 mt-2 text-[14.5px]">{subheading}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

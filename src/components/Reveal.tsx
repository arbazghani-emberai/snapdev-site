"use client";

import useInView from "./useInView";

/**
 * Fades/rises its children in once the wrapper scrolls into view. Reuses the
 * `.anim-rise` / `.anim-hidden` keyframes already defined in globals.css for
 * the service-card intros, so entrance motion stays consistent site-wide.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}s` }}
      className={`${inView ? "anim-rise" : "anim-hidden"} ${className}`}
    >
      {children}
    </div>
  );
}

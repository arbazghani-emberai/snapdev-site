"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Fires once, the first time the element scrolls into view. The service card
 * animations are one-shot intros, so there's no need to reset on exit.
 */
export default function useInView<T extends HTMLElement>(rootMargin = "-15% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

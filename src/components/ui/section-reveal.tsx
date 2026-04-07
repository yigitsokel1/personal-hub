"use client";

import {
  startTransition,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type SectionRevealProps = {
  children: ReactNode;
  className?: string;
};

type RevealState = "pending" | "hidden" | "shown";

/**
 * One-time opacity + translate when the block enters the viewport.
 * Not a scroll “showcase”: fires once, then stays visible.
 * SSR and first layout frame stay fully visible for on-screen blocks; off-screen
 * blocks switch to hidden in `useLayoutEffect` before paint to avoid a flash.
 */
export function SectionReveal({ children, className = "" }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("pending");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) {
      startTransition(() => setState("shown"));
      return;
    }

    const rootH = window.innerHeight;
    const rect = el.getBoundingClientRect();
    const peeking =
      rect.top < rootH * 0.94 && rect.bottom > rootH * 0.08;

    if (peeking) {
      startTransition(() => setState("shown"));
      return;
    }

    startTransition(() => setState("hidden"));

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          obs.disconnect();
        }
      },
      { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const motionClasses =
    state === "hidden"
      ? "translate-y-2 opacity-0"
      : "translate-y-0 opacity-100";

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${motionClasses} ${className}`.trim()}
    >
      {children}
    </div>
  );
}

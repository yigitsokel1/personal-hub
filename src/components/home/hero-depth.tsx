"use client";

import { useEffect, useRef } from "react";

type HeroDepthProps = {
  children: React.ReactNode;
};

/**
 * Very soft radial light behind the hero plus optional sub-pixel parallax on the glow
 * (disabled when `prefers-reduced-motion: reduce`).
 */
export function HeroDepth({ children }: HeroDepthProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const glow = glowRef.current;
    if (!host || !glow) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = host.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1);
        const my = (e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1);
        const cap = 2.5;
        glow.style.transform = `translate(${mx * cap}px, ${my * cap}px)`;
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(raf);
      glow.style.transform = "translate(0, 0)";
    };

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={hostRef} className="relative">
      <div
        className="pointer-events-none absolute inset-0 overflow-visible select-none"
        aria-hidden
      >
        <div className="absolute left-1/2 top-0 h-[min(32rem,88vh)] w-[min(48rem,120vw)] -translate-x-1/2 -translate-y-[15%]">
          <div
            ref={glowRef}
            className="h-full w-full bg-[radial-gradient(ellipse_75%_55%_at_50%_28%,rgba(0,0,0,0.045)_0%,transparent_62%)] transition-transform duration-500 ease-out will-change-transform motion-reduce:transition-none"
          />
        </div>
      </div>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}

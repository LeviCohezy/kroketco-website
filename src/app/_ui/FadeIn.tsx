"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Fades + rises its children into view once, when scrolled into the viewport.
export default function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(28px)",
        transition:
          "opacity 0.7s cubic-bezier(0.22,0.61,0.36,1), transform 0.7s cubic-bezier(0.22,0.61,0.36,1)",
        transitionDelay: shown ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

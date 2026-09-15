"use client";

import { useEffect, useRef } from "react";

export default function VideoSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);

  // Scroll-scrub: the video's frame follows scroll (down = forward, up = reverse,
  // stop = hold). A continuous rAF loop eases the playback position toward the
  // scroll target so seeking stays smooth instead of snapping on each scroll tick.
  useEffect(() => {
    const v = ref.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;

    let dur = 0;
    let raf = 0;
    let cur = 0;
    let active = false;

    const onMeta = () => { dur = v.duration || 0; };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) dur = v.duration || 0;

    const targetTime = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // 0 when the section top enters at the bottom; 1 the moment its top reaches
      // the top of the viewport.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      return p * (dur || 0);
    };

    const loop = () => {
      const t = targetTime();
      cur += (t - cur) * 0.15;              // ease toward the scroll target
      if (Math.abs(t - cur) < 0.004) cur = t; // settle exactly, then stop seeking
      if (dur && Math.abs(v.currentTime - cur) > 0.01) {
        try { v.currentTime = cur; } catch { /* not seekable yet */ }
      }
      if (active) raf = requestAnimationFrame(loop);
    };

    // Only run the loop while the section is on screen.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !active) {
          active = true;
          cur = v.currentTime;
          raf = requestAnimationFrame(loop);
        } else if (!visible && active) {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      active = false;
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, []);

  return (
    <section className="relative z-10 bg-white">
      {/* fixed-ratio frame crops the empty top/bottom of the 16:9 video */}
      <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ aspectRatio: "2.6 / 1" }}>
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          // lift the light backdrop up to plain white so it matches the other sections
          style={{ filter: "brightness(1.06) contrast(1.12)" }}
        >
          <source src="/video/intro.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

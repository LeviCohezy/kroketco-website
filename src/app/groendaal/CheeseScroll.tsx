"use client";

import { useEffect, useRef } from "react";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

const N = 120; // number of extracted frames
const frameSrc = (i: number) => `/new-images/cheese-frames/f-${String(i + 1).padStart(3, "0")}.webp`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// Scroll scrubs the spinning cheese wheel; once it has finished turning, the
// wheel cross-fades out and the bear-shaped kaaskroket fades in, while the
// wordmark swaps from "Roeselaars Streekproduct" to "Roeselaarse kaaskroket".
export default function CheeseScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kroketRef = useRef<HTMLImageElement>(null);
  const word1Ref = useRef<HTMLDivElement>(null);
  const word2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const kroket = kroketRef.current;
    const word1 = word1Ref.current;
    const word2 = word2Ref.current;
    if (!section || !canvas || !kroket || !word1 || !word2) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frames: HTMLImageElement[] = [];
    for (let i = 0; i < N; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      frames.push(img);
    }

    let lastIdx = -1;
    const draw = (i: number) => {
      const img = frames[i];
      if (!img || !img.complete || !img.naturalWidth) return;
      if (canvas.width !== img.naturalWidth) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      lastIdx = i;
    };
    if (frames[0].complete) draw(0);
    else frames[0].onload = () => draw(0);

    const crossfade = (p: number) => {
      const t = smooth(0.5, 0.72, p); // 0 = cheese, 1 = kroket (held to the end)
      canvas.style.opacity = String(1 - t);
      kroket.style.opacity = String(t);
      word1.style.opacity = String(1 - t);
      word2.style.opacity = String(t);
    };
    crossfade(0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return clamp01(-rect.top / (total || 1));
    };

    let raf = 0;
    let curF = 0;
    let active = false;
    const loop = () => {
      const p = progress();
      // spin uses the first ~45% of the scroll, then the cross-fade takes over
      const target = clamp01(p / 0.45) * (N - 1);
      curF += (target - curF) * 0.2;
      if (Math.abs(target - curF) < 0.25) curF = target;
      const idx = Math.max(0, Math.min(N - 1, Math.round(curF)));
      if (idx !== lastIdx) draw(idx);
      crossfade(p);
      if (active) raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0].isIntersecting;
        if (vis && !active) { active = true; raf = requestAnimationFrame(loop); }
        else if (!vis && active) { active = false; cancelAnimationFrame(raf); }
      },
      { threshold: 0 }
    );
    io.observe(section);

    return () => {
      io.disconnect();
      active = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-white">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* visual — cheese wheel cross-fading into the kroket */}
        <div className="relative flex h-[60vh] w-[min(92vw,560px)] items-center justify-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={854}
            className="absolute left-1/2 top-1/2 h-full w-auto max-w-[92vw] -translate-x-1/2 -translate-y-1/2"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={kroketRef}
            src="/new-images/kroket-beertje.png"
            alt="Roeselaarse kaaskroket in de vorm van een beertje"
            className="absolute left-1/2 top-1/2 h-full w-auto max-w-[92vw] -translate-x-1/2 -translate-y-1/2 object-contain"
            style={{ opacity: 0 }}
          />
        </div>

        {/* wordmark — cross-fading text */}
        <div className="relative -mt-[1vh] select-none text-center leading-[0.84]">
          <div ref={word1Ref}>
            <span className="block text-[clamp(2rem,10vw,8rem)] uppercase tracking-[-0.01em] text-forest" style={OSWALD}>
              Roeselaars
            </span>
            <span className="block text-[clamp(2rem,10vw,8rem)] uppercase tracking-[-0.01em] text-forest" style={OSWALD}>
              Streekproduct
            </span>
          </div>
          <div ref={word2Ref} className="absolute inset-0" style={{ opacity: 0 }}>
            <span className="block text-[clamp(2rem,10vw,8rem)] uppercase tracking-[-0.01em] text-forest" style={OSWALD}>
              Roeselaarse
            </span>
            <span className="block text-[clamp(2rem,10vw,8rem)] uppercase tracking-[-0.01em] text-forest" style={OSWALD}>
              Kaaskroket
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

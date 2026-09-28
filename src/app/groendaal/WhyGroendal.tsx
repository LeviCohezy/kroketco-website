"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/app/_ui/ContentProvider";
import { EditableText } from "@/app/_ui/edit/Editable";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

// Card styling cycles through this list (index modulo length), so the admin
// can add or remove cards freely.
const CARD_STYLES = [
  { bg: "bg-lime", text: "text-forest", tilt: -3 },
  { bg: "bg-orange", text: "text-cream", tilt: 2.5 },
  { bg: "bg-light-blue", text: "text-forest", tilt: -2 },
];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const TWO_PI = Math.PI * 2;

export default function WhyGroendal() {
  const content = useContent("groendaal.why");
  const cards = content.cards.map((c, i) => ({ ...c, ...CARD_STYLES[i % CARD_STYLES.length] }));
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading) return;

    // drop refs of cards that were removed since the last render
    cardRefs.current.length = cards.length;

    const apply = (p: number) => {
      // heading fades + drifts up early
      const hFade = smooth(0.03, 0.18, p);
      heading.style.opacity = String(1 - hFade);
      heading.style.transform = `translateY(${-hFade * 46}px) scale(${1 - hFade * 0.06})`;

      // wave is prominent through the middle of the scroll
      const waveGate = smooth(0.34, 0.5, p) * (1 - smooth(0.82, 0.96, p));

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        // staggered fly-in from below
        const e = smooth(0.12 + i * 0.05, 0.42 + i * 0.05, p);
        // everyone keeps drifting further up
        const d = smooth(0.42, 1, p);
        // travelling wave — each card a phase apart → 1 up, 2 up, 1 down …
        const wave = Math.sin(p * 3.5 * TWO_PI + i * (TWO_PI / 3));

        const y = lerp(78, 0, e) + lerp(0, -22, d) + 9 * wave * waveGate;
        card.style.transform = `translateY(${y}vh)`;
        card.style.opacity = String(e);
      });
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      heading.style.opacity = "0";
      cardRefs.current.forEach((card) => {
        if (card) { card.style.transform = "none"; card.style.opacity = "1"; }
      });
      return;
    }

    apply(0);

    const progress = () => {
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      return clamp01(-rect.top / (total || 1));
    };

    let raf = 0;
    let active = false;
    const loop = () => {
      apply(progress());
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
  }, [cards.length]);

  const heading = (
    <>
      <EditableText as="span" section="groendaal.why" field="title" />
      {content.titleAccent && (
        <>
          {" "}
          <EditableText as="span" section="groendaal.why" field="titleAccent" className="text-lime" />
        </>
      )}
    </>
  );

  return (
    <>
      {/* DESKTOP / TABLET — scroll-driven wave choreography */}
      <section ref={sectionRef} className="relative hidden h-[300vh] bg-forest md:block">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 sm:px-12">
          {/* big centred heading — fades away on scroll */}
          <div
            ref={headingRef}
            className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center text-center"
          >
            <EditableText
              as="span"
              section="groendaal.why"
              field="eyebrow"
              className="mb-4 text-[13px] font-bold uppercase tracking-[0.1em] text-lime"
            />
            <h2
              className="max-w-4xl text-[clamp(2rem,6vw,5rem)] uppercase leading-[1] tracking-tight text-cream"
              style={OSWALD}
            >
              {heading}
            </h2>
          </div>

          {/* floating cards */}
          <div className="relative z-10 flex w-full max-w-[1200px] items-center justify-center gap-4 sm:gap-8">
            {cards.map((c, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="w-[30vw] max-w-[320px] will-change-transform"
                style={{ opacity: 0 }}
              >
                <div
                  className={`${c.bg} ${c.text} rounded-[22px] p-4 shadow-[0_34px_70px_-24px_rgba(0,0,0,0.6)] sm:rounded-[26px] sm:p-7`}
                  style={{ transform: `rotate(${c.tilt}deg)` }}
                >
                  <EditableText
                    as="h3"
                    section="groendaal.why"
                    listField="cards"
                    index={i}
                    itemKey="title"
                    className="text-[clamp(0.95rem,2vw,1.9rem)] uppercase leading-[1.05]"
                    style={OSWALD}
                  />
                  <EditableText
                    as="p"
                    section="groendaal.why"
                    listField="cards"
                    index={i}
                    itemKey="body"
                    className="mt-2 whitespace-pre-line text-[clamp(0.7rem,1vw,1rem)] leading-relaxed opacity-90 sm:mt-4"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOBILE — sticky stacking cards */}
      <section className="bg-forest px-6 py-16 md:hidden">
        <div className="text-center">
          <EditableText
            as="span"
            section="groendaal.why"
            field="eyebrow"
            className="text-[13px] font-bold uppercase tracking-[0.1em] text-lime"
          />
          <h2
            className="mt-4 text-[clamp(1.8rem,8vw,2.7rem)] uppercase leading-[1.02] tracking-tight text-cream"
            style={OSWALD}
          >
            {heading}
          </h2>
        </div>

        <div className="mt-10 pb-[30vh]">
          {cards.map((c, i) => (
            <div
              key={i}
              className="sticky mb-5"
              style={{ top: `${104 + i * 14}px`, zIndex: i + 1 }}
            >
              <div
                className={`${c.bg} ${c.text} min-h-[38vh] rounded-[24px] p-7 shadow-[0_26px_54px_-18px_rgba(0,0,0,0.6)]`}
              >
                <span className="text-[12px] font-bold uppercase tracking-[0.12em] opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <EditableText
                  as="h3"
                  section="groendaal.why"
                  listField="cards"
                  index={i}
                  itemKey="title"
                  className="mt-3 text-[clamp(1.5rem,7vw,2rem)] uppercase leading-[1.05]"
                  style={OSWALD}
                />
                <EditableText
                  as="p"
                  section="groendaal.why"
                  listField="cards"
                  index={i}
                  itemKey="body"
                  className="mt-3 whitespace-pre-line leading-relaxed opacity-90"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

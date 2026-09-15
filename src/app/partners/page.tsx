"use client";

import { useEffect, useRef, useState } from "react";
import { PageFooter } from "../_ui/SiteChrome";
import { PARTNERS } from "./partners-data";

// Colour combos for the hero, generated as every top × section × band pairing.
// Rule: the top background is never the same colour as the marquee band.
// Tops/sections stay light so the forest heading + cards stay readable.
const HEX: Record<string, string> = {
  wit: "#ffffff",
  "light-blue": "#bfe6ff",
  lime: "#c7e36a",
  forest: "#0e4b3a",
  oranje: "#ff8a00",
};
const INK: Record<string, string> = {
  forest: "#fff3e2",
  oranje: "#ffffff",
  "light-blue": "#0e4b3a",
  lime: "#0e4b3a",
  wit: "#0e4b3a",
};
const TOPS = ["wit", "light-blue", "lime"];
const SECTIONS = ["wit", "light-blue", "lime"];
const BANDS = ["forest", "oranje", "light-blue", "lime", "wit"];

const COMBOS = TOPS.flatMap((top) =>
  SECTIONS.flatMap((section) =>
    BANDS.filter((band) => HEX[band] !== HEX[top]).map((band) => ({
      name: `top ${top} · sectie ${section} · band ${band}`,
      top: HEX[top],
      section: HEX[section],
      band: HEX[band],
      ink: INK[band],
    }))
  )
);

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// A marquee whose text follows a "Z" / step path — flat, then diagonally up to
// the right, then flat again (rounded corners). Scrolls seamlessly via rAF.
function CurvedMarquee({ words, band, ink, surface }: { words: string[]; band: string; ink: string; surface: string }) {
  const textRef = useRef<SVGTextElement>(null);
  const tpRef = useRef<SVGTextPathElement>(null);
  const SETS = 8;

  useEffect(() => {
    let raf = 0;
    let off = 0;
    let last = 0;
    let setLen = 0;
    const start = () => {
      const t = textRef.current;
      const tp = tpRef.current;
      if (!t || !tp) return;
      setLen = t.getComputedTextLength() / SETS;
      if (!setLen) return;
      const speed = 55; // user-units per second
      const tick = (now: number) => {
        if (!last) last = now;
        off -= speed * ((now - last) / 1000);
        last = now;
        if (off <= -setLen) off += setLen;
        tp.setAttribute("startOffset", String(off));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    if (typeof document !== "undefined" && document.fonts?.ready) document.fonts.ready.then(start);
    else start();
    return () => cancelAnimationFrame(raf);
  }, []);

  const set = words.map((w) => w.toUpperCase()).join("   ✦   ") + "   ✦   ";
  // Z path: flat low → diagonally up → flat high (rounded knees).
  const Z = "M0,140 L550,140 Q600,140 649,130.2 L951,69.8 Q1000,60 1050,60 L1600,60";
  return (
    <svg
      viewBox="0 0 1600 200"
      preserveAspectRatio="xMidYMid slice"
      className="block w-full"
      style={{ height: "clamp(96px, 10vw, 176px)" }}
      aria-hidden
    >
      <defs>
        <path id="cmq-path" d={Z} fill="none" />
      </defs>
      {/* surface-coloured fill below the Z — hides the video, blends into the list */}
      <path d={`${Z} L1600,200 L0,200 Z`} style={{ fill: surface }} />
      <use href="#cmq-path" stroke={band} strokeWidth="60" strokeLinecap="round" fill="none" />
      <text
        ref={textRef}
        fill={ink}
        dominantBaseline="middle"
        style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600, fontSize: "42px", letterSpacing: "0.04em" }}
      >
        <textPath ref={tpRef} href="#cmq-path" startOffset="0">
          {set.repeat(SETS)}
        </textPath>
      </text>
    </svg>
  );
}

// Scalloped "sticker" badge (same rounded-scallop shape as the homepage image
// labels): a central disc + ring of overlapping circles, with the logo inside.
function ScallopBadge({ logo, alt, dark = false }: { logo: string; alt: string; dark?: boolean }) {
  const N = 16, R = 33, c = 50, bumpR = 7;
  const bumps = Array.from({ length: N }, (_, i) => {
    const a = (2 * Math.PI * i) / N;
    return { cx: +(c + R * Math.cos(a)).toFixed(2), cy: +(c + R * Math.sin(a)).toFixed(2) };
  });
  return (
    <div className="absolute right-3 top-3 h-[clamp(58px,9vw,80px)] w-[clamp(58px,9vw,80px)] rotate-[-8deg] drop-shadow-[0_6px_16px_rgba(0,0,0,0.32)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill={dark ? "#0e4b3a" : "#ffffff"}>
          <circle cx={c} cy={c} r={R} />
          {bumps.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={bumpR} />
          ))}
        </g>
      </svg>
      <img src={logo} alt={alt} className="absolute inset-0 m-auto max-h-[52%] max-w-[60%] object-contain" />
    </div>
  );
}


export default function PartnersPage() {
  const [combo, setCombo] = useState(0);
  const c = COMBOS[combo];
  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HERO */}
      <section className="relative text-forest" style={{ backgroundColor: c.top }}>
        <div className="mx-auto max-w-[1480px] px-6 pb-12 pt-28 sm:px-12 sm:pb-16 sm:pt-36 lg:px-16">
          {/* headline left, intro right */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1
                className="max-w-3xl text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.9] tracking-[0.01em]"
                style={OSWALD}
              >
                Sterk dankzij
                <br />
                onze partners
              </h1>
            </div>
            <p className="max-w-sm text-forest/75 lg:pb-3 lg:text-right">
              Kroketco werkt samen met zorgvuldig gekozen versgroothandels in heel Vlaanderen —
              samen brengen we onze ambachtelijke kroketten en verse puree tot bij de betere
              traiteur en de horeca.
            </p>
          </div>
        </div>

        {/* partner video — full width, straight corners; badge sits on the video */}
        <div className="relative w-full">
          <video
            className="block aspect-square w-full object-cover sm:aspect-[16/6]"
            autoPlay
            muted
            loop
            playsInline
            poster="/ugc/ugc-3.png"
          >
            <source src="/video/partners.mp4" type="video/mp4" />
          </video>
          <img
            src="/new-image-section/label-ambachtelijk.png"
            alt="Ambachtelijk"
            className="absolute right-4 top-4 w-[clamp(84px,11vw,150px)] rotate-[9deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)] sm:right-10 sm:top-8"
          />

          {/* Z marquee sits on the video/list seam; the fill below it hides the
              rest of the video so everything under the marquee reads as white. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0">
            <CurvedMarquee
              words={["Sterk samen", "Lokaal", "Dagvers", "Betrouwbaar", "Ambachtelijk", "Puur Belgisch"]}
              band={c.band}
              ink={c.ink}
              surface={c.section}
            />
          </div>
        </div>
      </section>

      {/* PARTNER GRID */}
      <section className="px-6 pb-16 pt-10 sm:px-12 sm:pb-24 sm:pt-14 lg:px-16" style={{ backgroundColor: c.section }}>
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PARTNERS.map((p) => (
              <article
                key={p.name}
                className="flex flex-col overflow-hidden rounded-[26px] border border-forest/10 bg-white shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_66px_-22px_rgba(14,75,58,0.38)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
                  {p.card ? (
                    <>
                      <img
                        src={p.card}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <ScallopBadge logo={p.logo} alt={p.name} dark={p.badgeDark} />
                      <h3
                        className="absolute inset-x-5 bottom-4 text-[clamp(1.3rem,2.2vw,2rem)] uppercase leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
                        style={OSWALD}
                      >
                        {p.name}
                      </h3>
                    </>
                  ) : (
                    <div className="grid h-full w-full place-items-center p-10">
                      <img
                        src={p.logo}
                        alt={p.name}
                        className="max-h-[70%] max-w-[78%] object-contain"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm font-semibold text-forest/50">{p.tagline}</p>
                  <p className="mt-2 text-forest/75">{p.desc}</p>
                  <a
                    href={`/partners/${p.slug}`}
                    className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-forest px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.02]"
                  >
                    Meer info <ArrowRight />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORD PARTNER — contact form */}
      <section className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <div className="flex flex-col items-center gap-6 rounded-[24px] bg-[var(--light-blue)] px-6 py-14 text-center text-forest shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:px-8 sm:py-20">
            <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
              <span className="h-2 w-2 rounded-[2px] bg-orange" />
              Samenwerken?
            </span>
            <h2
              className="max-w-3xl text-[clamp(2rem,5vw,4rem)] uppercase leading-[0.95] tracking-[0.01em]"
              style={OSWALD}
            >
              Word partner van Kroketco
            </h2>
            <p className="max-w-xl text-lg font-medium text-forest/75">
              Versgroothandel, traiteur of horeca? Laat je gegevens achter en we nemen contact
              op om de samenwerking te bespreken.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-4 grid w-full max-w-[620px] gap-4 text-left">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="naam"
                  placeholder="Naam"
                  required
                  className="rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  className="rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
                />
              </div>
              <input
                type="text"
                name="onderwerp"
                placeholder="Onderwerp"
                className="rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <textarea
                name="bericht"
                placeholder="Je bericht"
                rows={5}
                required
                className="resize-y rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
              />
              <button
                type="submit"
                className="mx-auto inline-flex w-fit items-center gap-2 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
              >
                Verstuur <ArrowRight />
              </button>
            </form>
          </div>
        </div>
      </section>

      <PageFooter />

      {/* colour-combo switcher (dev/preview) */}
      <button
        onClick={() => setCombo((i) => (i + 1) % COMBOS.length)}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full bg-forest/95 px-4 py-3 text-cream shadow-[0_12px_34px_rgba(0,0,0,0.3)] backdrop-blur transition-transform hover:scale-[1.03]"
      >
        <span className="flex items-center gap-1">
          <span className="h-4 w-4 rounded-full border border-white/40" style={{ backgroundColor: c.top }} />
          <span className="h-4 w-4 rounded-full border border-white/40" style={{ backgroundColor: c.section }} />
          <span className="h-4 w-4 rounded-full border border-white/40" style={{ backgroundColor: c.band }} />
        </span>
        <span className="text-left text-[12px] font-bold leading-tight">
          {combo + 1}/{COMBOS.length}
          <br />
          <span className="font-medium text-cream/80">{c.name}</span>
        </span>
      </button>
    </main>
  );
}

"use client";

import { PageFooter } from "../_ui/SiteChrome";
import ContactForm from "../_ui/ContactForm";

// Presentation shape for the partners grid. Data comes from the CMS DB via the
// server page (see page.tsx).
export type PartnerCard = {
  slug: string;
  name: string;
  logo: string;
  city: string; // shown as the tagline
  description: string;
  thumbnail: string; // landscape photo; when absent the card shows the logo
};

// Colour combos for the hero, generated as every top × section × band pairing.
// Rule: the top background is never the same colour as the marquee band.
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
// the right, then flat again (rounded corners).
function CurvedMarquee({ words, band, ink, surface }: { words: string[]; band: string; ink: string; surface: string }) {
  const SETS = 8;
  const set = words.map((w) => w.toUpperCase()).join("   ✦   ") + "   ✦   ";
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
      <path d={`${Z} L1600,200 L0,200 Z`} style={{ fill: surface }} />
      <use href="#cmq-path" stroke={band} strokeWidth="60" strokeLinecap="round" fill="none" />
      <text
        fill={ink}
        dominantBaseline="middle"
        style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600, fontSize: "42px", letterSpacing: "0.04em" }}
      >
        <textPath href="#cmq-path" startOffset="0">
          {set.repeat(SETS)}
        </textPath>
      </text>
    </svg>
  );
}

// Scalloped "sticker" badge: a central disc + ring of overlapping circles, logo inside.
function ScallopBadge({ logo, alt }: { logo: string; alt: string }) {
  const N = 16, R = 33, c = 50, bumpR = 7;
  const bumps = Array.from({ length: N }, (_, i) => {
    const a = (2 * Math.PI * i) / N;
    return { cx: +(c + R * Math.cos(a)).toFixed(2), cy: +(c + R * Math.sin(a)).toFixed(2) };
  });
  return (
    <div className="absolute right-3 top-3 h-[clamp(58px,9vw,80px)] w-[clamp(58px,9vw,80px)] rotate-[-8deg] drop-shadow-[0_6px_16px_rgba(0,0,0,0.32)]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <g fill="#ffffff">
          <circle cx={c} cy={c} r={R} />
          {bumps.map((b, i) => (
            <circle key={i} cx={b.cx} cy={b.cy} r={bumpR} />
          ))}
        </g>
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt={alt} className="absolute inset-0 m-auto max-h-[52%] max-w-[60%] object-contain" />
    </div>
  );
}

export default function PartnersView({ partners }: { partners: PartnerCard[] }) {
  const c = COMBOS[0];
  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HERO */}
      <section className="relative text-forest" style={{ backgroundColor: c.top }}>
        <div className="mx-auto max-w-[1480px] px-6 pb-12 pt-28 sm:px-12 sm:pb-16 sm:pt-36 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-3xl text-[clamp(2.4rem,7vw,6rem)] uppercase leading-[0.9] tracking-[0.01em]" style={OSWALD}>
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

        {/* partner video — full width */}
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/new-image-section/label-ambachtelijk.png"
            alt="Ambachtelijk"
            className="absolute right-4 top-4 w-[clamp(84px,11vw,150px)] rotate-[9deg] drop-shadow-[0_10px_24px_rgba(0,0,0,0.28)] sm:right-10 sm:top-8"
          />

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
          {partners.length === 0 ? (
            <p className="text-center text-forest/60">Binnenkort meer over onze partners.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {partners.map((p) => (
                <article
                  key={p.slug}
                  className="flex flex-col overflow-hidden rounded-[26px] border border-forest/10 bg-white shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_34px_66px_-22px_rgba(14,75,58,0.38)]"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
                    {p.thumbnail ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumbnail} alt={p.name} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        {p.logo && <ScallopBadge logo={p.logo} alt={p.name} />}
                        <h3
                          className="absolute inset-x-5 bottom-4 text-[clamp(1.3rem,2.2vw,2rem)] uppercase leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]"
                          style={OSWALD}
                        >
                          {p.name}
                        </h3>
                      </>
                    ) : (
                      <div className="grid h-full w-full place-items-center p-10">
                        {p.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.logo} alt={p.name} className="max-h-[70%] max-w-[78%] object-contain" />
                        ) : (
                          <span className="text-[clamp(1.3rem,2.2vw,2rem)] uppercase text-forest" style={OSWALD}>
                            {p.name}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    {p.city && <p className="text-sm font-semibold text-forest/50">{p.city}</p>}
                    <p className="mt-2 text-forest/75">{p.description}</p>
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
          )}
        </div>
      </section>

      <ContactForm
        source="partners"
        eyebrow="Samenwerken?"
        heading="Word partner van Kroketco"
        text="Groothandel, traiteur of horeca? Laat je gegevens achter en we bekijken samen wat we voor je kunnen betekenen."
      />

      <PageFooter />
    </main>
  );
}

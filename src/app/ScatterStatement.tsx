/* eslint-disable @next/next/no-img-element */

const DISPLAY_FONT = {
  fontFamily: "var(--font-oswald), sans-serif",
  fontWeight: 600,
} as const;

type Floater = {
  src: string;
  alt: string;
  className: string; // absolute positioning + size + extras
  rotate?: string;
};

/* Small photos scattered around the centred mission paragraph.
   Most are hidden on small screens so they never overlap the text. */
const FLOATERS: Floater[] = [
  {
    src: "/ugc/ugc-1.png",
    alt: "Genieten van kroketten",
    className: "left-[3%] top-[8%] h-[104px] w-[104px]",
    rotate: "-rotate-6",
  },
  {
    src: "/ugc/ugc-2.png",
    alt: "Kroketten aan tafel",
    className: "hidden md:block left-[13%] bottom-[10%] h-[92px] w-[92px]",
    rotate: "rotate-3",
  },
  {
    src: "/kroketten/prod-kaas.jpg",
    alt: "Kaaskroketten",
    className: "hidden md:block left-[1%] top-[46%] h-[74px] w-[74px]",
    rotate: "rotate-6",
  },
  {
    src: "/ugc/ugc-3.png",
    alt: "Vrienden en kroketten",
    className: "hidden sm:block left-[22%] top-[2%] h-[68px] w-[68px]",
    rotate: "-rotate-3",
  },
  {
    src: "/ugc/ugc-4.png",
    alt: "Kroketten uit de oven",
    className: "right-[3%] top-[10%] h-[118px] w-[118px]",
    rotate: "rotate-3",
  },
  {
    src: "/kroketten/prod-garnaal.jpg",
    alt: "Garnaalkroketten",
    className: "hidden md:block right-[13%] bottom-[8%] h-[96px] w-[96px]",
    rotate: "-rotate-6",
  },
  {
    src: "/ugc/ugc-5.png",
    alt: "Smullen van kroketten",
    className: "hidden md:block right-[1%] top-[48%] h-[80px] w-[80px]",
    rotate: "rotate-6",
  },
  {
    src: "/kroketten/prod-klassiek.jpg",
    alt: "Klassieke kroketten",
    className: "hidden sm:block right-[22%] top-[3%] h-[64px] w-[64px]",
    rotate: "-rotate-3",
  },
  {
    src: "/ugc/ugc-6.png",
    alt: "Kroketten proeven",
    className: "hidden lg:block left-[30%] bottom-[4%] h-[72px] w-[72px]",
    rotate: "rotate-3",
  },
  {
    src: "/kroketten/prod-beertjes.jpg",
    alt: "Kroketbeertjes",
    className: "hidden lg:block right-[30%] bottom-[3%] h-[78px] w-[78px]",
    rotate: "-rotate-6",
  },
];

function StarburstBadge() {
  // 12-point starburst polygon, filled orange, "Kroketco" centred.
  const points = Array.from({ length: 24 }, (_, i) => {
    const angle = (Math.PI / 12) * i - Math.PI / 2;
    const r = i % 2 === 0 ? 50 : 39;
    const x = 50 + r * Math.cos(angle);
    const y = 50 + r * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");

  return (
    <div className="pointer-events-none absolute -top-8 right-[8%] z-20 hidden h-[104px] w-[104px] rotate-[14deg] sm:block md:h-[124px] md:w-[124px]">
      <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-lg">
        <polygon points={points} fill="var(--orange)" />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-center text-[13px] uppercase leading-none tracking-wide text-forest md:text-[15px]"
        style={DISPLAY_FONT}
      >
        Kroketco
      </span>
    </div>
  );
}

export default function ScatterStatement() {
  return (
    <>
      {/* ============ PART A — white mission area ============ */}
      <section className="relative min-h-[560px] overflow-hidden bg-white py-20 text-forest sm:py-28">
        <div className="relative mx-auto max-w-[1480px] px-6 sm:px-12 lg:px-16">
          {/* pill labels */}
          <span className="absolute left-6 top-0 z-10 rounded-full bg-forest px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream sm:left-12 lg:left-16">
            Ons doel
          </span>
          <span className="absolute right-6 top-0 z-10 rounded-full bg-forest px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream sm:right-12 lg:right-16">
            Zo werkt het
          </span>

          {/* scattered photos */}
          {FLOATERS.map((f, i) => (
            <img
              key={i}
              src={f.src}
              alt={f.alt}
              className={`absolute z-0 rounded-[16px] object-cover shadow-[0_14px_30px_-12px_rgba(14,75,58,0.45)] ${
                f.rotate ?? ""
              } ${f.className}`}
            />
          ))}

          {/* centred mission paragraph */}
          <p className="relative z-10 mx-auto max-w-[680px] text-center text-[clamp(1.3rem,2.6vw,2rem)] font-medium leading-relaxed text-forest/45">
            <span className="font-bold text-forest">Kroketco</span> maakt al meer
            dan{" "}
            <span className="font-bold text-forest">25 jaar</span> de{" "}
            <span className="font-bold text-forest">
              lekkerste ambachtelijke Belgische kroketten
            </span>{" "}
            &mdash; <span className="font-bold text-forest">vers gedraaid</span>,
            met de hand gepaneerd en{" "}
            <span className="font-bold text-forest">goudbruin gebakken</span>,
            voor thuis, de betere traiteur en de horeca.
          </p>
        </div>
      </section>

      {/* ============ PART B — dark-green statement band ============ */}
      <section className="relative overflow-hidden bg-forest py-24 text-center sm:py-32">
        <div className="relative mx-auto max-w-[1480px] px-6 sm:px-12 lg:px-16">
          <div className="relative inline-block">
            <StarburstBadge />
            <h2
              className="uppercase leading-[0.95] text-[clamp(2.6rem,7vw,6rem)]"
              style={{ ...DISPLAY_FONT, color: "var(--kc-golden, #f5c542)" }}
            >
              Versheid,
              <br />
              elke keer
              <br />
              opnieuw <span aria-hidden="true">🥕</span>
            </h2>
          </div>

          <p className="mx-auto mt-8 max-w-[540px] text-[clamp(1rem,1.6vw,1.2rem)] font-medium leading-relaxed text-cream/80">
            Elke dag opnieuw met de hand gedraaid, gepaneerd en gebakken &mdash;
            zoals een echte Belgische kroket hoort te zijn.
          </p>
        </div>
      </section>
    </>
  );
}

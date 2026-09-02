import Image from "next/image";
import VersionSwitch from "@/components/VersionSwitch";

/**
 * UGC card row — real Kroketco Belgium croquette photography from /public/ugc/.
 * Each card pairs a lifestyle shot with a Dutch flavour word and a playful
 * colored frame + pill label, matching the brand style.
 */
type FrameColor = "lime" | "pink" | "purple" | "orange" | "gold" | "blue";

type Card = {
  label: string;
  src: string;
  color: FrameColor;
};

// Full class strings (not interpolated) so Tailwind detects them at build time.
const FRAME: Record<FrameColor, { border: string; pill: string }> = {
  lime: { border: "border-frame-lime", pill: "bg-frame-lime" },
  pink: { border: "border-frame-pink", pill: "bg-frame-pink" },
  purple: { border: "border-frame-purple", pill: "bg-frame-purple" },
  orange: { border: "border-frame-orange", pill: "bg-frame-orange" },
  gold: { border: "border-frame-gold", pill: "bg-frame-gold" },
  blue: { border: "border-frame-blue", pill: "bg-frame-blue" },
};

const CARDS: Card[] = [
  { label: "KROKANT", src: "/ugc/ugc-1.png", color: "lime" },
  { label: "SMAAKBOM", src: "/ugc/ugc-2.png", color: "pink" },
  { label: "CULINAIR", src: "/ugc/ugc-3.png", color: "purple" },
  { label: "AMBACHTELIJK", src: "/ugc/ugc-4.png", color: "orange" },
  { label: "HUISGEMAAKT", src: "/ugc/ugc-5.png", color: "gold" },
  { label: "ROMIG", src: "/ugc/ugc-9.png", color: "blue" },
  { label: "GOUDBRUIN", src: "/ugc/ugc-6.png", color: "orange" },
];

function NavLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="text-sm font-semibold text-forest/90 transition-colors hover:text-forest"
    >
      {children}
    </a>
  );
}

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange font-display text-lg font-extrabold leading-none text-cream sm:h-10 sm:w-10 sm:text-xl">
        K<span className="text-[0.7em]">c</span>
      </span>
      <span className="font-display text-2xl font-extrabold tracking-tight text-forest sm:text-3xl">
        Kroketco
      </span>
    </a>
  );
}

function UgcCard({ card }: { card: Card }) {
  const f = FRAME[card.color];
  return (
    <div className="relative w-[220px] shrink-0 sm:w-[264px]">
      <div
        className={`overflow-hidden rounded-[28px] border-[5px] ${f.border} bg-cream shadow-lg`}
      >
        <div className="relative aspect-[3/4]">
          <Image
            src={card.src}
            alt={card.label}
            fill
            sizes="264px"
            className="object-cover"
          />
        </div>
      </div>
      <span
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full ${f.pill} px-4 py-1.5 font-display text-sm font-extrabold uppercase tracking-wide text-cream shadow-md sm:text-base`}
      >
        {card.label}
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-light-blue">
      {/* Top navigation: logo left, links centered, CTA right */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-7 sm:px-10">
        <Logo />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          <NavLink>Menu</NavLink>
          <NavLink>Deals</NavLink>
          <NavLink>Reviews</NavLink>
          <NavLink>Vind ons</NavLink>
        </nav>

        <a
          href="#"
          className="rounded-full bg-orange px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-cream shadow-sm transition-transform hover:scale-105"
        >
          Bestel nu
        </a>
      </header>

      {/* Hero copy, vertically centered in the space above the card row,
          flanked by floating croquette shots. */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <Image
          src="/hero/kroket-left.png"
          alt="Drie krokante Kroketco kroketten met peterselie"
          width={1100}
          height={648}
          priority
          className="pointer-events-none absolute left-0 top-1/2 hidden h-auto w-[300px] -translate-y-1/2 -rotate-3 select-none lg:block xl:w-[380px]"
        />

        <h1 className="relative z-10 font-display font-extrabold uppercase leading-[0.95] tracking-tight">
          <span className="block text-forest [font-size:clamp(2.75rem,8.5vw,7rem)]">
            Pak het.
          </span>
          <span className="block [font-size:clamp(2.75rem,8.5vw,7rem)]">
            <span className="text-forest">Dip het. </span>
            <span className="text-orange">Proef het.</span>
          </span>
        </h1>

        <div className="relative z-10 mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#"
            className="rounded-full bg-orange px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-cream shadow-md transition-transform hover:scale-105"
          >
            Bestel nu
          </a>
          <a
            href="#"
            className="rounded-full border-2 border-forest px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-forest transition-colors hover:bg-forest hover:text-cream"
          >
            Bekijk menu
          </a>
        </div>
      </section>

      {/* Hand + fork croquette reaching in diagonally from the top-right corner,
          so the wrist/arm bleeds off the edge — no visible cut. */}
      <Image
        src="/hero/kroket-right.png"
        alt="Een Kroketco kroket op een vork"
        width={1100}
        height={2378}
        priority
        className="pointer-events-none absolute right-0 top-0 z-0 hidden h-auto w-[240px] -translate-y-1/3 translate-x-[8%] rotate-[190deg] select-none lg:block xl:w-[280px]"
      />

      {/* Full-bleed auto-scrolling marquee of UGC cards, floating near the bottom.
          The track holds two identical sets so the -50% loop is seamless. */}
      <div className="relative z-10 flex overflow-hidden pb-8">
        <div className="animate-marquee flex w-max">
          <ul className="flex shrink-0 items-end gap-4 pr-4">
            {CARDS.map((card, i) => (
              <li key={`a-${i}`}>
                <UgcCard card={card} />
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 items-end gap-4 pr-4" aria-hidden>
            {CARDS.map((card, i) => (
              <li key={`b-${i}`}>
                <UgcCard card={card} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <VersionSwitch active="v1" />
    </main>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";

type Review = {
  name: string;
  role: string;
  quote: string;
  tag: string;
  rating: string;
  color: string;
  photo: string;
};

const REVIEWS: Review[] = [
  {
    name: "Chef Lucas Verhaegen",
    role: "Restaurant De Kade — Antwerpen",
    quote:
      "De beste kroketten die ik in jaren op mijn kaart heb gehad. Krokant vanbuiten, romig vanbinnen — mijn gasten vragen er telkens naar.",
    tag: "Horeca",
    rating: "★ 5,0",
    color: "var(--lime)",
    photo: "/ugc/ugc-1.png",
  },
  {
    name: "Émilie Dumont",
    role: "Traiteur Fêtes & Saveurs — Namen",
    quote:
      "Voor onze events zijn deze kroketten een vaste waarde. Constante kwaliteit, ambachtelijk en altijd op tijd geleverd. Een echte aanrader.",
    tag: "Traiteur",
    rating: "★ 4,9",
    color: "#a88be0",
    photo: "/ugc/ugc-2.png",
  },
  {
    name: "Sofie Maes",
    role: "Thuiskok — Gent",
    quote:
      "Eindelijk kroketten die naar écht huisgemaakt smaken zonder al het werk. Perfect voor een feestje thuis — iedereen was verkocht!",
    tag: "Thuis",
    rating: "★ 4,8",
    color: "var(--light-blue)",
    photo: "/ugc/ugc-3.png",
  },
  {
    name: "Chef Karim Benali",
    role: "Brasserie Le Comptoir — Brussel",
    quote:
      "Ambachtelijk werk dat je proeft. De garnaalkroket is subliem en de service is onberispelijk. Wij bestellen elke week opnieuw.",
    tag: "Horeca",
    rating: "★ 5,0",
    color: "#ff8d8d",
    photo: "/ugc/ugc-4.png",
  },
  {
    name: "Tom & Greet Peeters",
    role: "Feestzaal 't Hof — Leuven",
    quote:
      "Al onze bruiloften starten met deze kroketten als hapje. Gasten zijn steevast onder de indruk. Belgisch vakmanschap op zijn best.",
    tag: "Traiteur",
    rating: "★ 4,9",
    color: "#f2c14e",
    photo: "/ugc/ugc-5.png",
  },
];

export default function Reviews() {
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollRow = (dir: number) => {
    rowRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 text-forest sm:py-24">
      <div className="mx-auto max-w-[1480px] px-6 sm:px-12 lg:px-16">
        {/* ---- header row ---- */}
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-3 w-3 rounded-[3px] bg-lime" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest/70">
                Reviews
              </span>
            </div>
            <h2
              className="mt-4 max-w-[16ch] uppercase leading-[0.95] text-[clamp(2rem,5vw,3.75rem)]"
              style={{
                fontFamily: "var(--font-oswald), sans-serif",
                fontWeight: 600,
              }}
            >
              Wat onze klanten zeggen
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              type="button"
              aria-label="Vorige reviews"
              onClick={() => scrollRow(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/25 text-forest transition-colors duration-200 hover:border-forest hover:bg-forest hover:text-cream"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Volgende reviews"
              onClick={() => scrollRow(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-forest/25 text-forest transition-colors duration-200 hover:border-forest hover:bg-forest hover:text-cream"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ---- scroll row ---- */}
        <div
          ref={rowRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {REVIEWS.map((r, i) => (
            <article
              key={i}
              className="flex w-[clamp(280px,26vw,340px)] shrink-0 snap-start flex-col overflow-hidden rounded-[26px] shadow-[0_24px_44px_-28px_rgba(0,0,0,0.45)]"
            >
              {/* top colored area */}
              <div
                className="flex flex-col p-6"
                style={{ backgroundColor: r.color }}
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-forest">
                    {r.rating}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-forest">
                    {r.tag}
                  </span>
                </div>

                <h3
                  className="mt-5 text-xl font-extrabold uppercase leading-tight text-forest"
                  style={{
                    fontFamily: "var(--font-oswald), sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {r.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-forest/60">
                  {r.role}
                </p>

                <p className="mt-4 text-[15px] leading-relaxed text-forest/80">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              {/* bottom photo area */}
              <div className="relative flex-1">
                <img
                  src={r.photo}
                  alt={`Kroketten van ${r.name}`}
                  className="h-full min-h-[190px] w-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-forest shadow-md transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Lees meer
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

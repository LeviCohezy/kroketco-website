/* eslint-disable @next/next/no-img-element */
import { PageFooter } from "../_ui/SiteChrome";
import WorkWithUsForm from "../_ui/WorkWithUsForm";
import CheeseScroll from "./CheeseScroll";
import WhyGroendal from "./WhyGroendal";
import FadeIn from "../_ui/FadeIn";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export const metadata = {
  title: "Groendal · Onze kaaspartner — Kroketco Belgium",
  description:
    "Onze culinaire kaaskroketten danken hun smaak aan Groendal — authentieke Belgische kaas uit Roeselare. Ontdek het verhaal achter de samenwerking.",
};

const FEATURES = [
  "Klaar in een wip",
  "Geworteld in traditie",
  "Innovatieve smaken",
  "Toegewijd aan kwaliteit",
  "Premium ingrediënten",
];

export default function GroendaalPage() {
  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HERO — full-bleed brand image */}
      <section className="relative">
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          <img
            src="/new-images/groendal-hero.png"
            alt="Groendal — authentieke Belgische kaas"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* FEATURE BAND — static diagonal band riding up onto the hero */}
      <section className="relative z-20 -mt-[7vh] overflow-hidden py-10">
        <div className="-rotate-2 scale-110 border-y-2 border-forest bg-white py-3.5">
          <div className="flex flex-wrap items-center justify-center gap-y-1 px-4">
            {FEATURES.map((f, i) => (
              <span key={i} className="flex items-center">
                <span className="whitespace-nowrap px-7 text-[clamp(0.85rem,1.3vw,1.1rem)] font-bold uppercase tracking-[0.14em] text-forest">
                  {f}
                </span>
                {i < FEATURES.length - 1 && <span className="text-[0.7em] text-forest">◆</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 1. CULINAIRE KAASKROKETTEN — scroll-driven spinning cheese */}
      <CheeseScroll />

      {/* 2. WIE IS GROENDAL — full-width image, heading + text bottom-left */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/new-images/groendal-sfeer.webp"
          alt="Het kaasgamma van Groendal"
          className="h-[72vh] min-h-[460px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1480px] px-6 pb-10 sm:px-12 sm:pb-14 lg:px-16">
            <h2
              className="whitespace-nowrap text-[clamp(1.5rem,5.5vw,4.4rem)] uppercase leading-[0.98] tracking-[0.01em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]"
              style={OSWALD}
            >
              Authentic Belgian cheese
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
              Groendal maakt authentieke Belgische kazen in Roeselare — bekroond voor
              's werelds beste kaas. Van jong tot extra gerijpt, elk wiel met zorg en
              vakmanschap gemaakt, aangevuld met boter en lokale producten.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WAAROM WE SAMENWERKEN — floating cards on dark green */}
      <WhyGroendal />

      {/* affinage shot, tucked right under the cards. Own stacking layer (z-20)
          so it always paints above the pinned WhyGroendal cards — otherwise it
          gets clipped by the still-pinned sticky section mid-scroll. */}
      <section className="relative z-20 bg-forest px-6 pb-20 sm:px-12 sm:pb-28 md:-mt-[16vh] lg:px-16">
        <div className="mx-auto max-w-[1480px]">
          <img
            src="/new-images/groendal-affinage.jpg"
            alt="Kaaswielen op affinage-rekken bij Groendal"
            className="h-[38vh] min-h-[260px] w-full rounded-[26px] object-cover object-center sm:h-[48vh]"
          />
        </div>
      </section>

      {/* HUN VERHAAL — white section, image left, story + CTA right */}
      <section className="bg-white px-6 py-20 sm:px-12 sm:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1300px] items-center gap-10 md:grid-cols-2 md:gap-16">
          <FadeIn>
            <img
              src="/new-images/groendal-team.jpg"
              alt="De kaasmakers van 't Groendal in de affinage-ruimte"
              className="aspect-[4/5] w-full rounded-[26px] object-cover shadow-[0_30px_60px_-28px_rgba(14,75,58,0.5)]"
            />
          </FadeIn>
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange">
              <span className="h-2 w-2 rounded-[2px] bg-orange" /> Kaasmakerij Roeselare
            </span>
            <h2 className="mt-5 text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[1] tracking-tight" style={OSWALD}>
              Hun verhaal
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-forest/75">
              't Groendal is een echte familiekaasmakerij in Roeselare, gerund door
              Johan Deweer en Dominique Steyaert. Wat begon als een melkveebedrijf
              groeide uit tot een volwaardige kaasmakerij: in 1987 draaiden ze hun
              eerste kazen, en in 2017 kozen ze resoluut voor de kaas.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-forest/75">
              Hun bekende Groenentaler — een halfharde boerenkaas met grote gaten, een
              volle smaak en zoete notentoetsen — viel zo in de smaak dat een astronaute
              er zelfs porties van naar het ISS liet sturen. Net die authentieke,
              ambachtelijke kaas geeft onze culinaire kaaskroketten hun karakter.
            </p>
            <a
              href="https://www.tgroendal.be/nl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-forest px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
            >
              Bezoek tgroendal.be
              <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
                <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 5. PARTNER WITH US */}
      <WorkWithUsForm partner="Groendal" />

      <PageFooter />
    </main>
  );
}

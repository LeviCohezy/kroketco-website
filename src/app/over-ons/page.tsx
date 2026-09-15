/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { CSSProperties } from "react";
import { PageFooter } from "../_ui/SiteChrome";
import HistoryTimeline from "../HistoryTimeline";

const display: CSSProperties = {
  fontFamily: "var(--font-oswald), sans-serif",
  fontWeight: 600,
};

export const metadata = {
  title: "Over ons · Kroketco Belgium",
  description:
    "Ambacht zoals het hoort. Ontdek het verhaal, de waarden en het team achter de ambachtelijke Belgische kroketten van Kroketco.",
};

const stats = [
  { value: "25+", label: "jaar vakmanschap" },
  { value: "100%", label: "Belgisch ambacht" },
  { value: "Vers", label: "gedraaid, elke dag" },
  { value: "3", label: "kanalen: thuis · traiteur · horeca" },
];

export default function OverOnsPage() {
  return (
    <main className="min-h-screen bg-cream text-forest">
      {/* 1. HERO — background video */}
      <section className="relative h-[90vh] min-h-[560px] w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video/atelier.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60" />

        <div className="relative flex h-full flex-col justify-end">
          <div className="mx-auto w-full max-w-[1480px] px-6 pb-24 sm:px-12 sm:pb-28 lg:px-16">
            {/* breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-[13px] font-semibold text-white/75">
              <Link href="/" className="transition-opacity hover:opacity-100 hover:text-white">Home</Link>
              <span>–</span>
              <span className="text-white">Over ons</span>
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <h1
                className="max-w-3xl whitespace-nowrap text-[clamp(1.8rem,6vw,5.5rem)] uppercase leading-[0.95] tracking-[0.01em] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]"
                style={display}
              >
                Vers &amp; ambachtelijk
                <br />
                lekker sinds 1996
              </h1>
              <a
                href="/#contact"
                className="shrink-0 rounded-xl bg-orange px-8 py-4 text-center text-[15px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.04]"
              >
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ATELIER STORY — image left, text right (rounded overlap on the hero) */}
      <section className="relative z-10 -mt-10 rounded-t-[48px] bg-white">
        <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-[24px] shadow-[0_20px_50px_-20px_rgba(14,75,58,0.45)]">
              <img
                src="/about/atelier.png"
                alt="Het Kroketco atelier — kroketten met de hand gedraaid"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="inline-block rounded-full bg-lime px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-forest">
                Ons atelier
              </span>
              <h2
                className="mt-5 text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.98] text-forest"
                style={display}
              >
                Een familiebedrijf met een hart voor ambacht
              </h2>
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-forest/80">
                <p>
                  In ons atelier in Roeselare draaien we elke dag verse kroketten —
                  met de hand gepaneerd en goudbruin gebakken, zoals het hoort.
                </p>
                <p>
                  Klein begonnen in een schuurtje, vandaag een moderne voedingsproducent.
                  Maar de zorg voor kwaliteit en het echte ambacht bleven altijd hetzelfde.
                </p>
              </div>
              <a
                href="/#contact"
                className="mt-8 inline-block rounded-xl bg-orange px-8 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.04]"
              >
                Neem contact op
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3 + 4. STATS pinned; the TIMELINE circle scrolls up over it (reveal) */}
      <div className="relative isolate">
        <section className="sticky top-0 z-0 flex min-h-screen items-start overflow-hidden rounded-b-[44px] bg-white">
          <div className="mx-auto w-full max-w-[1480px] px-6 pb-20 pt-24 sm:px-12 sm:pt-28 lg:px-16">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-[24px] bg-forest p-8 text-center text-cream shadow-[0_18px_40px_-22px_rgba(14,75,58,0.7)]"
                >
                  <div
                    className="text-[clamp(2.4rem,4vw,3.4rem)] uppercase leading-none text-lime"
                    style={display}
                  >
                    {s.value}
                  </div>
                  <div className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-cream/80">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="relative z-10">
          <HistoryTimeline />
        </div>
      </div>

      {/* 5. MARQUEE — between the timeline and the light-blue section */}
      <div className="overflow-hidden bg-orange py-4 text-cream sm:py-5">
        <div className="flex w-max animate-marquee items-center" style={{ animationDuration: "26s" }}>
          {[...Array(2)].flatMap((_, set) =>
            ["Ambachtelijk", "Vers gedraaid", "Belgisch", "Sinds 1996", "Met de hand", "Goudbruin"].map((w) => (
              <span
                key={`${set}-${w}`}
                className="flex items-center whitespace-nowrap text-[clamp(1.05rem,2.4vw,1.9rem)] font-bold uppercase tracking-[0.04em]"
                style={display}
              >
                {w}
                <span className="mx-6 text-lime sm:mx-8">✦</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* 6. ONZE MISSIE */}
      <section id="missie" className="bg-light-blue">
        <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="overflow-hidden rounded-[24px] shadow-[0_20px_50px_-20px_rgba(14,75,58,0.45)]">
              <img
                src="/ugc/ugc-5.png"
                alt="Samen genieten van kroketten"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-orange">
                Onze missie
              </span>
              <h2
                className="mt-4 text-[clamp(2rem,4vw,3.2rem)] uppercase leading-[1] text-forest"
                style={display}
              >
                De Belgische kroket in ere houden
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-forest/80">
                Wat ooit begon in een kleine keuken in Gent groeide uit tot een
                echt ambacht. Onze missie is simpel: de allerlekkerste
                ambachtelijke kroket maken en die dagelijks vers op tafel
                brengen — bij jou thuis, bij de traiteur en in de beste
                horecazaken.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-forest/80">
                Geen half werk, geen kunstmatige smaakjes. Enkel eerlijke
                ingrediënten, met de hand gedraaid en goudbruin gebakken. Zo
                blijft de Belgische kroket wat ze altijd hoort te zijn: een klein
                stukje geluk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-forest">
        <div className="mx-auto max-w-[1480px] px-6 py-20 text-center sm:px-12 sm:py-28 lg:px-16">
          <h2
            className="mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[1] text-cream"
            style={display}
          >
            Proef het vakmanschap zelf
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/80">
            Vers gedraaid, goudbruin gebakken. Ontdek het volledige assortiment en
            breng de smaak van echt Belgisch ambacht naar je tafel.
          </p>
          <div className="mt-9">
            <Link
              href="/producten"
              className="inline-block rounded-xl bg-lime px-8 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-forest transition-transform hover:scale-[1.04]"
            >
              Bekijk het assortiment
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

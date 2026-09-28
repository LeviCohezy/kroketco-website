/* eslint-disable @next/next/no-img-element */
"use client";

import type { ProductCard, PrepMethod } from "@/lib/types";
import { AllergenIcon, parseAllergens } from "@/lib/allergens";
import { Bereiding } from "../../product/[slug]/Bereiding";

// Live preview of the public /product/[slug] detail page, fed by the editor
// draft. This mirrors the real page (src/app/product/[slug]/page.tsx) 1:1 —
// same markup, classes and sections (hero, highlight cards, bereiding,
// ingredients + allergens) — so the client sees exactly how the page will look.

const DISPLAY = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden className={className}>
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0l-3.5-3.5a1 1 0 1 1 1.4-1.4l2.8 2.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function ProductDetailPreview({
  name,
  title,
  description,
  image,
  prepImage,
  allergenImage,
  frame,
  veggie,
  tags,
  cards,
  ingredients,
  allergens,
  preparation,
}: {
  name: string;
  title: string;
  description: string;
  image: string;
  prepImage: string;
  allergenImage: string;
  frame: string;
  veggie: boolean;
  tags: string[];
  cards: ProductCard[];
  ingredients: string[];
  allergens: string;
  preparation: { oven: PrepMethod; frituur: PrepMethod };
}) {
  const presentAllergens = parseAllergens(allergens);
  const present = new Set(presentAllergens.map((a) => a.code));
  const methods = [
    { title: "In de oven", method: preparation.oven },
    { title: "In de frituur", method: preparation.frituur },
  ].filter((m) => m.method.enabled && m.method.steps.length > 0);

  return (
    <main className="bg-white px-6 py-8 text-forest [font-family:var(--font-inter),sans-serif]">
      {/* ============================ PRODUCT HERO ============================ */}
      <section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* image — frame + photo always square */}
          <div className="relative aspect-square overflow-hidden rounded-[32px] p-5 shadow-[0_24px_60px_rgba(14,75,58,0.18)] sm:p-8" style={{ background: frame }}>
            {veggie && (
              <span className="absolute left-5 top-5 z-10 rounded-full bg-lime px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-forest">
                Vegetarisch
              </span>
            )}
            <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white/40">
              {image ? (
                <img src={image} alt={title || name} className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-forest/30">Geen afbeelding</div>
              )}
            </div>
          </div>

          {/* info */}
          <div>
            <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-orange">
              <span className="h-2 w-2 rounded-[2px] bg-orange" /> {name || "Productnaam"}
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] uppercase leading-[0.95] tracking-[0.01em]" style={DISPLAY}>
              {title || name || "Titel"}
            </h1>
            {description && (
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-forest/75">{description}</p>
            )}

            {tags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2.5">
                {tags.map((t) => (
                  <span key={t} className="rounded-full bg-lime px-4 py-2 text-[13px] font-semibold text-forest">
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream">
                Contacteer voor meer info <ArrowRight />
              </span>
              {(ingredients.length > 0 || present.size > 0) && (
                <span className="text-sm font-semibold text-forest underline underline-offset-4">
                  Allergenen &amp; info
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HIGHLIGHTS (cards) ============================ */}
      {cards.length > 0 && (
        <section className="mt-16">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c, i) => (
              <div key={i} className="h-full rounded-[24px] bg-white p-7 shadow-[0_12px_30px_rgba(14,75,58,0.08)]">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-lg font-bold text-forest" style={DISPLAY}>
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight text-forest">{c.title || "Titel"}</h3>
                {c.text && <p className="mt-2 text-[14px] leading-relaxed text-forest/60">{c.text}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============================ BEREIDING ============================ */}
      {methods.length > 0 && (
        <section className="mt-16">
          <Bereiding oven={preparation.oven} frituur={preparation.frituur} image={prepImage || image} alt={title || name} />
        </section>
      )}

      {/* ============================ INGREDIËNTEN & ALLERGENEN ============================ */}
      {(ingredients.length > 0 || present.size > 0) && (
        <section className="mt-16">
          <div className="max-w-2xl">
            <h2 className="text-[clamp(2.4rem,6vw,4.6rem)] uppercase leading-[0.88] text-forest" style={DISPLAY}>
              Puur &amp; eerlijk
            </h2>
            <span className="font-hand -mt-1 block -rotate-2 text-[clamp(2rem,4.5vw,3.4rem)] leading-none text-orange">
              geen geheimen
            </span>
          </div>

          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-4">
            {/* product image — 50% width (2 of 4 columns), always square; the
                two cards stretch to match its height. */}
            <div className="relative aspect-square overflow-hidden rounded-[28px] bg-light-blue shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] lg:col-span-2">
              {(allergenImage || image) && (
                <img src={allergenImage || image} alt={title || name} className="absolute inset-0 h-full w-full object-cover" />
              )}
            </div>

            {/* light-blue "puur & echt" ingredients panel — 25% */}
            {ingredients.length > 0 && (
              <div className="flex flex-col rounded-[28px] bg-light-blue p-7 text-forest shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)]">
                <span className="font-hand -rotate-2 text-[1.9rem] leading-none text-orange">onze belofte</span>
                <h3 className="mt-1 text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[0.9]" style={DISPLAY}>
                  Puur &amp; echt
                </h3>
                <ul className="mt-5 flex-1 space-y-3">
                  {ingredients.map((ing) => (
                    <li key={ing} className="flex items-start gap-2.5 text-[16px] leading-snug text-forest/80">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-forest text-cream">
                        <CheckIcon />
                      </span>
                      {ing}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-forest px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream">
                  Vraag stalen aan <ArrowRight />
                </span>
              </div>
            )}

            {/* cream allergens panel — 25% — with chef mascot */}
            <div className="relative flex flex-col overflow-hidden rounded-[28px] bg-cream p-7 shadow-[0_18px_44px_-18px_rgba(14,75,58,0.2)]">
              <span className="font-hand -rotate-2 text-[1.9rem] leading-none text-orange">let op</span>
              <h3 className="mt-1 text-[clamp(1.5rem,2.2vw,2rem)] uppercase leading-[0.9] text-forest" style={DISPLAY}>
                Allergenen
              </h3>
              {presentAllergens.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {presentAllergens.map((a) => (
                    <li key={a.code} className="flex items-center gap-3 text-[16px]">
                      <AllergenIcon code={a.code} className="h-10 w-10 ring-1 ring-forest/10" />
                      <span className="font-semibold text-forest">{a.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 flex items-center gap-2 text-[15px] font-medium text-forest/60">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-forest">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  Geen van de gekende allergenen
                </p>
              )}
              <p className="relative z-10 mt-4 max-w-[62%] text-[12px] leading-relaxed text-forest/50">
                Kan sporen bevatten van andere allergenen. Raadpleeg de verpakking.
              </p>
              <img
                src="/kroketten/chef.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 w-2/3 drop-shadow-[0_10px_20px_rgba(14,75,58,0.25)]"
              />
            </div>
          </div>
        </section>
      )}

      {ingredients.length === 0 &&
        present.size === 0 &&
        cards.length === 0 &&
        methods.length === 0 &&
        !description && (
          <p className="mt-8 text-center text-sm text-forest/40">
            Vul de productvelden in om de detailpagina hier te zien.
          </p>
        )}
    </main>
  );
}

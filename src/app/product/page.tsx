/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PageFooter } from "../_ui/SiteChrome";

const DISPLAY = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const USPS = ["Ambachtelijk", "Belgisch", "Vers gedraaid", "Vegetarisch"];

const HIGHLIGHTS = [
  { emoji: "🧀", title: "Romige kaasvulling", line: "Volle smaak van échte Belgische kazen, zacht en smeuïg." },
  { emoji: "🥖", title: "Krokant panko-jasje", line: "Knapperig gepaneerd voor die onweerstaanbare krokante beet." },
  { emoji: "👐", title: "Met de hand gedraaid", line: "Stuk voor stuk gerold in ons atelier in Gent." },
  { emoji: "⏱️", title: "Klaar in 12 min", line: "Zo van diepvries naar tafel — krokant vanbuiten, romig vanbinnen." },
];

const STEPS_FRITUUR = [
  "Verhit de frituurolie tot 180 °C.",
  "Bak de bevroren kaaskroketten 3 à 4 minuten goudbruin.",
  "Laat kort uitlekken op keukenpapier.",
  "Serveer meteen — krokant vanbuiten, romig vanbinnen.",
];

const STEPS_OVEN = [
  "Verwarm de oven voor op 220 °C (hetelucht).",
  "Leg de kroketten op een bakplaat met bakpapier.",
  "Bak 12 à 14 minuten, halverwege even keren.",
  "Laat 1 minuut rusten en dien warm op.",
];

const INGREDIENTS = [
  "Belgische kaas (28%)",
  "Melk",
  "Bloem (tarwe)",
  "Roomboter",
  "Panko (tarwe)",
  "Ei",
  "Nootmuskaat & peper",
  "Zeezout",
];

const ALLERGENS = [
  { name: "Gluten (tarwe)", present: true },
  { name: "Melk", present: true },
  { name: "Ei", present: true },
  { name: "Selderij", present: false },
  { name: "Noten", present: false },
  { name: "Soja", present: false },
];

const RELATED = [
  { name: "Klassieke kroket", price: "€6,95 / 12 stuks", src: "/kroketten/prod-klassiek.jpg", frame: "bg-lime" },
  { name: "Garnaalkroket", price: "€8,95 / 4 stuks", src: "/kroketten/prod-garnaal.jpg", frame: "bg-light-blue" },
  { name: "Kroket-beertjes", price: "€5,45 / 4 stuks", src: "/kroketten/prod-beertjes.jpg", frame: "bg-[var(--frame-gold)]" },
];

export default function ProductPage() {
  return (
    <main className="bg-cream text-forest [font-family:var(--font-inter),sans-serif]">
      {/* ============================ PRODUCT HERO ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 pt-28 sm:px-12 sm:pb-24 sm:pt-36 lg:px-16">
        <nav className="mb-8 flex items-center gap-2 text-[13px] font-medium text-forest/50">
          <Link href="/" className="transition-colors hover:text-forest">Home</Link>
          <span>/</span>
          <Link href="/producten" className="transition-colors hover:text-forest">Assortiment</Link>
          <span>/</span>
          <span className="text-forest">Kaaskroket</span>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* image */}
          <div className="relative overflow-hidden rounded-[32px] bg-lime p-6 shadow-[0_24px_60px_rgba(14,75,58,0.18)] sm:p-10">
            <span className="absolute left-6 top-6 z-10 rounded-full bg-forest px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-cream">
              Bestseller
            </span>
            <div className="relative aspect-square w-full overflow-hidden rounded-[22px] bg-white/40">
              <img src="/kroketten/prod-kaas.jpg" alt="Ambachtelijke Belgische kaaskroket" className="h-full w-full object-cover" />
            </div>
          </div>

          {/* info */}
          <div>
            <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-orange">
              <span className="h-2 w-2 rounded-[2px] bg-orange" /> Kaaskroket
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,6vw,4.6rem)] uppercase leading-[0.95] tracking-[0.01em]" style={DISPLAY}>
              De echte Belgische kaaskroket
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-forest/75">
              Vers gedraaid en goudbruin gebakken. Een volle, romige kaasvulling in
              een krokant panko-jasje — krokant vanbuiten, romig vanbinnen. Elke hap
              een feest, voor thuis, de betere traiteur en de horeca.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {USPS.map((u) => (
                <span key={u} className="rounded-full border border-forest/15 bg-white px-4 py-2 text-[13px] font-semibold text-forest">
                  {u}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="/#contact"
                className="inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
              >
                Contacteer voor meer info <ArrowRight />
              </a>
              <a href="#allergenen" className="text-sm font-semibold text-forest underline underline-offset-4 transition-opacity hover:opacity-70">
                Allergenen &amp; info
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ HIGHLIGHTS ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="rounded-[24px] bg-white p-7 shadow-[0_12px_30px_rgba(14,75,58,0.08)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime text-2xl">{h.emoji}</div>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-forest">{h.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-forest/60">{h.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================ BEREIDING ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="rounded-[32px] bg-forest px-6 py-14 text-cream sm:px-12 sm:py-16 lg:px-16">
          <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-lime">
            <span className="h-2 w-2 rounded-[2px] bg-lime" /> Bereiding
          </p>
          <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] uppercase leading-[1.02]" style={DISPLAY}>
            Zo bak je ze perfect
          </h2>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
            {[
              { title: "In de frituur", steps: STEPS_FRITUUR, note: "180 °C · 3–4 min" },
              { title: "In de oven", steps: STEPS_OVEN, note: "220 °C · 12–14 min" },
            ].map((m) => (
              <div key={m.title}>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-bold tracking-tight text-cream">{m.title}</h3>
                  <span className="rounded-full bg-lime/20 px-3 py-1 text-[12px] font-semibold text-lime">{m.note}</span>
                </div>
                <ol className="mt-6 space-y-4">
                  {m.steps.map((s, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange text-sm font-bold text-cream" style={DISPLAY}>
                        {i + 1}
                      </span>
                      <span className="pt-1 text-cream/85">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ INGREDIËNTEN & ALLERGENEN ============================ */}
      <section id="allergenen" className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-orange">
          <span className="h-2 w-2 rounded-[2px] bg-orange" /> Ingrediënten &amp; allergenen
        </p>
        <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,4vw,3rem)] uppercase leading-[1.02] text-forest" style={DISPLAY}>
          Puur &amp; eerlijk
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* ingredients */}
          <div className="rounded-[24px] bg-white p-8 shadow-[0_12px_30px_rgba(14,75,58,0.08)]">
            <h3 className="text-lg font-bold tracking-tight text-forest">Ingrediënten</h3>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3.5">
              {INGREDIENTS.map((ing) => (
                <li key={ing} className="flex items-center gap-2.5 text-[14px] text-forest/75">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange" /> {ing}
                </li>
              ))}
            </ul>
            <p className="mt-7 text-[13px] leading-relaxed text-forest/45">
              Zonder kunstmatige smaakversterkers. Ambachtelijk bereid in Gent.
            </p>
          </div>

          {/* allergens */}
          <div className="rounded-[24px] bg-white p-8 shadow-[0_12px_30px_rgba(14,75,58,0.08)]">
            <h3 className="text-lg font-bold tracking-tight text-forest">Allergenen</h3>
            <ul className="mt-6 divide-y divide-forest/10">
              {ALLERGENS.map((a) => (
                <li key={a.name} className="flex items-center justify-between py-3">
                  <span className="text-[14px] text-forest/80">{a.name}</span>
                  {a.present ? (
                    <span className="rounded-full bg-orange/12 px-3 py-1 text-[12px] font-semibold text-orange">Bevat</span>
                  ) : (
                    <span className="rounded-full bg-forest/[0.06] px-3 py-1 text-[12px] font-semibold text-forest/45">Vrij van</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-light-blue/50 p-4 text-[13px] leading-relaxed text-forest/70">
              <span className="text-base">ℹ️</span>
              <span>Kan sporen bevatten van andere allergenen. Raadpleeg steeds de verpakking.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ RELATED PRODUCTS ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="flex items-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-orange">
              <span className="h-2 w-2 rounded-[2px] bg-orange" /> Ook lekker
            </p>
            <h2 className="mt-5 text-[clamp(1.9rem,4vw,3rem)] uppercase leading-[1.02] text-forest" style={DISPLAY}>
              Ontdek meer kroketten
            </h2>
          </div>
          <Link href="/producten" className="hidden shrink-0 items-center gap-2 text-sm font-semibold text-forest underline underline-offset-4 transition-opacity hover:opacity-70 sm:inline-flex">
            Heel het assortiment <ArrowRight />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED.map((p) => (
            <Link
              key={p.name}
              href="/producten"
              className="group flex flex-col rounded-[24px] bg-white p-5 shadow-[0_12px_30px_rgba(14,75,58,0.08)] transition-transform hover:-translate-y-1"
            >
              <div className={`relative overflow-hidden rounded-[18px] ${p.frame} p-4`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-[14px]">
                  <img src={p.src} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between gap-3 px-1">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-forest">{p.name}</h3>
                  <p className="mt-0.5 text-[13px] font-medium text-forest/55">{p.price}</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest text-cream transition-transform group-hover:scale-110">
                  <ArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============================ CLOSING CTA ============================ */}
      <section className="mx-auto max-w-[1480px] px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
        <div className="relative overflow-hidden rounded-[32px] bg-forest px-6 py-16 text-center text-cream sm:px-12 sm:py-24">
          <p className="flex items-center justify-center gap-2.5 text-[12px] font-semibold uppercase tracking-[0.28em] text-lime">
            <span className="h-2 w-2 rounded-[2px] bg-lime" /> Elke hap een feest
          </p>
          <h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.98]" style={DISPLAY}>
            Klaar om te proeven?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">
            Vers gedraaid, goudbruin gebakken en zo bij jou thuis. Voor de betere
            traiteur en de horeca in heel België.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button className="inline-flex items-center gap-3 rounded-xl bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]">
              In winkelmandje <ArrowRight />
            </button>
            <Link href="/producten" className="inline-flex items-center gap-3 rounded-xl border border-cream/25 px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-colors hover:bg-cream/10">
              Bekijk assortiment
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

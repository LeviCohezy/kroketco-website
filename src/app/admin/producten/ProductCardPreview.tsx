/* eslint-disable @next/next/no-img-element */
"use client";

import { AllergenIcon, parseAllergens } from "@/lib/allergens";

// A faithful copy of the public product-card markup (src/app/producten/client.tsx)
// for the editor's live preview. Kept in sync by hand — it's the same card the
// visitor sees on /producten.

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function CroquetteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[15px] w-[15px] shrink-0">
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" fill="currentColor" opacity="0.15" />
      <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11.4h.01M10 13h.01M13 11h.01M16 12.6h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductCardPreview({
  name,
  sub,
  image,
  allergens,
  veggie,
}: {
  name: string;
  sub: string;
  image: string;
  allergens: string;
  veggie: boolean;
}) {
  const codes = parseAllergens(allergens).map((a) => a.code);
  const amount = sub.match(/\d+/)?.[0];

  return (
    <div className="w-full max-w-[380px] bg-white text-forest">
      <article className="group relative flex flex-col rounded-[26px] border border-forest/10 bg-white p-6 text-forest shadow-[0_18px_44px_-18px_rgba(14,75,58,0.28)] sm:p-7">
        {codes.length > 0 && (
          <div className="absolute right-4 top-4 z-10 flex flex-col -space-y-2.5" aria-label="Allergenen">
            {codes.map((code) => (
              <AllergenIcon key={code} code={code} className="h-8 w-8 ring-2 ring-white" />
            ))}
          </div>
        )}

        <div className="pr-12">
          <h3 className="text-[clamp(1.2rem,1.8vw,1.7rem)] uppercase leading-[1.05] tracking-tight text-forest" style={OSWALD}>
            {name || "Productnaam"}
          </h3>
        </div>

        <div className="relative my-5 aspect-square overflow-hidden rounded-[20px] bg-white">
          {image ? (
            <img src={image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[#f5f4ef] text-sm text-forest/30">Geen afbeelding</div>
          )}
          {veggie && (
            <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-forest shadow-sm">
              Veggie
            </span>
          )}
        </div>

        <div className="mt-auto">
          {amount && (
            <span className="mb-3 flex items-center gap-1 text-[13px] font-semibold text-forest/50">
              {amount}x <CroquetteIcon />
            </span>
          )}
          <span className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-forest px-5 py-3.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream">
            Meer info <ArrowRight />
          </span>
        </div>
      </article>
    </div>
  );
}

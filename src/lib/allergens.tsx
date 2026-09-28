/* eslint-disable @next/next/no-img-element */
// Single source of truth for allergens: code → Dutch label + icon.
// Used by the public product cards & detail page and the admin previews/editor.
//
// Icons live in /public/allergenen as transparent PNGs: a coloured disc with a
// white glyph centred at ~(50%, 44%) of the frame (diameter ~64% of the width)
// and the allergen name printed underneath. In the UI we only ever want the
// disc, so <AllergenIcon> clips to a circle and blows the image up so the disc
// fills it — the printed label is cropped away.

export type Allergen = {
  code: string;
  label: string;
  src?: string; // icon image; when absent an SVG fallback is drawn (Selderij)
  color?: string; // disc colour for the SVG fallback
};

// Canonical display order.
export const ALLERGENS: Allergen[] = [
  { code: "G", label: "Gluten", src: "/allergenen/gluten.png" },
  { code: "M", label: "Melk (lactose)", src: "/allergenen/melk.png" },
  { code: "E", label: "Ei", src: "/allergenen/ei.png" },
  { code: "N", label: "Noten", src: "/allergenen/noten.png" },
  { code: "P", label: "Pinda", src: "/allergenen/pinda.png" },
  { code: "SO", label: "Soja", src: "/allergenen/soja.png" },
  { code: "SE", label: "Sesam", src: "/allergenen/sesam.png" },
  { code: "V", label: "Vis", src: "/allergenen/vis.png" },
  { code: "SC", label: "Schaaldieren", src: "/allergenen/schaaldieren.png" },
  { code: "MO", label: "Mosterd", src: "/allergenen/mosterd.png" },
  { code: "S", label: "Selderij", color: "#3FA34D" }, // no icon → SVG fallback
];

export const ALLERGEN_MAP: Record<string, Allergen> = Object.fromEntries(
  ALLERGENS.map((a) => [a.code, a])
);

export const ALLERGEN_CODES = ALLERGENS.map((a) => a.code);

// Parse a comma-separated code string ("G,M,E") into ordered, deduped allergens.
export function parseAllergens(csv: string): Allergen[] {
  const seen = new Set<string>();
  for (const raw of csv.split(",")) {
    const c = raw.trim().toUpperCase();
    if (c && ALLERGEN_MAP[c]) seen.add(c);
  }
  // keep canonical order
  return ALLERGENS.filter((a) => seen.has(a.code));
}

function CeleryFallback({ color }: { color: string }) {
  return (
    <span className="absolute inset-0 grid place-items-center" style={{ backgroundColor: color }}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[52%] w-[52%]"
      >
        <path d="M12 21c-1-5-3.5-8-7-9 3.5-1 6.5 1 7 5" />
        <path d="M12 21c1-5 3.5-8 7-9-3.5-1-6.5 1-7 5" />
        <path d="M12 21v-8" />
      </svg>
    </span>
  );
}

// A single allergen rendered as a clean coloured disc. `className` sizes the
// circle (e.g. "h-8 w-8"). The label is never shown here — it's cropped out.
export function AllergenIcon({
  code,
  className = "h-8 w-8",
}: {
  code: string;
  className?: string;
}) {
  const a = ALLERGEN_MAP[code];
  if (!a) return null;
  return (
    <span
      title={a.label}
      aria-label={a.label}
      className={`relative inline-block shrink-0 overflow-hidden rounded-full bg-white ${className}`}
    >
      {a.src ? (
        <img
          src={a.src}
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none absolute left-[-30%] top-[-20%] w-[160%] max-w-none select-none"
        />
      ) : (
        <CeleryFallback color={a.color!} />
      )}
    </span>
  );
}

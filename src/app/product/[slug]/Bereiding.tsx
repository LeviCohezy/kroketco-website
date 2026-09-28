/* eslint-disable @next/next/no-img-element */
import type { PrepMethod } from "@/lib/types";
import { resolveSection, type ContentOf } from "@/lib/content/registry";
import { productenSections } from "@/lib/content/sections/producten";
import Multiline from "../../_ui/Multiline";

// "Zo bak je ze perfect" — the preparation section. Two columns (oven / frituur)
// split by a dashed divider, lime header pills with line icons, hand-drawn
// doodle arrows + script notes, and orange-numbered step rows on subtle pills.
// Shared by the public detail page and the admin live preview.

const DISPLAY = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;
const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/* ---------------------------------- icons --------------------------------- */
function OvenGlyph() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[18px] w-[18px]">
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M4 9h16" />
      <path d="M7.3 6.5h.01M10 6.5h.01" />
      <rect x="7" y="12" width="10" height="5.4" rx="1.2" />
      <path d="M9 14.7h6" />
    </svg>
  );
}
function BasketGlyph() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[18px] w-[18px]">
      <path d="M4 8.5h16l-1.3 9.2a1.6 1.6 0 0 1-1.58 1.3H6.88a1.6 1.6 0 0 1-1.58-1.3L4 8.5Z" />
      <path d="M8.6 8.5 10 4.6M15.4 8.5 14 4.6" />
      <path d="M8.3 12l.6 4.2M12 12v4.2M15.7 12l-.6 4.2" />
    </svg>
  );
}
function OvenIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
      <path d="M3.5 9h17" />
      <path d="M7 6.5h.01M10 6.5h.01" />
      <rect x="6.5" y="12" width="11" height="5.6" rx="1.3" />
      <path d="M9 14.8h6" />
    </svg>
  );
}
function TrayIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <path d="M4 10h16l-1.2 7.4a1.4 1.4 0 0 1-1.38 1.1H6.58a1.4 1.4 0 0 1-1.38-1.1L4 10Z" />
      <path d="M2.5 10 5 7.5h14L21.5 10" />
      <path d="M8 13.5h8" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <circle cx="12" cy="13.5" r="6.5" />
      <path d="M12 10v3.6l2.6 1.7" />
      <path d="M6.6 5.4 4.7 7.3M17.4 5.4l1.9 1.9" />
    </svg>
  );
}
function ThermoIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <path d="M14 13.6V6.2a2 2 0 1 0-4 0v7.4a3.6 3.6 0 1 0 4 0Z" />
      <path d="M12 8.6v5.2" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function BasketIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <path d="M3.5 8.5h17l-1.4 9.3a1.7 1.7 0 0 1-1.68 1.4H6.58A1.7 1.7 0 0 1 4.9 17.8L3.5 8.5Z" />
      <path d="M8.2 8.5 10 4.4M15.8 8.5 14 4.4" />
      <path d="M4.4 12.4h15.2" />
      <path d="M7.6 11.4l.7 5M12 11.4v5M16.4 11.4l-.7 5" />
    </svg>
  );
}
function DripIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <path d="M12 3.5v6M9 5l6 3.5M15 5 9 8.5" />
      <circle cx="8" cy="15.2" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.2" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15.2" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" {...S} className="h-[22px] w-[22px]">
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12.2l2.3 2.3 4.4-4.8" />
    </svg>
  );
}
function ArrowDoodle({ className = "h-7 w-11" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" fill="none" className={className}>
      <path
        d="M4 12C20 3 42 5 45 30"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 25l7 6 5-8"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SparkleBurst({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 44" fill="none" className={className}>
      <path d="M6 22h12" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M9 8l9 9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M9 36l9-9" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

/* --------------------------------- columns -------------------------------- */
// Texts come from the editable "product.bereiding" section; callers without it
// (e.g. the admin preview) fall back to the declared defaults.
export type BereidingLabels = ContentOf<"product.bereiding">;
const DEFAULT_LABELS = resolveSection(productenSections["product.bereiding"], null) as BereidingLabels;

const CONFIG = {
  oven: { titleKey: "ovenTitle", noteKey: "ovenNote", Glyph: OvenGlyph, icons: [OvenIcon, TrayIcon, ClockIcon] },
  frituur: { titleKey: "frituurTitle", noteKey: "frituurNote", Glyph: BasketGlyph, icons: [ThermoIcon, BasketIcon, DripIcon] },
} as const;

type Kind = keyof typeof CONFIG;

function Column({ kind, method, labels }: { kind: Kind; method: PrepMethod; labels: BereidingLabels }) {
  const cfg = CONFIG[kind];
  const Glyph = cfg.Glyph;
  const meta = [method.temp, method.time].filter(Boolean).join(" · ");
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-2.5 rounded-full bg-lime px-4 py-2 text-forest">
          <Glyph />
          <span className="text-[15px] font-bold uppercase tracking-[0.04em]" style={DISPLAY}>
            {labels[cfg.titleKey]}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-lime">
          <ArrowDoodle className="h-6 w-10" />
          <span className="font-hand text-[1.35rem] leading-none">{labels[cfg.noteKey]}</span>
        </span>
      </div>

      {meta && <p className="mt-3 text-[13px] font-semibold tracking-wide text-lime/90">{meta}</p>}

      <ol className="mt-5 space-y-3">
        {method.steps.map((s, i) => {
          const Icon = cfg.icons[i] ?? CheckIcon;
          return (
            <li key={i} className="flex items-center gap-3.5 rounded-2xl bg-white/[0.06] px-4 py-3">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-orange text-[15px] font-bold text-cream"
                style={DISPLAY}
              >
                {i + 1}
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center text-cream">
                <Icon />
              </span>
              <span className="text-[15px] leading-snug text-cream/90">{s}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* --------------------------------- section -------------------------------- */
export function Bereiding({
  oven,
  frituur,
  image,
  alt = "",
  labels = DEFAULT_LABELS,
}: {
  oven: PrepMethod;
  frituur: PrepMethod;
  image?: string;
  alt?: string;
  labels?: BereidingLabels;
}) {
  const cols = (
    [
      { kind: "oven", method: oven },
      { kind: "frituur", method: frituur },
    ] as { kind: Kind; method: PrepMethod }[]
  ).filter((c) => c.method.enabled && c.method.steps.length > 0);

  if (cols.length === 0) return null;
  const two = cols.length > 1;

  return (
    <div className="relative rounded-[32px] bg-forest px-6 py-12 text-cream sm:px-10 sm:py-14 lg:px-14">
      {/* floating croquette — lowest layer: absolute + z-0 so it sits behind the
          columns/notes and can hang down to just meet the "In de frituur" row. */}
      {image && (
        <div className="pointer-events-none absolute -right-4 -top-4 z-0 hidden w-[290px] lg:block xl:-right-8 xl:-top-6 xl:w-[360px]">
          <img
            src={image}
            alt={alt}
            className="w-full object-contain drop-shadow-[0_20px_28px_rgba(0,0,0,0.45)]"
          />
        </div>
      )}

      {/* header */}
      <div className="relative z-10 max-w-xl">
        <h2
          className="flex items-center gap-3 text-[clamp(2rem,4.6vw,3.4rem)] uppercase leading-[0.98]"
          style={DISPLAY}
        >
          <span>
            {labels.title} <span className="text-orange">{labels.titleAccent}</span>
          </span>
          <SparkleBurst className="h-6 w-6 shrink-0 text-orange" />
        </h2>
        <p className="mt-4 max-w-md text-cream/80">
          <Multiline text={labels.text} />
        </p>
      </div>

      {/* columns */}
      <div className={`relative z-10 mt-16 grid gap-8 ${two ? "lg:grid-cols-2 lg:gap-0" : ""}`}>
        {cols.map((c, idx) => (
          <div
            key={c.kind}
            className={
              two
                ? idx === 1
                  ? "lg:border-l lg:border-dashed lg:border-cream/25 lg:pl-10"
                  : "lg:pr-10"
                : ""
            }
          >
            <Column kind={c.kind} method={c.method} labels={labels} />
          </div>
        ))}
      </div>
    </div>
  );
}

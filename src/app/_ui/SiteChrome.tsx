"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { useContent } from "./ContentProvider";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

const SOCIALS: { label: string; key: "instagram" | "facebook" | "linkedin"; icon: React.ReactNode }[] = [
  {
    label: "Instagram",
    key: "instagram",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Facebook",
    key: "facebook",
    icon: <path d="M14 8.5h2V5.7h-2.3C11.4 5.7 10 7 10 9.2V11H8v2.8h2V21h2.8v-7.2h2.3l.4-2.8h-2.7V9.4c0-.6.3-.9 1-.9Z" fill="currentColor" />,
  },
  {
    label: "LinkedIn",
    key: "linkedin",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 10.2v6.3M7 7.7v.02M11 16.5v-3.4c0-1 .8-1.8 1.8-1.8s1.7.8 1.7 1.8v3.4M11 16.5v-3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

// Footer on every page — all texts and links come from /admin (Algemeen → Footer).
export function PageFooter() {
  const f = useContent("global.footer");
  const socials = SOCIALS.map((s) => ({ ...s, href: f[s.key] })).filter((s) => s.href.trim());
  return (
    <footer className="relative z-10 bg-forest text-cream">
      <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.1fr_1.4fr]">
          {/* brand + socials */}
          <div>
            <div className="flex items-center gap-3">
              <img src={f.logo} alt="Kroketco" className="h-14 w-auto" />
              <span className="text-[1.7rem] uppercase leading-none tracking-tight text-cream" style={OSWALD}>
                Kroketco
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">{f.blurb}</p>
            {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition-colors hover:bg-cream/10"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
            )}
          </div>

          {/* nav links */}
          <div>
            <h3 className="text-[15px] uppercase tracking-[0.12em] text-lime" style={OSWALD}>
              {f.linksTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {f.links.map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-cream/75 transition-colors hover:text-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h3 className="text-[15px] uppercase tracking-[0.12em] text-lime" style={OSWALD}>
              {f.contactTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              {f.address && <li>{f.address}</li>}
              {f.email && (
                <li>
                  <a href={`mailto:${f.email}`} className="transition-colors hover:text-cream">
                    {f.email}
                  </a>
                </li>
              )}
              {f.contactLabel && (
                <li>
                  <Link href={f.contactHref || "/#contact"} className="transition-colors hover:text-cream">
                    {f.contactLabel}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* newsletter */}
          <NewsletterForm compact />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/15 pt-8 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <span>{f.copyright}</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {f.legal.map((l, i) => (
              <Link key={i} href={l.href || "#"} className="transition-colors hover:text-cream">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

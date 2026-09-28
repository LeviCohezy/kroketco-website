/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

const LINKS = [
  { label: "Producten", href: "/producten" },
  { label: "Partners", href: "/partners" },
  { label: "Groendal", href: "/groendaal" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Nieuws", href: "/nieuws" },
];

export function PageNav({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--light-blue)]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-4 sm:px-12 lg:px-16">
        <Link href="/" className="flex items-center">
          <img src="/hero/logo-kroketco.png" alt="Kroketco" className="h-11 w-auto sm:h-12" />
        </Link>
        <div className="hidden items-center gap-7 text-[13px] font-bold uppercase tracking-[0.08em] text-forest sm:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`transition-opacity hover:opacity-70 ${active === l.label ? "opacity-100" : "opacity-80"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="#"
          className="rounded-lg bg-orange px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03]"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
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
    href: "https://facebook.com",
    icon: <path d="M14 8.5h2V5.7h-2.3C11.4 5.7 10 7 10 9.2V11H8v2.8h2V21h2.8v-7.2h2.3l.4-2.8h-2.7V9.4c0-.6.3-.9 1-.9Z" fill="currentColor" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7 10.2v6.3M7 7.7v.02M11 16.5v-3.4c0-1 .8-1.8 1.8-1.8s1.7.8 1.7 1.8v3.4M11 16.5v-3.9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export function PageFooter() {
  return (
    <footer className="relative z-10 bg-forest text-cream">
      <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-12 sm:py-20 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1.1fr_1.4fr]">
          {/* brand + socials */}
          <div>
            <img src="/hero/logo-kroketco.png" alt="Kroketco" className="h-16 w-auto" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
              Ambachtelijke Belgische kroketten. Vers gedraaid, met de hand gepaneerd en goudbruin
              gebakken — voor thuis, de betere traiteur en de horeca.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map((s) => (
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
          </div>

          {/* nav links */}
          <div>
            <h3 className="text-[15px] uppercase tracking-[0.12em] text-lime" style={OSWALD}>
              Ontdek
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}>
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
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/75">
              <li>Atelier Roeselare, België</li>
              <li>
                <a href="mailto:info@kroketco.be" className="transition-colors hover:text-cream">
                  info@kroketco.be
                </a>
              </li>
              <li>
                <Link href="/#contact" className="transition-colors hover:text-cream">
                  Neem contact op
                </Link>
              </li>
            </ul>
          </div>

          {/* newsletter */}
          <NewsletterForm compact />
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-cream/15 pt-8 text-sm text-cream/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Kroketco Belgium · Gent</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="#" className="transition-colors hover:text-cream">Privacybeleid</Link>
            <Link href="#" className="transition-colors hover:text-cream">Cookiebeleid</Link>
            <Link href="#" className="transition-colors hover:text-cream">Algemene voorwaarden</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

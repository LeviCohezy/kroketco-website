/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

const LINKS = [
  { label: "Producten", href: "/producten" },
  { label: "Partners", href: "/partners" },
  { label: "Groendaal", href: "/groendaal" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Nieuws", href: "/nieuws" },
];

export function PageNav({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--light-blue)]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-[1480px] items-center justify-between px-6 py-4 sm:px-12 lg:px-16">
        <Link href="/" className="flex items-center">
          <img src="/hero/logo-kroketco.png" alt="Kroketco" className="h-8 w-auto sm:h-9" />
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

export function PageFooter() {
  return (
    <footer className="relative z-10 bg-forest px-6 py-12 text-cream sm:px-12 lg:px-16">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <img src="/hero/logo-kroketco.png" alt="Kroketco" className="h-8 w-auto brightness-0 invert" />
        <span className="text-cream/60">© 2026 Kroketco Belgium · Gent</span>
      </div>
    </footer>
  );
}

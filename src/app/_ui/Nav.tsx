"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

const LINKS = [
  { href: "/producten", label: "Producten" },
  { href: "/partners", label: "Partners" },
  { href: "/groendaal", label: "Groendal" },
  { href: "/over-ons", label: "Over ons" },
  { href: "/nieuws", label: "Nieuws" },
];
const HALF = Math.ceil(LINKS.length / 2);
const LEFT_LINKS = LINKS.slice(0, HALF);
const RIGHT_LINKS = LINKS.slice(HALF);

// The homepage hero's floating nav, extracted so it can sit fixed at the top of
// every page (sticky across the whole scroll) instead of only inside the hero.
export default function Nav() {
  const pathname = usePathname();
  const white = pathname === "/over-ons"; // white navbar on the About page

  // The CMS back office (/admin) has its own chrome — never show the public nav.
  const isAdmin = pathname?.startsWith("/admin");
  const [menuOpen, setMenuOpen] = useState(false);

  // lock body scroll while the full-screen menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (isAdmin) return null;

  return (
    <>
      <header className="fixed inset-x-0 top-6 z-50 px-6 sm:px-12 lg:px-16">
        <nav className={`relative flex w-full items-center justify-between rounded-full py-4 pl-8 pr-4 text-forest shadow-[0_12px_34px_rgba(0,0,0,0.18)] sm:py-5 ${white ? "bg-white" : "bg-light-blue"}`}>
          {/* left — desktop links */}
          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-6 text-[13px] font-bold uppercase tracking-[0.08em] lg:flex">
              {LEFT_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="transition-opacity hover:opacity-70">
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          {/* centered logo */}
          <a href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/hero/logo-kroketco.png" alt="Kroketco" width={2000} height={667} priority className="h-9 w-auto sm:h-11" />
          </a>
          {/* right — desktop links / mobile hamburger */}
          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-6 text-[13px] font-bold uppercase tracking-[0.08em] lg:flex">
              {RIGHT_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="transition-opacity hover:opacity-70">
                  {l.label}
                </a>
              ))}
            </div>
            {/* hamburger — opens full-screen menu on mobile + tablet, right side */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Menu openen"
              className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-forest/40 transition-colors hover:bg-forest/10 lg:hidden"
            >
              <span className="h-[2px] w-4 bg-forest" />
              <span className="h-[2px] w-4 bg-forest" />
            </button>
          </div>
        </nav>
      </header>

      {/* FULL-SCREEN MENU (mobile + tablet) */}
      <div
        className={`fixed inset-0 z-[70] flex flex-col bg-forest text-cream transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 sm:px-12">
          <a href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src="/hero/logo-kroketco.png"
              alt="Kroketco"
              width={2000}
              height={667}
              className="h-8 w-auto brightness-0 invert sm:h-9"
            />
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Menu sluiten"
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/30 transition-colors hover:bg-cream/10"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8 text-left sm:px-14">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-[clamp(2rem,9vw,3.4rem)] uppercase leading-none tracking-[0.01em] text-cream transition-colors hover:text-lime"
              style={OSWALD}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="px-8 pb-10 text-left sm:px-14">
          <a
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
          >
            Contacteer ons
          </a>
        </div>
      </div>
    </>
  );
}

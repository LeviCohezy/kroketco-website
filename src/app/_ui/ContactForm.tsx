"use client";

import ContactFields from "./ContactFields";
import { useContent } from "./ContentProvider";
import Multiline from "./Multiline";

// Standard contact form section: a light-blue card with an eyebrow, heading and
// intro line, wrapping the shared ContactFields. Dropped in at the end of pages
// so every page closes with a real, working contact form (not just a CTA).

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export default function ContactForm({
  source = "",
  eyebrow,
  heading,
  text,
}: {
  source?: string;
  eyebrow?: string;
  heading?: string;
  text?: string;
}) {
  // Page-specific copy wins; otherwise the site-wide defaults from /admin.
  const t = useContent("global.contact");
  return (
    <section id="contact" className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
      <div className="mx-auto max-w-[820px]">
        <div className="rounded-[24px] bg-[var(--light-blue)] px-6 py-12 text-forest shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:px-10 sm:py-14">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
            <span className="h-2 w-2 rounded-[2px] bg-orange" />
            {eyebrow || t.eyebrow}
          </span>
          <h2 className="mt-4 text-[clamp(1.8rem,4.5vw,3.2rem)] uppercase leading-[0.95] tracking-[0.01em]" style={OSWALD}>
            <Multiline text={heading || t.title} />
          </h2>
          <p className="mt-4 max-w-xl text-forest/75"><Multiline text={text || t.text} /></p>
          <div className="mt-8">
            <ContactFields source={source} />
          </div>
        </div>
      </div>
    </section>
  );
}

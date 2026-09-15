"use client";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const field =
  "rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40";

export default function WorkWithUsForm({ partner }: { partner?: string }) {
  return (
    <section className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
      <div className="mx-auto max-w-[820px]">
        <div className="rounded-[24px] bg-[var(--light-blue)] px-6 py-12 text-forest shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:px-10 sm:py-14">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
            <span className="h-2 w-2 rounded-[2px] bg-orange" />
            Samenwerken?
          </span>
          <h2 className="mt-4 text-[clamp(1.8rem,4.5vw,3.2rem)] uppercase leading-[0.95] tracking-[0.01em]" style={OSWALD}>
            Werk met ons
          </h2>
          <p className="mt-4 max-w-xl text-forest/75">
            Interesse in een samenwerking{partner ? ` met Kroketco via ${partner}` : ""}? Laat je
            gegevens achter en we nemen zo snel mogelijk contact op.
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="mt-8 grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" name="naam" placeholder="Naam" required className={field} />
              <input type="email" name="email" placeholder="E-mail" required className={field} />
            </div>
            <input
              type="text"
              name="onderwerp"
              placeholder="Onderwerp"
              defaultValue={partner ? `Samenwerking – ${partner}` : undefined}
              className={field}
            />
            <textarea name="bericht" placeholder="Je bericht" rows={5} required className={`resize-y ${field}`} />
            <button
              type="submit"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
            >
              Verstuur <ArrowRight />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

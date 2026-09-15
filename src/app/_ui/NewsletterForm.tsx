"use client";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export default function NewsletterForm() {
  return (
    <div className="rounded-[24px] bg-forest px-6 py-12 text-cream shadow-[0_20px_50px_-24px_rgba(14,75,58,0.7)] sm:px-10 sm:py-14">
      <div className="mx-auto max-w-[720px] text-center">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-lime">
          <span className="h-2 w-2 rounded-[2px] bg-lime" />
          Nieuwsbrief
        </span>
        <h2 className="mt-4 text-[clamp(1.8rem,4.5vw,3rem)] uppercase leading-[0.98]" style={OSWALD}>
          Mis geen kruimel
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/80">
          Nieuwe smaken, proefmomenten en nieuws van Kroketco — rechtstreeks in je mailbox.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            name="email"
            placeholder="Je e-mailadres"
            required
            className="flex-1 rounded-lg border border-cream/20 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
          />
          <button
            type="submit"
            className="rounded-lg bg-orange px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
          >
            Schrijf me in
          </button>
        </form>
      </div>
    </div>
  );
}

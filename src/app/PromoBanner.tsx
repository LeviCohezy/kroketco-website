/* eslint-disable @next/next/no-img-element */

const OSWALD = {
  fontFamily: "var(--font-oswald), sans-serif",
  fontWeight: 600,
} as const;

export default function PromoBanner() {
  return (
    <section className="bg-white py-16 text-forest sm:py-20">
      <div className="mx-auto max-w-[1480px] px-6 sm:px-12 lg:px-16">
        <div
          className="relative overflow-hidden rounded-[36px] shadow-[0_40px_80px_-40px_rgba(14,75,58,0.45)]"
          style={{
            background:
              "linear-gradient(135deg, #dcefb8 0%, #e7f4c6 55%, #d6ebac 100%)",
          }}
        >
          {/* soft decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--lime)" }}
          />

          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* -------- LEFT: copy -------- */}
            <div className="relative z-10 p-10 sm:p-14">
              <span className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cream">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--lime)" }}
                />
                Nieuw
              </span>

              <h2
                className="mt-6 text-[clamp(2.25rem,5vw,3.75rem)] uppercase leading-[0.95] text-forest"
                style={OSWALD}
              >
                Elke hap
                <br />
                een feest
              </h2>

              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-forest/80 sm:text-[17px]">
                Ambachtelijke Belgische kroketten, vers gedraaid en goudbruin
                gebakken. Romig vanbinnen, krokant vanbuiten &mdash; gemaakt met
                lokale producten en een familierecept.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a
                  href="/producten"
                  className="group inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-cream shadow-lg shadow-orange/30 transition-transform hover:-translate-y-0.5"
                >
                  Bestel nu
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>

                <a
                  href="/over-ons"
                  className="text-sm font-bold uppercase tracking-wide text-forest underline decoration-forest/30 underline-offset-4 transition-colors hover:decoration-forest"
                >
                  Ontdek ons verhaal
                </a>
              </div>
            </div>

            {/* -------- RIGHT: product image + overlays -------- */}
            <div className="relative min-h-[320px] px-10 pb-10 lg:min-h-[440px] lg:px-0 lg:pb-0">
              <div className="relative h-full lg:py-10 lg:pr-14">
                <img
                  src="/kroketten/prod-kaas.jpg"
                  alt="Ambachtelijke Belgische kaaskroket, goudbruin gebakken"
                  className="h-full min-h-[300px] w-full rounded-[24px] object-cover shadow-2xl lg:min-h-[380px] lg:scale-[1.04]"
                />

                {/* (a) frosted glass card */}
                <div className="absolute bottom-5 left-5 max-w-[15rem] rounded-2xl bg-white/60 p-4 shadow-lg backdrop-blur-md ring-1 ring-white/50 sm:bottom-8 sm:left-8 lg:bottom-14">
                  <p className="text-sm font-bold text-forest">Kaaskroket</p>
                  <p className="mt-0.5 text-xs leading-snug text-forest/70">
                    romig vanbinnen, krokant vanbuiten
                  </p>
                </div>

                {/* (b) floating label pills */}
                <span
                  className="absolute -top-2 right-6 rounded-full bg-lime px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-forest shadow-md sm:right-10 lg:top-4 lg:right-16"
                  style={{ transform: "rotate(-6deg)" }}
                >
                  Vers
                </span>
                <span
                  className="absolute right-3 top-24 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-forest shadow-md sm:right-6 sm:top-28 lg:top-36 lg:right-10"
                  style={{ transform: "rotate(5deg)" }}
                >
                  Ambachtelijk
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageFooter } from "../../_ui/SiteChrome";
import WorkWithUsForm from "../../_ui/WorkWithUsForm";
import { PARTNERS } from "../partners-data";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export function generateStaticParams() {
  return PARTNERS.map((p) => ({ slug: p.slug }));
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = PARTNERS.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HERO — partner image + name */}
      <section className="relative">
        <div className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
          {p.card ? (
            <img src={p.card} alt={p.name} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[var(--light-blue)] p-10">
              <img src={p.logo} alt={p.name} className="max-h-[45%] max-w-[70%] object-contain" />
            </div>
          )}
          {p.card && <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />}

          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-[1100px] px-6 pb-10 sm:px-12 sm:pb-14 lg:px-16">
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] ${
                  p.card ? "bg-lime text-forest" : "bg-forest text-cream"
                }`}
              >
                {p.tagline}
              </span>
              <h1
                className={`mt-4 text-[clamp(2.2rem,6vw,4.6rem)] uppercase leading-[0.95] tracking-[0.01em] ${
                  p.card ? "text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]" : "text-forest"
                }`}
                style={OSWALD}
              >
                {p.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* WIE ZIJN ZE */}
      <section className="px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[820px]">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
            <span className="h-2 w-2 rounded-[2px] bg-orange" />
            Wie zijn ze?
          </span>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-forest/80">
            {p.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <Link
            href="/partners"
            className="mt-10 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.06em] text-forest underline underline-offset-4 transition-opacity hover:opacity-70"
          >
            ← Terug naar partners
          </Link>
        </div>
      </section>

      {/* WERK MET ONS */}
      <WorkWithUsForm partner={p.name} />

      <PageFooter />
    </main>
  );
}

/* eslint-disable @next/next/no-img-element */
import { PageFooter } from "../_ui/SiteChrome";
import type { Metadata } from "next";
import ContactForm from "../_ui/ContactForm";
import { getContent } from "@/lib/content/store";
import CheeseScroll from "./CheeseScroll";
import WhyGroendal from "./WhyGroendal";
import FadeIn from "../_ui/FadeIn";
import { EditableText, EditableImage, EditableLink } from "@/app/_ui/edit/Editable";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent("groendaal.seo");
  return { title: seo.title, description: seo.description };
}

export default async function GroendaalPage() {
  const [hero, features, about, affinage, story] = await Promise.all([
    getContent("groendaal.hero"),
    getContent("groendaal.features"),
    getContent("groendaal.about"),
    getContent("groendaal.affinage"),
    getContent("groendaal.story"),
  ]);
  const featureItems = features.items.filter((f) => f.label);

  return (
    <main className="min-h-screen bg-white text-forest [font-family:var(--font-inter),sans-serif]">
      {/* HERO — full-bleed brand image */}
      <section className="relative">
        <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
          <EditableImage
            section="groendaal.hero"
            field="image"
            alt={hero.alt}
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* FEATURE BAND — static diagonal band riding up onto the hero */}
      <section className="relative z-20 -mt-[7vh] overflow-hidden py-10">
        <div className="-rotate-2 scale-110 border-y-2 border-forest bg-white py-3.5">
          <div className="flex flex-wrap items-center justify-center gap-y-1 px-4">
            {featureItems.map((_f, i) => (
              <span key={i} className="flex items-center">
                <EditableText
                  as="span"
                  section="groendaal.features"
                  listField="items"
                  index={i}
                  itemKey="label"
                  className="whitespace-nowrap px-7 text-[clamp(0.85rem,1.3vw,1.1rem)] font-bold uppercase tracking-[0.14em] text-forest"
                />
                {i < featureItems.length - 1 && <span className="text-[0.7em] text-forest">◆</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 1. CULINAIRE KAASKROKETTEN — scroll-driven spinning cheese */}
      <CheeseScroll />

      {/* 2. WIE IS GROENDAL — full-width image, heading + text bottom-left */}
      <section className="relative w-full overflow-hidden">
        <EditableImage
          section="groendaal.about"
          field="image"
          alt={about.alt}
          className="h-[72vh] min-h-[460px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1480px] px-6 pb-10 sm:px-12 sm:pb-14 lg:px-16">
            <EditableText
              as="h2"
              section="groendaal.about"
              field="title"
              className="whitespace-nowrap text-[clamp(1.5rem,5.5vw,4.4rem)] uppercase leading-[0.98] tracking-[0.01em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)]"
              style={OSWALD}
            />
            <EditableText
              as="p"
              section="groendaal.about"
              field="text"
              className="mt-5 max-w-xl whitespace-pre-line text-lg leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </section>

      {/* 3. WAAROM WE SAMENWERKEN — floating cards on dark green */}
      <WhyGroendal />

      {/* affinage shot, tucked right under the cards. Own stacking layer (z-20)
          so it always paints above the pinned WhyGroendal cards — otherwise it
          gets clipped by the still-pinned sticky section mid-scroll. */}
      <section className="relative z-20 bg-forest px-6 pb-20 sm:px-12 sm:pb-28 md:-mt-[16vh] lg:px-16">
        <div className="relative mx-auto max-w-[1480px]">
          <EditableImage
            section="groendaal.affinage"
            field="image"
            alt={affinage.alt}
            className="h-[38vh] min-h-[260px] w-full rounded-[26px] object-cover object-center sm:h-[48vh]"
          />
        </div>
      </section>

      {/* HUN VERHAAL — white section, image left, story + CTA right */}
      <section className="bg-white px-6 py-20 sm:px-12 sm:py-28 lg:px-16">
        <div className="mx-auto grid max-w-[1300px] items-center gap-10 md:grid-cols-2 md:gap-16">
          <FadeIn className="relative">
            <EditableImage
              section="groendaal.story"
              field="image"
              alt={story.alt}
              className="aspect-[4/5] w-full rounded-[26px] object-cover shadow-[0_30px_60px_-28px_rgba(14,75,58,0.5)]"
            />
          </FadeIn>
          <div>
            <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-orange">
              <span className="h-2 w-2 rounded-[2px] bg-orange" />{" "}
              <EditableText as="span" section="groendaal.story" field="eyebrow" />
            </span>
            <EditableText
              as="h2"
              section="groendaal.story"
              field="title"
              className="mt-5 text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[1] tracking-tight"
              style={OSWALD}
            />
            {story.paragraphs.map((_para, i) => (
              <EditableText
                key={i}
                as="p"
                section="groendaal.story"
                listField="paragraphs"
                index={i}
                itemKey="text"
                className={`${i === 0 ? "mt-5" : "mt-4"} whitespace-pre-line text-lg leading-relaxed text-forest/75`}
              />
            ))}
            {story.buttonHref && (
              <EditableLink
                section="groendaal.story"
                labelField="buttonLabel"
                hrefField="buttonHref"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-lg bg-forest px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03]"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
                  <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </EditableLink>
            )}
          </div>
        </div>
      </section>

      {/* 5. PARTNER WITH US */}
      <ContactForm source="samenwerking-groendal" section="groendaal.contact" />

      <PageFooter />
    </main>
  );
}

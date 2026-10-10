/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { PageFooter } from "../_ui/SiteChrome";
import HistoryTimeline from "../HistoryTimeline";
import { getContent } from "@/lib/content/store";
import { EditableText, EditableImage, EditableVideo, EditableLink } from "@/app/_ui/edit/Editable";

const display: CSSProperties = {
  fontFamily: "var(--font-oswald), sans-serif",
  fontWeight: 600,
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent("over-ons.seo");
  return { title: seo.title, description: seo.description };
}

export default async function OverOnsPage() {
  const [hero, atelier, statsC, band, missie, cta] = await Promise.all([
    getContent("over-ons.hero"),
    getContent("over-ons.atelier"),
    getContent("over-ons.stats"),
    getContent("over-ons.wordband"),
    getContent("over-ons.missie"),
    getContent("over-ons.cta"),
  ]);
  const stats = statsC.items;
  const words = band.words
    .map((w, idx) => ({ word: w.word, idx }))
    .filter((w) => Boolean(w.word));

  return (
    <main className="min-h-screen bg-forest text-forest">
      {/* 1. HERO — full-bleed background video (desktop/tablet only) */}
      <section className="relative hidden w-full overflow-hidden sm:block sm:h-[90vh] sm:min-h-[560px]">
        <EditableVideo
          section="over-ons.hero"
          field="video"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/60" />

        {/* Overlaid title + CTA — desktop/tablet only. On mobile the video is a
            clean 50vh and the copy lives in the beige block below. */}
        <div className="relative hidden h-full flex-col justify-end sm:flex">
          <div className="mx-auto w-full max-w-[1480px] px-6 pb-24 sm:px-12 sm:pb-28 lg:px-16">
            {/* breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-[13px] font-semibold text-white/75">
              <Link href="/" className="transition-opacity hover:opacity-100 hover:text-white">
                <EditableText as="span" section="over-ons.hero" field="breadcrumbHome" />
              </Link>
              <span>–</span>
              <EditableText as="span" section="over-ons.hero" field="breadcrumbCurrent" className="text-white" />
            </nav>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <EditableText
                as="h1"
                section="over-ons.hero"
                field="title"
                className="max-w-3xl whitespace-nowrap text-[clamp(1.8rem,6vw,5.5rem)] uppercase leading-[0.95] tracking-[0.01em] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]"
                style={display}
              />
              {hero.ctaLabel && (
                <EditableLink
                  section="over-ons.hero"
                  labelField="ctaLabel"
                  hrefField="ctaHref"
                  className="shrink-0 rounded-xl bg-orange px-8 py-4 text-center text-[15px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.04]"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 1. MOBILE HERO — 100vh dark green: square rounded video with margin,
          title + CTA below. No overlap; the body bg is dark green so it blends. */}
      <section className="flex h-screen min-h-[600px] flex-col bg-forest px-3 pb-10 pt-32 text-cream sm:hidden">
        <div className="relative aspect-square w-full overflow-hidden rounded-[28px] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]">
          <EditableVideo
            section="over-ons.hero"
            field="video"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-8 flex flex-1 flex-col justify-center px-2">
          <nav className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-cream/60">
            <Link href="/" className="transition-opacity hover:opacity-100">
              <EditableText as="span" section="over-ons.hero" field="breadcrumbHome" />
            </Link>
            <span>–</span>
            <EditableText as="span" section="over-ons.hero" field="breadcrumbCurrent" className="text-cream" />
          </nav>
          <EditableText
            as="h1"
            section="over-ons.hero"
            field="title"
            className="text-[clamp(2rem,9vw,3rem)] uppercase leading-[0.95] tracking-[0.01em] text-cream"
            style={display}
          />
          {hero.ctaLabel && (
            <EditableLink
              section="over-ons.hero"
              labelField="ctaLabel"
              hrefField="ctaHref"
              className="mt-6 inline-block w-fit rounded-xl bg-orange px-8 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.04]"
            />
          )}
        </div>
      </section>

      {/* 2. ATELIER STORY — image left, text right. Flush below the 100vh hero on
          mobile (no overlap); overlaps the hero on tablet/desktop. */}
      <section className="relative z-10 rounded-t-[48px] bg-white sm:-mt-10">
        <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_20px_50px_-20px_rgba(14,75,58,0.45)]">
              <EditableImage
                section="over-ons.atelier"
                field="image"
                alt={atelier.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <EditableText
                as="span"
                section="over-ons.atelier"
                field="eyebrow"
                className="kc-tag inline-block rounded-full bg-lime px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.14em] text-forest"
              />
              <EditableText
                as="h2"
                section="over-ons.atelier"
                field="title"
                className="mt-5 text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[0.98] text-forest"
                style={display}
              />
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-forest/80">
                <EditableText as="p" section="over-ons.atelier" field="text" />
              </div>
              {atelier.ctaLabel && (
                <EditableLink
                  section="over-ons.atelier"
                  labelField="ctaLabel"
                  hrefField="ctaHref"
                  className="kc-tag-btn mt-8 inline-block rounded-xl bg-orange px-8 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.04]"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3 + 4. STATS pinned; the TIMELINE circle scrolls up over it (reveal) */}
      <div className="relative isolate">
        <section className="sticky top-0 z-0 flex min-h-screen items-start overflow-hidden rounded-b-[44px] bg-white">
          <div className="mx-auto w-full max-w-[1480px] px-6 pb-20 pt-24 sm:px-12 sm:pt-28 lg:px-16">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((_s, i) => (
                <div
                  key={i}
                  className="rounded-[24px] bg-forest p-8 text-center text-cream shadow-[0_18px_40px_-22px_rgba(14,75,58,0.7)]"
                >
                  <EditableText
                    as="div"
                    section="over-ons.stats"
                    listField="items"
                    index={i}
                    itemKey="value"
                    className="text-[clamp(2.4rem,4vw,3.4rem)] uppercase leading-none text-lime"
                    style={display}
                  />
                  <EditableText
                    as="div"
                    section="over-ons.stats"
                    listField="items"
                    index={i}
                    itemKey="label"
                    className="mt-3 text-sm font-semibold uppercase tracking-[0.08em] text-cream/80"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="relative z-10">
          <HistoryTimeline />
        </div>
      </div>

      {/* 5. WORD BAND — static, between the timeline and the light-blue section */}
      <div className="bg-orange py-4 text-cream sm:py-5">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 sm:gap-x-8">
          {words.map((w, i, arr) => (
            <span
              key={i}
              className="flex items-center whitespace-nowrap text-[clamp(1.05rem,2.4vw,1.9rem)] font-bold uppercase tracking-[0.04em]"
              style={display}
            >
              <EditableText
                as="span"
                section="over-ons.wordband"
                listField="words"
                index={w.idx}
                itemKey="word"
              />
              {i < arr.length - 1 && (
                <span className="ml-6 flex items-center text-lime sm:ml-8" aria-hidden>
                  <svg viewBox="0 0 24 16" fill="none" className="h-[0.7em] w-auto">
                    <rect x="1" y="1" width="22" height="14" rx="7" fill="currentColor" opacity="0.2" />
                    <rect x="1" y="1" width="22" height="14" rx="7" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M6 8h.01M10 9.5h.01M14 6.5h.01M18 8.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* 6. ONZE MISSIE */}
      <section id="missie" className="bg-light-blue">
        <div className="mx-auto max-w-[1480px] px-6 py-16 sm:px-12 sm:py-24 lg:px-16">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-[24px] shadow-[0_20px_50px_-20px_rgba(14,75,58,0.45)]">
              <EditableImage
                section="over-ons.missie"
                field="image"
                alt={missie.imageAlt}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <EditableText
                as="span"
                section="over-ons.missie"
                field="eyebrow"
                className="text-[13px] font-bold uppercase tracking-[0.14em] text-orange"
              />
              <EditableText
                as="h2"
                section="over-ons.missie"
                field="title"
                className="mt-4 text-[clamp(2rem,4vw,3.2rem)] uppercase leading-[1] text-forest"
                style={display}
              />
              <EditableText
                as="p"
                section="over-ons.missie"
                field="text"
                className="mt-5 text-lg leading-relaxed text-forest/80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-forest">
        <div className="mx-auto max-w-[1480px] px-6 py-20 text-center sm:px-12 sm:py-28 lg:px-16">
          <EditableText
            as="h2"
            section="over-ons.cta"
            field="title"
            className="mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] uppercase leading-[1] text-cream"
            style={display}
          />
          <EditableText
            as="p"
            section="over-ons.cta"
            field="text"
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-cream/80"
          />
          {cta.ctaLabel && (
            <div className="mt-9">
              <EditableLink
                section="over-ons.cta"
                labelField="ctaLabel"
                hrefField="ctaHref"
                className="inline-block rounded-xl bg-lime px-8 py-4 text-[15px] font-bold uppercase tracking-[0.06em] text-forest transition-transform hover:scale-[1.04]"
              />
            </div>
          )}
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

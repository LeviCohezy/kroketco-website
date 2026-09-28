"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/core";
import type { Post } from "@/lib/types";
import { Field, ImageField, Select, TextArea, TextInput, useToast } from "../ui";
import { RichEditor } from "../_editor/RichEditor";
import { parseBody } from "../_editor/content";
import { slugify } from "../_editor/slugify";

const CATEGORIES = ["Product", "Bedrijf", "Event", "Partners"];

type Mode = "publish" | "draft" | "plan";
const MODE_LABEL: Record<Mode, string> = {
  publish: "Publiceer",
  draft: "Bewaar als concept",
  plan: "Inplannen",
};
const MODE_HINT: Record<Mode, string> = {
  publish: "Nu live",
  draft: "Niet zichtbaar",
  plan: "Op datum",
};
const MODES: Mode[] = ["publish", "draft", "plan"];

type Meta = {
  title: string;
  slug: string;
  slugTouched: boolean;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  published: number;
  publishedAt: string;
  dateLabel: string;
  showForm: number;
};

function initialMeta(post: Post | null): Meta {
  const today = new Date().toISOString().slice(0, 10);
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    slugTouched: !!post,
    excerpt: post?.excerpt ?? "",
    coverImage: post?.coverImage ?? "",
    author: post?.author ?? "Team Kroketco",
    category: post?.category ?? "Product",
    published: post?.published ?? 1,
    publishedAt: post?.publishedAt ?? today,
    dateLabel: post?.dateLabel ?? "",
    showForm: post?.showForm ?? 0,
  };
}

export function BlogEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const toast = useToast();
  const today = new Date().toISOString().slice(0, 10);
  const [meta, setMeta] = useState<Meta>(() => initialMeta(post));
  const [doc, setDoc] = useState<JSONContent>(() => parseBody(post?.body));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>(post?.published ? "publish" : "draft");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(today);

  // Auto-slug from title unless the user has manually edited the slug field.
  const effectiveSlug = meta.slugTouched ? meta.slug : slugify(meta.title);

  // Render preview HTML via the same route the public page uses, for exact parity.
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const docKey = useMemo(() => JSON.stringify(doc), [doc]);

  async function loadPreview() {
    try {
      const res = await fetch("/api/blog/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: docKey }),
      });
      const data = await res.json();
      setPreviewHtml(data.html || "");
    } catch {
      setPreviewHtml("<p>Preview kon niet geladen worden.</p>");
    }
  }

  async function save(override?: { published?: number; publishedAt?: string }, msg?: string) {
    setBusy(true);
    try {
      const published = override?.published ?? meta.published;
      const publishedAt = override?.publishedAt ?? meta.publishedAt;
      const payload = {
        title: meta.title,
        slug: meta.slugTouched ? meta.slug : "",
        excerpt: meta.excerpt,
        body: JSON.stringify(doc),
        category: meta.category,
        coverImage: meta.coverImage,
        author: meta.author,
        dateLabel: meta.dateLabel,
        showForm: meta.showForm,
        published,
        publishedAt,
      };
      const res = await fetch(post ? `/api/blog/${post.id}` : "/api/blog", {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Opslaan mislukt");
      setMeta((m) => ({ ...m, published, publishedAt }));
      toast(msg ?? (post ? "Post opgeslagen" : "Post aangemaakt"));
      if (!post) {
        router.replace(`/admin/blog/${data.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Opslaan mislukt", "error");
    } finally {
      setBusy(false);
    }
  }

  // Run a publish mode. Inplannen opens a date popup first; the others save now.
  function runMode(m: Mode) {
    setMode(m);
    setMenuOpen(false);
    if (m === "draft") return save({ published: 0 }, "Opgeslagen als concept");
    if (m === "plan") {
      setScheduleDate(meta.publishedAt && meta.publishedAt > today ? meta.publishedAt : today);
      setScheduleOpen(true);
      return;
    }
    const publishedAt = meta.publishedAt && meta.publishedAt > today ? today : meta.publishedAt;
    return save({ published: 1, publishedAt }, "Gepubliceerd");
  }

  function confirmSchedule() {
    setScheduleOpen(false);
    setMeta((m) => ({ ...m, publishedAt: scheduleDate }));
    save({ published: 1, publishedAt: scheduleDate }, "Ingepland");
  }

  const canSave = !busy && !!meta.title.trim();

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100vh-2rem)] lg:flex-row">
      {/* MIDDLE — content editor (fixed height, inner scroll) */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
        {/* Sticky header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-6 py-3">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-forest/60 transition hover:bg-forest/5 hover:text-forest"
          >
            ← Terug
          </Link>
          <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`rounded-full px-4 py-1.5 transition ${
                tab === "write" ? "bg-white text-forest shadow-sm" : "text-gray-500"
              }`}
            >
              Schrijven
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("preview");
                loadPreview();
              }}
              className={`rounded-full px-4 py-1.5 transition ${
                tab === "preview" ? "bg-white text-forest shadow-sm" : "text-gray-500"
              }`}
            >
              Voorbeeld
            </button>
          </div>
        </div>

        {/* Scrollable content — the tiptap toolbar is sticky within this area */}
        <div className="nice-scroll min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
          <div className="mx-auto max-w-[760px]">
            {tab === "write" ? (
              <RichEditor initialContent={doc} onChange={setDoc} />
            ) : (
              <article>
                {meta.coverImage && (
                  <div className="mb-8 overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgba(14,75,58,0.5)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={meta.coverImage} alt={meta.title} className="aspect-[16/8] w-full object-cover" />
                  </div>
                )}
                <h1
                  className="mb-6 text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[0.98] tracking-[0.01em] text-forest"
                  style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
                >
                  {meta.title || "Naamloze post"}
                </h1>
                <div className="tt-prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
              </article>
            )}
          </div>
        </div>
      </section>

      {/* RIGHT — metadata (scroll) + sticky action button at the bottom */}
      <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm lg:w-[360px]">
        <div className="nice-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-7">
          <Field label="Titel">
            <TextInput
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              placeholder="Posttitel"
              required
            />
          </Field>
          <Field label="Slug">
            <TextInput
              value={effectiveSlug}
              onChange={(e) => setMeta({ ...meta, slug: e.target.value, slugTouched: true })}
              placeholder="auto"
            />
          </Field>
          <Field label="Beschrijving">
            <TextArea rows={3} value={meta.excerpt} onChange={(e) => setMeta({ ...meta, excerpt: e.target.value })} />
          </Field>
          <ImageField label="Cover foto" cover value={meta.coverImage} onChange={(v) => setMeta({ ...meta, coverImage: v })} />
          <Field label="Categorie">
            <Select value={meta.category} onChange={(e) => setMeta({ ...meta, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Datum">
              <TextInput
                type="date"
                value={meta.publishedAt}
                onChange={(e) => setMeta({ ...meta, publishedAt: e.target.value })}
              />
            </Field>
            <Field label="Datum label">
              <TextInput value={meta.dateLabel} onChange={(e) => setMeta({ ...meta, dateLabel: e.target.value })} />
            </Field>
          </div>
          <label className="flex items-start gap-2.5 text-sm text-forest/80">
            <input
              type="checkbox"
              checked={!!meta.showForm}
              onChange={(e) => setMeta({ ...meta, showForm: e.target.checked ? 1 : 0 })}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-orange"
            />
            <span>
              <span className="font-medium text-forest">Formulier tonen</span>
              <span className="block text-xs text-forest/50">Contactformulier onderaan de blogpost.</span>
            </span>
          </label>
        </div>

        {/* Sticky action bar */}
        <div className="shrink-0 border-t border-forest/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-forest/50">
            <span className={`h-2 w-2 rounded-full ${meta.published ? "bg-emerald-500" : "bg-forest/25"}`} />
            {meta.published ? "Gepubliceerd" : "Concept"}
          </div>

          <div className="relative">
            {menuOpen && (
              <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setMenuOpen(false)} />
            )}
            <div className="flex overflow-hidden rounded-full shadow-sm">
              <button
                onClick={() => runMode(mode)}
                disabled={!canSave}
                className="flex-1 bg-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Bezig…" : MODE_LABEL[mode]}
              </button>
              <button
                type="button"
                aria-label="Meer opties"
                onClick={() => setMenuOpen((v) => !v)}
                disabled={!canSave}
                className="grid w-11 place-items-center border-l border-white/25 bg-orange text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {menuOpen && (
              <div className="absolute bottom-full right-0 z-20 mb-2 w-full overflow-hidden rounded-xl border border-forest/10 bg-white py-1 shadow-xl">
                {MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => runMode(m)}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-forest/5 ${
                      m === mode ? "text-orange" : "text-forest/80"
                    }`}
                  >
                    <span className="font-medium">{MODE_LABEL[m]}</span>
                    <span className="ml-auto text-xs text-forest/40">{MODE_HINT[m]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Schedule popup */}
      {scheduleOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-forest/30 p-4 backdrop-blur-sm"
          onClick={() => setScheduleOpen(false)}
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-forest">Inplannen</h3>
            <p className="mt-1 text-sm text-forest/55">Kies wanneer deze post live gaat.</p>
            <div className="mt-4">
              <Field label="Publiceer op">
                <TextInput
                  type="date"
                  min={today}
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                />
              </Field>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setScheduleOpen(false)}
                className="rounded-full border border-forest/15 px-5 py-2 text-sm font-semibold text-forest transition hover:bg-forest/5"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={confirmSchedule}
                disabled={!canSave || !scheduleDate}
                className="rounded-full bg-orange px-5 py-2 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-50"
              >
                Inplannen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

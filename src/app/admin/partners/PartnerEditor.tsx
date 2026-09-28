"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JSONContent } from "@tiptap/core";
import type { Partner } from "@/lib/types";
import { Field, ImageField, TextArea, TextInput, useToast } from "../ui";
import { RichEditor } from "../_editor/RichEditor";
import { parseBody } from "../_editor/content";
import { slugify } from "../_editor/slugify";

type Mode = "publish" | "draft";
const MODE_LABEL: Record<Mode, string> = { publish: "Publiceer", draft: "Bewaar als concept" };
const MODE_HINT: Record<Mode, string> = { publish: "Nu live", draft: "Niet zichtbaar" };
const MODES: Mode[] = ["publish", "draft"];

type Meta = {
  name: string;
  slug: string;
  slugTouched: boolean;
  city: string;
  description: string;
  logo: string;
  thumbnail: string;
  showForm: number;
  published: number;
  sortOrder: number;
};

function initialMeta(partner: Partner | null): Meta {
  return {
    name: partner?.name ?? "",
    slug: partner?.slug ?? "",
    slugTouched: !!partner,
    city: partner?.city ?? "",
    description: partner?.description ?? "",
    logo: partner?.logo ?? "",
    thumbnail: partner?.thumbnail ?? "",
    showForm: partner?.showForm ?? 1,
    published: partner?.published ?? 1,
    sortOrder: partner?.sortOrder ?? 0,
  };
}

export function PartnerEditor({ partner, nextSort }: { partner: Partner | null; nextSort: number }) {
  const router = useRouter();
  const toast = useToast();
  const [meta, setMeta] = useState<Meta>(() => {
    const m = initialMeta(partner);
    return partner ? m : { ...m, sortOrder: nextSort };
  });
  const [doc, setDoc] = useState<JSONContent>(() => parseBody(partner?.body));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>(partner?.published ? "publish" : "draft");
  const [menuOpen, setMenuOpen] = useState(false);

  const effectiveSlug = meta.slugTouched ? meta.slug : slugify(meta.name);

  // Preview via the shared /api/blog/preview route (same extensions + sanitize).
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

  async function save(override?: { published?: number }, msg?: string) {
    setBusy(true);
    try {
      const published = override?.published ?? meta.published;
      const payload = {
        name: meta.name,
        slug: meta.slugTouched ? meta.slug : "",
        city: meta.city,
        description: meta.description,
        logo: meta.logo,
        thumbnail: meta.thumbnail,
        body: JSON.stringify(doc),
        showForm: meta.showForm,
        published,
        sortOrder: meta.sortOrder,
      };
      const res = await fetch(partner ? `/api/partners/${partner.id}` : "/api/partners", {
        method: partner ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Opslaan mislukt");
      setMeta((m) => ({ ...m, published }));
      toast(msg ?? (partner ? "Partner opgeslagen" : "Partner aangemaakt"));
      if (!partner) router.replace(`/admin/partners/${data.id}`);
      else router.refresh();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Opslaan mislukt", "error");
    } finally {
      setBusy(false);
    }
  }

  function runMode(m: Mode) {
    setMode(m);
    setMenuOpen(false);
    if (m === "draft") return save({ published: 0 }, "Opgeslagen als concept");
    return save({ published: 1 }, "Gepubliceerd");
  }

  const canSave = !busy && !!meta.name.trim();

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100vh-2rem)] lg:flex-row">
      {/* MIDDLE — content editor (fixed height, inner scroll) */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-6 py-3">
          <Link
            href="/admin/partners"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-forest/60 transition hover:bg-forest/5 hover:text-forest"
          >
            ← Terug
          </Link>
          <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium">
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`rounded-full px-4 py-1.5 transition ${tab === "write" ? "bg-white text-forest shadow-sm" : "text-gray-500"}`}
            >
              Schrijven
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("preview");
                loadPreview();
              }}
              className={`rounded-full px-4 py-1.5 transition ${tab === "preview" ? "bg-white text-forest shadow-sm" : "text-gray-500"}`}
            >
              Voorbeeld
            </button>
          </div>
        </div>

        <div className="nice-scroll min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">
          <div className="mx-auto max-w-[760px]">
            {tab === "write" ? (
              <RichEditor initialContent={doc} onChange={setDoc} />
            ) : (
              <article>
                {meta.thumbnail && (
                  <div className="mb-8 overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgba(14,75,58,0.5)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={meta.thumbnail} alt={meta.name} className="aspect-[16/8] w-full object-cover" />
                  </div>
                )}
                <h1
                  className="mb-6 text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[0.98] tracking-[0.01em] text-forest"
                  style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
                >
                  {meta.name || "Naamloze partner"}
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
          <Field label="Naam">
            <TextInput value={meta.name} onChange={(e) => setMeta({ ...meta, name: e.target.value })} placeholder="Partnernaam" required />
          </Field>
          <Field label="Slug">
            <TextInput
              value={effectiveSlug}
              onChange={(e) => setMeta({ ...meta, slug: e.target.value, slugTouched: true })}
              placeholder="auto"
            />
          </Field>
          <Field label="Stad">
            <TextInput value={meta.city} onChange={(e) => setMeta({ ...meta, city: e.target.value })} placeholder="Bv. Gistel" />
          </Field>
          <Field label="Beschrijving">
            <TextArea rows={3} value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} />
          </Field>
          <ImageField label="Logo" value={meta.logo} onChange={(v) => setMeta({ ...meta, logo: v })} />
          <ImageField label="Thumbnail" cover value={meta.thumbnail} onChange={(v) => setMeta({ ...meta, thumbnail: v })} />

          <div className="border-t border-forest/10 pt-4">
            <label className="flex items-start gap-2 text-sm text-forest/80">
              <input
                type="checkbox"
                checked={!!meta.showForm}
                onChange={(e) => setMeta({ ...meta, showForm: e.target.checked ? 1 : 0 })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-orange"
              />
              <span>
                Contactformulier tonen onderaan de pagina
                <span className="mt-0.5 block text-xs text-gray-500">Staat standaard aan.</span>
              </span>
            </label>
          </div>
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
    </div>
  );
}

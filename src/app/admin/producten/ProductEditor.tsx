"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Product, ProductInput, PrepMethod, ProductCard } from "@/lib/types";
import { emptyPrepMethod } from "@/lib/types";
import { Field, ImageField, Select, TextArea, TextInput, useToast } from "../ui";
import { ProductCardPreview } from "./ProductCardPreview";
import { ProductDetailPreview } from "./ProductDetailPreview";
import { slugify } from "../_editor/slugify";
import { ALLERGENS } from "@/lib/allergens";

const CATEGORIES = ["Kroketten", "Mini's & borrelhapjes", "Aardappel", "Puree", "Vegetarisch"];
const FRAMES = [
  { value: "var(--frame-lime)", label: "Lime" },
  { value: "var(--frame-pink)", label: "Roze" },
  { value: "var(--frame-purple)", label: "Paars" },
  { value: "var(--frame-orange)", label: "Oranje" },
  { value: "var(--frame-gold)", label: "Goud" },
  { value: "var(--frame-blue)", label: "Blauw" },
];
type Mode = "publish" | "draft";
const MODE_LABEL: Record<Mode, string> = { publish: "Publiceer", draft: "Bewaar als concept" };
const MODE_HINT: Record<Mode, string> = { publish: "Nu live", draft: "Niet zichtbaar" };
const MODES: Mode[] = ["publish", "draft"];

type Draft = ProductInput & { slugTouched: boolean };

function initialDraft(product: Product | null, nextSort: number): Draft {
  if (product) {
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = product;
    void _id;
    void _c;
    void _u;
    return { ...rest, slugTouched: true };
  }
  return {
    slug: "",
    name: "",
    title: "",
    category: "Kroketten",
    sub: "",
    description: "",
    image: "",
    prepImage: "",
    allergenImage: "",
    allergens: "",
    frame: "var(--frame-lime)",
    veggie: 0,
    tags: [],
    cards: [],
    ingredients: [],
    preparation: { oven: emptyPrepMethod(), frituur: emptyPrepMethod() },
    showForm: 1,
    published: 1,
    sortOrder: nextSort,
    slugTouched: false,
  };
}

export function ProductEditor({ product, nextSort }: { product: Product | null; nextSort: number }) {
  const router = useRouter();
  const toast = useToast();
  const [draft, setDraft] = useState<Draft>(() => initialDraft(product, nextSort));
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>(product && !product.published ? "draft" : "publish");
  const [menuOpen, setMenuOpen] = useState(false);
  const [preview, setPreview] = useState<"card" | "detail">("card");

  const effectiveSlug = draft.slugTouched ? draft.slug : slugify(draft.name);
  const allergenSet = new Set(draft.allergens.split(",").map((s) => s.trim()).filter(Boolean));

  function toggleAllergen(code: string) {
    const next = new Set(allergenSet);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    setDraft({ ...draft, allergens: ALLERGENS.filter((a) => next.has(a.code)).map((a) => a.code).join(",") });
  }

  async function save(override?: { published?: number }, msg?: string) {
    setBusy(true);
    try {
      const published = override?.published ?? draft.published;
      const { slugTouched, ...rest } = draft;
      const payload = { ...rest, published, slug: slugTouched ? draft.slug : "" };
      const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Opslaan mislukt");
      setDraft((d) => ({ ...d, published }));
      toast(msg ?? (product ? "Product opgeslagen" : "Product aangemaakt"));
      if (!product) router.replace(`/admin/producten/${data.id}`);
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

  const canSave = !busy && !!draft.name.trim();

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100vh-2rem)] lg:flex-row">
      {/* MIDDLE — live preview card */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-gray-200 px-6 py-3">
          <Link
            href="/admin/producten"
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-forest/60 transition hover:bg-forest/5 hover:text-forest"
          >
            ← Terug
          </Link>
          <div role="tablist" aria-label="Voorbeeld" className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5 text-sm font-medium">
            <button
              type="button"
              role="tab"
              aria-selected={preview === "card"}
              onClick={() => setPreview("card")}
              className={`rounded-full px-4 py-1.5 transition ${preview === "card" ? "bg-white text-forest shadow-sm" : "text-gray-500"}`}
            >
              Kaart
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={preview === "detail"}
              onClick={() => setPreview("detail")}
              className={`rounded-full px-4 py-1.5 transition ${preview === "detail" ? "bg-white text-forest shadow-sm" : "text-gray-500"}`}
            >
              Productpagina
            </button>
          </div>
        </div>
        <div className="nice-scroll min-h-0 flex-1 overflow-y-auto">
          {preview === "card" ? (
            <div className="grid place-items-center px-6 py-10">
              <ProductCardPreview
                name={draft.name}
                sub={draft.sub}
                image={draft.image}
                allergens={draft.allergens}
                veggie={!!draft.veggie}
              />
            </div>
          ) : (
            <ProductDetailPreview
              name={draft.name}
              title={draft.title}
              description={draft.description}
              image={draft.image}
              prepImage={draft.prepImage}
              allergenImage={draft.allergenImage}
              frame={draft.frame}
              veggie={!!draft.veggie}
              tags={draft.tags}
              cards={draft.cards}
              ingredients={draft.ingredients}
              allergens={draft.allergens}
              preparation={draft.preparation}
            />
          )}
        </div>
      </section>

      {/* RIGHT — fields + sticky actions */}
      <aside className="flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm lg:w-[360px]">
        <div className="nice-scroll min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-7">
          {/* Logical order: core product info first, display extras (tags, kaarten) last. */}

          {/* 1. Naam (also the detail-page eyebrow) */}
          <Field label="Naam" hint="Wordt ook de eyebrow boven de titel op de detailpagina.">
            <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          </Field>

          {/* 2. Slug */}
          <Field label="Slug">
            <TextInput
              value={effectiveSlug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value, slugTouched: true })}
              placeholder="auto"
            />
          </Field>

          {/* 3. Afbeelding + 4. Kaderkleur (kept close together) */}
          <ImageField label="Afbeelding" cover value={draft.image} onChange={(v) => setDraft({ ...draft, image: v })} />
          <Field label="Kaderkleur" hint="Achtergrondkleur van het kader op de detailpagina.">
            <Select value={draft.frame} onChange={(e) => setDraft({ ...draft, frame: e.target.value })}>
              {FRAMES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </Select>
          </Field>

          {/* 5. Titel (detail-page H1) */}
          <Field label="Titel" hint="De grote kop (H1) op de productpagina.">
            <TextInput value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Bv. De echte Belgische kaaskroket" />
          </Field>

          {/* 6. Beschrijving */}
          <Field label="Beschrijving">
            <TextArea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </Field>

          {/* 7. Categorie */}
          <Field label="Categorie">
            <Select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>

          {/* 8. Ondertitel (o.a. het aantal) */}
          <Field label="Ondertitel" hint="Gebruikt op de /producten-kaart (o.a. het aantal).">
            <TextInput value={draft.sub} onChange={(e) => setDraft({ ...draft, sub: e.target.value })} placeholder="Bv. 4 stuks · romig" />
          </Field>

          {/* 9. Vegetarisch */}
          <label className="flex items-center gap-2 text-sm text-forest/80">
            <input
              type="checkbox"
              checked={!!draft.veggie}
              onChange={(e) => setDraft({ ...draft, veggie: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-gray-300 accent-orange"
            />
            Vegetarisch
          </label>

          {/* 10. Allergenen */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-gray-700">Allergenen</span>
            <div className="flex flex-wrap gap-2">
              {ALLERGENS.map((a) => {
                const on = allergenSet.has(a.code);
                return (
                  <button
                    key={a.code}
                    type="button"
                    onClick={() => toggleAllergen(a.code)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      on ? "border-orange bg-orange/10 text-orange" : "border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {a.label} ({a.code})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 11. Ingrediënten */}
          <StringListEditor
            label="Ingrediënten"
            placeholder="Bv. Belgische kaas (28%)"
            items={draft.ingredients}
            onChange={(ingredients) => setDraft({ ...draft, ingredients })}
          />

          {/* 11b. Afbeelding naast Ingrediënten & allergenen */}
          <div>
            <ImageField
              label="Afbeelding bij ingrediënten & allergenen"
              cover
              value={draft.allergenImage}
              onChange={(v) => setDraft({ ...draft, allergenImage: v })}
            />
            <p className="mt-1 text-xs text-gray-500">
              Grote foto links van het “Puur &amp; eerlijk”-blok. Leeg = de gewone productfoto.
            </p>
          </div>

          {/* 12. Bereiding-afbeelding — losse kroket-cutout boven de bereiding */}
          <div>
            <ImageField
              label="Bereiding-afbeelding (losse kroket)"
              cover
              value={draft.prepImage}
              onChange={(v) => setDraft({ ...draft, prepImage: v })}
            />
            <p className="mt-1 text-xs text-gray-500">
              Los kroketje (transparante PNG) dat naast de bereiding zweeft. Leeg = de gewone productfoto.
            </p>
          </div>

          {/* 13. Bereiding — oven + frituur toggles */}
          <div>
            <span className="mb-2 block text-sm font-medium text-gray-700">Bereiding</span>
            <div className="space-y-3">
              <PrepEditor
                label="Oven"
                method={draft.preparation.oven}
                onChange={(oven) => setDraft({ ...draft, preparation: { ...draft.preparation, oven } })}
              />
              <PrepEditor
                label="Frituur"
                method={draft.preparation.frituur}
                onChange={(frituur) => setDraft({ ...draft, preparation: { ...draft.preparation, frituur } })}
              />
            </div>
          </div>

          {/* 13. Tags (max 4) — display extra */}
          <TagsEditor tags={draft.tags} onChange={(tags) => setDraft({ ...draft, tags })} />

          {/* 14. Kaarten (max 4) — display extra */}
          <CardsEditor cards={draft.cards} onChange={(cards) => setDraft({ ...draft, cards })} />

          {/* 15. Contactformulier onderaan de pagina */}
          <div className="border-t border-forest/10 pt-4">
            <label className="flex items-start gap-2 text-sm text-forest/80">
              <input
                type="checkbox"
                checked={!!draft.showForm}
                onChange={(e) => setDraft({ ...draft, showForm: e.target.checked ? 1 : 0 })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-orange"
              />
              <span>
                Contactformulier tonen onderaan de pagina
                <span className="mt-0.5 block text-xs text-gray-500">Staat standaard aan. Zet uit om enkel de call-to-action te tonen.</span>
              </span>
            </label>
          </div>
        </div>

        {/* Sticky actions */}
        <div className="shrink-0 border-t border-forest/10 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-forest/50">
            <span className={`h-2 w-2 rounded-full ${draft.published ? "bg-emerald-500" : "bg-forest/25"}`} />
            {draft.published ? "Gepubliceerd" : "Concept"}
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

// —— Small reusable editors for the repeatable / structured fields ——

const removeBtn =
  "grid h-8 w-8 shrink-0 place-items-center rounded-lg text-forest/40 transition hover:bg-red-50 hover:text-red-500";
const addBtn =
  "rounded-lg border border-dashed border-forest/25 px-3 py-2 text-sm font-medium text-forest/60 transition hover:border-orange hover:text-orange";

// Tags: up to 4 short tags, add via input + Enter/button, remove per chip.
function TagsEditor({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const [value, setValue] = useState("");
  const full = tags.length >= 4;

  function add() {
    const v = value.trim();
    if (!v || full || tags.includes(v)) return;
    onChange([...tags, v]);
    setValue("");
  }

  return (
    <Field label="Tags" hint="Max. 4 korte tags (bv. Ambachtelijk, Belgisch).">
      <div className="flex flex-wrap gap-2">
        {tags.map((t, i) => (
          <span key={`${t}-${i}`} className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1 text-xs font-semibold text-forest">
            {t}
            <button type="button" aria-label={`Verwijder ${t}`} onClick={() => onChange(tags.filter((_, j) => j !== i))} className="text-forest/60 hover:text-forest">
              ✕
            </button>
          </span>
        ))}
      </div>
      {!full && (
        <div className="mt-2 flex gap-2">
          <TextInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            placeholder="Tag toevoegen"
          />
          <button type="button" onClick={add} className={addBtn}>
            +
          </button>
        </div>
      )}
    </Field>
  );
}

// Generic add/remove list of strings (used for Ingrediënten and prep steps).
function StringListEditor({
  label,
  placeholder,
  items,
  onChange,
  max = Infinity,
}: {
  label: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
  max?: number;
}) {
  const [value, setValue] = useState("");
  const full = items.length >= max;

  function add() {
    const v = value.trim();
    if (!v || full) return;
    onChange([...items, v]);
    setValue("");
  }

  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2">
            <TextInput value={it} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <button type="button" aria-label="Verwijder" onClick={() => onChange(items.filter((_, j) => j !== i))} className={removeBtn}>
              ✕
            </button>
          </div>
        ))}
        {!full && (
          <div className="flex gap-2">
            <TextInput
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add();
                }
              }}
              placeholder={placeholder}
            />
            <button type="button" onClick={add} className={addBtn}>
              Toevoegen
            </button>
          </div>
        )}
      </div>
    </Field>
  );
}

// Up to 4 feature cards, each a short title + one-line text.
function CardsEditor({ cards, onChange }: { cards: ProductCard[]; onChange: (c: ProductCard[]) => void }) {
  const full = cards.length >= 4;
  return (
    <Field label="Kaarten" hint="Max. 4 uitgelichte kaarten (korte titel + één regel).">
      <div className="space-y-3">
        {cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-forest/10 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-forest/50">Kaart {i + 1}</span>
              <button type="button" aria-label="Verwijder kaart" onClick={() => onChange(cards.filter((_, j) => j !== i))} className={removeBtn}>
                ✕
              </button>
            </div>
            <TextInput
              value={c.title}
              onChange={(e) => onChange(cards.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
              placeholder="Titel"
              className="mb-2"
            />
            <TextInput
              value={c.text}
              onChange={(e) => onChange(cards.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))}
              placeholder="Eén regel tekst"
            />
          </div>
        ))}
        {!full && (
          <button type="button" onClick={() => onChange([...cards, { title: "", text: "" }])} className={`${addBtn} w-full`}>
            + Kaart toevoegen
          </button>
        )}
      </div>
    </Field>
  );
}

// One preparation method (oven or frituur): on/off + temp/time + steps.
function PrepEditor({ label, method, onChange }: { label: string; method: PrepMethod; onChange: (m: PrepMethod) => void }) {
  return (
    <div className="rounded-xl border border-forest/10 p-3">
      <label className="flex items-center gap-2 text-sm font-medium text-forest/80">
        <input
          type="checkbox"
          checked={method.enabled}
          onChange={(e) => onChange({ ...method, enabled: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300 accent-orange"
        />
        {label}
      </label>
      {method.enabled && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Temperatuur">
              <TextInput value={method.temp} onChange={(e) => onChange({ ...method, temp: e.target.value })} placeholder="180°C" />
            </Field>
            <Field label="Tijd">
              <TextInput value={method.time} onChange={(e) => onChange({ ...method, time: e.target.value })} placeholder="3–4 min" />
            </Field>
          </div>
          <StringListEditor
            label="Stappen"
            placeholder="Extra stap"
            items={method.steps}
            onChange={(steps) => onChange({ ...method, steps })}
            max={3}
          />
        </div>
      )}
    </div>
  );
}

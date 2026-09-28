"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Field, ScalarField } from "@/lib/content/schema";
import { Button, TextArea, TextInput, useToast } from "../ui";

// Form-based editor for one page's content sections, with a live preview of the
// public page next to it. Every field is a plain input, textarea or photo/video
// drop zone; each section saves on its own.

export type EditorSection = {
  id: string;
  label: string;
  help?: string;
  fields: readonly Field[];
  value: Record<string, unknown>;
  edited: boolean;
};

type Value = Record<string, unknown>;
type Item = Record<string, string>;

export function ContentEditor({
  title,
  previewPath,
  sections,
}: {
  title: string;
  previewPath: string;
  sections: EditorSection[];
}) {
  const [previewKey, setPreviewKey] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="flex flex-col gap-3">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/inhoud"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-forest/60 transition hover:bg-forest/5 hover:text-forest"
          >
            ← Alle pagina&apos;s
          </Link>
          <h1 className="text-lg font-bold text-forest">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="hidden lg:inline-flex" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? "Voorbeeld verbergen" : "Voorbeeld tonen"}
          </Button>
          <a
            href={previewPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Bekijk pagina ↗
          </a>
        </div>
      </div>

      <div className={`grid gap-3 ${showPreview ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)]" : ""}`}>
        {/* Sections */}
        <div className={`space-y-3 ${showPreview ? "" : "mx-auto w-full max-w-[760px]"}`}>
          {sections.map((s) => (
            <SectionCard key={s.id} section={s} onSaved={() => setPreviewKey((k) => k + 1)} />
          ))}
        </div>

        {/* Live preview */}
        {showPreview && <Preview path={previewPath} reloadKey={previewKey} onReload={() => setPreviewKey((k) => k + 1)} />}
      </div>
    </div>
  );
}

// Preview of the public page at a real device size (desktop 1280×800 or
// phone 390×780), scaled down to fit the column. The page scrolls inside.
const DEVICES = {
  desktop: { w: 1280, h: 800, label: "Computer" },
  mobile: { w: 390, h: 780, label: "Gsm" },
} as const;

function Preview({ path, reloadKey, onReload }: { path: string; reloadKey: number; onReload: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // null = automatic: phone view when the column is too narrow for a readable desktop view.
  const [picked, setPicked] = useState<keyof typeof DEVICES | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const device = picked ?? (size.w && size.w < 560 ? "mobile" : "desktop");
  const d = DEVICES[device];
  const scale = size.w ? Math.min(1, (size.w - 24) / d.w, (size.h - 24) / d.h) : 0;
  return (
    <div className="sticky top-4 hidden h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm lg:flex">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-2 text-xs text-gray-500">
        <span className="truncate">Live voorbeeld · {path}</span>
        <div className="flex shrink-0 items-center gap-3">
          <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5">
            {(Object.keys(DEVICES) as (keyof typeof DEVICES)[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setPicked(k)}
                className={`rounded-full px-2.5 py-0.5 font-medium transition ${device === k ? "bg-white text-forest shadow-sm" : "text-gray-500 hover:text-forest"}`}
              >
                {DEVICES[k].label}
              </button>
            ))}
          </div>
          <button type="button" className="font-medium text-orange hover:underline" onClick={onReload}>
            Vernieuwen
          </button>
        </div>
      </div>
      <div ref={box} className="relative min-h-0 flex-1 overflow-hidden bg-gray-100">
        {scale > 0 && (
          <div
            className="absolute left-1/2 top-3 overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-black/5"
            style={{ width: d.w * scale, height: d.h * scale, marginLeft: -(d.w * scale) / 2 }}
          >
            <iframe
              key={`${reloadKey}-${device}`}
              src={path}
              title="Voorbeeld"
              className="origin-top-left border-0"
              style={{ width: d.w, height: d.h, transform: `scale(${scale})` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// —— One section: its fields + Opslaan / Annuleren / Herstel origineel ——

function SectionCard({ section, onSaved }: { section: EditorSection; onSaved: () => void }) {
  const toast = useToast();
  const [saved, setSaved] = useState<Value>(section.value);
  const [draft, setDraft] = useState<Value>(section.value);
  const [edited, setEdited] = useState(section.edited);
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);

  async function save() {
    setBusy(true);
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(section.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Opslaan mislukt");
      setSaved(data);
      setDraft(data);
      setEdited(true);
      toast(`“${section.label}” opgeslagen`);
      onSaved();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Opslaan mislukt", "error");
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    setBusy(true);
    try {
      const res = await fetch(`/api/content/${encodeURIComponent(section.id)}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Herstellen mislukt");
      setSaved(data);
      setDraft(data);
      setEdited(false);
      setConfirmReset(false);
      toast("Originele tekst hersteld");
      onSaved();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Herstellen mislukt", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl bg-white shadow-sm">
      <header className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-forest">{section.label}</h2>
          {edited && <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold text-forest">Aangepast</span>}
          {dirty && <span className="rounded-full bg-orange/15 px-2 py-0.5 text-[11px] font-semibold text-orange">Niet opgeslagen</span>}
        </div>
        {section.help && <p className="mt-1 text-xs text-gray-500">{section.help}</p>}
      </header>

      <div className="space-y-5 px-5 py-5">
        {section.fields.map((f) =>
          f.type === "list" ? (
            <ListEditor
              key={f.key}
              field={f}
              items={(draft[f.key] as Item[]) ?? []}
              onChange={(items) => setDraft((d) => ({ ...d, [f.key]: items }))}
            />
          ) : (
            <ScalarEditor
              key={f.key}
              field={f}
              value={String(draft[f.key] ?? "")}
              onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
            />
          )
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 rounded-b-2xl border-t border-gray-100 bg-gray-50/60 px-5 py-3">
        <div>
          {edited &&
            (confirmReset ? (
              <span className="flex items-center gap-2 text-xs text-gray-600">
                Alle wijzigingen in dit blok wissen?
                <Button variant="danger" className="!px-3 !py-1 text-xs" disabled={busy} onClick={reset}>
                  Ja, herstel
                </Button>
                <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => setConfirmReset(false)}>
                  Nee
                </Button>
              </span>
            ) : (
              <button type="button" className="text-xs font-medium text-gray-500 hover:text-red-600" onClick={() => setConfirmReset(true)}>
                Herstel originele tekst
              </button>
            ))}
        </div>
        <div className="flex items-center gap-2">
          {dirty && (
            <Button variant="ghost" disabled={busy} onClick={() => setDraft(saved)}>
              Annuleren
            </Button>
          )}
          <Button disabled={!dirty || busy} onClick={save}>
            {busy ? "Bezig…" : "Opslaan"}
          </Button>
        </div>
      </footer>
    </section>
  );
}

// —— Single fields ——

function FieldShell({ field, children }: { field: { label: string; help?: string }; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{field.label}</span>
      {children}
      {field.help && <span className="mt-1 block text-xs text-gray-400">{field.help}</span>}
    </div>
  );
}

function ScalarEditor({ field, value, onChange }: { field: ScalarField; value: string; onChange: (v: string) => void }) {
  const placeholder = field.help || field.label;
  if (field.type === "image" || field.type === "video") {
    return (
      <FieldShell field={field}>
        <MediaField kind={field.type} value={value} onChange={onChange} />
      </FieldShell>
    );
  }
  if (field.type === "textarea") {
    const rows = Math.min(10, Math.max(3, Math.ceil(value.length / 60) + value.split("\n").length - 1));
    return (
      <FieldShell field={field}>
        <TextArea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      </FieldShell>
    );
  }
  if (field.type === "url") {
    return (
      <FieldShell field={{ ...field, help: field.help || "Bv. /producten, /#contact of https://…" }}>
        <div className="flex gap-2">
          <TextInput value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
          {value && value !== "#" && (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              title="Link testen"
              className="grid shrink-0 place-items-center rounded-lg border border-gray-300 px-3 text-sm text-gray-500 hover:bg-gray-50"
            >
              ↗
            </a>
          )}
        </div>
      </FieldShell>
    );
  }
  return (
    <FieldShell field={field}>
      <TextInput value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </FieldShell>
  );
}

// Photo / video drop zone: drag a file in, click to choose, or paste a path.
function MediaField({ kind, value, onChange }: { kind: "image" | "video"; value: string; onChange: (v: string) => void }) {
  const toast = useToast();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const noun = kind === "image" ? "foto" : "video";

  async function upload(file: File) {
    if (kind === "image" && !file.type.startsWith("image/")) return toast("Dat is geen afbeelding", "error");
    if (kind === "video" && !file.type.startsWith("video/")) return toast("Dat is geen video", "error");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload mislukt");
      onChange(data.url);
      toast(`${kind === "image" ? "Foto" : "Video"} geüpload — vergeet niet op te slaan`);
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload mislukt", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        className={`group relative grid min-h-36 cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed transition ${
          over ? "border-orange bg-orange/5" : "border-gray-200 bg-gray-50 hover:border-orange/60"
        }`}
      >
        {value ? (
          kind === "image" ? (
            <img src={value} alt="" className="max-h-56 w-full object-contain" />
          ) : (
            <video src={value} muted playsInline className="max-h-56 w-full object-contain" />
          )
        ) : (
          <span className="px-4 py-8 text-center text-sm text-gray-400">Nog geen {noun}</span>
        )}
        <span
          className={`absolute inset-x-0 bottom-0 bg-forest/80 px-3 py-2 text-center text-xs font-medium text-white transition ${
            busy || over ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {busy ? "Bezig met uploaden…" : `Sleep een ${noun} hierheen of klik om te kiezen`}
        </span>
        <input
          ref={input}
          type="file"
          accept={kind === "image" ? "image/*" : "video/mp4,video/webm"}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      <TextInput
        value={value}
        placeholder={kind === "image" ? "/pad/naar/foto.jpg" : "/pad/naar/video.mp4"}
        onChange={(e) => onChange(e.target.value)}
        className="!py-1.5 text-xs text-gray-500"
      />
    </div>
  );
}

// —— Lists (links, cards, timeline items…): add, remove, reorder ——

function ListEditor({
  field,
  items,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  items: Item[];
  onChange: (items: Item[]) => void;
}) {
  const [open, setOpen] = useState<number | null>(null);

  function update(i: number, key: string, v: string) {
    onChange(items.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(open === i ? j : open === j ? i : open);
  }
  function remove(i: number) {
    onChange(items.filter((_, j) => j !== i));
    setOpen(null);
  }
  function add() {
    const blank = Object.fromEntries(field.fields.map((f) => [f.key, ""]));
    onChange([...items, blank]);
    setOpen(items.length);
  }

  const summaryKey = field.fields.find((f) => f.type === "text" || f.type === "textarea")?.key;

  return (
    <FieldShell field={field}>
      <div className="space-y-2">
        {items.length === 0 && <p className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-400">Nog geen items.</p>}
        {items.map((it, i) => {
          const isOpen = open === i;
          const summary = (summaryKey && it[summaryKey]) || `${field.itemLabel} ${i + 1}`;
          return (
            <div key={i} className="rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm"
                >
                  <span className={`text-gray-400 transition ${isOpen ? "rotate-90" : ""}`}>▸</span>
                  <span className="shrink-0 text-xs font-semibold text-gray-400">{i + 1}.</span>
                  <span className="truncate text-forest">{summary}</span>
                </button>
                <button type="button" title="Omhoog" disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-1.5 text-gray-400 hover:text-forest disabled:opacity-30">
                  ↑
                </button>
                <button type="button" title="Omlaag" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="rounded px-1.5 text-gray-400 hover:text-forest disabled:opacity-30">
                  ↓
                </button>
                <button type="button" title="Verwijderen" onClick={() => remove(i)} className="rounded px-1.5 text-gray-400 hover:text-red-600">
                  ✕
                </button>
              </div>
              {isOpen && (
                <div className="space-y-4 border-t border-gray-100 px-3 py-4">
                  {field.fields.map((f) => (
                    <ScalarEditor key={f.key} field={f} value={it[f.key] ?? ""} onChange={(v) => update(i, f.key, v)} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={add}
          className="w-full rounded-xl border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-orange transition hover:border-orange hover:bg-orange/5"
        >
          + {field.itemLabel} toevoegen
        </button>
      </div>
    </FieldShell>
  );
}

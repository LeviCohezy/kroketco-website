"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useEditor } from "../ContentProvider";
import type { SectionId } from "@/lib/content/registry";

// Inline-editable primitives. In view mode they render exactly like plain
// markup; in edit mode (admin flipped the toolbar on) they become editable in
// place — text via contentEditable, images via an upload overlay, links via a
// small popover — and save through the ContentProvider.

// Resolve a scalar value from either a section field or a list item field.
type Binding = { section: SectionId; field?: string; listField?: string; index?: number; itemKey?: string };

function readValue(content: Record<string, unknown>, b: Binding): string {
  const sec = content[b.section] as Record<string, unknown>;
  if (b.listField != null && b.index != null && b.itemKey != null) {
    const list = sec?.[b.listField] as Record<string, string>[] | undefined;
    return list?.[b.index]?.[b.itemKey] ?? "";
  }
  return (sec?.[b.field as string] as string) ?? "";
}

const OUTLINE = "outline outline-1 outline-dashed outline-orange/70 rounded-[3px] focus:outline-2 focus:outline-orange";

// ——— Text ———
export function EditableText({
  section,
  field,
  listField,
  index,
  itemKey,
  as,
  className,
  style,
}: Binding & { as?: ElementType; className?: string; style?: CSSProperties }) {
  const { content, editing, updateField, updateItem } = useEditor();
  const As: ElementType = as || "span";
  const value = readValue(content as Record<string, unknown>, { section, field, listField, index, itemKey });
  const ref = useRef<HTMLElement>(null);

  // Keep the DOM text in sync with state, but never while the admin is typing
  // in it (that would reset the caret).
  useEffect(() => {
    const el = ref.current;
    if (editing && el && document.activeElement !== el) el.innerText = value;
  }, [value, editing]);

  if (!editing) {
    return (
      <As className={className} style={style}>
        {value}
      </As>
    );
  }

  const commit = (text: string) => {
    if (listField != null && index != null && itemKey != null) updateItem(section, listField, index, itemKey, text);
    else updateField(section, field as string, text);
  };

  return (
    <As
      ref={ref}
      className={`${className ?? ""} ${OUTLINE} cursor-text`}
      style={style}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={(e: React.FocusEvent<HTMLElement>) => commit(e.currentTarget.innerText.trim())}
      onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
        // Enter commits + blurs for single-line-ish fields; Shift+Enter allows newlines.
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {value}
    </As>
  );
}

// ——— Image ———
export function EditableImage({
  section,
  field,
  listField,
  index,
  itemKey,
  className,
  style,
  alt = "",
}: Binding & { className?: string; style?: CSSProperties; alt?: string }) {
  const { content, editing, updateField, updateItem } = useEditor();
  const value = readValue(content as Record<string, unknown>, { section, field, listField, index, itemKey });
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const commit = (url: string) => {
    if (listField != null && index != null && itemKey != null) updateItem(section, listField, index, itemKey, url);
    else updateField(section, field as string, url);
  };

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) commit(data.url);
      else alert(data.error || "Upload mislukt");
    } catch {
      alert("Upload mislukt");
    } finally {
      setBusy(false);
    }
  }

  // eslint-disable-next-line @next/next/no-img-element
  const img = (
    <img src={value} alt={alt} style={style} className={editing ? `${className ?? ""} outline outline-2 outline-dashed outline-orange/70` : className} />
  );
  if (!editing) return img;

  // Small corner pill (not a full overlay) so it never blocks foreground content
  // sitting on top of a background image. Parent is a positioned container.
  return (
    <>
      {img}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute left-2 top-2 z-30 rounded-full bg-forest/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-cream shadow-lg transition hover:bg-forest"
      >
        {busy ? "Uploaden…" : "Wijzig afbeelding"}
      </button>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
    </>
  );
}

// ——— Video (background) ———
export function EditableVideo({
  section,
  field,
  poster,
  className,
}: Binding & { poster?: string; className?: string }) {
  const { content, editing, updateField } = useEditor();
  const value = readValue(content as Record<string, unknown>, { section, field });
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) updateField(section, field as string, data.url);
      else alert(data.error || "Upload mislukt");
    } catch {
      alert("Upload mislukt");
    } finally {
      setBusy(false);
    }
  }

  const video = (
    <video
      className={editing ? `${className ?? ""} outline outline-2 outline-dashed outline-orange/70` : className}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      key={value}
    >
      <source src={value} type="video/mp4" />
    </video>
  );
  if (!editing) return video;

  return (
    <>
      {video}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute left-2 top-2 z-30 rounded-full bg-forest/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-cream shadow-lg transition hover:bg-forest"
      >
        {busy ? "Uploaden…" : "Wijzig video"}
      </button>
      <input ref={inputRef} type="file" accept="video/*" hidden onChange={onPick} />
    </>
  );
}

// ——— Link / button ———
export function EditableLink({
  section,
  labelField,
  hrefField,
  className,
  children,
  target,
  rel,
}: {
  section: SectionId;
  labelField: string;
  hrefField: string;
  className?: string;
  children?: ReactNode;
  target?: string;
  rel?: string;
}) {
  const { content, editing, updateField } = useEditor();
  const sec = content[section] as Record<string, string>;
  const label = sec[labelField] ?? "";
  const href = sec[hrefField] ?? "";
  const [open, setOpen] = useState(false);

  if (!editing) {
    return (
      <a href={href} className={className} target={target} rel={rel}>
        {label}
        {children}
      </a>
    );
  }

  return (
    <span className="relative inline-flex">
      <a
        href={href}
        className={`${className ?? ""} ${OUTLINE}`}
        onClick={(e) => {
          e.preventDefault();
          setOpen((o) => !o);
        }}
      >
        {label}
        {children}
      </a>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-64 rounded-xl border border-forest/15 bg-white p-3 text-left shadow-xl">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-forest/60">Tekst</label>
          <input
            defaultValue={label}
            onChange={(e) => updateField(section, labelField, e.target.value)}
            className="mt-1 w-full rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-orange focus:ring-2 focus:ring-orange/25"
          />
          <label className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.08em] text-forest/60">Link</label>
          <input
            defaultValue={href}
            onChange={(e) => updateField(section, hrefField, e.target.value)}
            placeholder="/pagina, #anker of https://…"
            className="mt-1 w-full rounded-lg border border-forest/15 bg-white px-3 py-2 text-sm text-forest outline-none focus:border-orange focus:ring-2 focus:ring-orange/25"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-3 w-full rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-cream transition hover:brightness-110"
          >
            Klaar
          </button>
        </div>
      )}
    </span>
  );
}

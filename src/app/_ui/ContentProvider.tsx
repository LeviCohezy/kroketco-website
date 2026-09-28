"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import type { ContentOf, SectionId, SiteContent } from "@/lib/content/registry";

// All editable site content, loaded once by the root layout. In addition to
// serving content to components (useContent), this provider powers the inline
// "Webflow-style" editor: admins can flip on edit mode and change text, images
// and links directly on the page. Edits update local state immediately and are
// debounce-saved to /api/content/[id] (the full section, since a partial save
// resets the section's other fields to their defaults).

type EditContext = {
  content: SiteContent;
  isAdmin: boolean;
  editing: boolean;
  setEditing: (v: boolean) => void;
  saving: boolean;
  updateField: (section: SectionId, field: string, value: string) => void;
  updateItem: (section: SectionId, listField: string, index: number, key: string, value: string) => void;
};

const Ctx = createContext<EditContext | null>(null);

export function ContentProvider({
  value,
  isAdmin = false,
  children,
}: {
  value: SiteContent;
  isAdmin?: boolean;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<SiteContent>(value);
  const [editing, setEditing] = useState(false);
  const [inflight, setInflight] = useState(0);
  const ref = useRef(content);
  ref.current = content;
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const scheduleSave = useCallback((section: SectionId, sectionValue: unknown) => {
    const key = String(section);
    if (timers.current[key]) clearTimeout(timers.current[key]);
    timers.current[key] = setTimeout(async () => {
      setInflight((n) => n + 1);
      try {
        await fetch(`/api/content/${section}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionValue),
        });
      } catch {
        // Leave the local edit in place; the admin can retry by editing again.
      } finally {
        setInflight((n) => n - 1);
      }
    }, 600);
  }, []);

  const updateField = useCallback(
    (section: SectionId, field: string, value: string) => {
      const prevSection = ref.current[section] as Record<string, unknown>;
      if (prevSection[field] === value) return;
      const nextSection = { ...prevSection, [field]: value };
      const next = { ...ref.current, [section]: nextSection } as SiteContent;
      ref.current = next;
      setContent(next);
      scheduleSave(section, nextSection);
    },
    [scheduleSave]
  );

  const updateItem = useCallback(
    (section: SectionId, listField: string, index: number, key: string, value: string) => {
      const prevSection = ref.current[section] as Record<string, unknown>;
      const list = Array.isArray(prevSection[listField])
        ? (prevSection[listField] as Record<string, string>[]).map((x) => ({ ...x }))
        : [];
      if (!list[index] || list[index][key] === value) return;
      list[index][key] = value;
      const nextSection = { ...prevSection, [listField]: list };
      const next = { ...ref.current, [section]: nextSection } as SiteContent;
      ref.current = next;
      setContent(next);
      scheduleSave(section, nextSection);
    },
    [scheduleSave]
  );

  const ctx = useMemo<EditContext>(
    () => ({ content, isAdmin, editing, setEditing, saving: inflight > 0, updateField, updateItem }),
    [content, isAdmin, editing, inflight, updateField, updateItem]
  );

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useContent<K extends SectionId>(id: K): ContentOf<K> {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx.content[id] as ContentOf<K>;
}

export function useEditor(): EditContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useEditor must be used inside <ContentProvider>");
  return ctx;
}

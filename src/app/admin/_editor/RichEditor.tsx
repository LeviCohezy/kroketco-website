"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import Placeholder from "@tiptap/extension-placeholder";
import type { JSONContent } from "@tiptap/core";
import { useEffect, useRef } from "react";
import { sharedExtensions } from "./extensions";
import { Callout } from "./callout";
import { CalloutEditor } from "./CalloutView";
import { SlashCommand } from "./slash-command";
import { useToast } from "../ui";

// Swap the plain server-side Callout for the editor variant (React NodeView with
// a colour-swatch picker). Everything else in the shared set is reused as-is.
const editorExtensions = [...sharedExtensions.filter((e) => e !== Callout), CalloutEditor];

// —— Premium toolbar icons (stroke SVGs, not emoji) ——
function I({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[18px] w-[18px]"
      aria-hidden
    >
      {children}
    </svg>
  );
}

const ICON = {
  highlight: (
    <I>
      <path d="m9 11-6 6v3h9l3-3" />
      <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
    </I>
  ),
  code: (
    <I>
      <path d="m16 18 6-6-6-6" />
      <path d="m8 6-6 6 6 6" />
    </I>
  ),
  bullet: (
    <I>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <circle cx="3.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="3.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </I>
  ),
  ordered: (
    <I>
      <path d="M10 6h11" />
      <path d="M10 12h11" />
      <path d="M10 18h11" />
      <path d="M4 4.5h1.3V9" />
      <path d="M4 9h2.6" />
      <path d="M4.2 14.6c.1-.6.7-1 1.3-1 .7 0 1.2.4 1.2 1 0 1.1-2.4 1.6-2.4 3H6.8" />
    </I>
  ),
  quote: (
    <I>
      <path d="M9 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2v1.5A1.5 1.5 0 0 1 5.5 15" />
      <path d="M20 8h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h2v1.5a1.5 1.5 0 0 1-1.5 1.5" />
    </I>
  ),
  callout: (
    <I>
      <path d="M21 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2z" />
    </I>
  ),
  important: (
    <I>
      <path d="M10.3 4 2.7 17a1.5 1.5 0 0 0 1.3 2.2h16a1.5 1.5 0 0 0 1.3-2.2L13.7 4a1.5 1.5 0 0 0-2.6 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </I>
  ),
  table: (
    <I>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M3 15h18" />
      <path d="M9 3v18" />
    </I>
  ),
  image: (
    <I>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </I>
  ),
  link: (
    <I>
      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 4.83" />
      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12 19.17" />
    </I>
  ),
};

function tbtn(active: boolean) {
  return `grid h-8 min-w-8 place-items-center rounded-md px-1.5 text-[13px] font-semibold transition ${
    active ? "bg-orange/15 text-orange" : "text-gray-600 hover:bg-gray-100"
  }`;
}

// Reusable Notion-style rich editor. Emits ProseMirror JSON via onChange.
// `immediatelyRender: false` avoids a Next SSR hydration mismatch.
export function RichEditor({
  initialContent,
  onChange,
}: {
  initialContent: JSONContent;
  onChange: (doc: JSONContent) => void;
}) {
  const toast = useToast();
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      ...editorExtensions,
      Placeholder.configure({ placeholder: "Typ '/' voor commando's…" }),
      SlashCommand,
    ],
    content: initialContent,
    editorProps: {
      attributes: { class: "tt-prose focus:outline-none" },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getJSON()),
  });

  // Image insertion — triggered by the slash menu's "Afbeelding" item or the
  // toolbar button. Opens a file picker, uploads, then inserts.
  const fileRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const openPicker = () => fileRef.current?.click();
    window.addEventListener("tt-insert-image", openPicker);
    return () => window.removeEventListener("tt-insert-image", openPicker);
  }, []);

  async function uploadImage(file: File) {
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload mislukt");
      editor?.chain().focus().setImage({ src: data.url }).run();
      toast("Afbeelding ingevoegd");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload mislukt", "error");
    }
  }

  if (!editor) {
    return <div className="tt-prose min-h-96 animate-pulse text-forest/30">Editor laden…</div>;
  }

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL:", prev || "");
    if (url === null) return;
    if (url === "") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="tt-editor">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white/95 py-2 backdrop-blur">
        <button type="button" title="Vet" className={tbtn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-bold">B</span>
        </button>
        <button type="button" title="Cursief" className={tbtn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="font-serif italic">I</span>
        </button>
        <button type="button" title="Onderstrepen" className={tbtn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </button>
        <button type="button" title="Markeren" className={tbtn(editor.isActive("highlight"))} onClick={() => editor.chain().focus().toggleHighlight().run()}>
          {ICON.highlight}
        </button>
        <button type="button" title="Code" className={tbtn(editor.isActive("code"))} onClick={() => editor.chain().focus().toggleCode().run()}>
          {ICON.code}
        </button>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <button type="button" title="Kop 1" className={tbtn(editor.isActive("heading", { level: 1 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>
        <button type="button" title="Kop 2" className={tbtn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button type="button" title="Kop 3" className={tbtn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <button type="button" title="Opsomming" className={tbtn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          {ICON.bullet}
        </button>
        <button type="button" title="Genummerde lijst" className={tbtn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          {ICON.ordered}
        </button>
        <button type="button" title="Citaat" className={tbtn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          {ICON.quote}
        </button>
        <span className="mx-1 h-5 w-px bg-gray-200" />
        <button
          type="button"
          title="Callback (gekleurd blok)"
          className={tbtn(editor.isActive("callout"))}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertContent({ type: "callout", attrs: { color: "light-blue" }, content: [{ type: "paragraph" }] })
              .run()
          }
        >
          {ICON.callout}
        </button>
        <button
          type="button"
          title="Belangrijk"
          className={tbtn(editor.isActive("important"))}
          onClick={() =>
            editor.chain().focus().insertContent({ type: "important", content: [{ type: "paragraph" }] }).run()
          }
        >
          {ICON.important}
        </button>
        <button
          type="button"
          title="Tabel invoegen"
          className={tbtn(editor.isActive("table"))}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          {ICON.table}
        </button>
        <button type="button" title="Afbeelding" className={tbtn(false)} onClick={() => window.dispatchEvent(new CustomEvent("tt-insert-image"))}>
          {ICON.image}
        </button>
        <button type="button" title="Link" className={tbtn(editor.isActive("link"))} onClick={setLink}>
          {ICON.link}
        </button>
      </div>

      {/* Inline selection bubble menu */}
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
      >
        <button type="button" title="Vet" className={tbtn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-bold">B</span>
        </button>
        <button type="button" title="Cursief" className={tbtn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="font-serif italic">I</span>
        </button>
        <button type="button" title="Onderstrepen" className={tbtn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </button>
        <button type="button" title="Markeren" className={tbtn(editor.isActive("highlight"))} onClick={() => editor.chain().focus().toggleHighlight().run()}>
          {ICON.highlight}
        </button>
        <button type="button" title="Link" className={tbtn(editor.isActive("link"))} onClick={setLink}>
          {ICON.link}
        </button>
      </BubbleMenu>

      <EditorContent editor={editor} />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadImage(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

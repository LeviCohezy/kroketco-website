"use client";

import { Extension } from "@tiptap/core";
import type { Editor, Range } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import type { SuggestionProps, SuggestionKeyDownProps } from "@tiptap/suggestion";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  type ReactElement,
} from "react";

// Notion-style "/" slash menu, built on TipTap's Suggestion utility + a React
// floating menu rendered via ReactRenderer. Client-only.

export type SlashItem = {
  title: string;
  subtitle: string;
  icon: string;
  keywords?: string[];
  command: (args: { editor: Editor; range: Range }) => void;
};

const ITEMS: SlashItem[] = [
  {
    title: "Tekst",
    subtitle: "Gewone alinea",
    icon: "¶",
    keywords: ["text", "paragraph", "alinea"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setParagraph().run(),
  },
  {
    title: "Titel 1",
    subtitle: "Grote kop",
    icon: "H1",
    keywords: ["h1", "heading", "titel", "kop"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 1 }).run(),
  },
  {
    title: "Titel 2",
    subtitle: "Middelgrote kop",
    icon: "H2",
    keywords: ["h2", "heading", "titel", "kop"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 2 }).run(),
  },
  {
    title: "Titel 3",
    subtitle: "Kleine kop",
    icon: "H3",
    keywords: ["h3", "heading", "titel", "kop"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setNode("heading", { level: 3 }).run(),
  },
  {
    title: "Opsomming",
    subtitle: "Ongenummerde lijst",
    icon: "•",
    keywords: ["bullet", "list", "lijst", "opsomming"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Genummerde lijst",
    subtitle: "Geordende lijst",
    icon: "1.",
    keywords: ["numbered", "ordered", "list", "lijst"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "Takenlijst",
    subtitle: "Checkboxes",
    icon: "☑",
    keywords: ["todo", "task", "check", "taken"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Citaat",
    subtitle: "Quote-blok",
    icon: "❝",
    keywords: ["quote", "citaat", "blockquote"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleBlockquote().run(),
  },
  {
    title: "Callback",
    subtitle: "Gekleurd blok (kies een merk­kleur)",
    icon: "🎨",
    keywords: ["callback", "callout", "info", "note", "kader", "kleur", "color"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: "callout",
          attrs: { color: "light-blue" },
          content: [{ type: "paragraph" }],
        })
        .run(),
  },
  {
    title: "Belangrijk",
    subtitle: "Oranje aandachtsblok",
    icon: "⚠",
    keywords: ["important", "belangrijk", "let op", "warning", "attentie"],
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertContent({ type: "important", content: [{ type: "paragraph" }] })
        .run(),
  },
  {
    title: "Scheidingslijn",
    subtitle: "Horizontale lijn",
    icon: "―",
    keywords: ["divider", "hr", "rule", "lijn", "scheiding"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).setHorizontalRule().run(),
  },
  {
    title: "Codeblok",
    subtitle: "Blok met code",
    icon: "</>",
    keywords: ["code", "codeblock", "pre"],
    command: ({ editor, range }) => editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
  },
  {
    title: "Afbeelding",
    subtitle: "Upload een afbeelding",
    icon: "🖼",
    keywords: ["image", "afbeelding", "foto", "upload"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // Defer to a global handler wired up by the editor component.
      window.dispatchEvent(new CustomEvent("tt-insert-image"));
    },
  },
  {
    title: "Link",
    subtitle: "Voeg een hyperlink toe",
    icon: "🔗",
    keywords: ["link", "url", "hyperlink"],
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = window.prompt("Link URL:");
      if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    },
  },
  {
    title: "Tabel",
    subtitle: "3×3 tabel invoegen",
    icon: "▦",
    keywords: ["table", "tabel", "grid"],
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
];

function filterItems(query: string): SlashItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return ITEMS;
  return ITEMS.filter((it) => {
    const hay = [it.title, it.subtitle, ...(it.keywords ?? [])].join(" ").toLowerCase();
    return hay.includes(q);
  });
}

// —— The floating menu component ——

type MenuHandle = { onKeyDown: (props: SuggestionKeyDownProps) => boolean };

const SlashMenu = forwardRef<MenuHandle, SuggestionProps<SlashItem>>(function SlashMenu(props, ref): ReactElement {
  const [selected, setSelected] = useState(0);

  useEffect(() => setSelected(0), [props.items]);

  const pick = (index: number) => {
    const item = props.items[index];
    if (item) props.command(item);
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelected((s) => (s + props.items.length - 1) % Math.max(props.items.length, 1));
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelected((s) => (s + 1) % Math.max(props.items.length, 1));
        return true;
      }
      if (event.key === "Enter") {
        pick(selected);
        return true;
      }
      return false;
    },
  }));

  if (props.items.length === 0) {
    return (
      <div className="w-72 rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-400 shadow-xl">
        Geen blokken gevonden
      </div>
    );
  }

  return (
    <div className="max-h-80 w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
      {props.items.map((item, i) => (
        <button
          key={item.title}
          type="button"
          onMouseEnter={() => setSelected(i)}
          onClick={() => pick(i)}
          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition ${
            i === selected ? "bg-orange/10" : "hover:bg-gray-50"
          }`}
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-gray-200 bg-white text-xs font-semibold text-gray-700">
            {item.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-gray-900">{item.title}</span>
            <span className="block truncate text-xs text-gray-400">{item.subtitle}</span>
          </span>
        </button>
      ))}
    </div>
  );
});

// —— Lightweight positioning without extra deps ——
// We anchor the menu near the caret using getBoundingClientRect from the
// suggestion's clientRect, positioned fixed.

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem>({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        allowSpaces: false,
        items: ({ query }) => filterItems(query),
        command: ({ editor, range, props }) => props.command({ editor, range }),
        render: () => {
          let component: ReactRenderer<MenuHandle, SuggestionProps<SlashItem>> | null = null;
          let el: HTMLDivElement | null = null;

          const position = (clientRect?: (() => DOMRect | null) | null) => {
            if (!el || !clientRect) return;
            const rect = clientRect();
            if (!rect) return;
            el.style.position = "fixed";
            el.style.left = `${rect.left}px`;
            el.style.top = `${rect.bottom + 6}px`;
            el.style.zIndex = "80";
          };

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashMenu, { props, editor: props.editor });
              el = document.createElement("div");
              el.appendChild(component.element);
              document.body.appendChild(el);
              position(props.clientRect);
            },
            onUpdate: (props) => {
              component?.updateProps(props);
              position(props.clientRect);
            },
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                el?.remove();
                el = null;
                return true;
              }
              return component?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              el?.remove();
              el = null;
              component?.destroy();
              component = null;
            },
          };
        },
      }),
    ];
  },
});

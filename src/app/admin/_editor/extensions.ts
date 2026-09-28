import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import type { Extensions } from "@tiptap/core";
import { Callout } from "./callout";
import { Important } from "./important";

// Shared TipTap extension set — the single source of truth for the editor
// schema. Kept free of browser-only imports so it can also run on the server
// (used by generateHTML in the public /nieuws/[slug] page).
//
// TipTap v3's StarterKit already bundles: document, paragraph, text, bold,
// italic, strike, code, codeBlock, blockquote, heading, horizontalRule,
// bullet/ordered lists + listItem, hardBreak, underline, AND link. So we do NOT
// add Link/Underline separately (that would duplicate the schema).
export const sharedExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: {
      openOnClick: false,
      HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
    },
  }),
  Highlight,
  TaskList,
  TaskItem.configure({ nested: true }),
  Image.configure({ HTMLAttributes: { class: "tt-image" } }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
  Callout,
  Important,
];

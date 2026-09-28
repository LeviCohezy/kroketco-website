import { Node, mergeAttributes } from "@tiptap/core";

// "Callback" block: a coloured box (callout-style) whose colour the user can set
// to one of the brand colours. Content is editable rich text. Server-safe (no
// browser-only imports), so it can be shared with server-side HTML generation.
//
// Rendered DOM:
//   <div class="tt-callout tt-callout--<color>" data-color="<color>"> …content… </div>

export const CALLOUT_COLORS = ["light-blue", "orange", "forest", "cream", "lime"] as const;
export type CalloutColor = (typeof CALLOUT_COLORS)[number];

function normalizeColor(v: unknown): CalloutColor {
  return (CALLOUT_COLORS as readonly string[]).includes(v as string) ? (v as CalloutColor) : "light-blue";
}

export const Callout = Node.create({
  name: "callout",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      color: {
        default: "light-blue" as CalloutColor,
        parseHTML: (el) => normalizeColor(el.getAttribute("data-color")),
        renderHTML: (attrs) => ({ "data-color": normalizeColor(attrs.color) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "div.tt-callout" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const color = normalizeColor(node.attrs.color);
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: `tt-callout tt-callout--${color}` }),
      ["div", { class: "tt-callout__body" }, 0],
    ];
  },
});

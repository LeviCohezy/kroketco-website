import { Node, mergeAttributes } from "@tiptap/core";

// "Belangrijk" (Important) block: a distinct orange-accented emphasis block for
// important notices — left orange bar + soft orange background + a warning icon.
// Content is editable rich text. Server-safe.
//
// Rendered DOM:
//   <div class="tt-important"><span class="tt-important__icon">⚠</span>
//     <div class="tt-important__body"> …content… </div></div>

export const Important = Node.create({
  name: "important",
  group: "block",
  content: "block+",
  defining: true,

  parseHTML() {
    return [{ tag: "div.tt-important" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "tt-important" }),
      ["span", { class: "tt-important__icon", contenteditable: "false" }, "⚠"],
      ["div", { class: "tt-important__body" }, 0],
    ];
  },
});

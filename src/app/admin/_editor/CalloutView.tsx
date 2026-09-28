"use client";

import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Callout, CALLOUT_COLORS, type CalloutColor } from "./callout";

// Swatch labels + preview chips for the colour picker.
const SWATCHES: { color: CalloutColor; label: string; css: string }[] = [
  { color: "light-blue", label: "Blauw", css: "var(--light-blue)" },
  { color: "orange", label: "Oranje", css: "var(--orange)" },
  { color: "forest", label: "Groen", css: "var(--forest)" },
  { color: "cream", label: "Crème", css: "var(--cream)" },
  { color: "lime", label: "Lime", css: "var(--lime)" },
];

function CalloutComponent({ node, updateAttributes }: NodeViewProps) {
  const active = (node.attrs.color as CalloutColor) ?? "light-blue";
  return (
    <NodeViewWrapper className={`tt-callout tt-callout--${active} tt-callout--editing`}>
      {/* colour swatch picker — not part of the document, editor-only */}
      <div className="tt-callout__picker" contentEditable={false}>
        {SWATCHES.map((s) => (
          <button
            key={s.color}
            type="button"
            title={s.label}
            aria-label={s.label}
            onClick={() => updateAttributes({ color: s.color })}
            className={`tt-swatch ${active === s.color ? "tt-swatch--on" : ""}`}
            style={{ background: s.css }}
          />
        ))}
      </div>
      <NodeViewContent className="tt-callout__body" />
    </NodeViewWrapper>
  );
}

// Editor-only variant of the shared Callout node: same schema/name, but renders
// with a React NodeView that exposes the swatch picker. Used in RichEditor in
// place of the base Callout (the base one stays for server-side rendering).
export const CalloutEditor = Callout.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CalloutComponent);
  },
});

export { CALLOUT_COLORS };

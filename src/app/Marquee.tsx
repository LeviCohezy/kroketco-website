"use client";
/* eslint-disable @next/next/no-img-element */

import { useContent, useEditor } from "@/app/_ui/ContentProvider";
import { EditableText, EditableImage } from "@/app/_ui/edit/Editable";

// Frame/label colour per card position (content lives in the CMS: home.marquee).
const COLORS = ["#ff8a00", "#f2c14e", "#3e6be6", "#ff8a00", "#0e4b3a", "#f4a7c3", "#a88be0", "#e95454"];

export default function Marquee() {
  const { cards } = useContent("home.marquee");
  const { editing } = useEditor();
  if (!cards.length) return null;
  const withColor = cards.map((c, i) => ({ ...c, color: COLORS[i % COLORS.length] }));
  // In edit mode show a single, static, wrapping set so every card is editable;
  // in view mode duplicate the set so translateX(-50%) loops seamlessly.
  const track = editing ? withColor : [...withColor, ...withColor];
  return (
    <section className="relative z-10 overflow-hidden bg-[var(--light-blue)] py-10 sm:py-12">
      <div className={editing ? "flex flex-wrap justify-center gap-5 px-6" : "flex w-max animate-marquee"}>
        {track.map((c, i) => {
          const idx = i % cards.length;
          return (
            <div key={i} className={`relative w-[clamp(230px,22vw,290px)] shrink-0 ${editing ? "" : "mr-5"}`}>
              <div className="rounded-[26px] p-[5px]" style={{ background: c.color }}>
                <div className="aspect-[3/4] overflow-hidden rounded-[22px]">
                  <EditableImage section="home.marquee" listField="cards" index={idx} itemKey="image" className="h-full w-full object-cover" />
                </div>
              </div>
              <EditableText
                as="span"
                section="home.marquee"
                listField="cards"
                index={idx}
                itemKey="label"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white"
                style={{ background: c.color }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

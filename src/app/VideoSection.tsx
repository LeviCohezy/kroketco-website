"use client";

import { useEffect, useRef, useState } from "react";
import { useContent, useEditor } from "@/app/_ui/ContentProvider";

export default function VideoSection() {
  const { video } = useContent("home.video");
  const { editing, updateField } = useEditor();
  const wrapRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
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
      if (res.ok && data.url) updateField("home.video", "video", data.url);
      else alert(data.error || "Upload mislukt");
    } finally {
      setBusy(false);
    }
  }

  // Scroll-scrub: the video's frame follows scroll (down = forward, up = reverse,
  // stop = hold). A continuous rAF loop eases the playback position toward the
  // scroll target so seeking stays smooth instead of snapping on each scroll tick.
  useEffect(() => {
    const v = ref.current;
    const wrap = wrapRef.current;
    if (!v || !wrap) return;

    let dur = 0;
    let raf = 0;
    let cur = 0;
    let active = false;

    const onMeta = () => { dur = v.duration || 0; };
    v.addEventListener("loadedmetadata", onMeta);
    if (v.readyState >= 1) dur = v.duration || 0;

    const targetTime = () => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // 0 when the section top enters at the bottom; 1 the moment its top reaches
      // the top of the viewport.
      const p = Math.min(1, Math.max(0, (vh - rect.top) / vh));
      return p * (dur || 0);
    };

    const loop = () => {
      const t = targetTime();
      cur += (t - cur) * 0.15;              // ease toward the scroll target
      if (Math.abs(t - cur) < 0.004) cur = t; // settle exactly, then stop seeking
      if (dur && Math.abs(v.currentTime - cur) > 0.01) {
        try { v.currentTime = cur; } catch { /* not seekable yet */ }
      }
      if (active) raf = requestAnimationFrame(loop);
    };

    // Only run the loop while the section is on screen.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !active) {
          active = true;
          cur = v.currentTime;
          raf = requestAnimationFrame(loop);
        } else if (!visible && active) {
          active = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      active = false;
      cancelAnimationFrame(raf);
      v.removeEventListener("loadedmetadata", onMeta);
    };
  }, [video]);

  if (!video) return null;

  return (
    <section className="relative z-10 bg-white">
      {/* fixed-ratio frame crops the empty top/bottom of the 16:9 video */}
      <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ aspectRatio: "2.6 / 1" }}>
        <video
          key={video}
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          // lift the light backdrop up to plain white so it matches the other sections
          style={{ filter: "brightness(1.06) contrast(1.12)" }}
        >
          <source src={video} type="video/mp4" />
        </video>
        {editing && (
          <>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute left-2 top-2 z-30 rounded-full bg-forest/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-cream shadow-lg transition hover:bg-forest"
            >
              {busy ? "Uploaden…" : "Wijzig video"}
            </button>
            <input ref={fileRef} type="file" accept="video/*" hidden onChange={onPick} />
          </>
        )}
      </div>
    </section>
  );
}

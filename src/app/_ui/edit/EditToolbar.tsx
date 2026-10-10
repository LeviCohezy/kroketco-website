"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useEditor } from "../ContentProvider";

// Admin-only control: a small round button pinned to the right edge (mid
// screen, so it never covers the hero card or the footer). Clicking it opens a
// menu with "Bewerkmodus" (inline editing on/off) and "Beheerscherm" (the
// dashboard). In edit mode the save status shows as a small label next to it.
// Visitors never see this (isAdmin is false for them).
export default function EditToolbar() {
  const { isAdmin, editing, setEditing, saving } = useEditor();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isAdmin) return null;

  return (
    <div ref={rootRef} className="fixed right-4 top-1/2 z-[80] flex -translate-y-1/2 items-center gap-2 print:hidden">
      {editing && !open && (
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1c1c1c] shadow-lg backdrop-blur">
          {saving ? "Opslaan…" : "Opgeslagen"}
        </span>
      )}

      {open && (
        <div
          role="menu"
          className="flex flex-col overflow-hidden rounded-2xl bg-white p-1.5 text-sm font-semibold text-[#1c1c1c] shadow-[0_14px_40px_rgba(0,0,0,0.28)]"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setEditing(!editing);
              setOpen(false);
            }}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-[#b5e3fc]"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${editing ? "bg-[#fd6c0d]" : "bg-black/20"}`} aria-hidden />
            {editing ? "Bewerkmodus uit" : "Bewerkmodus aan"}
          </button>
          <Link
            href="/admin/producten"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 transition-colors hover:bg-[#b5e3fc]"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            Beheerscherm
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Menu sluiten" : "Bewerken"}
        title={editing ? "Bewerkmodus is aan" : "Bewerken"}
        className={`grid h-11 w-11 place-items-center rounded-full text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition hover:scale-105 ${
          editing ? "bg-[#fd6c0d]" : "bg-[#1c1c1c]"
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <path
            d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z M13.5 6.5l3 3"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

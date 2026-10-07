"use client";

import Link from "next/link";
import { useEditor } from "../ContentProvider";

// Floating control shown only to logged-in admins. Flips inline edit mode on/off,
// shows the save status, and links to the dashboard (products, blog, partners,
// contact). Visitors never see this (isAdmin is false for them).
export default function EditToolbar() {
  const { isAdmin, editing, setEditing, saving } = useEditor();
  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 print:hidden">
      {editing && (
        <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-forest shadow-lg backdrop-blur">
          {saving ? "Opslaan…" : "Opgeslagen"}
        </span>
      )}
      {!editing && (
        <Link
          href="/admin/producten"
          className="rounded-full bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-forest shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-[1.03]"
        >
          Producten &amp; beheer
        </Link>
      )}
      <button
        type="button"
        onClick={() => setEditing(!editing)}
        className={`rounded-full px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition ${
          editing ? "bg-forest text-cream hover:brightness-110" : "bg-orange text-cream hover:scale-[1.03]"
        }`}
      >
        {editing ? "Klaar met bewerken" : "Bewerken"}
      </button>
    </div>
  );
}

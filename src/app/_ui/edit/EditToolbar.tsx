"use client";

import { useEditor } from "../ContentProvider";

// Floating control shown only to logged-in admins. Flips inline edit mode on/off
// and shows the save status. Visitors never see this (isAdmin is false for them).
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

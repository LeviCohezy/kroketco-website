"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

// —— Toast system ——

type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastCtx = createContext<(message: string, kind?: Toast["kind"]) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.kind === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// —— Form primitives ——

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-orange focus:ring-2 focus:ring-orange/25";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" | "ghost" }) {
  const styles = {
    primary: "bg-orange text-white hover:brightness-105 hover:-translate-y-0.5 shadow-sm",
    secondary: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-gray-500 hover:text-gray-800",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    />
  );
}

// —— Row action menu: a "Bewerk" split button + portal dropdown ——
// The dropdown is portalled to <body> so a scrollable/overflow-hidden table
// never clips it.

export type ActionItem = { label: string; onClick: () => void; danger?: boolean };

export function RowActionMenu({ onEdit, items }: { onEdit: () => void; items: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    setOpen(true);
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-gray-300">
      <button
        onClick={onEdit}
        className="bg-white px-4 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        Bewerk
      </button>
      <button
        ref={btnRef}
        type="button"
        aria-label="Meer opties"
        onClick={toggle}
        className="grid w-8 place-items-center border-l border-gray-300 bg-white text-gray-500 transition hover:bg-gray-50"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open &&
        pos &&
        createPortal(
          <>
            <button className="fixed inset-0 z-40 cursor-default" aria-hidden onClick={() => setOpen(false)} />
            <div
              style={{ position: "fixed", top: pos.top, right: pos.right }}
              className="z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-left shadow-xl"
            >
              {items.map((it, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    it.onClick();
                  }}
                  className={`block w-full px-4 py-2 text-left text-sm transition hover:bg-gray-50 ${
                    it.danger ? "text-red-600 hover:bg-red-50" : "text-gray-700"
                  }`}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}

// —— Image upload widget: uploads to /api/uploads and returns the URL ——

export function ImageField({
  value,
  onChange,
  label = "Afbeelding",
  cover = false,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  cover?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function upload(file: File) {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload mislukt");
      onChange(data.url);
      toast("Afbeelding geüpload");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Upload mislukt", "error");
    } finally {
      setBusy(false);
    }
  }

  const fileInput = (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-orange hover:underline">
      {busy ? "Bezig met uploaden…" : "Of upload een bestand"}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </label>
  );

  // Cover layout: thumbnail preview stacked ABOVE the input.
  if (cover) {
    return (
      <Field label={label}>
        <div className="space-y-2">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="aspect-video w-full rounded-lg border border-gray-200 object-cover" />
          ) : (
            <div className="grid aspect-video w-full place-items-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
              Geen cover
            </div>
          )}
          <TextInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="/pad/naar/afbeelding.jpg" />
          {fileInput}
        </div>
      </Field>
    );
  }

  return (
    <Field label={label}>
      <div className="flex items-start gap-3">
        <div className="flex-1 space-y-2">
          <TextInput
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/pad/naar/afbeelding.jpg"
          />
          {fileInput}
        </div>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt=""
            className="h-16 w-16 shrink-0 rounded-lg border border-gray-200 object-cover"
          />
        )}
      </div>
    </Field>
  );
}

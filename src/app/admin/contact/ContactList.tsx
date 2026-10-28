"use client";

import { useState } from "react";
import type { ContactRequest } from "@/lib/types";
import { Button, useToast } from "../ui";

// Newsletter sign-ups post to the same endpoint, tagged with this source.
const NEWSLETTER = "nieuwsbrief";

type Tab = "aanvragen" | "nieuwsbrief";

export function ContactList({ initial }: { initial: ContactRequest[] }) {
  const [items, setItems] = useState<ContactRequest[]>(initial);
  const [tab, setTab] = useState<Tab>("aanvragen");
  const toast = useToast();
  const requests = items.filter((i) => i.postSlug !== NEWSLETTER);
  const signups = items.filter((i) => i.postSlug === NEWSLETTER);
  const unread = requests.filter((i) => !i.isRead).length;
  const newSignups = signups.filter((i) => !i.isRead).length;

  async function copyEmails() {
    const emails = [...new Set(signups.map((i) => i.email))].join(", ");
    try {
      await navigator.clipboard.writeText(emails);
      toast("E-mailadressen gekopieerd");
    } catch {
      toast("Kopiëren mislukt", "error");
    }
  }

  async function toggleRead(item: ContactRequest) {
    const next = item.isRead ? 0 : 1;
    const res = await fetch(`/api/contact/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !!next }),
    });
    if (res.ok) {
      setItems((list) => list.map((x) => (x.id === item.id ? { ...x, isRead: next } : x)));
    } else {
      toast("Bijwerken mislukt", "error");
    }
  }

  async function remove(item: ContactRequest) {
    const label = item.postSlug === NEWSLETTER ? `Inschrijving van ${item.email}` : `Aanvraag van ${item.name}`;
    if (!confirm(`${label} verwijderen?`)) return;
    const res = await fetch(`/api/contact/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Verwijderd");
      setItems((list) => list.filter((x) => x.id !== item.id));
    } else {
      toast("Verwijderen mislukt", "error");
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Sticky header */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight text-forest">Contact aanvragen</h1>
        {tab === "nieuwsbrief" && signups.length > 0 && (
          <Button variant="secondary" onClick={copyEmails}>
            Kopieer alle e-mailadressen
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex shrink-0 gap-1 border-b border-gray-200 px-6">
        {(
          [
            ["aanvragen", "Formulieren", requests.length, unread],
            ["nieuwsbrief", "Nieuwsbrief", signups.length, newSignups],
          ] as const
        ).map(([key, label, total, fresh]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`-mb-px flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition ${
              tab === key ? "border-orange text-forest" : "border-transparent text-forest/50 hover:text-forest"
            }`}
          >
            {label}
            <span className="text-xs font-medium text-forest/40">{total}</span>
            {fresh > 0 && (
              <span className="rounded-full bg-orange/12 px-2 py-0.5 text-xs font-semibold text-orange">{fresh} nieuw</span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable body */}
      <div className="nice-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-6">
        {tab === "nieuwsbrief" ? (
          signups.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center text-sm text-forest/50">
              Nog geen inschrijvingen op de nieuwsbrief.
            </div>
          ) : (
            <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200">
              {signups.map((item) => (
                <div key={item.id} className={`flex items-center justify-between gap-3 px-5 py-3 ${item.isRead ? "" : "bg-orange/5"}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    {!item.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-orange" aria-label="Nieuw" />}
                    <a href={`mailto:${item.email}`} className="truncate text-sm font-medium text-forest hover:text-orange">
                      {item.email}
                    </a>
                    <time className="shrink-0 text-xs text-forest/40">{new Date(item.createdAt).toLocaleString("nl-BE")}</time>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {!item.isRead && (
                      <Button variant="secondary" onClick={() => toggleRead(item)}>
                        Gezien
                      </Button>
                    )}
                    <Button variant="ghost" onClick={() => remove(item)} className="text-red-500 hover:text-red-700">
                      Verwijder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : requests.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center text-sm text-forest/50">
            Nog geen aanvragen via de formulieren.
          </div>
        ) : (
          requests.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition ${
                item.isRead ? "border-gray-200 bg-gray-50" : "border-orange/40 bg-orange/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {!item.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-orange" aria-label="Ongelezen" />}
                    <span className="font-semibold text-forest">{item.name}</span>
                    <a href={`mailto:${item.email}`} className="truncate text-sm text-forest/50 hover:text-orange">
                      {item.email}
                    </a>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-forest/75">{item.message}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-forest/40">
                    <time>{new Date(item.createdAt).toLocaleString("nl-BE")}</time>
                    {item.postSlug && (
                      <>
                        <span>·</span>
                        <span>via {item.postSlug}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" onClick={() => toggleRead(item)}>
                    {item.isRead ? "Markeer ongelezen" : "Markeer gelezen"}
                  </Button>
                  <Button variant="ghost" onClick={() => remove(item)} className="text-red-500 hover:text-red-700">
                    Verwijder
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

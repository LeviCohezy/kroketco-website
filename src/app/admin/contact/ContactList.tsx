"use client";

import { useState } from "react";
import Link from "next/link";
import type { ContactRequest } from "@/lib/types";
import { Button, useToast } from "../ui";

export function ContactList({ initial }: { initial: ContactRequest[] }) {
  const [items, setItems] = useState<ContactRequest[]>(initial);
  const toast = useToast();
  const unread = items.filter((i) => !i.isRead).length;

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
    if (!confirm(`Aanvraag van ${item.name} verwijderen?`)) return;
    const res = await fetch(`/api/contact/${item.id}`, { method: "DELETE" });
    if (res.ok) {
      toast("Aanvraag verwijderd");
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
        {unread > 0 && (
          <span className="rounded-full bg-orange/12 px-3 py-1 text-xs font-semibold text-orange">{unread} ongelezen</span>
        )}
      </div>

      {/* Scrollable body */}
      <div className="nice-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center text-sm text-forest/50">
            Nog geen aanvragen. Zet “Formulier tonen” aan bij een blogpost om er één te ontvangen.
          </div>
        ) : (
          items.map((item) => (
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
                        <Link href={`/nieuws/${item.postSlug}`} className="hover:text-orange">
                          via /nieuws/{item.postSlug}
                        </Link>
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

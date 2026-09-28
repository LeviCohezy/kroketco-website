"use client";

import { useState } from "react";

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

// Newsletter sign-up. Posts the e-mail to the shared /api/contact endpoint,
// tagged as a "nieuwsbrief" request. `compact` renders the slim variant used
// inside the site footer; the default is the full dark-green card.
export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Nieuwsbrief inschrijving",
          email,
          message: "Inschrijving op de nieuwsbrief.",
          postSlug: "nieuwsbrief",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Inschrijven mislukt");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inschrijven mislukt");
      setStatus("error");
    }
  }

  if (compact) {
    return (
      <div>
        <h3 className="text-[15px] font-bold uppercase tracking-[0.14em] text-lime">Nieuwsbrief</h3>
        <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
          Nieuwe smaken, proefmomenten en nieuws — rechtstreeks in je mailbox.
        </p>
        {status === "done" ? (
          <p className="mt-4 text-sm font-semibold text-lime">Bedankt! Je bent ingeschreven.</p>
        ) : (
          <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Je e-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="min-w-0 flex-1 rounded-lg border border-cream/20 bg-white px-4 py-3 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="shrink-0 rounded-lg bg-orange px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-cream transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Bezig…" : "Schrijf in"}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-2 text-sm font-medium text-red-300">{error}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-forest px-6 py-12 text-cream shadow-[0_20px_50px_-24px_rgba(14,75,58,0.7)] sm:px-10 sm:py-14">
      <div className="mx-auto max-w-[720px] text-center">
        <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.14em] text-lime">
          <span className="h-2 w-2 rounded-[2px] bg-lime" />
          Nieuwsbrief
        </span>
        <h2 className="mt-4 text-[clamp(1.8rem,4.5vw,3rem)] uppercase leading-[0.98]" style={OSWALD}>
          Mis geen kruimel
        </h2>
        <p className="mx-auto mt-4 max-w-md text-cream/80">
          Nieuwe smaken, proefmomenten en nieuws van Kroketco — rechtstreeks in je mailbox.
        </p>

        {status === "done" ? (
          <p className="mx-auto mt-8 max-w-md text-lg font-semibold text-lime">
            Bedankt! Je bent ingeschreven op onze nieuwsbrief.
          </p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Je e-mailadres"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="min-w-0 flex-1 rounded-lg border border-cream/20 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="shrink-0 rounded-lg bg-orange px-7 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "sending" ? "Bezig…" : "Schrijf me in"}
            </button>
          </form>
        )}
        {status === "error" && <p className="mt-3 text-sm font-medium text-red-300">{error}</p>}
      </div>
    </div>
  );
}

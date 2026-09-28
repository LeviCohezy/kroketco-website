"use client";

import { useState } from "react";

// Contact form rendered at the end of a blog post when the post has
// "Formulier tonen" enabled. Posts to the public /api/contact endpoint.
export function PostContactForm({ slug }: { slug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
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
        body: JSON.stringify({ name, email, message, postSlug: slug }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Versturen mislukt");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Versturen mislukt");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-forest outline-none transition placeholder:text-forest/35 focus:border-orange focus:ring-2 focus:ring-orange/25";

  if (status === "done") {
    return (
      <div className="mt-14 rounded-[24px] bg-light-blue p-8 text-center sm:p-10">
        <p className="text-lg font-bold text-forest" style={{ fontFamily: "var(--font-oswald), sans-serif" }}>
          Bedankt voor je bericht!
        </p>
        <p className="mt-2 text-sm text-forest/70">We nemen zo snel mogelijk contact met je op.</p>
      </div>
    );
  }

  return (
    <div className="mt-14 rounded-[24px] bg-light-blue p-6 sm:p-10">
      <h2
        className="text-[clamp(1.5rem,3vw,2.2rem)] uppercase leading-[1.02] text-forest"
        style={{ fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 }}
      >
        Stuur ons een bericht
      </h2>
      <p className="mt-2 max-w-lg text-sm text-forest/70">
        Vragen of interesse? Laat je gegevens achter en we reageren snel.
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-forest">Naam</span>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-forest">E-mail</span>
            <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-forest">Bericht</span>
          <textarea
            className={inputClass}
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>
        {status === "error" && <p className="text-sm font-medium text-red-600">{error}</p>}
        <div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 rounded-full bg-orange px-8 py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Bezig…" : "Versturen"}
          </button>
        </div>
      </form>
    </div>
  );
}

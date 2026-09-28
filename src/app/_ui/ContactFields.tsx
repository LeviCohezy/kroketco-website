"use client";

import { useState } from "react";

// The actual contact form fields + submit logic, posting to the public
// /api/contact endpoint. Kept separate from any surrounding card/heading so it
// can be dropped into different section designs (see ContactForm for the
// standard light-blue card wrapper, and the home/producten sections).

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05em] w-[1.05em]">
      <path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const field =
  "w-full rounded-lg border border-forest/15 bg-white px-5 py-4 text-forest placeholder:text-forest/40 focus:border-orange focus:outline-none focus:ring-2 focus:ring-orange/40";

export default function ContactFields({
  source = "",
  center = false,
}: {
  source?: string;
  center?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const composed = subject.trim() ? `Onderwerp: ${subject.trim()}\n\n${message}` : message;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: composed, postSlug: source }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Versturen mislukt");
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Versturen mislukt");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className={`rounded-2xl bg-white/70 p-8 ${center ? "text-center" : ""}`}>
        <p className="text-lg font-bold text-forest" style={OSWALD}>
          Bedankt voor je bericht!
        </p>
        <p className="mt-2 text-sm text-forest/70">We nemen zo snel mogelijk contact met je op.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={field} placeholder="Naam" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          type="email"
          className={field}
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <input className={field} placeholder="Onderwerp" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <textarea
        className={`resize-y ${field}`}
        rows={5}
        placeholder="Je bericht"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      {status === "error" && <p className="text-sm font-medium text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className={`inline-flex w-fit items-center gap-2 rounded-lg bg-orange px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-cream transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60 ${
          center ? "mx-auto" : ""
        }`}
      >
        {status === "sending" ? "Bezig…" : (<>Verstuur <ArrowRight /></>)}
      </button>
    </form>
  );
}

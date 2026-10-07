"use client";

import Link from "next/link";
import { useState } from "react";

const input =
  "w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-forest outline-none transition placeholder:text-forest/35 focus:border-orange focus:ring-2 focus:ring-orange/25";

export default function ResetForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== repeat) return setError("De wachtwoorden zijn niet hetzelfde");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Opslaan mislukt");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <>
        <p className="rounded-lg bg-lime/40 px-4 py-3 text-sm text-forest">
          Je nieuwe wachtwoord is ingesteld. Iedereen die nog ingelogd was, is uitgelogd.
        </p>
        <Link
          href="/login-admin"
          className="mt-5 block w-full rounded-lg bg-orange px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.06em] text-cream"
        >
          Inloggen
        </Link>
      </>
    );
  }

  return (
    <form onSubmit={submit}>
      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-medium text-forest/80">Nieuw wachtwoord</span>
        <input type="password" autoComplete="new-password" minLength={8} required autoFocus value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minstens 8 tekens" className={input} />
      </label>
      <label className="mb-4 block">
        <span className="mb-1.5 block text-sm font-medium text-forest/80">Herhaal wachtwoord</span>
        <input type="password" autoComplete="new-password" minLength={8} required value={repeat} onChange={(e) => setRepeat(e.target.value)} placeholder="Nog een keer" className={input} />
      </label>
      {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-lg bg-orange px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-cream transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? "Bezig…" : "Wachtwoord opslaan"}
      </button>
    </form>
  );
}

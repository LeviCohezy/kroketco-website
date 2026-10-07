"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Standalone admin login. On success you land back on the live site, where the
// floating "Bewerken" button lets you edit pages in place. (The old /admin
// dashboard still manages products/blog/partners/contact.)
export default function LoginAdminPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Inloggen mislukt");
      }
      // Only follow same-site paths (no "//evil.com" or absolute URLs).
      const raw = params.get("next") || "/";
      const next = raw.startsWith("/") && !raw.startsWith("//") && !raw.startsWith("/\\") ? raw : "/";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inloggen mislukt");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--light-blue)] px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(14,75,58,0.4)]">
        <div className="mb-6 text-center">
          <div className="text-xl font-bold tracking-tight text-orange">Kroketco</div>
          <p className="mt-1 text-sm text-forest/60">Log in om de website live te bewerken</p>
        </div>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-forest/80">Wachtwoord</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-forest/15 bg-white px-4 py-3 text-forest outline-none transition placeholder:text-forest/35 focus:border-orange focus:ring-2 focus:ring-orange/25"
          />
        </label>
        {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-orange px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-cream transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Bezig…" : "Inloggen"}
        </button>
        <Link href="/login-admin/vergeten" className="mt-4 block text-center text-sm font-medium text-forest/60 hover:text-orange">
          Wachtwoord vergeten?
        </Link>
      </form>
    </div>
  );
}

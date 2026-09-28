"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, TextInput } from "../ui";

export default function LoginPage() {
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
      const next = params.get("next") || "/admin";
      router.push(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Inloggen mislukt");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <div className="mb-6 text-center">
          <div className="text-xl font-bold tracking-tight text-orange">Kroketco CMS</div>
          <p className="mt-1 text-sm text-gray-500">Log in om het beheer te openen</p>
        </div>
        <label className="mb-4 block">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Wachtwoord</span>
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            placeholder="••••••••"
          />
        </label>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Bezig…" : "Inloggen"}
        </Button>
      </form>
    </div>
  );
}

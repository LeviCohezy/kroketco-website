"use client";

import Link from "next/link";
import { useState } from "react";

// "Wachtwoord vergeten?" — one click sends a 15-minute reset link to the shop's
// own mailbox (info@kroketco.be). No e-mail field: there is only one admin.
export default function ForgotPasswordPage() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  async function send() {
    setState("sending");
    await fetch("/api/auth/reset/request", { method: "POST" }).catch(() => {});
    setState("sent");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--light-blue)] px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-[0_20px_50px_-20px_rgba(14,75,58,0.4)]">
        <div className="mb-6 text-center">
          <div className="text-xl font-bold tracking-tight text-orange">Kroketco</div>
          <p className="mt-1 text-sm text-forest/60">Wachtwoord vergeten</p>
        </div>
        {state === "sent" ? (
          <p className="rounded-lg bg-lime/40 px-4 py-3 text-sm text-forest">
            Er is een e-mail met een resetlink verstuurd naar <strong>info@kroketco.be</strong>. De link is 15 minuten
            geldig. Niets ontvangen? Kijk in je spam of probeer het over een minuut opnieuw.
          </p>
        ) : (
          <>
            <p className="mb-6 text-sm text-forest/75">
              We sturen een link naar <strong>info@kroketco.be</strong> waarmee je een nieuw wachtwoord kiest.
            </p>
            <button
              type="button"
              onClick={send}
              disabled={state === "sending"}
              className="w-full rounded-lg bg-orange px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-cream transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "sending" ? "Bezig…" : "Stuur resetlink"}
            </button>
          </>
        )}
        <Link href="/login-admin" className="mt-5 block text-center text-sm font-medium text-forest/60 hover:text-orange">
          ← Terug naar inloggen
        </Link>
      </div>
    </div>
  );
}

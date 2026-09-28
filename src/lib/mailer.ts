import nodemailer from "nodemailer";
import type { ContactRequest } from "./types";

// ---------------------------------------------------------------------------
// Contact-form email notifications.
//
// Submissions are always saved to the DB (the CRM). On top of that, if SMTP is
// configured via env vars, we also email a notification to CONTACT_TO
// (e.g. info@kroketco.be). Email is best-effort: a failure here must never make
// the public contact endpoint fail — the request is already persisted.
//
// Required env vars to enable email:
//   SMTP_HOST   e.g. smtp.hostinger.com
//   SMTP_PORT   e.g. 465 (SSL) or 587 (STARTTLS)
//   SMTP_USER   the mailbox login, e.g. info@kroketco.be
//   SMTP_PASS   the mailbox password
// Optional:
//   SMTP_FROM   From address (defaults to SMTP_USER)
//   CONTACT_TO  recipient (defaults to SMTP_USER)
// ---------------------------------------------------------------------------

function smtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT) || 465;
  return {
    host,
    port,
    secure: port === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth: { user, pass },
    from: process.env.SMTP_FROM || user,
    to: process.env.CONTACT_TO || user,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Send a notification email for a new contact request. Resolves to true when an
// email was sent, false when SMTP isn't configured, and never throws.
export async function sendContactNotification(req: ContactRequest): Promise<boolean> {
  const cfg = smtpConfig();
  if (!cfg) {
    console.warn("[mailer] SMTP not configured — contact saved to CRM but no email sent.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
    });

    const source = req.postSlug ? ` (via: ${req.postSlug})` : "";
    const lines = [
      `Naam: ${req.name}`,
      `E-mail: ${req.email}`,
      req.postSlug ? `Bron: ${req.postSlug}` : "",
      "",
      req.message,
    ].filter(Boolean);

    await transporter.sendMail({
      from: cfg.from,
      to: cfg.to,
      replyTo: req.email,
      subject: `Nieuw contactformulier${source} — ${req.name}`,
      text: lines.join("\n"),
      html: `
        <h2 style="margin:0 0 12px">Nieuw contactformulier</h2>
        <p><strong>Naam:</strong> ${escapeHtml(req.name)}<br/>
        <strong>E-mail:</strong> <a href="mailto:${escapeHtml(req.email)}">${escapeHtml(req.email)}</a>
        ${req.postSlug ? `<br/><strong>Bron:</strong> ${escapeHtml(req.postSlug)}` : ""}</p>
        <p style="white-space:pre-wrap">${escapeHtml(req.message)}</p>
      `,
    });
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send contact notification:", err);
    return false;
  }
}

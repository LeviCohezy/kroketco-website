import ContactForm from "./ContactForm";

// "Werk met ons" section — a thin wrapper around the shared ContactForm with
// partner-specific copy. Used on the Groendal page (and any partner page).
export default function WorkWithUsForm({ partner }: { partner?: string }) {
  return (
    <ContactForm
      source={partner ? `samenwerking-${partner.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` : "samenwerking"}
      eyebrow="Samenwerken?"
      heading="Werk met ons"
      text={`Interesse in een samenwerking${partner ? ` met Kroketco via ${partner}` : ""}? Laat je gegevens achter en we nemen zo snel mogelijk contact op.`}
    />
  );
}

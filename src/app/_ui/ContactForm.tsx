import ContactFields from "./ContactFields";
import { EditableText } from "./edit/Editable";
import type { SectionId } from "@/lib/content/registry";

// Standard contact form section: a light-blue card with an eyebrow, heading and
// intro line, wrapping the shared ContactFields. The heading copy is inline-
// editable, bound to the page's contact section (falls back to global.contact).

const OSWALD = { fontFamily: "var(--font-oswald), sans-serif", fontWeight: 600 } as const;

export default function ContactForm({
  source = "",
  section = "global.contact",
}: {
  source?: string;
  section?: SectionId;
}) {
  return (
    <section id="contact" className="px-6 pb-16 sm:px-12 sm:pb-24 lg:px-16">
      <div className="mx-auto max-w-[820px]">
        <div className="rounded-[24px] bg-[var(--light-blue)] px-6 py-12 text-forest shadow-[0_12px_34px_rgba(0,0,0,0.08)] sm:px-10 sm:py-14">
          <span className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-forest/70">
            <span className="h-2 w-2 rounded-[2px] bg-orange" />
            <EditableText as="span" section={section} field="eyebrow" />
          </span>
          <EditableText
            as="h2"
            section={section}
            field="title"
            className="mt-4 block text-[clamp(1.8rem,4.5vw,3.2rem)] uppercase leading-[0.95] tracking-[0.01em]"
            style={OSWALD}
          />
          <EditableText as="p" section={section} field="text" className="mt-4 block max-w-xl text-forest/75" />
          <div className="mt-8">
            <ContactFields source={source} />
          </div>
        </div>
      </div>
    </section>
  );
}

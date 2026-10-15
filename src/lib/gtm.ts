// Google Tag Manager data layer helpers.
//
// Every form on the site pushes its own, uniquely named event when a submit
// succeeds, so GTM/GA4 can tell them apart:
//
//   nieuwsbrief               – newsletter sign-up (footer + /nieuws)
//   contactformulier          – generic contact form (home, producten, product pages, news posts)
//   contactformulier_groendal – contact form on /groendaal
//   contact_partneraanvraag   – partner request (/partners + partner detail pages)
//
// Each push also carries `form_name` (same as the event) and `form_source`
// (which page/variant the form was on) so triggers can filter further.

export type FormEventName =
  | "nieuwsbrief"
  | "contactformulier"
  | "contactformulier_groendal"
  | "contact_partneraanvraag";

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

export function pushDataLayer(entry: DataLayerEntry) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(entry);
}

export function trackFormSubmit(event: FormEventName, source: string) {
  pushDataLayer({ event, form_name: event, form_source: source || "onbekend" });
}

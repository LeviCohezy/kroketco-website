import { defineSections } from "../schema";

// Site-wide content: menu, footer, newsletter, contact form, SEO.

const NAV_LINKS = [
  { label: "Producten", href: "/producten" },
  { label: "Partners", href: "/partners" },
  { label: "Groendal", href: "/groendaal" },
  { label: "Over ons", href: "/over-ons" },
  { label: "Nieuws", href: "/nieuws" },
];

const linkFields = [
  { key: "label", type: "text", label: "Tekst", help: "Wat de bezoeker ziet", default: "" },
  { key: "href", type: "url", label: "Link", help: "Bv. /producten of https://…", default: "" },
] as const;

export const globalSections = defineSections({
  "global.seo": {
    page: "algemeen",
    label: "Zoekmachines & tabblad",
    help: "Titel en beschrijving die Google en het browsertabblad tonen.",
    fields: [
      { key: "title", type: "text", label: "Paginatitel", help: "Tekst in het browsertabblad en in Google", default: "Kroketco — Elke hap een feest" },
      {
        key: "description",
        type: "textarea",
        label: "Beschrijving",
        help: "Korte omschrijving onder de titel in Google (±150 tekens)",
        default: "Ambachtelijke Belgische kroketten. Vers gedraaid, goudbruin gebakken. Schuif aan en proef het verschil.",
      },
    ],
  },
  "global.nav": {
    page: "algemeen",
    label: "Menu (bovenaan)",
    help: "Het zwevende menu bovenaan elke pagina. De eerste helft van de links staat links van het logo, de rest rechts.",
    fields: [
      { key: "logo", type: "image", label: "Logo", help: "Rond logo in het midden van het menu", default: "/hero/logo-kroketco.png" },
      { key: "links", type: "list", label: "Menulinks", itemLabel: "Link", fields: linkFields, default: NAV_LINKS },
      { key: "ctaLabel", type: "text", label: "Knop in mobiel menu", help: "Oranje knop onderaan het menu op gsm/tablet", default: "Contacteer ons" },
      { key: "ctaHref", type: "url", label: "Link van die knop", default: "/#contact" },
    ],
  },
  "global.footer": {
    page: "algemeen",
    label: "Footer (onderaan)",
    help: "Het groene blok onderaan elke pagina.",
    fields: [
      { key: "logo", type: "image", label: "Logo", default: "/hero/logo-kroketco.png" },
      {
        key: "blurb",
        type: "textarea",
        label: "Korte tekst onder het logo",
        default:
          "Ambachtelijke Belgische kroketten. Vers gedraaid, met de hand gepaneerd en goudbruin gebakken — voor thuis, de betere traiteur en de horeca.",
      },
      { key: "instagram", type: "url", label: "Instagram-link", help: "Leeg laten = icoon verbergen", default: "https://instagram.com" },
      { key: "facebook", type: "url", label: "Facebook-link", help: "Leeg laten = icoon verbergen", default: "https://facebook.com" },
      { key: "linkedin", type: "url", label: "LinkedIn-link", help: "Leeg laten = icoon verbergen", default: "https://linkedin.com" },
      { key: "linksTitle", type: "text", label: "Titel linkkolom", default: "Ontdek" },
      { key: "links", type: "list", label: "Links", itemLabel: "Link", fields: linkFields, default: NAV_LINKS },
      { key: "contactTitle", type: "text", label: "Titel contactkolom", default: "Contact" },
      { key: "address", type: "text", label: "Adres / locatie", default: "Regina Wautersweg 2, 8800 Roeselare" },
      { key: "email", type: "text", label: "E-mailadres", default: "info@kroketco.be" },
      { key: "vat", type: "text", label: "Ondernemingsnummer", default: "BE 0755.892.195" },
      { key: "contactLabel", type: "text", label: "Contactlink tekst", default: "Neem contact op" },
      { key: "contactHref", type: "url", label: "Contactlink", default: "/#contact" },
      { key: "copyright", type: "text", label: "Copyright-regel", default: "© 2026 Kroketco Belgium" },
      {
        key: "legal",
        type: "list",
        label: "Juridische links",
        itemLabel: "Link",
        fields: linkFields,
        default: [
          { label: "Privacybeleid", href: "#" },
          { label: "Cookiebeleid", href: "#" },
          { label: "Algemene voorwaarden", href: "#" },
        ],
      },
    ],
  },
  "global.newsletter": {
    page: "algemeen",
    label: "Nieuwsbrief",
    help: "Inschrijfblok in de footer en de grote groene kaart op de nieuwspagina.",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Nieuwsbrief" },
      { key: "title", type: "text", label: "Titel (grote kaart)", default: "Mis geen kruimel" },
      { key: "text", type: "textarea", label: "Tekst (grote kaart)", default: "Nieuwe smaken, proefmomenten en nieuws van Kroketco — rechtstreeks in je mailbox." },
      { key: "footerText", type: "textarea", label: "Tekst (footer)", default: "Nieuwe smaken, proefmomenten en nieuws — rechtstreeks in je mailbox." },
      { key: "placeholder", type: "text", label: "Tekst in het e-mailveld", default: "Je e-mailadres" },
      { key: "button", type: "text", label: "Knop (grote kaart)", default: "Schrijf me in" },
      { key: "footerButton", type: "text", label: "Knop (footer)", default: "Schrijf in" },
      { key: "thanks", type: "text", label: "Bedankt-bericht (grote kaart)", default: "Bedankt! Je bent ingeschreven op onze nieuwsbrief." },
      { key: "footerThanks", type: "text", label: "Bedankt-bericht (footer)", default: "Bedankt! Je bent ingeschreven." },
    ],
  },
  "global.contact": {
    page: "algemeen",
    label: "Contactformulier",
    help: "Het formulier dat onderaan verschillende pagina's staat. Titels per pagina pas je aan bij die pagina.",
    fields: [
      { key: "eyebrow", type: "text", label: "Standaard klein label", default: "Contacteer ons" },
      { key: "title", type: "text", label: "Standaard titel", default: "Stuur ons een bericht" },
      {
        key: "text",
        type: "textarea",
        label: "Standaard tekst",
        default: "Vragen, interesse of zin in een samenwerking? Laat je gegevens achter en we reageren snel.",
      },
      { key: "name", type: "text", label: "Veld: naam", default: "Naam" },
      { key: "email", type: "text", label: "Veld: e-mail", default: "E-mail" },
      { key: "subject", type: "text", label: "Veld: onderwerp", default: "Onderwerp" },
      { key: "message", type: "text", label: "Veld: bericht", default: "Je bericht" },
      { key: "button", type: "text", label: "Verstuurknop", default: "Verstuur" },
      { key: "thanksTitle", type: "text", label: "Bedankt-titel", default: "Bedankt voor je bericht!" },
      { key: "thanksText", type: "text", label: "Bedankt-tekst", default: "We nemen zo snel mogelijk contact met je op." },
    ],
  },
});

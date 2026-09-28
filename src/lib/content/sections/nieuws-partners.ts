import { defineSections } from "../schema";

// Nieuws (/nieuws + /nieuws/[slug]) and Partners (/partners + /partners/[slug]),
// in page order. The posts and partners themselves (titles, teksten, foto's,
// logo's…) are managed in the blog/partner CMS; these sections hold the fixed
// copy around them.

// Copy of the small contact form at the end of a nieuwsbericht / partnerpagina.
// Both pages get their own section with the same fields.
const postFormFields = (where: string) =>
  [
    { key: "title", type: "text", label: "Titel", help: `Titel boven het formulier onderaan ${where}`, default: "Stuur ons een bericht" },
    { key: "text", type: "textarea", label: "Tekst", help: "Korte zin onder de titel", default: "Vragen of interesse? Laat je gegevens achter en we reageren snel." },
    { key: "name", type: "text", label: "Veld: naam", default: "Naam" },
    { key: "email", type: "text", label: "Veld: e-mail", default: "E-mail" },
    { key: "message", type: "text", label: "Veld: bericht", default: "Bericht" },
    { key: "button", type: "text", label: "Verstuurknop", default: "Versturen" },
    { key: "sending", type: "text", label: "Knop tijdens versturen", help: "Tekst op de knop terwijl het bericht verstuurd wordt", default: "Bezig…" },
    { key: "error", type: "text", label: "Foutmelding", help: "Getoond als het versturen niet lukt", default: "Versturen mislukt" },
    { key: "thanksTitle", type: "text", label: "Bedankt-titel", help: "Verschijnt na het versturen", default: "Bedankt voor je bericht!" },
    { key: "thanksText", type: "text", label: "Bedankt-tekst", default: "We nemen zo snel mogelijk contact met je op." },
  ] as const;

export const nieuwsPartnersSections = defineSections({
  // —— Nieuws ——
  "nieuws.seo": {
    page: "nieuws",
    label: "Zoekmachines & tabblad",
    help: "Titel en beschrijving van de nieuwsoverzichtspagina in Google en het browsertabblad.",
    fields: [
      { key: "title", type: "text", label: "Paginatitel", help: "Tekst in het browsertabblad en in Google", default: "Nieuws · Kroketco Belgium" },
      {
        key: "description",
        type: "textarea",
        label: "Beschrijving",
        help: "Korte omschrijving onder de titel in Google (±150 tekens)",
        default: "Het laatste nieuws van Kroketco: nieuwe smaken, events, partners en meer.",
      },
    ],
  },
  "nieuws.hero": {
    page: "nieuws",
    label: "Bovenaan (titel)",
    help: "Het lichtblauwe blok bovenaan de nieuwspagina, met de kok links en de vork rechts (alleen op grote schermen).",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", help: "Klein woord boven de titel, naast het oranje blokje", default: "Nieuws" },
      { key: "title", type: "text", label: "Titel", default: "Het laatste van Kroketco" },
      { key: "text", type: "textarea", label: "Tekst onder de titel", default: "Nieuwe smaken, events en verhalen van achter de schermen — ontdek wat er speelt." },
      { key: "imageLeft", type: "image", label: "Afbeelding links", help: "Decoratieve figuur linksonder (wordt gespiegeld getoond)", default: "/kroketten/chef.png" },
      { key: "imageRight", type: "image", label: "Afbeelding rechts", help: "Decoratieve figuur die schuin van rechts binnenkomt", default: "/kroketten/deco-vork.png" },
    ],
  },
  "nieuws.list": {
    page: "nieuws",
    label: "Berichtenoverzicht",
    help: "De kaarten met nieuwsberichten. De berichten zelf beheer je bij Blog.",
    fields: [
      { key: "readMore", type: "text", label: "Link op elke kaart", help: "Oranje tekst onderaan elke nieuwskaart", default: "Lees meer" },
      { key: "emptyTitle", type: "text", label: "Titel als er nog geen nieuws is", help: "Getoond wanneer er geen gepubliceerde berichten zijn", default: "Nog geen nieuws" },
      { key: "emptyText", type: "textarea", label: "Tekst als er nog geen nieuws is", default: "Kom binnenkort terug voor het laatste van Kroketco." },
    ],
  },
  "nieuws.detail": {
    page: "nieuws",
    label: "Nieuwsbericht — vaste teksten",
    help: "Geldt voor alle nieuwsberichten: de links boven en onder elk bericht.",
    fields: [
      { key: "backLabel", type: "text", label: "Terug-link bovenaan", help: "Kleine link boven de titel van het bericht", default: "← Terug naar nieuws" },
      { key: "moreLabel", type: "text", label: "Knop onderaan", help: "Groene knop onder het bericht", default: "← Meer nieuws" },
      { key: "backHref", type: "url", label: "Link van beide", help: "Waar de terug-link en de knop naartoe gaan", default: "/nieuws" },
    ],
  },
  "nieuws.postForm": {
    page: "nieuws",
    label: "Nieuwsbericht — contactformulier",
    help: "Geldt voor alle nieuwsberichten waarbij 'Formulier tonen' aan staat.",
    fields: postFormFields("een nieuwsbericht"),
  },

  // —— Partners ——
  "partners.hero": {
    page: "partners",
    label: "Bovenaan (titel + video)",
    help: "Het eerste blok van de partnerpagina: titel, intro, de brede video en de bewegende band met woorden.",
    fields: [
      { key: "titleLine1", type: "text", label: "Titel — regel 1", default: "Sterk dankzij" },
      { key: "titleLine2", type: "text", label: "Titel — regel 2", default: "onze partners" },
      {
        key: "text",
        type: "textarea",
        label: "Intro-tekst",
        help: "Tekst rechts naast de titel",
        default:
          "Kroketco werkt samen met zorgvuldig gekozen versgroothandels in heel Vlaanderen — samen brengen we onze ambachtelijke kroketten en verse puree tot bij de betere traiteur en de horeca.",
      },
      { key: "video", type: "video", label: "Video", help: "Brede video onder de titel; speelt automatisch en zonder geluid af, in een lus", default: "/video/partners.mp4" },
      { key: "poster", type: "image", label: "Voorbeeldbeeld video", help: "Getoond zolang de video nog laadt", default: "/ugc/ugc-3.png" },
      { key: "sticker", type: "image", label: "Sticker op de video", help: "Schuin label rechtsboven op de video. Leeg laten = verbergen", default: "/new-image-section/label-ambachtelijk.png" },
      { key: "stickerAlt", type: "text", label: "Omschrijving sticker", help: "Voor schermlezers en Google", default: "Ambachtelijk" },
      {
        key: "marquee",
        type: "list",
        label: "Woorden in de bewegende band",
        help: "De woorden die over de golvende band onderaan de video lopen",
        itemLabel: "Woord",
        fields: [{ key: "text", type: "text", label: "Woord", default: "" }],
        default: [
          { text: "Sterk samen" },
          { text: "Lokaal" },
          { text: "Dagvers" },
          { text: "Betrouwbaar" },
          { text: "Ambachtelijk" },
          { text: "Puur Belgisch" },
        ],
      },
    ],
  },
  "partners.list": {
    page: "partners",
    label: "Partneroverzicht",
    help: "De kaarten met partners. De partners zelf beheer je bij Partners.",
    fields: [
      { key: "moreInfo", type: "text", label: "Knop op elke kaart", help: "Groene knop onderaan elke partnerkaart", default: "Meer info" },
      { key: "empty", type: "textarea", label: "Tekst als er nog geen partners zijn", default: "Binnenkort meer over onze partners." },
    ],
  },
  "partners.contact": {
    page: "partners",
    label: "Contactformulier",
    help: "Het contactblok onderaan de partneroverzichtspagina. Velden en knoppen pas je aan bij Algemeen → Contactformulier.",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Samenwerken?" },
      { key: "title", type: "text", label: "Titel", default: "Word partner van Kroketco" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default: "Groothandel, traiteur of horeca? Laat je gegevens achter en we bekijken samen wat we voor je kunnen betekenen.",
      },
    ],
  },
  "partners.detail": {
    page: "partners",
    label: "Partnerpagina — vaste teksten",
    help: "Geldt voor alle partnerpagina's (de pagina die opent via 'Meer info').",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label boven de beschrijving", default: "Wie zijn ze?" },
      { key: "backLabel", type: "text", label: "Terug-link", help: "Link onder de tekst van de partner", default: "← Terug naar partners" },
      { key: "backHref", type: "url", label: "Link van de terug-link", default: "/partners" },
    ],
  },
  "partners.postForm": {
    page: "partners",
    label: "Partnerpagina — contactformulier",
    help: "Geldt voor alle partnerpagina's waarbij het formulier aan staat.",
    fields: postFormFields("een partnerpagina"),
  },
});

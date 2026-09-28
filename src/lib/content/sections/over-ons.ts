import { defineSections } from "../schema";

// "Over ons" page (/over-ons), in page order. The history timeline has its own
// section (declared elsewhere).

export const overOnsSections = defineSections({
  "over-ons.seo": {
    page: "over-ons",
    label: "Zoekmachines & tabblad",
    help: "Titel en beschrijving van de Over ons-pagina in Google en het browsertabblad.",
    fields: [
      { key: "title", type: "text", label: "Paginatitel", help: "Tekst in het browsertabblad en in Google", default: "Over ons · Kroketco Belgium" },
      {
        key: "description",
        type: "textarea",
        label: "Beschrijving",
        help: "Korte omschrijving onder de titel in Google (±150 tekens)",
        default:
          "Ambacht zoals het hoort. Ontdek het verhaal, de waarden en het team achter de ambachtelijke Belgische kroketten van Kroketco.",
      },
    ],
  },
  "over-ons.hero": {
    page: "over-ons",
    label: "Bovenaan (video + titel)",
    help: "Het eerste blok van de pagina: de video met de grote titel en de oranje knop.",
    fields: [
      { key: "video", type: "video", label: "Achtergrondvideo", help: "Speelt automatisch en zonder geluid af, in een lus", default: "/video/atelier.mp4" },
      { key: "breadcrumbHome", type: "text", label: "Kruimelpad — eerste link", help: "Kleine link boven de titel die naar de homepage gaat", default: "Home" },
      { key: "breadcrumbCurrent", type: "text", label: "Kruimelpad — huidige pagina", help: "Naam van deze pagina naast die link", default: "Over ons" },
      {
        key: "title",
        type: "textarea",
        label: "Titel",
        help: "Grote titel. Een nieuwe regel geeft een regeleinde op computer; op gsm loopt de titel gewoon door.",
        default: "Vers & ambachtelijk\nlekker sinds 1996",
      },
      { key: "ctaLabel", type: "text", label: "Knoptekst", default: "Neem contact op" },
      { key: "ctaHref", type: "url", label: "Link van de knop", default: "/#contact" },
    ],
  },
  "over-ons.atelier": {
    page: "over-ons",
    label: "Ons atelier",
    help: "Wit blok onder de video: foto links, verhaal rechts.",
    fields: [
      { key: "image", type: "image", label: "Foto", default: "/about/atelier.png" },
      { key: "imageAlt", type: "text", label: "Omschrijving foto", help: "Voor blinden en Google; niet zichtbaar", default: "Het Kroketco atelier — kroketten met de hand gedraaid" },
      { key: "eyebrow", type: "text", label: "Label (groen balkje)", default: "Ons atelier" },
      { key: "title", type: "text", label: "Titel", default: "Een familiebedrijf met een hart voor ambacht" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        help: "Laat een lege regel tussen twee alinea's",
        default:
          "In ons atelier in Roeselare draaien we elke dag verse kroketten — met de hand gepaneerd en goudbruin gebakken, zoals het hoort.\n\nKlein begonnen in een schuurtje, vandaag een moderne voedingsproducent. Maar de zorg voor kwaliteit en het echte ambacht bleven altijd hetzelfde.",
      },
      { key: "ctaLabel", type: "text", label: "Knoptekst", default: "Neem contact op" },
      { key: "ctaHref", type: "url", label: "Link van de knop", default: "/#contact" },
    ],
  },
  "over-ons.stats": {
    page: "over-ons",
    label: "Cijfers",
    help: "De groene kaartjes met cijfers, net boven de tijdlijn.",
    fields: [
      {
        key: "items",
        type: "list",
        label: "Cijfers",
        itemLabel: "Cijfer",
        fields: [
          { key: "value", type: "text", label: "Cijfer", help: "Groot, in lichtgroen (bv. 25+)", default: "" },
          { key: "label", type: "text", label: "Omschrijving", help: "Klein eronder", default: "" },
        ],
        default: [
          { value: "25+", label: "jaar vakmanschap" },
          { value: "100%", label: "Belgisch ambacht" },
          { value: "Vers", label: "gedraaid, elke dag" },
          { value: "3", label: "kanalen: thuis · traiteur · horeca" },
        ],
      },
    ],
  },
  "over-ons.wordband": {
    page: "over-ons",
    label: "Oranje woordenband",
    help: "De oranje strook met woorden onder de tijdlijn.",
    fields: [
      {
        key: "words",
        type: "list",
        label: "Woorden",
        itemLabel: "Woord",
        fields: [{ key: "word", type: "text", label: "Woord", default: "" }],
        default: [
          { word: "Ambachtelijk" },
          { word: "Vers gedraaid" },
          { word: "Belgisch" },
          { word: "Sinds 1996" },
          { word: "Met de hand" },
          { word: "Goudbruin" },
        ],
      },
    ],
  },
  "over-ons.missie": {
    page: "over-ons",
    label: "Onze missie",
    help: "Lichtblauw blok: foto links, missie rechts.",
    fields: [
      { key: "image", type: "image", label: "Foto", default: "/ugc/ugc-5.png" },
      { key: "imageAlt", type: "text", label: "Omschrijving foto", help: "Voor blinden en Google; niet zichtbaar", default: "Samen genieten van kroketten" },
      { key: "eyebrow", type: "text", label: "Klein label (oranje)", default: "Onze missie" },
      { key: "title", type: "text", label: "Titel", default: "De Belgische kroket in ere houden" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        help: "Laat een lege regel tussen twee alinea's",
        default:
          "Wat ooit begon in een kleine keuken in Gent groeide uit tot een echt ambacht. Onze missie is simpel: de allerlekkerste ambachtelijke kroket maken en die dagelijks vers op tafel brengen — bij jou thuis, bij de traiteur en in de beste horecazaken.\n\nGeen half werk, geen kunstmatige smaakjes. Enkel eerlijke ingrediënten, met de hand gedraaid en goudbruin gebakken. Zo blijft de Belgische kroket wat ze altijd hoort te zijn: een klein stukje geluk.",
      },
    ],
  },
  "over-ons.cta": {
    page: "over-ons",
    label: "Afsluiter",
    help: "Donkergroen blok onderaan, net boven de footer.",
    fields: [
      { key: "title", type: "text", label: "Titel", default: "Proef het vakmanschap zelf" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default:
          "Vers gedraaid, goudbruin gebakken. Ontdek het volledige assortiment en breng de smaak van echt Belgisch ambacht naar je tafel.",
      },
      { key: "ctaLabel", type: "text", label: "Knoptekst", default: "Bekijk het assortiment" },
      { key: "ctaHref", type: "url", label: "Link van de knop", default: "/producten" },
    ],
  },
});

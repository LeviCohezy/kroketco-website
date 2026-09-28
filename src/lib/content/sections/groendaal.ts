import { defineSections } from "../schema";

// Groendal page (/groendaal): the cheese partner behind the kaaskroketten.
// Sections are listed in the order they appear on the page.

export const groendaalSections = defineSections({
  "groendaal.seo": {
    page: "groendaal",
    label: "Zoekmachines & tabblad",
    help: "Titel en beschrijving van de Groendal-pagina in Google en in het browsertabblad.",
    fields: [
      {
        key: "title",
        type: "text",
        label: "Paginatitel",
        help: "Tekst in het browsertabblad en in Google",
        default: "Groendal · Onze kaaspartner — Kroketco Belgium",
      },
      {
        key: "description",
        type: "textarea",
        label: "Beschrijving",
        help: "Korte omschrijving onder de titel in Google (±150 tekens)",
        default:
          "Onze culinaire kaaskroketten danken hun smaak aan Groendal — authentieke Belgische kaas uit Roeselare. Ontdek het verhaal achter de samenwerking.",
      },
    ],
  },
  "groendaal.hero": {
    page: "groendaal",
    label: "Grote foto bovenaan",
    help: "De brede foto helemaal bovenaan de pagina.",
    fields: [
      { key: "image", type: "image", label: "Foto", default: "/new-images/groendal-hero.png" },
      {
        key: "alt",
        type: "text",
        label: "Omschrijving van de foto",
        help: "Voor blinden en Google; niet zichtbaar op de pagina",
        default: "Groendal — authentieke Belgische kaas",
      },
    ],
  },
  "groendaal.features": {
    page: "groendaal",
    label: "Schuine band met troeven",
    help: "De witte, schuine band net onder de grote foto met korte troeven, gescheiden door ◆.",
    fields: [
      {
        key: "items",
        type: "list",
        label: "Troeven",
        itemLabel: "Troef",
        fields: [{ key: "label", type: "text", label: "Tekst", help: "Kort, bv. 2 à 3 woorden", default: "" }],
        default: [
          { label: "Klaar in een wip" },
          { label: "Geworteld in traditie" },
          { label: "Innovatieve smaken" },
          { label: "Toegewijd aan kwaliteit" },
          { label: "Premium ingrediënten" },
        ],
      },
    ],
  },
  "groendaal.cheeseScroll": {
    page: "groendaal",
    label: "Draaiend kaaswiel",
    help: "Het blok waar het kaaswiel draait tijdens het scrollen en daarna overgaat in de kroket. De grote tekst eronder wisselt mee.",
    fields: [
      {
        key: "kroketImage",
        type: "image",
        label: "Foto van de kroket",
        help: "Verschijnt nadat het kaaswiel uitgedraaid is (liefst een uitgeknipte foto zonder achtergrond)",
        default: "/new-images/kroket-beertje.png",
      },
      {
        key: "kroketAlt",
        type: "text",
        label: "Omschrijving van die foto",
        help: "Voor blinden en Google; niet zichtbaar op de pagina",
        default: "Roeselaarse kaaskroket in de vorm van een beertje",
      },
      { key: "before1", type: "text", label: "Grote tekst bij het kaaswiel — regel 1", default: "Roeselaars" },
      { key: "before2", type: "text", label: "Grote tekst bij het kaaswiel — regel 2", default: "Streekproduct" },
      { key: "after1", type: "text", label: "Grote tekst bij de kroket — regel 1", default: "Roeselaarse" },
      { key: "after2", type: "text", label: "Grote tekst bij de kroket — regel 2", default: "Kaaskroket" },
    ],
  },
  "groendaal.about": {
    page: "groendaal",
    label: "Wie is Groendal",
    help: "Brede sfeerfoto met een witte titel en tekst linksonder.",
    fields: [
      { key: "image", type: "image", label: "Achtergrondfoto", default: "/new-images/groendal-sfeer.webp" },
      {
        key: "alt",
        type: "text",
        label: "Omschrijving van de foto",
        help: "Voor blinden en Google; niet zichtbaar op de pagina",
        default: "Het kaasgamma van Groendal",
      },
      {
        key: "title",
        type: "text",
        label: "Titel",
        help: "Blijft op één regel, dus hou het kort",
        default: "Authentic Belgian cheese",
      },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default:
          "Groendal maakt authentieke Belgische kazen in Roeselare — bekroond voor 's werelds beste kaas. Van jong tot extra gerijpt, elk wiel met zorg en vakmanschap gemaakt, aangevuld met boter en lokale producten.",
      },
    ],
  },
  "groendaal.why": {
    page: "groendaal",
    label: "Waarom we samenwerken",
    help: "Donkergroen blok met een grote titel en zwevende gekleurde kaarten (op gsm: kaarten die over elkaar schuiven). De kleuren van de kaarten wisselen automatisch af.",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label boven de titel", default: "Onze samenwerking" },
      { key: "title", type: "text", label: "Titel", default: "Waarom Kroketco samenwerkt met" },
      {
        key: "titleAccent",
        type: "text",
        label: "Titel — gekleurd woord",
        help: "Lichtgroen woord achteraan de titel",
        default: "Groendal",
      },
      {
        key: "cards",
        type: "list",
        label: "Kaarten",
        help: "Werkt het mooist met 3 kaarten",
        itemLabel: "Kaart",
        fields: [
          { key: "title", type: "text", label: "Titel", default: "" },
          { key: "body", type: "textarea", label: "Tekst", default: "" },
        ],
        default: [
          {
            title: "Roeselaarse Roots",
            body: "Groendal én Kroketco komen uit Roeselare. Zelfde thuis, zelfde trots.",
          },
          { title: "Beste kaas ter wereld", body: "De Groenentaler werd bekroond als 's werelds beste kaas." },
          {
            title: "Samen luxe kroket creëren",
            body: "Samen ontwikkelen we een culinaire kaaskroket op topniveau.",
          },
        ],
      },
    ],
  },
  "groendaal.affinage": {
    page: "groendaal",
    label: "Foto onder de kaarten",
    help: "De brede foto met afgeronde hoeken net onder de kaarten, nog op de donkergroene achtergrond.",
    fields: [
      { key: "image", type: "image", label: "Foto", default: "/new-images/groendal-affinage.jpg" },
      {
        key: "alt",
        type: "text",
        label: "Omschrijving van de foto",
        help: "Voor blinden en Google; niet zichtbaar op de pagina",
        default: "Kaaswielen op affinage-rekken bij Groendal",
      },
    ],
  },
  "groendaal.story": {
    page: "groendaal",
    label: "Hun verhaal",
    help: "Wit blok met links een foto en rechts het verhaal van Groendal met een knop naar hun website.",
    fields: [
      { key: "image", type: "image", label: "Foto (links)", default: "/new-images/groendal-team.jpg" },
      {
        key: "alt",
        type: "text",
        label: "Omschrijving van de foto",
        help: "Voor blinden en Google; niet zichtbaar op de pagina",
        default: "De kaasmakers van 't Groendal in de affinage-ruimte",
      },
      { key: "eyebrow", type: "text", label: "Klein oranje label", default: "Kaasmakerij Roeselare" },
      { key: "title", type: "text", label: "Titel", default: "Hun verhaal" },
      {
        key: "paragraphs",
        type: "list",
        label: "Alinea's",
        itemLabel: "Alinea",
        fields: [{ key: "text", type: "textarea", label: "Tekst", default: "" }],
        default: [
          {
            text: "'t Groendal is een echte familiekaasmakerij in Roeselare, gerund door Johan Deweer en Dominique Steyaert. Wat begon als een melkveebedrijf groeide uit tot een volwaardige kaasmakerij: in 1987 draaiden ze hun eerste kazen, en in 2017 kozen ze resoluut voor de kaas.",
          },
          {
            text: "Hun bekende Groenentaler — een halfharde boerenkaas met grote gaten, een volle smaak en zoete notentoetsen — viel zo in de smaak dat een astronaute er zelfs porties van naar het ISS liet sturen. Net die authentieke, ambachtelijke kaas geeft onze culinaire kaaskroketten hun karakter.",
          },
        ],
      },
      { key: "buttonLabel", type: "text", label: "Knoptekst", default: "Bezoek tgroendal.be" },
      {
        key: "buttonHref",
        type: "url",
        label: "Link van de knop",
        help: "Opent in een nieuw tabblad. Leeg laten = knop verbergen",
        default: "https://www.tgroendal.be/nl",
      },
    ],
  },
  "groendaal.contact": {
    page: "groendaal",
    label: "Contactformulier (samenwerken)",
    help: "Het lichtblauwe contactformulier onderaan de pagina. De velden en knop pas je aan onder Algemeen › Contactformulier.",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Samenwerken?" },
      { key: "title", type: "text", label: "Titel", default: "Werk met ons" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default:
          "Interesse in een samenwerking met Kroketco via Groendal? Laat je gegevens achter en we nemen zo snel mogelijk contact op.",
      },
    ],
  },
});

import { defineSections } from "../schema";

// /producten (overview) and the shared template of every /product/<slug> page.
// Product data itself (name, foto, tags, ingrediënten, bereiding, allergenen …)
// is edited per product under Admin → Producten; these are the fixed texts
// around it.

const ALL = "Geldt voor alle productpagina's.";

export const productenSections = defineSections({
  // ————————————————————————————— /producten —————————————————————————————
  "producten.hero": {
    page: "producten",
    label: "Hero (bovenaan)",
    help: "Het grote videoblok bovenaan de productenpagina.",
    fields: [
      { key: "video", type: "video", label: "Achtergrondvideo", help: "Speelt automatisch en zonder geluid af", default: "/ugc/mood.mp4" },
      { key: "title", type: "text", label: "Titel — eerste deel", help: "Witte tekst van de grote titel", default: "Onze kroketten &" },
      { key: "titleAccent", type: "text", label: "Titel — gekleurd woord", help: "Groen woord achteraan de titel", default: "puree" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst onder de titel",
        default: "Vers gedraaid, met de hand gepaneerd en goudbruin gebakken — voor thuis, de betere traiteur en de horeca.",
      },
    ],
  },
  "producten.words": {
    page: "producten",
    label: "Oranje woordenband",
    help: "De oranje strook met woorden tussen de video en de producten.",
    fields: [
      {
        key: "words",
        type: "list",
        label: "Woorden",
        itemLabel: "Woord",
        fields: [{ key: "word", type: "text", label: "Woord", default: "" }],
        default: [
          { word: "Lekker" },
          { word: "Smeuïg" },
          { word: "Ambachtelijk" },
          { word: "Smaakvol" },
          { word: "Knapperig" },
          { word: "Puur Belgisch" },
        ],
      },
    ],
  },
  "producten.grid": {
    page: "producten",
    label: "Filters & productkaarten",
    help: "De filterknoppen en de teksten op de productkaarten. De filters zelf werken op de categorie van elk product; hier pas je enkel de tekst op de knop aan.",
    fields: [
      { key: "chipAll", type: "text", label: "Filterknop: alles", default: "Alles" },
      { key: "chipKroketten", type: "text", label: "Filterknop: kroketten", help: "Toont producten uit de categorie 'Kroketten'", default: "Kroketten" },
      { key: "chipMinis", type: "text", label: "Filterknop: mini's", help: "Toont producten uit de categorie 'Mini's & borrelhapjes'", default: "Mini's & borrelhapjes" },
      { key: "chipAardappel", type: "text", label: "Filterknop: aardappel", help: "Toont producten uit de categorie 'Aardappel'", default: "Aardappel" },
      { key: "chipPuree", type: "text", label: "Filterknop: puree", help: "Toont producten uit de categorie 'Puree'", default: "Puree" },
      { key: "chipVeggie", type: "text", label: "Filterknop: vegetarisch", help: "Toont alle producten die als vegetarisch zijn aangeduid", default: "Vegetarisch" },
      { key: "countLabel", type: "text", label: "Woord na het aantal", help: "Bv. '12 producten' boven het raster", default: "producten" },
      { key: "veggieBadge", type: "text", label: "Label op vegetarische foto", default: "Veggie" },
      { key: "moreInfo", type: "text", label: "Knop op elke kaart", default: "Meer info" },
      { key: "showMore", type: "text", label: "Knop 'meer tonen'", help: "Het aantal resterende producten komt er automatisch achter", default: "Toon meer" },
      { key: "allergenEyebrow", type: "text", label: "Allergenen-venster: klein label", help: "Venster dat opent als je op de allergeen-icoontjes klikt", default: "Allergenen" },
      {
        key: "allergenNote",
        type: "textarea",
        label: "Allergenen-venster: opmerking onderaan",
        default: "Kan sporen bevatten van andere allergenen. Raadpleeg steeds de verpakking.",
      },
    ],
  },
  "producten.horeca": {
    page: "producten",
    label: "Blok 'Voor de horeca'",
    help: "Groen blok onder de producten.",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Voor de horeca" },
      { key: "title", type: "text", label: "Titel", default: "Groothandel & foodservice" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default:
          "Betrouwbare kwaliteit, constante paneer en scherpe volumeprijzen. Wij leveren dagvers aan restaurants, brasserieën, traiteurs en cateraars in heel België — met maatwerk voor kaart, portie en verpakking.",
      },
      { key: "primaryLabel", type: "text", label: "Oranje knop — tekst", default: "Vraag horeca-prijzen" },
      { key: "primaryHref", type: "url", label: "Oranje knop — link", default: "#" },
      { key: "secondaryLabel", type: "text", label: "Tweede knop — tekst", default: "Over ons" },
      { key: "secondaryHref", type: "url", label: "Tweede knop — link", default: "/over-ons" },
      { key: "image", type: "image", label: "Afbeelding", help: "Rechts in het blok", default: "/about/horeca.png" },
      {
        key: "imageAlt",
        type: "text",
        label: "Omschrijving afbeelding",
        help: "Voor blinden en Google; niet zichtbaar",
        default: "Assortiment kroketten in horeca-verpakking, klaar voor groothandel en foodservice",
      },
    ],
  },
  "producten.cta": {
    page: "producten",
    label: "Afsluiter met contactformulier",
    help: "Lichtblauw blok onderaan met het contactformulier.",
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Zin gekregen?" },
      { key: "title", type: "text", label: "Titel", default: "Bestel je favoriete kroketten" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default: "Voor thuis, de betere traiteur en de horeca. Vers gedraaid, goudbruin gebakken — elke dag opnieuw.",
      },
    ],
  },

  // ——————————————————————— /product/<slug> (template) ———————————————————————
  "product.hero": {
    page: "product",
    label: "Bovenaan: kruimelpad & knoppen",
    help: `Vaste teksten naast de productfoto. ${ALL}`,
    fields: [
      { key: "crumbHome", type: "text", label: "Kruimelpad: eerste link", default: "Home" },
      { key: "crumbHomeHref", type: "url", label: "Kruimelpad: eerste link — adres", default: "/" },
      { key: "crumbList", type: "text", label: "Kruimelpad: tweede link", default: "Assortiment" },
      { key: "crumbListHref", type: "url", label: "Kruimelpad: tweede link — adres", default: "/producten" },
      { key: "veggieBadge", type: "text", label: "Label op vegetarische foto", default: "Vegetarisch" },
      { key: "noImage", type: "text", label: "Tekst als er geen foto is", default: "Geen afbeelding" },
      { key: "ctaLabel", type: "text", label: "Oranje knop — tekst", default: "Contacteer voor meer info" },
      { key: "ctaHref", type: "url", label: "Oranje knop — link", default: "/#contact" },
      { key: "allergenLink", type: "text", label: "Link naar allergenen", help: "Onderlijnde link naast de oranje knop", default: "Allergenen & info" },
    ],
  },
  "product.bereiding": {
    page: "product",
    label: "Bereiding",
    help: `Groen blok met de bereidingsstappen. De stappen zelf pas je per product aan. ${ALL}`,
    fields: [
      { key: "title", type: "text", label: "Titel — eerste deel", default: "Zo bak je ze" },
      { key: "titleAccent", type: "text", label: "Titel — oranje woord", default: "perfect" },
      { key: "text", type: "textarea", label: "Tekst onder de titel", default: "Krokant van buiten, smeuïg van binnen. Zo doe je dat:" },
      { key: "ovenTitle", type: "text", label: "Oven — titel", default: "In de oven" },
      { key: "ovenNote", type: "text", label: "Oven — handgeschreven notitie", default: "Makkelijk en lekker!" },
      { key: "frituurTitle", type: "text", label: "Frituur — titel", default: "In de frituur" },
      { key: "frituurNote", type: "text", label: "Frituur — handgeschreven notitie", default: "Extra krokant!" },
    ],
  },
  "product.ingredienten": {
    page: "product",
    label: "Ingrediënten & allergenen",
    help: `Blok met de ingrediënten en allergenen van het product. ${ALL}`,
    fields: [
      { key: "title", type: "text", label: "Titel", default: "Puur & eerlijk" },
      { key: "titleHand", type: "text", label: "Handgeschreven regel onder de titel", default: "geen geheimen" },
      { key: "ingredientsHand", type: "text", label: "Ingrediënten — handgeschreven label", default: "onze belofte" },
      { key: "ingredientsTitle", type: "text", label: "Ingrediënten — titel", default: "Puur & echt" },
      { key: "ingredientsButton", type: "text", label: "Ingrediënten — knop", default: "Vraag stalen aan" },
      { key: "ingredientsHref", type: "url", label: "Ingrediënten — link van de knop", default: "/#contact" },
      { key: "allergensHand", type: "text", label: "Allergenen — handgeschreven label", default: "let op" },
      { key: "allergensTitle", type: "text", label: "Allergenen — titel", default: "Allergenen" },
      { key: "allergensNone", type: "text", label: "Tekst als er geen allergenen zijn", default: "Geen van de gekende allergenen" },
      {
        key: "allergensNote",
        type: "textarea",
        label: "Allergenen — opmerking",
        default: "Kan sporen bevatten van andere allergenen. Raadpleeg de verpakking.",
      },
      { key: "mascot", type: "image", label: "Figuurtje in het allergenenblok", help: "Chef-mascotte rechtsonder", default: "/kroketten/chef.png" },
    ],
  },
  "product.related": {
    page: "product",
    label: "Andere producten",
    help: `Drie andere producten onderaan. ${ALL}`,
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Ook lekker" },
      { key: "title", type: "text", label: "Titel", default: "Ontdek meer" },
      { key: "linkLabel", type: "text", label: "Link rechts — tekst", help: "Enkel zichtbaar op grotere schermen", default: "Heel het assortiment" },
      { key: "linkHref", type: "url", label: "Link rechts — adres", default: "/producten" },
    ],
  },
  "product.cta": {
    page: "product",
    label: "Afsluiter (groen blok)",
    help: `Groen blok met twee knoppen. ${ALL}`,
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Elke hap een feest" },
      { key: "title", type: "text", label: "Titel", default: "Klaar om te proeven?" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default: "Vers gedraaid, goudbruin gebakken en zo bij jou thuis. Voor de betere traiteur en de horeca in heel België.",
      },
      { key: "primaryLabel", type: "text", label: "Oranje knop — tekst", default: "Contacteer ons" },
      { key: "primaryHref", type: "url", label: "Oranje knop — link", default: "/#contact" },
      { key: "secondaryLabel", type: "text", label: "Tweede knop — tekst", default: "Bekijk assortiment" },
      { key: "secondaryHref", type: "url", label: "Tweede knop — link", default: "/producten" },
    ],
  },
  "product.contact": {
    page: "product",
    label: "Contactformulier",
    help: `Formulier onderaan (per product uit te schakelen). ${ALL}`,
    fields: [
      { key: "eyebrow", type: "text", label: "Klein label", default: "Contacteer ons" },
      { key: "title", type: "text", label: "Titel", default: "Interesse in dit product?" },
      {
        key: "text",
        type: "textarea",
        label: "Tekst",
        default: "Stalen aanvragen of meer info over prijzen en verpakking? Laat je gegevens achter en we nemen snel contact op.",
      },
    ],
  },
});

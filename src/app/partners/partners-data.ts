export type Partner = {
  slug: string;
  name: string;
  card?: string; // landscape photo; when absent the card/hero shows the logo
  logo: string;
  badgeDark?: boolean; // dark scallop badge for light/cream logos
  tagline: string;
  desc: string;
  body: string[]; // "wie zijn ze" — paragraphs for the detail page
};

export const PARTNERS: Partner[] = [
  {
    slug: "steen-food-masters",
    name: "Steen Food Masters",
    card: "/partners/cards/steen.png",
    logo: "/partners/logo-steen.3bac4d420028.svg",
    tagline: "Food & non-food",
    desc: "Versgroothandel in food en non-food voor de professionele keuken.",
    body: [
      "Steen Food Masters is een versgroothandel met een breed gamma food- én non-foodproducten.",
      "Van vlees en vis tot droge voeding, bereide maaltijden, zuivel, diepvries, salades, aardappelproducten, sauzen, kruiden, tapas en desserts — aangevuld met non-food zoals verpakkingen en reinigingsmiddelen. Bij Steen Food Masters vind je alles wat je zoekt, en meer.",
    ],
  },
  {
    slug: "huppa",
    name: "Huppa",
    card: "/partners/cards/huppa.png",
    logo: "/partners/HUPPA_Logo_Screen_Black_RGB.svg",
    tagline: "Oostende & Wortegem-Petegem",
    desc: "Versgroothandel met een breed assortiment voor horeca en traiteur.",
    body: [
      "Zeg 'vers' en je denkt aan Huppa. Meer dan een groothandel: een toonaangevend, innovatief versplatform voor lokale, nationale én internationale merken.",
      "Een platform waarop ze duurzaam samenwerken met klanten, leveranciers, medewerkers en partners — op lange termijn, met groei voor alle partijen. Dat zijn ze vandaag, en dat willen ze morgen blijven. Met vestigingen in Oostende en Wortegem-Petegem.",
    ],
  },
  {
    slug: "rafina",
    name: "Rafina",
    card: "/partners/cards/rafina.png",
    logo: "/partners/rafina.svg",
    tagline: "Lauwe · sinds 1954",
    desc: "Belgische versgroothandel, al meer dan 70 jaar een vaste waarde.",
    body: [
      "Rafina is een gevestigde Belgische versgroothandel uit Lauwe, actief sinds 1954. Het bedrijf levert een zeer breed gamma aan onder meer slagers, kaaswinkels, traiteurs en versspeciaalzaken. Vandaag telt het aanbod meer dan 7.000 producten: charcuterie, kazen, salades, bereide maaltijden, diepvries en andere verse producten.",
      "Rafina onderscheidt zich met eigen transport, een vaste vertegenwoordiger per klant, een uitgebreide aankoopafdeling en een sterke focus op lokale en ambachtelijke producten. De voorbije jaren groeide het bedrijf verder via overnames zoals Triporteur (2017) en ARCA en Deketelaere-Maes Viswaren (2024).",
    ],
  },
  {
    slug: "duva-fruit",
    name: "Duva Fruit",
    card: "/partners/cards/duva.png",
    logo: "/partners/logo.svg",
    tagline: "Gistel",
    desc: "Groenten, fruit en verse producten, dagvers geleverd.",
    body: [
      "Duva Fruit NV is een West-Vlaamse groothandel in verse groenten, fruit en aanverwante voedingsproducten, gevestigd in Gistel. Het bedrijf werd opgericht in 1992 en bevoorraadt vandaag honderden voedingsprofessionals in West- en Oost-Vlaanderen.",
      "Duva richt zich vooral op horeca, slagers, traiteurs, grootkeukens, bakkers en versspeciaalzaken. Naast groenten en fruit is er een breed complementair assortiment: voorgesneden groenten, aardappelproducten, puree, kroketten, noten, gedroogd fruit, fruitsappen, scheuten en microgroenten.",
      "Een sterke troef is de logistiek: eigen koeltransport en honderden dagelijkse leveringen in de regio, met levering dezelfde dag voor horeca.",
    ],
  },
  {
    slug: "vlaemynck-natuurlijk",
    name: "Vlaemynck Natuurlijk",
    card: "/partners/cards/vlaemynck.png",
    logo: "/partners/VlaemynckNatuurlijk_logo_header.svg",
    badgeDark: true,
    tagline: "Veurne",
    desc: "Specialist in verse aardappelproducten en versgroenten.",
    body: [
      "Vlaemynck Natuurlijk is een familiebedrijf en professionele groothandel in verse groenten, fruit en aardappelproducten uit Veurne. Het bedrijf overspant intussen vier generaties en levert aan professionele keukens in West- en Oost-Vlaanderen.",
      "Vlaemynck combineert een breed versassortiment met een eigen snijafdeling en wagenpark. Klanten zijn onder meer horeca, grootkeukens, zorginstellingen, traiteurs en voedingsbedrijven. Naast groenten en fruit leveren ze verwerkte aardappelen, kruiden, sappen, noten en gekookte groenten.",
      "Een grote troef is de snelle en flexibele logistiek: laat bestellen kan, en Vlaemynck verzorgt dagelijkse leveringen met eigen transport, volgens de IFS-kwaliteitsnormen.",
    ],
  },
  {
    slug: "biervliet-freez-center",
    name: "Biervliet Freez Center",
    card: "/partners/cards/freezcenter.png",
    logo: "/partners/logo-freezcenter.png",
    tagline: "Diksmuide",
    desc: "Vers- en diepvriesgroothandel voor horeca en retail.",
    body: [
      "Biervliet Freez Center is een West-Vlaamse voedingsgroothandel uit Diksmuide, gespecialiseerd in diepvriesproducten en een breed assortiment voor professionele klanten: horeca, slagers, traiteurs, bakkers, grootkeukens, catering, verenigingen en bedrijven.",
      "Het aanbod is uitgebreid: diepvriesgroenten en -fruit, frieten, aardappelproducten, gefrituurde snacks, ambachtelijke kroketten, vlees, gevogelte, vis, desserts, ijs en droge voeding.",
      "Een grote sterkte is de regionale distributie: dagelijkse leveringen aan de kust en in West-Vlaanderen, met een snel bestel- en leverproces. Het bedrijf is aangesloten bij AZ Food Horecagrossiers.",
    ],
  },
  {
    slug: "fresh-by-vero",
    name: "Fresh by Vero",
    logo: "/partners/xfreshbyvero-logo.png.pagespeed.ic.tV35_7rs2f.webp",
    tagline: "Poperinge",
    desc: "Groenten en fruit, met zorg geselecteerd en vers geleverd.",
    body: [
      "Fresh by Vero is een West-Vlaamse versgroothandel uit Poperinge, actief in de groenten- en fruitsector.",
      "Het bedrijf is gevestigd aan de Beneluxlaan 21 in Poperinge en staat geregistreerd als groente- en fruitonderneming.",
    ],
  },
];

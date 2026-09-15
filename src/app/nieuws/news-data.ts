export type NewsItem = {
  slug: string;
  title: string;
  date: string; // ISO, for <time>
  dateLabel: string;
  category: string;
  excerpt: string;
  image: string;
  intro: string;
  body: string[];
  info: { title: string; text: string };
  image2?: string;
  image2Caption?: string;
  quote: { text: string; author: string; role?: string };
  table: { caption: string; headers: string[]; rows: string[][] };
};

export const NEWS: NewsItem[] = [
  {
    slug: "verse-puree-nieuwe-smaken",
    title: "Verse puree in nieuwe smaken",
    date: "2026-08-20",
    dateLabel: "20 augustus 2026",
    category: "Product",
    excerpt:
      "Onze verse puree krijgt gezelschap: drie nieuwe smaken, klaar voor thuis, de traiteur en de horeca.",
    image: "/promo/eten.png",
    intro:
      "Sinds 2023 maken we naast onze kroketten ook verse puree. Vandaag breiden we het gamma uit met drie nieuwe smaken — telkens vertrokken van échte aardappelen.",
    body: [
      "We blijven onze puree opnieuw uitvinden: in andere smaken, formaten en verpakkingen. Geen poeder, geen shortcuts — enkel verse aardappelen, roomboter en een snuf nootmuskaat, zoals thuis.",
      "De nieuwe smaken zijn ontwikkeld samen met een aantal traiteurs en chefs, zodat ze meteen klaar zijn voor de professionele keuken én voor op tafel thuis.",
    ],
    info: {
      title: "Goed om te weten",
      text: "De nieuwe smaken zijn beschikbaar in tubes van 2 kg en 475 g, en in potjes van 450 g. Vraag stalen aan via onze kanalen.",
    },
    image2: "/kroketten/prod-kaas.jpg",
    image2Caption: "Vers gedraaid en met de hand gepaneerd in ons atelier in Roeselare.",
    quote: {
      text: "Echte aardappelen, geen poeder. Dat proef je in elke lepel.",
      author: "Lieven Vinckier",
      role: "zaakvoerder",
    },
    table: {
      caption: "Beschikbare verpakkingen",
      headers: ["Formaat", "Inhoud", "Kanaal"],
      rows: [
        ["Tube", "2 kg", "Horeca"],
        ["Tube", "475 g", "Traiteur"],
        ["Potje", "450 g", "Retail"],
      ],
    },
  },
  {
    slug: "atelier-roeselare-uitgebreid",
    title: "Ons atelier in Roeselare uitgebreid",
    date: "2026-06-10",
    dateLabel: "10 juni 2026",
    category: "Bedrijf",
    excerpt:
      "Meer ruimte, dezelfde zorg. We investeerden in ons atelier om nog verser en constanter te kunnen werken.",
    image: "/about/atelier.png",
    intro:
      "Wat klein begon in een schuurtje, is vandaag een moderne voedingsproducent. Deze zomer breidden we ons atelier in Roeselare verder uit.",
    body: [
      "Meer ruimte betekent kortere lijnen, strakkere hygiëne en nog meer aandacht voor kwaliteit. Onze kroketten blijven met de hand gepaneerd — de uitbreiding zorgt er vooral voor dat we die zorg op grotere schaal kunnen volhouden.",
      "We blijven een familiebedrijf: klein team, korte beslissingslijnen, en iedereen kent elke stap van het proces.",
    ],
    info: {
      title: "In cijfers",
      text: "25+ jaar vakmanschap, 100% Belgisch ambacht en dagverse productie — nu met extra capaciteit in Roeselare.",
    },
    image2: "/ugc/ugc-5.png",
    image2Caption: "Samen genieten — daar doen we het voor.",
    quote: {
      text: "Alleen het beste is goed genoeg. We starten met kwaliteit en eindigen met kwaliteit.",
      author: "Team Kroketco",
    },
    table: {
      caption: "Onze kanalen",
      headers: ["Kanaal", "Voor wie", "Levering"],
      rows: [
        ["Thuis", "Consument", "Via retail"],
        ["Traiteur", "Versspeciaalzaak", "Via partners"],
        ["Horeca", "Restaurant & brasserie", "Dagvers"],
      ],
    },
  },
  {
    slug: "kroketco-op-horeca-expo",
    title: "Kroketco op Horeca Expo",
    date: "2026-05-02",
    dateLabel: "2 mei 2026",
    category: "Event",
    excerpt:
      "Kom proeven! We stonden op Horeca Expo met onze kroketten, mini's en verse puree.",
    image: "/ugc/ugc-2.png",
    intro:
      "Niets zo fijn als mensen live laten proeven. Op Horeca Expo lieten we onze klassiekers en nieuwe smaken ontdekken aan chefs, traiteurs en fijnproevers.",
    body: [
      "Van garnaalkroket tot kaas-prei en mini's voor de borrel: onze stand draaide op volle toeren. Bedankt aan iedereen die langskwam voor een babbel en een krokante beet.",
      "Kon je er niet bij zijn? Geen zorgen — we plannen dit najaar nieuwe proefmomenten bij onze partners.",
    ],
    info: {
      title: "Volgende halte",
      text: "Hou onze nieuwsbrief in de gaten voor de volgende beurzen en proefdagen bij onze versgroothandels.",
    },
    image2: "/ugc/ugc-8.png",
    image2Caption: "De garnaalkroket blijft een publiekslieveling.",
    quote: {
      text: "Elke hap een feest — dat is precies wat we op de beurs wilden laten proeven.",
      author: "Team Kroketco",
    },
    table: {
      caption: "Op de stand",
      headers: ["Categorie", "Voorbeeld", "Formaat"],
      rows: [
        ["Kroketten", "Garnaal · kaas", "4 & 12 stuks"],
        ["Mini's", "Borrelhapjes", "24 stuks"],
        ["Puree", "Verse puree", "Tube & potje"],
      ],
    },
  },
  {
    slug: "samen-met-groendal",
    title: "Samen met Groendal voor de beste kaas",
    date: "2026-03-15",
    dateLabel: "15 maart 2026",
    category: "Partners",
    excerpt:
      "Onze kaaskroketten danken hun volle smaak aan lokale kaas van Groendal. Een samenwerking om trots op te zijn.",
    image: "/ugc/ugc-4.png",
    intro:
      "Voor onze kaaskroketten werken we samen met Groendal — bekroond voor 's werelds beste kaas. Lokaal, eerlijk en met een neus voor smaak.",
    body: [
      "Echte Belgische kazen, geen kunstmatige smaakjes. Die keuze maakt het verschil in elke romige vulling. Groendal levert ons kaas én boter, en blijft een vaste partner in het verhaal.",
      "Lokale producten, korte ketens en respect voor het product — dat is waar Kroketco voor staat, en waar we onze partners op uitkiezen.",
    ],
    info: {
      title: "Extra info",
      text: "Meer weten over Groendal? Bezoek tgroendal.be voor hun volledige verhaal en assortiment.",
    },
    image2: "/kroketten/prod-kaas.jpg",
    image2Caption: "Romige kaasvulling in een krokant panko-jasje.",
    quote: {
      text: "Lokale kaas van topkwaliteit — dat verdient een kroket die er tegenop kan.",
      author: "Team Kroketco",
    },
    table: {
      caption: "Kaas in ons gamma",
      headers: ["Product", "Kaas", "Verpakking"],
      rows: [
        ["Kaaskroket", "Belgische kaas", "4 & 12 stuks"],
        ["Kaas-prei kroket", "Belgische kaas", "6 stuks"],
        ["Mini kaas", "Belgische kaas", "24 stuks"],
      ],
    },
  },
];

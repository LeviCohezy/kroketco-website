import AssortimentView from "./client";
import { listProducts } from "@/lib/repo";
import type { Product as DbProduct } from "@/lib/types";
import { parseAllergens } from "@/lib/allergens";

// Server component: reads products from the CMS DB and passes them to the
// (unchanged) client presentation. Dynamic so CMS edits appear immediately.
export const dynamic = "force-dynamic";

type Category = "Kroketten" | "Mini's & borrelhapjes" | "Aardappel" | "Puree" | "Vegetarisch";

function toView(p: DbProduct) {
  return {
    slug: p.slug,
    name: p.name,
    sub: p.sub,
    allergens: parseAllergens(p.allergens).map((a) => a.code),
    src: p.image,
    frame: p.frame,
    category: p.category as Category,
    veggie: !!p.veggie,
  };
}

export default function AssortimentPage() {
  const products = listProducts({ publishedOnly: true }).map(toView);
  return <AssortimentView products={products} />;
}

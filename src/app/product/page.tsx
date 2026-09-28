import { redirect } from "next/navigation";

// The generic /product page has been replaced by per-product routes at
// /product/[slug]. Send any stray visits to the full assortment.
export const dynamic = "force-dynamic";

export default function ProductIndexPage() {
  redirect("/producten");
}

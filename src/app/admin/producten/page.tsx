import { listProducts } from "@/lib/repo";
import { ProductsManager } from "./manager";

export const dynamic = "force-dynamic";

export default function ProductsAdminPage() {
  const initial = listProducts();
  return <ProductsManager initial={initial} />;
}

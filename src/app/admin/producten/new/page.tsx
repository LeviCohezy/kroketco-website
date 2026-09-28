import { listProducts } from "@/lib/repo";
import { ProductEditor } from "../ProductEditor";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  const nextSort = listProducts().length;
  return <ProductEditor product={null} nextSort={nextSort} />;
}

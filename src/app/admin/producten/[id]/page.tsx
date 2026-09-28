import { notFound } from "next/navigation";
import { getProduct, listProducts } from "@/lib/repo";
import { ProductEditor } from "../ProductEditor";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) notFound();
  const product = getProduct(numId);
  if (!product) notFound();
  return <ProductEditor product={product} nextSort={listProducts().length} />;
}

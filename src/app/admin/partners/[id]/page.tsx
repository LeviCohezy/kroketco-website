import { notFound } from "next/navigation";
import { getPartner, listPartners } from "@/lib/repo";
import { PartnerEditor } from "../PartnerEditor";

export const dynamic = "force-dynamic";

export default async function EditPartnerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) notFound();
  const partner = getPartner(numId);
  if (!partner) notFound();
  return <PartnerEditor partner={partner} nextSort={listPartners().length} />;
}

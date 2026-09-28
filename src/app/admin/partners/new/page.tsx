import { listPartners } from "@/lib/repo";
import { PartnerEditor } from "../PartnerEditor";

export const dynamic = "force-dynamic";

export default function NewPartnerPage() {
  const nextSort = listPartners().length;
  return <PartnerEditor partner={null} nextSort={nextSort} />;
}

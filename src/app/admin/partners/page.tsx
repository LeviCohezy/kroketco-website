import { listPartners } from "@/lib/repo";
import { PartnersManager } from "./manager";

export const dynamic = "force-dynamic";

export default function PartnersAdminPage() {
  const initial = listPartners();
  return <PartnersManager initial={initial} />;
}

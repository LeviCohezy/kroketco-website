import PartnersView from "./client";
import type { PartnerCard } from "./client";
import { listPartners } from "@/lib/repo";

// Server component: reads published partners from the CMS DB and passes them to
// the client presentation. Dynamic so CMS edits appear immediately.
export const dynamic = "force-dynamic";

export default function PartnersPage() {
  const partners: PartnerCard[] = listPartners({ publishedOnly: true }).map((p) => ({
    slug: p.slug,
    name: p.name,
    logo: p.logo,
    city: p.city,
    description: p.description,
    thumbnail: p.thumbnail,
  }));
  return <PartnersView partners={partners} />;
}

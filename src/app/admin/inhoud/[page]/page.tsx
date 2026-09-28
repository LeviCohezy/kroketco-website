import { notFound } from "next/navigation";
import { PAGES } from "@/lib/content/schema";
import { REGISTRY, type SectionId } from "@/lib/content/registry";
import { contentUpdatedAt, getAllContent } from "@/lib/content/store";
import { listProducts } from "@/lib/repo";
import { ContentEditor, type EditorSection } from "../ContentEditor";

export const dynamic = "force-dynamic";

export default async function EditPageContent({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const meta = PAGES.find((p) => p.slug === page);
  if (!meta) notFound();

  const all = await getAllContent();
  const updated = contentUpdatedAt();
  const sections: EditorSection[] = (Object.keys(REGISTRY) as SectionId[])
    .filter((id) => REGISTRY[id].page === meta.slug)
    .map((id) => ({
      id,
      label: REGISTRY[id].label,
      help: REGISTRY[id].help,
      fields: REGISTRY[id].fields,
      value: all[id] as Record<string, unknown>,
      edited: !!updated[id],
    }));

  // The product-page template needs a real product to preview.
  let previewPath: string = meta.path;
  if (meta.slug === "product") {
    const first = listProducts().find((p) => p.published);
    if (first) previewPath = `/product/${first.slug}`;
  }

  return <ContentEditor title={meta.label} previewPath={previewPath} sections={sections} />;
}

import { listPosts } from "@/lib/repo";
import { BlogManager } from "./manager";

export const dynamic = "force-dynamic";

export default function BlogAdminPage() {
  const initial = listPosts();
  return <BlogManager initial={initial} />;
}

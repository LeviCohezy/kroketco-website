import { notFound } from "next/navigation";
import { getPost } from "@/lib/repo";
import { BlogEditor } from "../BlogEditor";

export const dynamic = "force-dynamic";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) notFound();
  const post = getPost(numId);
  if (!post) notFound();
  return <BlogEditor post={post} />;
}

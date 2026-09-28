import { BlogEditor } from "../BlogEditor";

export const dynamic = "force-dynamic";

export default function NewBlogPage() {
  return <BlogEditor post={null} />;
}

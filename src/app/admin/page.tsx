import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// The dashboard nav starts at "Blog posts"; /admin redirects there.
export default function AdminHome() {
  redirect("/admin/blog");
}

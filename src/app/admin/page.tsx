import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Website texts are edited live on the site (log in at /login-admin). The
// dashboard now manages collections; /admin redirects to the first section.
export default function AdminHome() {
  redirect("/admin/blog");
}

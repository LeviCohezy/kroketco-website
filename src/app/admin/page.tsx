import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// The dashboard nav starts at "Website teksten"; /admin redirects there.
export default function AdminHome() {
  redirect("/admin/inhoud");
}

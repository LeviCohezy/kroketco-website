import { listContactRequests } from "@/lib/repo";
import { ContactList } from "./ContactList";

export const dynamic = "force-dynamic";

export default function ContactAdminPage() {
  const initial = listContactRequests();
  return <ContactList initial={initial} />;
}

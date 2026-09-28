import type { ReactNode } from "react";
import { ToastProvider } from "./ui";
import { AdminShell } from "./shell";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kroketco CMS",
  robots: { index: false, follow: false },
};

// The layout wraps every /admin route. The login page renders standalone
// (no sidebar); authenticated pages get the AdminShell with navigation.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAuthenticated();
  return (
    <div className="min-h-screen bg-light-blue text-forest [font-family:var(--font-inter),system-ui,sans-serif]">
      <ToastProvider>{authed ? <AdminShell>{children}</AdminShell> : children}</ToastProvider>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { useToast } from "./ui";
import { BlogIcon, ProductIcon, PartnersIcon, InboxIcon, LogoutIcon, PagesIcon } from "./icons";

type NavItem = { href: string; label: string; icon: ComponentType<SVGProps<SVGSVGElement>> };

const NAV: NavItem[] = [
  { href: "/admin/inhoud", label: "Website teksten", icon: PagesIcon },
  { href: "/admin/blog", label: "Blog posts", icon: BlogIcon },
  { href: "/admin/producten", label: "Producten", icon: ProductIcon },
  { href: "/admin/partners", label: "Partners", icon: PartnersIcon },
  { href: "/admin/contact", label: "Contact aanvragen", icon: InboxIcon },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast("Uitgelogd");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-light-blue p-3 sm:p-4">
      {/* Sidebar — white rounded panel floating on the light-blue background */}
      <aside className="sticky top-3 hidden h-[calc(100vh-1.5rem)] w-[240px] shrink-0 flex-col rounded-2xl bg-white p-4 shadow-[0_10px_40px_-12px_rgba(14,75,58,0.25)] sm:top-4 sm:flex sm:h-[calc(100vh-2rem)]">
        {/* Brand row */}
        <Link href="/admin/blog" className="mb-6 flex items-center px-2 pt-1">
          <Image
            src="/hero/logo-kroketco.png"
            alt="Kroketco"
            width={1254}
            height={1254}
            priority
            className="h-11 w-auto"
          />
        </Link>

        {/* Nav */}
        <nav className="flex-1 space-y-1.5">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-orange/12 text-orange"
                    : "text-forest/70 hover:bg-forest/5 hover:text-forest"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${active ? "text-orange" : "text-forest/50"}`} />
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-forest/10 pt-3">
          <Link
            href="/"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-forest/60 transition hover:bg-forest/5 hover:text-forest"
          >
            <span className="grid h-5 w-5 place-items-center text-forest/50">↗</span>
            Naar de site
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-forest/60 transition hover:bg-orange/10 hover:text-orange"
          >
            <LogoutIcon className="h-5 w-5 shrink-0 text-forest/50" />
            Uitloggen
          </button>
        </div>
      </aside>

      {/* Main content column */}
      <main className="min-w-0 flex-1 sm:pl-4">
        {/* Mobile top bar with logout (sidebar is hidden on mobile) */}
        <div className="mb-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm sm:hidden">
          <Image src="/hero/logo-kroketco.png" alt="Kroketco" width={1254} height={1254} className="h-10 w-auto" />
          <button onClick={logout} className="text-sm font-medium text-orange">
            Uitloggen
          </button>
        </div>

        {children}

        {/* Mobile nav row */}
        <nav className="mt-3 flex gap-2 sm:hidden">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`flex-1 rounded-xl px-2 py-2 text-center text-xs font-medium ${
                  active ? "bg-orange text-white" : "bg-white text-forest/70"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </main>
    </div>
  );
}

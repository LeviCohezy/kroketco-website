import Link from "next/link";
import { PAGES } from "@/lib/content/schema";
import { REGISTRY } from "@/lib/content/registry";
import { contentUpdatedAt } from "@/lib/content/store";

export const dynamic = "force-dynamic";

// Overview of every page whose texts, links and photos the client can edit.
export default function ContentOverview() {
  const updated = contentUpdatedAt();
  const sections = Object.entries(REGISTRY);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold text-forest">Website teksten</h1>
      <p className="mt-1 max-w-2xl text-sm text-gray-500">
        Pas elke tekst, link en foto van de website aan. Kies een pagina, wijzig wat je wil en klik op
        <strong className="font-semibold text-forest"> Opslaan</strong> — het staat meteen live.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PAGES.map((p) => {
          const own = sections.filter(([, s]) => s.page === p.slug);
          const edited = own.filter(([id]) => updated[id]).length;
          const last = own
            .map(([id]) => updated[id])
            .filter(Boolean)
            .sort()
            .pop();
          return (
            <Link
              key={p.slug}
              href={`/admin/inhoud/${p.slug}`}
              className="group rounded-2xl border border-gray-200 p-5 transition hover:-translate-y-0.5 hover:border-orange/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-forest">{p.label}</h2>
                <span className="text-orange opacity-0 transition group-hover:opacity-100">→</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {own.length} {own.length === 1 ? "blok" : "blokken"}
                {edited > 0 && ` · ${edited} aangepast`}
              </p>
              <p className="mt-3 line-clamp-2 text-xs text-gray-400">{own.map(([, s]) => s.label).join(" · ")}</p>
              {last && <p className="mt-3 text-xs text-gray-400">Laatst gewijzigd: {last.slice(0, 16).replace("T", " ")}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

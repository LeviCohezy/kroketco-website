"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { Button, RowActionMenu, useToast } from "../ui";

export function ProductsManager({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const router = useRouter();
  const toast = useToast();

  async function remove(p: Product) {
    if (!confirm(`"${p.name}" verwijderen?`)) return;
    const res = await fetch(`/api/products/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      toast(`"${p.name}" verwijderd`);
      setProducts((list) => list.filter((x) => x.id !== p.id));
    } else {
      toast("Verwijderen mislukt", "error");
    }
  }

  async function setPublished(p: Product, value: number) {
    // Send the whole product (parseProduct ignores extra keys) and override
    // only `published`, so toggling status never wipes the rich detail fields.
    const res = await fetch(`/api/products/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...p, published: value }),
    });
    if (res.ok) {
      const updated = (await res.json()) as Product;
      setProducts((list) => list.map((x) => (x.id === p.id ? updated : x)));
      toast(value ? "Gepubliceerd" : "Naar concept");
    } else {
      toast("Bijwerken mislukt", "error");
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Sticky header with title + new button */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight text-forest">Producten</h1>
        <Button onClick={() => router.push("/admin/producten/new")}>+ Nieuw product</Button>
      </div>

      {/* Scrollable body; table head stays sticky */}
      <div className="nice-scroll min-h-0 flex-1 overflow-y-auto">
        {products.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Nog geen producten. Klik op “Nieuw product” om te beginnen.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Categorie</th>
                <th className="px-4 py-3 font-medium">Allergenen</th>
                <th className="px-4 py-3 font-medium">Aantal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const amount = p.sub.match(/\d+/)?.[0];
                return (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-3">
                      <Link href={`/admin/producten/${p.id}`} className="flex items-center gap-3 hover:opacity-80">
                        {p.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image} alt="" className="h-10 w-10 rounded-lg border border-gray-200 object-cover" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.sub}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.category}
                      {p.veggie ? <span className="ml-1 text-emerald-600">· veggie</span> : null}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.allergens || "—"}</td>
                    <td className="px-4 py-3 text-gray-600">{amount ? `${amount}x` : "—"}</td>
                    <td className="px-4 py-3">
                      {p.published ? (
                        <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-forest">Live</span>
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">Concept</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <RowActionMenu
                        onEdit={() => router.push(`/admin/producten/${p.id}`)}
                        items={[
                          p.published
                            ? { label: "Naar concept", onClick: () => setPublished(p, 0) }
                            : { label: "Publiceren", onClick: () => setPublished(p, 1) },
                          { label: "Verwijderen", onClick: () => remove(p), danger: true },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

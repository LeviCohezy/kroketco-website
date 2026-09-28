"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/lib/types";
import { Button, RowActionMenu, useToast } from "../ui";

export function BlogManager({ initial }: { initial: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initial);
  const router = useRouter();
  const toast = useToast();

  async function remove(p: Post) {
    if (!confirm(`"${p.title}" verwijderen?`)) return;
    const res = await fetch(`/api/blog/${p.id}`, { method: "DELETE" });
    if (res.ok) {
      toast(`"${p.title}" verwijderd`);
      setPosts((list) => list.filter((x) => x.id !== p.id));
    } else {
      toast("Verwijderen mislukt", "error");
    }
  }

  async function setPublished(p: Post, value: number) {
    const res = await fetch(`/api/blog/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        body: p.body,
        category: p.category,
        coverImage: p.coverImage,
        author: p.author,
        dateLabel: p.dateLabel,
        showForm: p.showForm,
        published: value,
        publishedAt: p.publishedAt,
      }),
    });
    if (res.ok) {
      const updated = (await res.json()) as Post;
      setPosts((list) => list.map((x) => (x.id === p.id ? updated : x)));
      toast(value ? "Gepubliceerd" : "Naar concept");
    } else {
      toast("Bijwerken mislukt", "error");
    }
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      {/* Sticky header with title + new button */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight text-forest">Blog posts</h1>
        <Button onClick={() => router.push("/admin/blog/new")}>+ Nieuwe post</Button>
      </div>

      {/* Scrollable body; table head stays sticky */}
      <div className="nice-scroll min-h-0 flex-1 overflow-y-auto">
        {posts.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-500">
            Nog geen posts. Klik op “Nieuwe post” om te beginnen.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">Titel</th>
                <th className="px-4 py-3 font-medium">Categorie</th>
                <th className="px-4 py-3 font-medium">Datum</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-3">
                    <Link href={`/admin/blog/${p.id}`} className="flex items-center gap-3 hover:opacity-80">
                      {p.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.coverImage} alt="" className="h-10 w-14 rounded-lg border border-gray-200 object-cover" />
                      )}
                      <div className="font-medium text-gray-900">{p.title}</div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 text-gray-600">{p.dateLabel || p.publishedAt}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-lime px-2.5 py-1 text-xs font-semibold text-forest">Live</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">Concept</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <RowActionMenu
                      onEdit={() => router.push(`/admin/blog/${p.id}`)}
                      items={[
                        p.published
                          ? { label: "Naar concept", onClick: () => setPublished(p, 0) }
                          : { label: "Publiceren", onClick: () => setPublished(p, 1) },
                        { label: "Verwijderen", onClick: () => remove(p), danger: true },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

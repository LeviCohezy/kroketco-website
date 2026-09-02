import Link from "next/link";

/**
 * Sticky floating toggle to jump between the two homepage designs.
 * V1 = "/" (playful), V2 = "/v3" (poster/editorial).
 */
export default function VersionSwitch({ active }: { active: "v1" | "v2" }) {
  const seg =
    "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors";
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/90 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.22)] backdrop-blur">
        <Link
          href="/"
          className={`${seg} ${active === "v1" ? "bg-forest text-cream" : "text-forest/60 hover:text-forest"}`}
        >
          V1
        </Link>
        <Link
          href="/v3"
          className={`${seg} ${active === "v2" ? "bg-forest text-cream" : "text-forest/60 hover:text-forest"}`}
        >
          V2
        </Link>
      </div>
    </div>
  );
}

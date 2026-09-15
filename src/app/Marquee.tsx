/* eslint-disable @next/next/no-img-element */

type Card = { img: string; label: string; color: string };

const CARDS: Card[] = [
  { img: "/ugc/ugc-2.png", label: "Ambachtelijk", color: "#ff8a00" },
  { img: "/ugc/ugc-4.png", label: "Huisgemaakt", color: "#f2c14e" },
  { img: "/ugc/ugc-1.png", label: "Romig", color: "#3e6be6" },
  { img: "/ugc/ugc-8.png", label: "Goudbruin", color: "#ff8a00" },
  { img: "/ugc/ugc-5.png", label: "Krokant", color: "#0e4b3a" },
  { img: "/ugc/ugc-7.png", label: "Smaakbom", color: "#f4a7c3" },
  { img: "/ugc/ugc-9.png", label: "Vers", color: "#a88be0" },
  { img: "/ugc/ugc-3.png", label: "Belgisch", color: "#e95454" },
];

export default function Marquee() {
  // Two identical sets so translateX(-50%) loops seamlessly.
  const track = [...CARDS, ...CARDS];
  return (
    <section className="relative z-10 overflow-hidden bg-[var(--light-blue)] py-10 sm:py-12">
      <div className="flex w-max animate-marquee">
        {track.map((c, i) => (
          <div key={i} className="relative mr-5 w-[clamp(230px,22vw,290px)] shrink-0">
            <div className="rounded-[26px] p-[5px]" style={{ background: c.color }}>
              <div className="aspect-[3/4] overflow-hidden rounded-[22px]">
                <img src={c.img} alt="" className="h-full w-full object-cover" />
              </div>
            </div>
            <span
              className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-6 py-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-white"
              style={{ background: c.color }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

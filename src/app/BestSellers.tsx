/* eslint-disable @next/next/no-img-element */

const FEATURES = [
  { icon: "/icons/icon-1.png", label: "Lokale producten" },
  { icon: "/icons/icon-2.png", label: "Belgische kazen" },
  { icon: "/icons/icon-3.png", label: "Vers gedraaid" },
  { icon: "/icons/icon-4.png", label: "Gemaakt voor chefs" },
  { icon: "/icons/icon-5.png", label: "Met de hand gemaakt" },
  { icon: "/icons/icon-6.png", label: "Familie recept" },
];

export default function BestSellers({ squareBottom = false }: { squareBottom?: boolean }) {
  return (
    <section className={`relative z-20 -mt-[clamp(8px,2vw,50px)] ${squareBottom ? "" : "rounded-b-[44px]"} bg-white px-6 pb-16 pt-10 text-forest shadow-[0_36px_60px_-30px_rgba(0,0,0,0.35)] sm:px-12 sm:pb-20 lg:px-16`}>
      <div className="mx-auto max-w-[1480px]">
        {/* ---- feature icons ---- */}
        {/* mobile + tablet: auto-scrolling marquee (~2 icons on phone, ~4 on tablet) */}
        <div className="overflow-hidden lg:hidden">
          <div className="flex w-max animate-marquee items-start gap-10" style={{ animationDuration: "18s" }}>
            {[...FEATURES, ...FEATURES].map((f, i) => (
              <div key={i} className="flex w-[42vw] shrink-0 flex-col items-center gap-3 text-center sm:w-[24vw]">
                <img
                  src={f.icon}
                  alt=""
                  className="h-[72px] w-auto object-contain"
                />
                <span className="max-w-[8.5rem] text-[15px] font-extrabold leading-[1.15] text-forest">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* desktop: static grid */}
        <div className="hidden gap-y-10 lg:grid lg:grid-cols-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="reveal flex flex-col items-center gap-4 px-2 text-center"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <img
                src={f.icon}
                alt=""
                className="h-[clamp(64px,6.5vw,98px)] w-auto object-contain"
              />
              <span className="mx-auto max-w-[8.5rem] text-[16px] font-extrabold leading-[1.15] text-forest sm:text-[19px]">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

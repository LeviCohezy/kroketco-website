import type { Metadata } from "next";
import { Oswald } from "next/font/google";

// Condensed display face for the poster-style hero headline.
const oswald = Oswald({ weight: ["600"], subsets: ["latin"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "Kroketco — Elke hap een feest",
  description:
    "Ambachtelijke Belgische kroketten. Vers gedraaid, goudbruin gebakken. Schuif aan en proef het verschil.",
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <div className={oswald.variable}>{children}</div>;
}

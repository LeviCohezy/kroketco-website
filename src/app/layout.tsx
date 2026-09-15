import type { Metadata } from "next";
import { Baloo_2, Inter, Oswald } from "next/font/google";
import "./globals.css";
import Nav from "./_ui/Nav";

// Rounded, chunky display face for the Kroketco brand voice.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Condensed display face for the poster-style hero headline.
const oswald = Oswald({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  title: "Kroketco — Elke hap een feest",
  description:
    "Ambachtelijke Belgische kroketten. Vers gedraaid, goudbruin gebakken. Schuif aan en proef het verschil.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${baloo.variable} ${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('theme')==='beige')document.documentElement.setAttribute('data-theme','beige')}catch(e){}",
          }}
        />
        <Nav />
        {children}
      </body>
    </html>
  );
}

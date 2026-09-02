import type { Metadata } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";

// Rounded, chunky display face for the Kroketco brand voice.
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kroketco — Pak het. Dip het. Proef het.",
  description: "Verse Belgische kroketten & puree. Krokant, ambachtelijk en romig — pak het, dip het, proef het.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${baloo.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}

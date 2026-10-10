import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Nav from "./_ui/Nav";
import { ContentProvider } from "./_ui/ContentProvider";
import EditToolbar from "./_ui/edit/EditToolbar";
import { getAllContent, getContent } from "@/lib/content/store";
import { isAuthenticated } from "@/lib/auth";

// Brandbook 2026: two fonts. Inter for running text, Oswald SemiBold for
// titles & hooks (always capitals — see globals.css).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-oswald",
});

// Title + description are editable in /admin (Algemeen → Zoekmachines & tabblad).
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getContent("global.seo");
  return { title: seo.title, description: seo.description };
}

// On a project GitHub Pages deploy the app lives under /kroketco-website. Next
// prefixes its own URLs, but raw <img>/<video>/<a> rendered by client React use
// root-absolute paths. This patch intercepts src/srcset/poster/href set from JS
// and prefixes the base path before load. Only emitted when a base path is set.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const basePathPatch = `(function(){var BP=${JSON.stringify(BASE_PATH)};if(!BP)return;
function n(v){return typeof v==='string'&&v.charAt(0)==='/'&&v.charAt(1)!=='/'&&v.indexOf(BP+'/')!==0&&v!==BP;}
function u(v){return n(v)?BP+v:v;}
function ss(v){return typeof v!=='string'?v:v.split(',').map(function(p){var s=p.trim().split(/\\s+/);s[0]=u(s[0]);return s.join(' ');}).join(', ');}
function pp(o,k,is){try{var d=Object.getOwnPropertyDescriptor(o,k);if(!d||!d.set)return;Object.defineProperty(o,k,{configurable:true,enumerable:d.enumerable,get:function(){return d.get.call(this);},set:function(v){d.set.call(this,is?ss(v):u(v));}});}catch(e){}}
pp(HTMLImageElement.prototype,'src');pp(HTMLImageElement.prototype,'srcset',1);
pp(HTMLSourceElement.prototype,'src');pp(HTMLSourceElement.prototype,'srcset',1);
try{pp(HTMLVideoElement.prototype,'poster');}catch(e){}
var o=Element.prototype.setAttribute;Element.prototype.setAttribute=function(a,v){if(typeof v==='string'){var l=(''+a).toLowerCase();if(l==='src'||l==='poster'||l==='href')v=u(v);else if(l==='srcset')v=ss(v);}return o.call(this,a,v);};
})();`;

// Google Tag Manager container.
const GTM_ID = "GTM-NGMNBVTW";

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const content = await getAllContent();
  const isAdmin = await isAuthenticated();
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${oswald.variable} h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        {/* Google Tag Manager (noscript) — must be the first thing in <body>. */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager — loaded by Next after hydration. */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        {BASE_PATH && <script dangerouslySetInnerHTML={{ __html: basePathPatch }} />}
        <ContentProvider value={content} isAdmin={isAdmin}>
          <Nav />
          {children}
          <EditToolbar />
        </ContentProvider>
      </body>
    </html>
  );
}

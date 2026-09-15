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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${baloo.variable} ${inter.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="min-h-full" suppressHydrationWarning>
        {BASE_PATH && <script dangerouslySetInnerHTML={{ __html: basePathPatch }} />}
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

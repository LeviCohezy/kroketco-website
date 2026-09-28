// Outline (stroke) icons for the admin sidebar. Inline SVG, currentColor.
import type { SVGProps } from "react";

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BlogIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H16l4 4v10.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5z" />
      <path d="M15 4v4h4" />
      <path d="M8 12h7M8 15.5h7" />
    </svg>
  );
}

export function ProductIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5z" />
      <path d="M3.5 8.5 12 13l8.5-4.5" />
      <path d="M12 13v7" />
    </svg>
  );
}

export function PartnersIcon(props: SVGProps<SVGSVGElement>) {
  // Two overlapping "handshake"-adjacent people — a partnership mark.
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M15 14.2c2.5.2 4.5 2.1 4.5 4.8" />
    </svg>
  );
}

export function InboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 13.5 6 6a2 2 0 0 1 1.9-1.4h8.2A2 2 0 0 1 18 6l2 7.5" />
      <path d="M4 13.5h4l1 2h6l1-2h4V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    </svg>
  );
}

export function LogoutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M15 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2" />
      <path d="M18 15l3-3-3-3" />
      <path d="M21 12H10" />
    </svg>
  );
}

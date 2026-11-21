import type { Metadata, Viewport } from "next";
import { Anton, Manrope, Noto_Serif_JP, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/content";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./sections.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import CircleProgress from "@/components/CircleProgress";
import Nav from "@/components/Nav";
import Intro from "@/components/Intro";
import Effects from "@/components/Effects";
import { SITE_URL } from "@/lib/seo";
import { INTRO_BOOT } from "@/lib/intro";

// Headlines: condensed caps.
const display = Anton({ variable: "--ff-display", subsets: ["latin"], weight: "400", display: "swap" });
// Body.
const body = Manrope({ variable: "--ff-body", subsets: ["latin"], display: "swap" });
// Kanji accents only: the browser fetches just the unicode-range slices for the glyphs on the page.
const jp = Noto_Serif_JP({ variable: "--ff-jp", weight: ["400", "700"], display: "swap", preload: false });
// Micro-labels, chips and the timetable.
const mono = JetBrains_Mono({ variable: "--ff-mono", subsets: ["latin"], weight: ["500", "700"], display: "swap" });

const title = `${site.name}, Dehradun | Gym in Jakhan, Rajpur Road`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description: site.metaDescription,
  alternates: { canonical: "/" },
  keywords: [
    "gym in Jakhan Dehradun",
    "gym on Rajpur Road Dehradun",
    "IKIGAI Fitness Club",
    "boxing Dehradun",
    "Ikigai Boxing Club",
    "steam gym Dehradun",
    "women-friendly gym Dehradun",
    "Zumba Dehradun",
    "Bhangra fitness Dehradun",
    "Yoga Dehradun",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.name}, Dehradun | ${site.tagline}`,
    description: site.metaDescription,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "The IKIGAI strength floor with its wall slogan: This place will change you, if you let it." }],
  },
  twitter: { card: "summary_large_image", title: `${site.name}, Dehradun`, description: site.metaDescription, images: ["/og.jpg"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${jp.variable} ${mono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Before first paint: enable reveal styles (JS on) and decide whether the ensō intro plays (lib/intro.ts) */}
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js");${INTRO_BOOT}` }} />
      </head>
      <body className="min-h-full" suppressHydrationWarning>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        {children}
        <Effects />
        <CircleProgress />
        <Intro />
        <Cursor />
      </body>
    </html>
  );
}

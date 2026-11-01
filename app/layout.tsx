import type { Metadata } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";

// Schibsted Grotesk (SIL Open Font License), self-hosted so builds work offline.
const schibsted = localFont({
  src: "./fonts/SchibstedGrotesk-Variable.woff2",
  variable: "--font-schibsted",
  weight: "400 900",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: screen recording without the per-seat bill`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${schibsted.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

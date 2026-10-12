import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import Script from "next/script";

import { preferenceScript } from "@/lib/preference-script";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Likhith Sanathi - Developer Portfolio",
  description:
    "Portfolio for a University College Cork computer science student building software across systems, AI, verification, and quantitative research.",
  openGraph: {
    title: "Likhith Sanathi - Developer Portfolio",
    description:
      "Computer science student portfolio with projects, experience, achievements, and technical skills.",
    type: "website",
    siteName: "Likhith Sanathi Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Likhith Sanathi developer portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Likhith Sanathi - Developer Portfolio",
    description:
      "Computer science student portfolio with projects, experience, achievements, and technical skills.",
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f2ee",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-motion and data-theme may be set by the script below before React
    // hydrates.
    <html
      lang="en"
      className={`${GeistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <Script id="motion-preference" strategy="beforeInteractive">
          {preferenceScript}
        </Script>
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Likhith Sanathi - Developer Portfolio",
  description:
    "Portfolio for a University College Cork computer science student building software across systems, AI, verification, and quantitative research.",
  openGraph: {
    title: "Likhith Sanathi - Developer Portfolio",
    description:
      "Computer science student portfolio with projects, experience, achievements, and technical skills.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}

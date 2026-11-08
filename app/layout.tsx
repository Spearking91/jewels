import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Great_Vibes } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";

export const cormorantGaramond = Cormorant_Garamond({
  weight: "400",
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});
export const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jewels",
  description: "For the love of jewels, discover modern jewellery",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorantGaramond.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-cormorant-garamond text-base-content">
        {children}
        <Footer />

        {/* Vercel Analytics wrapped in Suspense and placed inside body */}
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </body>
    </html>
  );
}

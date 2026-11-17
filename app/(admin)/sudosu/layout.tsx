import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Great_Vibes } from "next/font/google";
import "../../globals.css";

import Sidebar from "@/components/sidebar";

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
  title: "Admin Page ",
  description: "Manage your website with peace",
};

export default function AdminLayout({
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
        <Sidebar>{children}</Sidebar>
      </body>
    </html>
  );
}

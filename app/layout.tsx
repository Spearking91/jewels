import type { Metadata } from "next";
import { Geist, Great_Vibes } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";

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
      className={`${geistSans.variable} ${greatVibes.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}
        <Footer />
      </body>
    </html>
  );
}
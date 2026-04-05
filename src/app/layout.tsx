import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";
import ChatWidget from "@/components/ChatWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Viva Plant Nutrition - Dott.ssa Arianna Ciervo Nutrizionista Vegana",
  description: "Centro specializzato in nutrizione vegana. Consulenze personalizzate, piani alimentari e supporto per uno stile di vita sano, equilibrato e sostenibile.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-[68px]">{children}</main>
        <Footer />
        <CookieBanner />
        <ChatWidget />
      </body>
    </html>
  );
}

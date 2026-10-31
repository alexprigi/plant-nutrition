import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Viva Plant Nutrition - Arianna Ciervo Nutrizionista Vegana",
  description: "Centro specializzato in nutrizione vegana. Consulenze personalizzate, piani alimentari e supporto per uno stile di vita sano, equilibrato e sostenibile.",
};

// La lingua della pagina viene impostata dal middleware di next-intl (solo sulle rotte /{locale}/...).
// Le pagine che il middleware non tocca (admin, anteprime) sono in italiano.
async function getHtmlLang(): Promise<string> {
  const locale = (await headers()).get("x-next-intl-locale");
  return hasLocale(routing.locales, locale) ? locale : "it";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getHtmlLang();

  return (
    <html lang={lang}>
      <body className={`${nunito.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-unbounded",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lastocka-stroy.ru"),
  title: "Ласточка Строй — строительная компания полного цикла",
  description:
    "Строим дома, коммерческие и промышленные объекты под заказ. Проектирование, смета, стройка и сдача под ключ. Гарантия по договору, собственные бригады.",
  keywords: [
    "строительная компания",
    "строительство под ключ",
    "строительство домов",
    "коммерческое строительство",
    "проект под заказ",
  ],
  openGraph: {
    title: "Ласточка Строй — строительство под заказ",
    description:
      "Проекты любой сложности под ключ: от эскиза до сдачи объекта. Собственные бригады, гарантия по договору.",
    locale: "ru_RU",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#162E45",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CurrencyProvider } from "@/lib/CurrencyContext";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SoulsWed — Flawless Moves. Perfect Events.",
  description:
    "Book your Dream Hall in Exciting Destinations, Effortlessly. India's premium wedding marketplace for venues, vendors, and destination weddings.",
  openGraph: {
    title: "SoulsWed — Flawless Moves. Perfect Events.",
    description:
      "Discover 24+ categories — venues, photographers, flights, cruises & more for your dream wedding.",
    siteName: "SoulsWed",
    images: [
      {
        url: "/openGraph/image.png",
        width: 1200,
        height: 630,
        alt: "SoulsWed",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(plusJakarta.variable, "font-sans", geist.variable)}>
      <body className="min-h-screen antialiased">
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}


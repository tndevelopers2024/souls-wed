import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import Preloader from "@/components/shared/Preloader";

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://soulswed.com"),
  title: "SoulsWed — Flawless Moves. Perfect Events.",
  description:
    "Say 'I do' in a dreamy destination! Transforming couples' visions into amazing international wedding celebrations with ease.",
  openGraph: {
    title: "Book your Dream Hall in Exciting Destinations, Effortlessly",
    description:
      "Explore Venues, Anywhere, Anytime",
    siteName: "SoulsWed",
    url: "https://soulswed.com",
    images: [
      {
        url: "/soulswed/sw_share.png",
        width: 1080,
        height: 1080,
        alt: "SoulsWed — Flawless Moves. Perfect Events.",
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
    <html lang="en" className={cn(inter.variable, "font-sans", outfit.variable)}>
      <body className="min-h-screen antialiased overflow-x-hidden w-full">
        <CurrencyProvider>
          <Preloader />
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}


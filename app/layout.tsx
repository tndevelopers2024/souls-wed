import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { CurrencyProvider } from "@/lib/CurrencyContext";
import { ThemeProvider } from "@/lib/ThemeContext";
import Preloader from "@/components/shared/Preloader";

// Runs before paint to set the theme class and avoid a flash of the wrong theme.
const themeInitScript = `(function(){try{var p=window.location.pathname;var isPriv=p.startsWith('/admin')||p.startsWith('/vendor/dashboard');if(!isPriv){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';return;}var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;}catch(e){}})();`;

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
    <html lang="en" className={cn(inter.variable, "font-sans", outfit.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden w-full">
        <ThemeProvider>
          <CurrencyProvider>
            <Preloader />
            {children}
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


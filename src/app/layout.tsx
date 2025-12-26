import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SearchProvider } from "@/context/SearchContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: {
    default: "Rene Guerra | Palm Beach County Single Family Homes",
    template: "%s | Rene Guerra Real Estate",
  },
  description:
    "Find your perfect family home in South Florida with Rene Guerra. Specializing in single family homes and residential properties throughout Palm Beach County.",
  keywords: [
    "South Florida real estate",
    "Palm Beach single family homes",
    "family homes Palm Beach County",
    "Rene Guerra realtor",
    "Florida homes for sale",
    "Palm Beach MLS",
    "South Florida residential properties",
    "Boca Raton homes",
    "West Palm Beach real estate",
    "Jupiter FL homes",
  ],
  authors: [{ name: "Rene Guerra" }],
  creator: "Rene Guerra Real Estate",
  publisher: "Rene Guerra Real Estate",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://reneguerra.com",
    siteName: "Rene Guerra Real Estate",
    title: "Rene Guerra | Palm Beach County Single Family Homes",
    description:
      "Find your perfect family home in South Florida with Rene Guerra. Specializing in single family homes throughout Palm Beach County.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Rene Guerra Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rene Guerra | Palm Beach County Single Family Homes",
    description:
      "Find your perfect family home in South Florida with Rene Guerra.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        <ThemeProvider>
          <LanguageProvider>
            <SearchProvider>
              <Navigation />
              <main>{children}</main>
              <Footer />
            </SearchProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/Toast";
import { BackToTop } from "@/components/ui/BackToTop";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lithiaautos.com"),

  title: {
    default: "Lithia Autos | Premium Exotic & Luxury Cars For Sale",
    template: "%s | Lithia Autos",
  },

  description:
    "Discover premium exotic cars, luxury vehicles & high-performance sports cars for sale at Lithia Autos. Browse our curated collection of supercars, SUVs & sedans. Verified clean titles, competitive pricing & white-glove nationwide delivery.",

  keywords: [
    // Brand Name - consistently searched
    "Lithia Autos",
    "Lithia Autos dealership",
    "Lithia Autos exotic cars",
    "Lithia Autos luxury cars",
    
    // High-Volume General - stable consistent volume
    "exotic cars for sale",
    "luxury car dealership",
    "used exotic cars for sale",
    "buy luxury cars online",
    "premium sports cars for sale",
    "high performance vehicles",
    "used luxury SUVs for sale",
    "sports cars for sale near me",
    "luxury car dealership near me",
    "used cars for sale near me",
    "cars for sale near me",
    "car dealership near me",
    
    // Brand-specific - very stable high volume
    "Lamborghini for sale",
    "Ferrari for sale",
    "Porsche for sale",
    "McLaren for sale",
    "Bentley for sale",
    "Rolls Royce for sale",
    "Aston Martin for sale",
    "BMW luxury cars",
    "Mercedes Benz for sale",
    "Audi luxury vehicles",
    "Range Rover for sale",
    "Masersati for sale",
    "Lexus car dealership",
    "Tesla car dealership",
    
    // Transactional - strong intent
    "buy exotic car",
    "purchase luxury car",
    "used car dealer",
    "pre-owned luxury cars",
    "certified pre-owned exotic cars",
    
    // Vehicle Type
    "luxury SUV for sale",
    "sports coupe for sale",
    "convertible for sale",
    "luxury sedan for sale",
    
    // Service/Feature
    "white glove car delivery",
    "nationwide luxury car delivery",
    "exotic car financing",
    "luxury car financing"
  ],

  authors: [{ name: "Lithia Autos" }],
  creator: "Lithia Autos",
  publisher: "Lithia Autos",

  openGraph: {
    type: "website",
    url: "https://lithiaautos.com",
    siteName: "Lithia Autos",
    title: "Lithia Autos | Premium Exotic & Luxury Cars For Sale",
    description:
      "Shop our curated selection of exotic supercars, luxury SUVs and high-performance vehicles. Verified clean titles, competitive pricing & white-glove delivery across the USA.",
    images: [
      {
        url: "https://lithiaautos.com/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Lithia Autos - Premium Exotic & Luxury Cars",
      },
    ],
    locale: "en_US",
  },

  other: {
    "fb:app_id": ["123456789"]
  },

  twitter: {
    card: "summary_large_image",
    title: "Lithia Autos | Exotic & Luxury Cars For Sale",
    description:
      "Discover premium exotic cars & luxury vehicles at Lithia Autos. Verified clean titles, competitive pricing, nationwide delivery.",
    images: ["https://lithiaautos.com/thumbnail.png"],
    site: "@lithiaautos",
    creator: "@lithiaautos",
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

  alternates: {
    canonical: "https://lithiaautos.com",
    languages: {
      en: "https://lithiaautos.com",
    },
  },
};

import { CartProvider } from "@/context/CartContext";
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased text-navy-900 bg-light-100 min-h-screen flex flex-col`}>
        <CartProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <BackToTop />
          </ToastProvider>
        </CartProvider>

        <CookieConsent />

        {/* Smartsupp Live Chat */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '68994566b65e974b51ab7e4d789412964959c3b8';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `
          }}
        />
        <noscript>Powered by <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">Smartsupp</a></noscript>
      </body>
    </html>
  );
}

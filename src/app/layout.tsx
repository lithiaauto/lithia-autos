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
    default: "Lithia Autos | Exotic, Luxury & Performance Cars Nationwide",
    template: "%s | Lithia Autos",
  },

  description:
    "Lithia Autos is your premium destination for exotic, luxury, and high-performance vehicles nationwide. Explore our curated selection of supercars, sports cars, luxury SUVs, and rare performance models with competitive pricing, verified clean titles, and white-glove driveway delivery.",

  keywords: [
    "Exotic cars for sale",
    "Buy luxury cars online",
    "Luxury car dealership nationwide",
    "Performance cars for sale",
    "Supercars online dealer",
    "Premium sports cars",
    "High performance vehicles",
    "Used exotic cars",
    "Pre-owned luxury SUVs",
    "Lithia Autos",
    "White-glove car delivery",
    "Exotic auto sales"
  ],

  authors: [{ name: "Lithia Autos" }],
  creator: "Lithia Autos",
  publisher: "Lithia Autos",

  openGraph: {
    type: "website",
    url: "https://lithiaautos.com",
    siteName: "Lithia Autos",
    title: "Exotic, Luxury & Performance Cars | Lithia Autos",
    description:
      "Discover verified exotic and luxury vehicles at Lithia Autos. Supercars, sports cars, and premium performance models available now with nationwide delivery.",
    images: [
      {
        url: "https://lithiaautos.com/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Lithia Autos Exotic & Performance Cars",
      },
    ],
  },

  // Optional but recommended by Facebook for better debugging
  // You can replace "123456789" with a real App ID later if needed from developers.facebook.com
  other: {
    "fb:app_id": "123456789"
  },

  twitter: {
    card: "summary_large_image",
    title: "Exotic & Luxury Cars | Lithia Autos",
    description:
      "Shop high-performance and luxury vehicles at Lithia Autos. Clean titles. Premium selection. Nationwide driveway delivery.",
    images: ["https://lithiaautos.com/thumbnail.png"],
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
  },
};

import { CartProvider } from "@/context/CartContext";

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

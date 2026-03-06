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
    default: "Lithia Autos | Exotic, Luxury & Performance Cars in [City, State]",
    template: "%s | Lithia Autos",
  },

  description:
    "Lithia Autos is your destination for exotic, luxury, and high-performance vehicles in [City, State]. Explore supercars, sports cars, premium SUVs, and rare performance models with competitive pricing and verified clean titles.",

  keywords: [
    "Exotic cars in [City, State]",
    "Luxury car dealership",
    "Performance cars for sale",
    "Supercars",
    "Sports cars",
    "Premium vehicles",
    "High performance vehicles",
    "Used exotic cars",
    "Luxury SUVs",
    "Lithia Autos"
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
      "Discover verified exotic and luxury vehicles at Lithia Autos. Supercars, sports cars, and premium performance models available now in [City, State].",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Lithia Autos Exotic & Performance Cars",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Exotic & Luxury Cars | Lithia Autos",
    description:
      "Shop high-performance and luxury vehicles at Lithia Autos in [City, State]. Clean titles. Premium selection.",
    images: ["/thumbnail.png"],
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

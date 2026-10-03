import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://patliputraresidences.com"),
  title: "Patliputra Residences | Premium Luxury Living in Patna",
  description:
    "Discover Patliputra Residences — Patna's most prestigious luxury residential project. Premium 2, 3 & 4 BHK apartments with world-class amenities, landscaped gardens, and modern architecture. Book your dream home today.",
  keywords: [
    "Patliputra Residences",
    "luxury apartments Patna",
    "premium residential project",
    "2 BHK Patna",
    "3 BHK Patna",
    "4 BHK Patna",
    "real estate Patna",
    "luxury living Patna",
    "gated community Patna",
    "Patliputra housing",
  ],
  authors: [{ name: "Patliputra Residences" }],
  creator: "Patliputra Residences",
  publisher: "Patliputra Residences",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://patliputraresidences.com",
    siteName: "Patliputra Residences",
    title: "Patliputra Residences | Premium Luxury Living in Patna",
    description:
      "Patna's most prestigious luxury residential project. Premium apartments with world-class amenities.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Patliputra Residences - Luxury Living",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patliputra Residences | Premium Luxury Living in Patna",
    description:
      "Discover Patna's most prestigious luxury residential project with world-class amenities.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "https://patliputraresidences.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Patliputra Residences",
    description:
      "Premium luxury residential apartments in Patna with world-class amenities",
    url: "https://patliputraresidences.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Patliputra Colony",
      addressLocality: "Patna",
      addressRegion: "Bihar",
      postalCode: "800013",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "25.6120",
      longitude: "85.1580",
    },
    telephone: "+91-9876543210",
    priceRange: "₹₹₹",
    image: "/og-image.jpg",
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

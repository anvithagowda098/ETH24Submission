import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;
const imageUrl = `${baseUrl}/thumbnail.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "EventChain - Web3 Event Management Platform",
    template: "%s | EventChain",
  },
  description:
    "Next-generation Web3 event management platform with zero-knowledge privacy. Create, sell, and verify tickets with blockchain security and fraud-proof technology.",
  openGraph: {
    title: {
      default: "EventChain - Web3 Event Management Platform",
      template: "%s | EventChain",
    },
    description:
      "Next-generation Web3 event management platform with zero-knowledge privacy. Create, sell, and verify tickets with blockchain security and fraud-proof technology.",
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: "EventChain - Web3 Event Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "EventChain - Web3 Event Management Platform",
      template: "%s | EventChain",
    },
    description:
      "Next-generation Web3 event management platform with zero-knowledge privacy. Create, sell, and verify tickets with blockchain security and fraud-proof technology.",
    images: [imageUrl],
    creator: "@EventChainXYZ",
  },
  icons: {
    icon: "/favicon.ico",
  },
  keywords: [
    "web3",
    "blockchain",
    "events",
    "tickets",
    "nft",
    "zero-knowledge",
    "privacy",
    "ethereum",
    "polygon",
    "defi",
    "dao",
    "ticketing",
    "event management",
    "smart contracts",
  ],
  authors: [{ name: "EventChain Team" }],
  creator: "EventChain",
  publisher: "EventChain",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#1f2937" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased bg-base-100">
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
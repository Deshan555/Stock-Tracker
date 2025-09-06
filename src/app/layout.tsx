import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FinTech Manager",
    template: "%s | FinTech Manager",
  },
  description: "FinTech Manager is a modern inventory and capital management system for clothing stores, with advanced analytics and fintech features.",
  keywords: [
    "fintech",
    "inventory",
    "capital management",
    "clothing store",
    "stock tracker",
    "analytics",
    "Next.js",
    "MongoDB",
    "Ant Design"
  ],
  openGraph: {
    title: "FinTech Manager",
    description: "Modern inventory and capital management for clothing stores.",
    url: "https://fintech-manager.example.com/",
    siteName: "FinTech Manager",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FinTech Manager Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FinTech Manager",
    description: "Modern inventory and capital management for clothing stores.",
    images: ["/og-image.png"]
  },
  themeColor: "#a259ec",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  alternates: {
    canonical: "/"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sheltr-ai.web.app'),
  title: "SHELTR-AI | Hacking Homelessness Through Technology",
  description: "Revolutionary charitable giving through QR-code donations, blockchain transparency, and AI-driven insights. 80% direct support, 15% housing fund, 5% operations.",
  keywords: ["homelessness", "charity", "blockchain", "AI", "donations", "QR code", "social impact", "housing"],
  authors: [{ name: "SHELTR-AI Technologies Inc." }],
  creator: "SHELTR-AI Technologies Inc.",
  publisher: "SHELTR-AI Technologies Inc.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sheltr-ai.web.app",
    siteName: "SHELTR-AI",
    title: "SHELTR-AI | Hacking Homelessness Through Technology",
    description: "Revolutionary charitable giving through QR-code donations, blockchain transparency, and AI-driven insights. 80% direct support, 15% housing fund, 5% operations.",
    images: [
      {
        url: "https://sheltr-ai.web.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SHELTR-AI - Hacking Homelessness Through Technology",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SHELTR_AI",
    creator: "@SHELTR_AI",
    title: "SHELTR-AI | Hacking Homelessness Through Technology",
    description: "Revolutionary charitable giving through QR-code donations, blockchain transparency, and AI-driven insights.",
    images: ["https://sheltr-ai.web.app/og-image.jpg"],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { MockWalletProvider } from '@/components/blockchain/MockWalletProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  fallback: ['ui-monospace', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'monospace']
})

export const metadata: Metadata = {
  title: 'SHELTR',
  description: 'Blockchain-powered platform for direct participant empowerment',
  keywords: ['homelessness', 'blockchain', 'AI', 'technology', 'social impact', 'donations', 'shelter management'],
  authors: [{ name: 'SHELTR Team' }],
  creator: 'SHELTR',
  publisher: 'SHELTR',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'SHELTR',
    description: 'Blockchain-powered platform for direct participant empowerment',
    url: 'https://sheltr-ai.web.app',
    siteName: 'SHELTR',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHELTR',
    description: 'Blockchain-powered platform for direct participant empowerment',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <MockWalletProvider>
              {children}
            </MockWalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

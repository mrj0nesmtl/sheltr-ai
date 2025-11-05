import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { MockWalletProvider } from '@/components/blockchain/MockWalletProvider'
import ConsoleFilter from '@/components/ConsoleFilter'
import { Toaster } from 'sonner'

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
  metadataBase: new URL('https://sheltr-ai.web.app'),
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
        url: '/images/sheltr_units/sheltr-fab.jpeg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Manufacturing Facility - Micro-housing units and bicycles in production',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHELTR',
    description: 'Blockchain-powered platform for direct participant empowerment',
    images: ['/images/sheltr_units/sheltr-fab.jpeg'],
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
              <ConsoleFilter />
              {children}
              <Toaster 
                position="top-right" 
                expand={true}
                richColors
                closeButton
              />
            </MockWalletProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

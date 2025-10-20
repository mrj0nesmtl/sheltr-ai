import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scan & Give - Direct QR Code Donations | SHELTR',
  description: 'Experience the future of direct giving. Scan a QR code and instantly support individuals experiencing homelessness. Watch your donation make an immediate impact with full transparency and blockchain verification.',
  keywords: [
    'QR code donations',
    'direct giving',
    'SHELTR donations',
    'scan and give',
    'instant donations',
    'blockchain donations',
    'transparent giving',
    'homeless support',
    'mobile donations',
    'contactless giving',
    'digital donations',
    'direct impact'
  ],
  authors: [{ name: 'SHELTR Team' }],
  creator: 'SHELTR',
  publisher: 'SHELTR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Scan & Give - Direct QR Code Donations | SHELTR',
    description: 'Scan a QR code and instantly support individuals experiencing homelessness. Watch your donation make an immediate impact with full transparency.',
    url: 'https://sheltr-ai.web.app/scan-give',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-scan-give.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Scan & Give - QR Code Direct Donations',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scan & Give - Direct QR Code Donations',
    description: 'Scan a QR code and instantly support individuals experiencing homelessness with full transparency.',
    images: ['/images/og-scan-give.jpg'],
    creator: '@sheltr_ai',
    site: '@sheltr_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'Donations',
  classification: 'Direct Giving, Blockchain Donations, Social Impact',
};

export default function ScanGiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


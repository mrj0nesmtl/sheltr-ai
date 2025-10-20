import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate - Make a Direct Impact | SHELTR',
  description: 'Your donation goes directly to those who need it most. Choose to support specific individuals or contribute to the community fund. 100% transparent, blockchain-verified, and fully trackable.',
  keywords: [
    'donate to SHELTR',
    'homeless donations',
    'direct donations',
    'blockchain donations',
    'transparent giving',
    'donate now',
    'support homeless',
    'charitable donations',
    'direct impact',
    'donation platform',
    'give directly',
    'homeless support'
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
    title: 'Donate - Make a Direct Impact | SHELTR',
    description: 'Your donation goes directly to those who need it most. 100% transparent, blockchain-verified, and fully trackable.',
    url: 'https://sheltr-ai.web.app/donate',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-donate.jpg',
        width: 1200,
        height: 630,
        alt: 'Donate to SHELTR - Make a Direct Impact',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donate - Make a Direct Impact',
    description: 'Your donation goes directly to those who need it most. 100% transparent and trackable.',
    images: ['/images/og-donate.jpg'],
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
  classification: 'Donations, Direct Giving, Social Impact',
};

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


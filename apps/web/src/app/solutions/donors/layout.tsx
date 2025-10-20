import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Donors - Direct Impact Giving | SHELTR',
  description: 'Make a direct impact with 100% transparency. Track your donations in real-time, see exactly how your contribution helps, and connect directly with participants. No middlemen, just pure impact.',
  keywords: [
    'SHELTR donors',
    'direct giving',
    'transparent donations',
    'donor platform',
    'track donations',
    'blockchain donations',
    'impact giving',
    'donor dashboard',
    'charitable giving',
    'direct impact',
    'donation transparency',
    'donor solutions'
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
    title: 'For Donors - Direct Impact Giving | SHELTR',
    description: 'Make a direct impact with 100% transparency. Track your donations in real-time and see exactly how your contribution helps.',
    url: 'https://sheltr-ai.web.app/solutions/donors',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-donors.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR for Donors - Direct Impact Giving',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Donors - Direct Impact Giving',
    description: 'Make a direct impact with 100% transparency. Track your donations in real-time.',
    images: ['/images/og-donors.jpg'],
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
  category: 'Donors',
  classification: 'Direct Giving, Donations, Social Impact',
};

export default function DonorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impact Stories - Real Change, Real People | SHELTR',
  description: 'Discover the transformative impact of SHELTR. Read real stories of individuals finding stability, dignity, and hope through our platform. See the difference direct support makes.',
  keywords: [
    'SHELTR impact',
    'impact stories',
    'success stories',
    'homeless success',
    'participant stories',
    'real impact',
    'transformation stories',
    'SHELTR results',
    'social impact',
    'community impact',
    'life changes',
    'participant testimonials'
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
    title: 'Impact Stories - Real Change, Real People | SHELTR',
    description: 'Discover the transformative impact of SHELTR. Read real stories of individuals finding stability, dignity, and hope.',
    url: 'https://sheltr-ai.web.app/impact',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-impact.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Impact Stories - Real Change, Real People',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impact Stories - Real Change',
    description: 'Discover the transformative impact of SHELTR. Real stories of stability, dignity, and hope.',
    images: ['/images/og-impact.jpg'],
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
  category: 'Impact',
  classification: 'Impact Stories, Social Impact, Success Stories',
};

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


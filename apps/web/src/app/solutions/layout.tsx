import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions - SHELTR Platform for Everyone',
  description: 'Discover how SHELTR serves donors, participants, and organizations. Our comprehensive platform provides tailored solutions for direct giving, participant empowerment, and shelter management.',
  keywords: [
    'SHELTR solutions',
    'donor solutions',
    'participant solutions',
    'organization solutions',
    'shelter management',
    'direct giving platform',
    'homeless solutions',
    'social impact platform',
    'donation platform',
    'participant empowerment'
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
    title: 'Solutions - SHELTR Platform for Everyone',
    description: 'Comprehensive platform serving donors, participants, and organizations with tailored solutions for direct giving and empowerment.',
    url: 'https://sheltr-ai.web.app/solutions',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-solutions.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Solutions - Platform for Everyone',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solutions - SHELTR Platform',
    description: 'Comprehensive platform serving donors, participants, and organizations.',
    images: ['/images/og-solutions.jpg'],
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
  category: 'Solutions',
  classification: 'Platform Solutions, Social Impact, Technology',
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


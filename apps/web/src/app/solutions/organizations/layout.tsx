import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Organizations - Shelter Management Platform | SHELTR',
  description: 'Comprehensive shelter management platform with real-time analytics, participant tracking, resource allocation, and seamless integration with existing systems. Streamline operations and maximize impact.',
  keywords: [
    'shelter management',
    'SHELTR organizations',
    'shelter software',
    'participant tracking',
    'resource management',
    'shelter analytics',
    'HMIS integration',
    'shelter operations',
    'organization solutions',
    'shelter platform',
    'homeless services management',
    'shelter administration'
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
    title: 'For Organizations - Shelter Management Platform | SHELTR',
    description: 'Comprehensive shelter management with real-time analytics, participant tracking, and resource allocation. Streamline operations and maximize impact.',
    url: 'https://sheltr-ai.web.app/solutions/organizations',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-organizations.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR for Organizations - Shelter Management Platform',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Organizations - Shelter Management',
    description: 'Comprehensive shelter management with real-time analytics and participant tracking.',
    images: ['/images/og-organizations.jpg'],
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
  category: 'Organizations',
  classification: 'Shelter Management, Software, Operations',
};

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


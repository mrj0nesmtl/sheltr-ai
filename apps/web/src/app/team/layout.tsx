import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Team - SHELTR Leadership & Experts',
  description: 'Meet the passionate team behind SHELTR. Our diverse group of technologists, social workers, designers, and advocates working together to revolutionize housing solutions and end homelessness.',
  keywords: [
    'SHELTR team',
    'leadership team',
    'social impact team',
    'homeless solutions experts',
    'technology team',
    'social workers',
    'housing advocates',
    'SHELTR founders',
    'team members',
    'about our team'
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
    title: 'Our Team - SHELTR Leadership & Experts',
    description: 'Meet the passionate team behind SHELTR. Technologists, social workers, designers, and advocates revolutionizing housing solutions.',
    url: 'https://sheltr-ai.web.app/team',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-team.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Team - Leadership and Experts',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Team - SHELTR Leadership',
    description: 'Meet the passionate team behind SHELTR. Revolutionizing housing solutions together.',
    images: ['/images/og-team.jpg'],
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
  category: 'Team',
  classification: 'Team, Leadership, Company Information',
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


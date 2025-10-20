import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Participants - Empowerment & Dignity | SHELTR',
  description: 'Access secure housing (PODS), electric transportation (MOBI), emergency supplies, and direct support. Manage your journey with dignity, privacy, and full control through your personal dashboard.',
  keywords: [
    'SHELTR participants',
    'participant empowerment',
    'homeless services',
    'participant dashboard',
    'SHELTR PODS',
    'MOBI bikes',
    'emergency supplies',
    'dignified housing',
    'participant support',
    'housing services',
    'participant solutions',
    'direct support'
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
    title: 'For Participants - Empowerment & Dignity | SHELTR',
    description: 'Access secure housing, electric transportation, emergency supplies, and direct support. Manage your journey with dignity and full control.',
    url: 'https://sheltr-ai.web.app/solutions/participants',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-participants.jpg',
        width: 1200,
        height: 630,
        alt: 'SHELTR for Participants - Empowerment & Dignity',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'For Participants - Empowerment & Dignity',
    description: 'Access secure housing, transportation, and support. Manage your journey with dignity.',
    images: ['/images/og-participants.jpg'],
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
  category: 'Participants',
  classification: 'Participant Services, Housing, Empowerment',
};

export default function ParticipantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


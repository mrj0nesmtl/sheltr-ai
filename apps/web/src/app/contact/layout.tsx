import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get in Touch | SHELTR',
  description: 'Have questions about SHELTR? Want to partner with us? Need support? Reach out to our team. We\'re here to help donors, participants, organizations, and anyone interested in ending homelessness.',
  keywords: [
    'contact SHELTR',
    'SHELTR support',
    'get in touch',
    'SHELTR team',
    'partnership inquiries',
    'donor support',
    'participant support',
    'organization support',
    'contact form',
    'SHELTR contact',
    'reach out',
    'help center'
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
    title: 'Contact Us - Get in Touch | SHELTR',
    description: 'Have questions about SHELTR? Want to partner with us? Reach out to our team. We\'re here to help.',
    url: 'https://sheltr-ai.web.app/contact',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact SHELTR - Get in Touch',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get in Touch',
    description: 'Have questions about SHELTR? Want to partner with us? Reach out to our team.',
    images: ['/images/og-contact.jpg'],
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
  category: 'Contact',
  classification: 'Contact, Support, Communication',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


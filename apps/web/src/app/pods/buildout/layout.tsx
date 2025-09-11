import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SHELTR Pods Buildout - Complete Technical Specifications',
  description: 'Comprehensive technical buildout guide for SHELTR pods including solar systems, electrical, plumbing, security, furniture, and mobility features. Complete specifications for Model A and Model B units.',
  keywords: [
    'SHELTR pod buildout',
    'technical specifications',
    'solar panel system',
    'battery storage',
    'air conditioning',
    'electrical outlets',
    'pod furniture',
    'bike hitch',
    'QR code system',
    'security features',
    'micro-housing construction'
  ],
  openGraph: {
    title: 'SHELTR Pods Buildout - Complete Technical Guide',
    description: 'Detailed technical specifications and buildout information for SHELTR mobile micro-housing units.',
    url: 'https://sheltr-ai.web.app/pods/buildout',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/sheltr_units/sleeper-2.jpeg',
        width: 1200,
        height: 630,
        alt: 'SHELTR POD Technical Buildout',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHELTR Pods Buildout - Technical Specifications',
    description: 'Complete technical buildout guide for SHELTR mobile micro-housing units.',
    images: ['/images/sheltr_units/sleeper-2.jpeg'],
  },
};

export default function BuildoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

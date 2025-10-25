import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/docs');

  return {
    title: 'Documentation Hub - SHELTR Platform Guides & Resources',
    description: 'Comprehensive documentation for SHELTR\'s blockchain-powered platform. Access technical guides, API references, user manuals, and implementation resources for developers, donors, and organizations.',
    keywords: [
      'SHELTR documentation',
      'platform guides',
      'API documentation',
      'technical resources',
      'developer guides',
      'user manuals',
      'implementation guides',
      'SHELTR API',
      'blockchain documentation',
      'integration guides',
      'system architecture',
      'payment rails',
      'tokenomics guide'
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
      title: 'Documentation Hub - SHELTR Platform Guides & Resources',
      description: 'Comprehensive documentation for SHELTR\'s blockchain platform. Technical guides, API references, and implementation resources.',
      url: 'https://sheltr-ai.web.app/docs',
      siteName: 'SHELTR',
      images: [
        {
          url: heroImage.url,
          width: heroImage.width,
          height: heroImage.height,
          alt: heroImage.alt,
        }
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SHELTR Documentation Hub',
      description: 'Comprehensive platform guides, API references, and technical resources for developers and organizations.',
      images: [heroImage.url],
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
    category: 'Documentation',
    classification: 'Technical Documentation, Developer Resources, Platform Guides',
  };
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


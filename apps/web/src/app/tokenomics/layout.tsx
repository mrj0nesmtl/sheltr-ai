import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/tokenomics');

  return {
    title: 'SHELTR SmartFund™ - Enterprise Tokenomics & Payment Architecture',
    description: 'Discover SHELTR\'s revolutionary single-token stable fund model combining Adyen payment processing, Coinbase institutional staking, and blockchain transparency for zero-risk participant protection with guaranteed 4-6% APY returns.',
    keywords: [
      'SHELTR tokenomics',
      'SmartFund model',
      'stablecoin architecture',
      'payment rails',
      'Adyen integration',
      'Coinbase staking',
      'blockchain payments',
      'virtual debit cards',
      'housing fund',
      'enterprise payments',
      'guaranteed returns',
      'zero risk model',
      'institutional staking',
      'Base network'
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
      title: 'SHELTR SmartFund™ - Enterprise Tokenomics & Payment Architecture',
      description: 'Revolutionary single-token stable fund model with Adyen payment processing, Coinbase institutional staking, and guaranteed 4-6% APY returns.',
      url: 'https://sheltr-ai.web.app/tokenomics',
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
      title: 'SHELTR SmartFund™ - Enterprise Tokenomics',
      description: 'Single-token stable fund model with Adyen payments, Coinbase staking, and guaranteed returns. Zero participant risk.',
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
    category: 'Tokenomics',
    classification: 'Financial Architecture, Payment Systems, Blockchain Technology',
  };
}

export default function TokenomicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


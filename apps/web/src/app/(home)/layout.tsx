import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/');

  return {
    title: 'SHELTR - Dignified Housing Solutions for Everyone',
    description: 'Revolutionary blockchain-powered platform providing secure, mobile micro-housing (PODS), electric transportation (MOBI), and emergency supply delivery (Drones). Empowering individuals experiencing homelessness with dignity, mobility, and direct support.',
    keywords: [
      'SHELTR',
      'homeless solutions',
      'micro-housing',
      'SHELTR PODS',
      'blockchain donations',
      'direct giving',
      'emergency housing',
      'mobile shelter',
      'social impact',
      'homelessness technology',
      'dignified housing',
      'MOBI bikes',
      'drone delivery'
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
      title: 'SHELTR - Dignified Housing Solutions for Everyone',
      description: 'Revolutionary platform providing secure micro-housing (PODS), electric transportation (MOBI), and emergency supply delivery. Empowering individuals with dignity and direct support.',
      url: 'https://sheltr-ai.web.app',
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
      title: 'SHELTR - Dignified Housing Solutions',
      description: 'Revolutionary platform providing secure micro-housing, electric transportation, and emergency supply delivery.',
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
    verification: {
      google: 'google72e9d04baf3e14bf',
    },
    category: 'Social Impact',
    classification: 'Housing Technology, Social Impact, Humanitarian Aid',
  };
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


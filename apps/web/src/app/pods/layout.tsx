import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/pods');

  return {
    title: 'SHELTR Pods - Secure, Mobile, Functional Micro-Housing',
    description: 'Revolutionary mobile micro-housing units designed for dignity, mobility, and sustainability. Winter-rated pods with solar power, smart security, and complete living amenities. Engineered for Canadian winters and rated for -25°C.',
    keywords: [
      'SHELTR pods',
      'micro-housing',
      'mobile housing',
      'homeless shelter',
      'winter housing',
      'solar powered housing',
      'smart security',
      'biometric locks',
      'sustainable housing',
      'emergency shelter',
      'portable housing',
      'dignified housing'
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
      title: 'SHELTR Pods - Revolutionary Mobile Micro-Housing',
      description: 'Secure, mobile, and functional housing pods with winter rating, solar power, and smart security. Designed for dignity and sustainability.',
      url: 'https://sheltr-ai.web.app/pods',
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
      title: 'SHELTR Pods - Secure, Mobile, Functional',
      description: 'Revolutionary mobile micro-housing units with winter rating, solar power, and smart security systems.',
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
    category: 'technology',
    classification: 'Housing Technology, Social Impact, Sustainable Living',
    other: {
      'theme-color': '#000000',
      'color-scheme': 'dark light',
    },
  };
}

export default function PodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

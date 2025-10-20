import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/drones');

  return {
    title: 'Emergency Supply Drones - SHELTR',
    description: 'Rapid drone delivery of essential supplies directly to SHELTR PODS using GPS precision. Donors can fund emergency packages that reach participants within minutes.',
    keywords: [
      'drone delivery',
      'emergency supplies',
      'SHELTR drones',
      'GPS delivery',
      'humanitarian drones',
      'emergency response',
      'supply delivery',
      'POD delivery',
      'drone technology',
      'emergency aid'
    ],
    openGraph: {
      title: 'Emergency Supply Drones - SHELTR',
      description: 'Rapid drone delivery of essential supplies directly to SHELTR PODS. Fund emergency packages that reach participants within minutes.',
      url: 'https://sheltr-ai.web.app/drones',
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
      title: 'Emergency Supply Drones - SHELTR',
      description: 'Rapid drone delivery of essential supplies directly to SHELTR PODS using GPS precision.',
      images: [heroImage.url],
    },
  };
}

export default function DronesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

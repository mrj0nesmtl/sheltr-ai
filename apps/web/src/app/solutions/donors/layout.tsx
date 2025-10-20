import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/solutions/donors');

  return {
    title: 'SHELTR for Donors - Transparent & Direct Impact',
    description: 'Learn how SHELTR empowers donors with blockchain transparency, direct giving options, and real-time impact tracking to support individuals experiencing homelessness.',
    keywords: [
      'SHELTR donors',
      'transparent donations',
      'direct giving',
      'blockchain donations',
      'impact tracking',
      'homeless charity',
      'donor empowerment'
    ],
    openGraph: {
      title: 'SHELTR for Donors - See Your Impact Directly',
      description: 'Experience transparent and direct giving with SHELTR. Fund secure housing and essential services, tracking your impact in real-time.',
      url: 'https://sheltr-ai.web.app/solutions/donors',
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
      title: 'SHELTR for Donors - Transparent & Direct Impact',
      description: 'Fund secure housing and essential services, tracking your impact in real-time with blockchain transparency.',
      images: [heroImage.url],
    },
  };
}

export default function DonorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

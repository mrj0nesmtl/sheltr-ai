import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/donate');

  return {
    title: 'Donate to SHELTR - Empowering Direct Impact',
    description: 'Support SHELTR\'s mission to provide secure housing and essential services to individuals experiencing homelessness. Your donation makes a direct, transparent impact.',
    keywords: [
      'donate to SHELTR',
      'homeless charity',
      'support homelessness',
      'direct impact donation',
      'secure housing charity',
      'blockchain donations',
      'social good'
    ],
    openGraph: {
      title: 'Donate to SHELTR - Make a Direct, Transparent Impact',
      description: 'Join SHELTR in empowering individuals experiencing homelessness with secure housing and vital resources. Your contribution drives real change.',
      url: 'https://sheltr-ai.web.app/donate',
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
      title: 'Donate to SHELTR - Empowering Direct Impact',
      description: 'Support SHELTR\'s mission to provide secure housing and essential services to individuals experiencing homelessness.',
      images: [heroImage.url],
    },
  };
}

export default function DonateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/impact');

  return {
    title: 'SHELTR Impact - Stories of Transformation',
    description: 'Read inspiring stories of how SHELTR is making a real difference in the lives of individuals and communities affected by homelessness.',
    keywords: [
      'SHELTR impact',
      'homeless success stories',
      'transformation stories',
      'community impact',
      'social change',
      'real difference',
      'SHELTR testimonials'
    ],
    openGraph: {
      title: 'SHELTR Impact - Real Stories, Real Change',
      description: 'Explore the profound impact SHELTR is having on individuals and communities, fostering hope and creating lasting change.',
      url: 'https://sheltr-ai.web.app/impact',
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
      title: 'SHELTR Impact - Stories of Transformation',
      description: 'Read inspiring stories of how SHELTR is making a real difference in the lives of individuals and communities.',
      images: [heroImage.url],
    },
  };
}

export default function ImpactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

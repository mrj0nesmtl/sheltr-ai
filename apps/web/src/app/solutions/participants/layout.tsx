import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/solutions/participants');

  return {
    title: 'SHELTR for Participants - Dignity & Empowerment',
    description: 'Discover how SHELTR provides secure housing, essential resources, and personalized support to empower individuals experiencing homelessness on their journey to stability.',
    keywords: [
      'SHELTR participants',
      'homeless empowerment',
      'secure housing',
      'essential resources',
      'personalized support',
      'journey to stability',
      'dignified living'
    ],
    openGraph: {
      title: 'SHELTR for Participants - Your Path to Stability',
      description: 'Access secure housing, vital resources, and personalized support designed to empower you on your journey out of homelessness.',
      url: 'https://sheltr-ai.web.app/solutions/participants',
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
      title: 'SHELTR for Participants - Dignity & Empowerment',
      description: 'Secure housing, essential resources, and personalized support for individuals experiencing homelessness.',
      images: [heroImage.url],
    },
  };
}

export default function ParticipantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

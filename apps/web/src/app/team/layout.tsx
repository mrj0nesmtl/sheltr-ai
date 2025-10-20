import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/team');

  return {
    title: 'Our Team - SHELTR Leadership & Experts',
    description: 'Meet the passionate team behind SHELTR. Our diverse group of technologists, social workers, designers, and advocates working together to revolutionize housing solutions and end homelessness.',
    keywords: [
      'SHELTR team',
      'leadership team',
      'social impact team',
      'homeless solutions experts',
      'technology team',
      'social workers',
      'housing advocates',
      'SHELTR founders',
      'team members',
      'about our team'
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
      title: 'Our Team - SHELTR Leadership & Experts',
      description: 'Meet the passionate team behind SHELTR. Technologists, social workers, designers, and advocates revolutionizing housing solutions.',
      url: 'https://sheltr-ai.web.app/team',
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
      title: 'Our Team - SHELTR Leadership',
      description: 'Meet the passionate team behind SHELTR. Revolutionizing housing solutions together.',
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
    category: 'Team',
    classification: 'Team, Leadership, Company Information',
  };
}

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

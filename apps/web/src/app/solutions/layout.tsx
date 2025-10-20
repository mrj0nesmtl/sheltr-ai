import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/solutions');

  return {
    title: 'SHELTR Solutions - Empowering Every Stakeholder',
    description: 'Explore SHELTR\'s comprehensive solutions designed for donors, participants, and organizations to create a lasting impact on homelessness.',
    keywords: [
      'SHELTR solutions',
      'homelessness solutions',
      'donor solutions',
      'participant empowerment',
      'organization tools',
      'social impact platform',
      'integrated solutions'
    ],
    openGraph: {
      title: 'SHELTR Solutions - Impact for Donors, Participants & Organizations',
      description: 'Discover SHELTR\'s tailored solutions to empower every stakeholder in the fight against homelessness.',
      url: 'https://sheltr-ai.web.app/solutions',
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
      title: 'SHELTR Solutions - Empowering All Stakeholders',
      description: 'Comprehensive solutions for donors, participants, and organizations to make a real impact.',
      images: [heroImage.url],
    },
  };
}

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

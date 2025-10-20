import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/solutions/organizations');

  return {
    title: 'SHELTR for Organizations - Streamlined Shelter Management',
    description: 'Optimize your operations with SHELTR\'s platform for shelter management, resource allocation, participant tracking, and enhanced reporting for non-profits and government agencies.',
    keywords: [
      'SHELTR organizations',
      'shelter management software',
      'non-profit solutions',
      'resource allocation',
      'participant tracking',
      'reporting tools',
      'government agency solutions'
    ],
    openGraph: {
      title: 'SHELTR for Organizations - Optimize Shelter Operations',
      description: 'Streamline management, allocate resources efficiently, track participants, and generate comprehensive reports with SHELTR\'s powerful platform.',
      url: 'https://sheltr-ai.web.app/solutions/organizations',
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
      title: 'SHELTR for Organizations - Streamlined Management',
      description: 'Optimize operations, resource allocation, and reporting for non-profits and government agencies.',
      images: [heroImage.url],
    },
  };
}

export default function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

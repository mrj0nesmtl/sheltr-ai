import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  const heroImage = await getHeroImageWithFallback('/portal/founders-only/investor-relations');
  
  return {
    title: 'Investor Relations - SHELTR Founders Portal',
    description: 'SHELTR Pre-Seed Funding Round: $250K raise for revolutionary payment infrastructure addressing homelessness. Explore our dual-token architecture, financial projections, and investment opportunity. Schedule a meeting with our founding team.',
    openGraph: {
      title: 'SHELTR Investor Relations - Pre-Seed Funding Opportunity',
      description: 'Join SHELTR\'s Pre-Seed funding round ($250K). Revolutionary payment infrastructure for social impact with blockchain transparency, AI integration, and enterprise-grade security. 100% donation efficiency through innovative technology.',
      url: 'https://sheltr-ai.web.app/portal/founders-only/investor-relations',
      siteName: 'SHELTR',
      images: [
        {
          url: heroImage.url,
          width: heroImage.width,
          height: heroImage.height,
          alt: heroImage.alt,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SHELTR Investor Relations - Pre-Seed Funding',
      description: 'Revolutionary payment infrastructure for social impact. Join our $250K Pre-Seed round.',
      images: [heroImage.url],
    },
  };
}

export default function InvestorRelationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


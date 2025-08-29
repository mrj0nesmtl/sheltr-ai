import ShelterPageClient from './ShelterPageClient';

// Generate static params for static export
export async function generateStaticParams() {
  // Return known shelter slugs for static generation
  return [
    { slug: 'old-brewery-mission' },
    { slug: 'dans-la-rue' },
    { slug: 'mission-bon-accueil' },
    { slug: 'welcome-hall-mission' },
    { slug: 'missions-de-montreal' },
    { slug: 'chaînon' },
    { slug: 'resilience-montreal' },
    { slug: 'logi-femmes' },
    { slug: 'passages' },
    { slug: 'un-chez-nous' }
  ];
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ShelterPage({ params }: PageProps) {
  return <ShelterPageClient slug={params.slug} />;
}
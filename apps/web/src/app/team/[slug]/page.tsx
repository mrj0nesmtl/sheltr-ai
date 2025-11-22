import TeamMemberBioClient from './client';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// For static export - generate paths for known team members
export function generateStaticParams() {
  return [
    { slug: 'joel-yaffe' },
    { slug: 'zaffia-laplante' },
    { slug: 'alexander-kline' },
    { slug: 'doug-kukura' },
    { slug: 'marc-reichel' },
    { slug: 'morgan-hirtle' },
    { slug: 'dominique-legault' },
    { slug: 'christine-savard' },
    { slug: 'sen-wong' },
    { slug: 'aryan-srivastava' },
    // Add more team members as they're created
  ];
}

export default async function TeamMemberBioPage({ params }: PageProps) {
  const { slug } = await params;
  return <TeamMemberBioClient slug={slug} />;
}

import TeamMemberBioClient from './client';

interface PageProps {
  params: {
    slug: string;
  };
}

// For static export - generate paths for known team members
export function generateStaticParams() {
  return [
    { slug: 'joel-yaffe' },
    // Add more team members as they're created
  ];
}

export default function TeamMemberBioPage({ params }: PageProps) {
  return <TeamMemberBioClient slug={params.slug} />;
}

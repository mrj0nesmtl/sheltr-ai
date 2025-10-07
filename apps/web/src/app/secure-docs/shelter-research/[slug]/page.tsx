import ShelterResearchDocumentClient from './client-page';

// Generate static params for known research documents
export function generateStaticParams() {
  return [
    { slug: 'general-research' },
    { slug: 'shelters-state-by-state' },
    { slug: 'top-shelters-canada' },
    { slug: 'unique-shelter-programs' },
  ];
}

export default function ShelterResearchDocumentPage() {
  return <ShelterResearchDocumentClient />;
}

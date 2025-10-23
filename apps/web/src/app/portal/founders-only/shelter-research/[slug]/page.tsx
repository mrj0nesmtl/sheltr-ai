import SecureDocumentViewer from '@/components/portal/SecureDocumentViewer';

// Generate static params for shelter research documents
export async function generateStaticParams() {
  // Return known shelter research document slugs
  return [
    { slug: 'general-research' },
    { slug: 'shelters-state-by-state' },
    { slug: 'top-homeless-shelters-canada' },
    { slug: 'unique-shelter-programs-for-homelessness' },
  ];
}

export default function ShelterResearchDocumentPage({ params }: { params: { slug: string } }) {
  return (
    <SecureDocumentViewer
      documentSlug={params.slug}
      category="Shelter Research"
      backLink="/portal/founders-only/shelter-research"
    />
  );
}


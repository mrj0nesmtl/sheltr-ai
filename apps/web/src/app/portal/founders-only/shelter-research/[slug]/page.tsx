import SecureDocumentViewer from '@/components/portal/SecureDocumentViewer';

export default function ShelterResearchDocumentPage({ params }: { params: { slug: string } }) {
  return (
    <SecureDocumentViewer
      documentSlug={params.slug}
      category="Shelter Research"
      backLink="/portal/founders-only/shelter-research"
    />
  );
}


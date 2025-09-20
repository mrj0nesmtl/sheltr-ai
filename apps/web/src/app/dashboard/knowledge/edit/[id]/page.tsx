import EditKnowledgeDocumentClient from './EditKnowledgeDocumentClient';

// Generate static params for static export
export async function generateStaticParams() {
  // Return some demo document IDs for static generation
  // In a real scenario, you'd fetch these from your API
  return [
    {
      id: 'demo-doc-001',
    },
    {
      id: 'demo-doc-002',
    },
  ];
}

// Disable dynamic params for static export
export const dynamicParams = false;

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditKnowledgeDocument({ params }: PageProps) {
  return <EditKnowledgeDocumentClient />;
}
import EditKnowledgeDocumentClient from './EditKnowledgeDocumentClient';

// Minimal generateStaticParams for build compatibility
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Return at least one param for static export compatibility
  return [
    { id: 'placeholder' }
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
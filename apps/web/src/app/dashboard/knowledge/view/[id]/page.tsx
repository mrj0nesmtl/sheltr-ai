import ViewKnowledgeDocumentClient from './ViewKnowledgeDocumentClient';

// Generate static params for build compatibility
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // For static export, we need to provide all possible document IDs
  // Since this is an admin route, we'll use a placeholder approach
  // and handle real document IDs client-side
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

export default function ViewKnowledgeDocument({ params }: PageProps) {
  return <ViewKnowledgeDocumentClient />;
}

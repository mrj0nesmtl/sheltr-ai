import EditKnowledgeDocumentClient from './EditKnowledgeDocumentClient';

// Generate static params for build compatibility
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // For static export, we need to provide all possible document IDs
  // Since this is an admin route, we'll use a placeholder approach
  // and handle real document IDs client-side
  return [
    { id: 'placeholder' }
  ];
}

// Allow dynamic params for client-side routing
export const dynamicParams = true;

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditKnowledgeDocument({ params }: PageProps) {
  return <EditKnowledgeDocumentClient />;
}
import { ParticipantProfileClient } from './ParticipantProfileClient';

// Required for static export with dynamic routes
export async function generateStaticParams() {
  // Return the participant IDs that we want to pre-generate
  return [
    {
      id: 'demo-participant-001',
    },
    {
      id: 'michael-rodriguez',
    },
  ];
}

// Enable dynamic routes for development
export const dynamicParams = true;

interface PageProps {
  params: {
    id: string;
  };
}

export default function ParticipantProfilePage({ params }: PageProps) {
  return <ParticipantProfileClient participantId={params.id} />;
}
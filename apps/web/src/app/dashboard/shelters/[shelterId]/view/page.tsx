import ShelterViewClient from './client-page';

export async function generateStaticParams() {
  // Generate static params for known shelters
  return [
    { shelterId: 'old-brewery-mission' },
    { shelterId: 'welcome-hall-mission' },
    { shelterId: 'mission-bon-accueil' },
    // Add more shelter IDs as needed
  ];
}

export default function ShelterViewPage() {
  return <ShelterViewClient />;
}

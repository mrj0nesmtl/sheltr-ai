import ShelterViewClient from './client-page';

export async function generateStaticParams() {
  return [
    { shelterId: 'placeholder' }
  ];
}

// Disable dynamic routes for production static export
export const dynamicParams = false;

export default function ShelterViewPage() {
  return <ShelterViewClient />;
}

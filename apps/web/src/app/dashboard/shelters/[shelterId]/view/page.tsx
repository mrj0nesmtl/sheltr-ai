import ShelterViewClient from './client-page';

export async function generateStaticParams() {
  return [
    { shelterId: 'placeholder' }
  ];
}

export default function ShelterViewPage() {
  return <ShelterViewClient />;
}

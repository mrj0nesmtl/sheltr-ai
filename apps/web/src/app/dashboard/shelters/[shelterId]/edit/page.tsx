import ShelterEditClient from './client-page';

export async function generateStaticParams() {
  return [
    { shelterId: 'placeholder' }
  ];
}

export default function ShelterEditPage() {
  return <ShelterEditClient />;
}

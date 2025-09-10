import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emergency Supply Drones - SHELTR',
  description: 'Rapid drone delivery of essential supplies directly to SHELTR PODS using GPS precision. Donors can fund emergency packages that reach participants within minutes.',
  keywords: [
    'drone delivery',
    'emergency supplies',
    'SHELTR drones',
    'GPS delivery',
    'humanitarian drones',
    'emergency response',
    'supply delivery',
    'POD delivery',
    'drone technology',
    'emergency aid'
  ],
  openGraph: {
    title: 'Emergency Supply Drones - SHELTR',
    description: 'Rapid drone delivery of essential supplies directly to SHELTR PODS. Fund emergency packages that reach participants within minutes.',
    url: 'https://sheltr-ai.web.app/drones',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/sheltr_units/drone-delivery.jpeg',
        width: 1200,
        height: 630,
        alt: 'SHELTR Emergency Supply Drone Delivery',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emergency Supply Drones - SHELTR',
    description: 'Rapid drone delivery of essential supplies directly to SHELTR PODS using GPS precision.',
    images: ['/images/sheltr_units/drone-delivery.jpeg'],
  },
};

export default function DronesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

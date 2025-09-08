import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MOBI - Ultimate Mobility & POD Transport',
  description: 'MOBI provides ultimate mobility and POD transport capability. Electric-powered, all-terrain design built for urban and rural environments with integrated cargo and towing systems.',
  keywords: [
    'MOBI',
    'SHELTR MOBI',
    'electric bike',
    'pod transport',
    'mobility solution',
    'cargo bike',
    'bike hitch',
    'all-terrain bike',
    'urban mobility',
    'sustainable transport'
  ],
  openGraph: {
    title: 'MOBI - Ultimate Mobility Solution',
    description: 'Electric mountain bike designed for POD transport and ultimate mobility. All-terrain capability with integrated cargo systems.',
    url: 'https://sheltr-ai.web.app/pods/mobi',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/sheltr_units/sheltr-mobility.jpg',
        width: 1200,
        height: 630,
        alt: 'MOBI - Ultimate mobility and transport solution',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MOBI - Ultimate Mobility',
    description: 'Electric mountain bike designed for POD transport and all-terrain mobility.',
    images: ['/images/sheltr_units/sheltr-mobility.jpg'],
  },
};

export default function MobiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

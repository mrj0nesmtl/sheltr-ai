import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gallery | SHELTR',
  description: 'Explore the SHELTR ecosystem through our comprehensive image gallery showcasing PODS, MOBI bikes, drone technology, and behind-the-scenes development.',
  keywords: [
    'SHELTR gallery',
    'PODS images',
    'MOBI bikes',
    'drone technology',
    'emergency housing',
    'homeless solutions',
    'photo gallery',
    'SHELTR ecosystem'
  ],
  openGraph: {
    title: 'SHELTR Gallery - Visual Journey Through Our Ecosystem',
    description: 'Discover the SHELTR platform through stunning visuals of our PODS, MOBI bikes, drone technology, and development process.',
    type: 'website',
    images: [
      {
        url: '/images/sheltr_units/hero-pods.png',
        width: 1200,
        height: 630,
        alt: 'SHELTR Gallery - PODS and Technology Showcase',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHELTR Gallery - Visual Ecosystem Tour',
    description: 'Explore our comprehensive gallery showcasing PODS, MOBI bikes, drone technology, and development insights.',
    images: ['/images/sheltr_units/hero-pods.png'],
  },
  robots: {
    index: false, // Hidden page - not indexed by search engines
    follow: true,
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

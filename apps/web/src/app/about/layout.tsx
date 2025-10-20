import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/about');

  return {
  title: 'About SHELTR - Our Mission to End Homelessness',
  description: 'Learn about SHELTR\'s revolutionary approach to ending homelessness through technology, dignity, and direct empowerment. Discover our story, mission, and vision for a world where everyone has access to safe, secure housing.',
  keywords: [
    'about SHELTR',
    'SHELTR mission',
    'end homelessness',
    'social impact',
    'housing solutions',
    'homeless technology',
    'direct empowerment',
    'dignified housing',
    'SHELTR story',
    'humanitarian technology',
    'blockchain social impact',
    'housing innovation'
  ],
  authors: [{ name: 'SHELTR Team' }],
  creator: 'SHELTR',
  publisher: 'SHELTR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'About SHELTR - Our Mission to End Homelessness',
    description: 'Revolutionary approach to ending homelessness through technology, dignity, and direct empowerment. Discover our story and vision.',
    url: 'https://sheltr-ai.web.app/about',
    siteName: 'SHELTR',
    images: [
      {
        url: heroImage.url,
        width: heroImage.width,
        height: heroImage.height,
        alt: heroImage.alt,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About SHELTR - Our Mission',
    description: 'Revolutionary approach to ending homelessness through technology, dignity, and direct empowerment.',
    images: [heroImage.url],
    creator: '@sheltr_ai',
    site: '@sheltr_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'About',
  classification: 'Social Impact, Company Information, Mission',
  };
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


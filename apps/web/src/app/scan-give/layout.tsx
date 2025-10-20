import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/scan-give');

  return {
    title: 'Scan & Give - Direct QR Code Donations | SHELTR',
    description: 'Scan a SHELTR QR code to instantly and transparently donate directly to individuals experiencing homelessness, tracking your impact in real-time.',
    keywords: [
      'scan and give',
      'QR code donation',
      'direct giving',
      'transparent charity',
      'SHELTR donations',
      'instant support',
      'homeless aid'
    ],
    openGraph: {
      title: 'Scan & Give - Direct QR Code Donations | SHELTR',
      description: 'Scan a QR code and instantly support individuals experiencing homelessness with transparent, direct donations.',
      url: 'https://sheltr-ai.web.app/scan-give',
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
      title: 'Scan & Give - Direct QR Code Donations | SHELTR',
      description: 'Instantly support individuals experiencing homelessness by scanning a SHELTR QR code.',
      images: [heroImage.url],
    },
  };
}

export default function ScanGiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

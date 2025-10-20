import { Metadata } from 'next';
import { getHeroImageWithFallback } from '@/lib/heroImages';

export async function generateMetadata(): Promise<Metadata> {
  // Fetch hero image from gallery (or fallback to default)
  const heroImage = await getHeroImageWithFallback('/contact');

  return {
    title: 'Contact SHELTR - Get In Touch',
    description: 'Reach out to the SHELTR team for inquiries, partnerships, support, or to learn more about our mission to combat homelessness.',
    keywords: [
      'contact SHELTR',
      'SHELTR support',
      'partnership inquiries',
      'homelessness contact',
      'get in touch',
      'SHELTR team contact'
    ],
    openGraph: {
      title: 'Contact SHELTR - We\'re Here to Help',
      description: 'Connect with the SHELTR team for any questions, collaboration opportunities, or support regarding our mission.',
      url: 'https://sheltr-ai.web.app/contact',
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
      title: 'Contact SHELTR - Get In Touch',
      description: 'Reach out to the SHELTR team for inquiries, partnerships, support, or to learn more about our mission.',
      images: [heroImage.url],
    },
  };
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

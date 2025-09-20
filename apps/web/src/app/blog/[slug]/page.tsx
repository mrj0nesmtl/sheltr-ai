import BlogPostClient from './BlogPostClient';

// Generate static params for static export
export async function generateStaticParams() {
  // Return example blog post slugs for static generation
  // In production, this would fetch actual slugs from the API
  return [
    { slug: 'sheltr-blockchain-homeless-services-revolution' },
    { slug: 'welcome-to-sheltr' },
    { slug: 'how-to-help-homelessness' },
    { slug: 'blockchain-for-social-impact' },
    { slug: 'montreal-shelter-network' },
    { slug: 'donation-transparency' }
  ];
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: PageProps) {
  return <BlogPostClient slug={params.slug} />;
}
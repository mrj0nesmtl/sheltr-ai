import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

// Generate static params for static export
export async function generateStaticParams() {
  // Return example blog post slugs for static generation
  // In a real implementation, you'd fetch these from your database
  return [
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
  const { slug } = params;

  // For static export, we'll show a placeholder since we can't fetch data at build time
  // In a real implementation, you'd either:
  // 1. Pre-generate all blog posts at build time
  // 2. Use a different deployment strategy that supports server-side rendering
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <ThemeLogo />
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-foreground/60 hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/blog" className="text-foreground font-medium">
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post: {slug}</h1>
          <p className="text-muted-foreground mb-8">
            This blog post will be loaded dynamically at runtime.
          </p>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

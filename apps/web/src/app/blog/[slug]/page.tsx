import BlogPostClient from './BlogPostClient';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Generate static params for static export
export async function generateStaticParams() {
  try {
    // Fetch all published blog posts from Firestore
    const postsRef = collection(db, 'blog_posts');
    const publishedQuery = query(postsRef, where('status', '==', 'published'));
    const querySnapshot = await getDocs(publishedQuery);
    
    const slugs = querySnapshot.docs.map(doc => ({
      slug: doc.data().slug
    }));
    
    console.log(`📝 Generated static params for ${slugs.length} blog posts:`, slugs);
    
    // Return slugs, or fallback to example slugs if none found
    return slugs.length > 0 ? slugs : [
      { slug: 'sheltr-blockchain-homeless-services-revolution' },
      { slug: 'welcome-to-sheltr' }
    ];
  } catch (error) {
    console.error('❌ Error fetching blog slugs for static generation:', error);
    // Fallback to example slugs if fetch fails
    return [
      { slug: 'sheltr-blockchain-homeless-services-revolution' },
      { slug: 'welcome-to-sheltr' }
    ];
  }
}

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: PageProps) {
  return <BlogPostClient slug={params.slug} />;
}
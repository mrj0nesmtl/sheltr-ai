# Blog System Schema

## Firestore Collections

### `blog_posts` Collection
```typescript
interface BlogPost {
  id: string;                    // Auto-generated document ID
  title: string;                 // Blog post title
  slug: string;                  // URL-friendly slug (e.g., "how-sheltr-transforms-donations")
  content: string;               // Markdown content
  excerpt: string;               // Short description for previews
  featured_image?: string;       // Firebase Storage URL for featured image
  author_id: string;             // User ID of the author (Super Admin)
  author_name: string;           // Author display name
  status: 'draft' | 'published' | 'archived';
  published_at?: Timestamp;      // Publication timestamp
  created_at: Timestamp;         // Creation timestamp
  updated_at: Timestamp;         // Last update timestamp
  tags: string[];                // Array of tags for categorization
  category: string;              // Primary category
  read_time: number;             // Estimated reading time in minutes
  view_count: number;            // Number of views
  seo_title?: string;            // SEO-optimized title
  seo_description?: string;      // SEO meta description
  seo_keywords?: string[];       // SEO keywords
}
```

### `blog_categories` Collection
```typescript
interface BlogCategory {
  id: string;                    // Category ID
  name: string;                  // Display name
  slug: string;                  // URL-friendly slug
  description: string;           // Category description
  color: string;                 // Hex color for UI
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### `blog_tags` Collection
```typescript
interface BlogTag {
  id: string;                    // Tag ID
  name: string;                  // Display name
  slug: string;                  // URL-friendly slug
  usage_count: number;           // Number of posts using this tag
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

## Firebase Storage Structure
```
gs://sheltr-ai.firebasestorage.app/
├── blog/
│   ├── featured-images/         # Blog post featured images
│   │   ├── {post-id}/
│   │   │   ├── original.jpg
│   │   │   ├── thumbnail.jpg
│   │   │   └── optimized.jpg
│   └── content-images/          # Images embedded in blog content
│       ├── {post-id}/
│       └── {image-files}
```

## Security Rules
- **Read Access**: All authenticated users can read published blog posts
- **Write Access**: Only Super Admin users can create, edit, delete blog posts
- **Image Access**: Public read access for blog images, Super Admin write access

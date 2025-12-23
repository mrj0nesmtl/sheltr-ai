/**
 * Social Media URL Parser
 * Extracts video IDs and generates embed URLs for TikTok, X (Twitter), and YouTube
 */

export interface ParsedSocialMedia {
  platform: 'tiktok' | 'twitter' | 'youtube' | null;
  videoId: string | null;
  embedUrl: string | null;
  originalUrl: string;
  username?: string;
  isValid: boolean;
  error?: string;
}

/**
 * Parse a social media URL and extract platform, video ID, and embed URL
 */
export function parseSocialMediaUrl(url: string): ParsedSocialMedia {
  const trimmedUrl = url.trim();
  
  // TikTok patterns
  const tiktokPatterns = [
    /tiktok\.com\/@([^/]+)\/video\/(\d+)/i,
    /vm\.tiktok\.com\/([A-Za-z0-9]+)/i,
    /vt\.tiktok\.com\/([A-Za-z0-9]+)/i,
  ];

  // X/Twitter patterns
  const twitterPatterns = [
    /(?:twitter\.com|x\.com)\/(?:i\/)?(?:web\/)?status\/(\d+)/i,
    /(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i,
  ];

  // YouTube patterns
  const youtubePatterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/i,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/i,
  ];

  // Try TikTok
  for (const pattern of tiktokPatterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      const videoId = match[2] || match[1];
      const username = match[1] && match[2] ? match[1] : undefined;
      
      return {
        platform: 'tiktok',
        videoId,
        embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
        originalUrl: trimmedUrl,
        username,
        isValid: true,
      };
    }
  }

  // Try X/Twitter
  for (const pattern of twitterPatterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      const videoId = match[2] || match[1];
      const username = match[1] && match[2] ? match[1] : undefined;
      
      return {
        platform: 'twitter',
        videoId,
        embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${videoId}`,
        originalUrl: trimmedUrl,
        username,
        isValid: true,
      };
    }
  }

  // Try YouTube
  for (const pattern of youtubePatterns) {
    const match = trimmedUrl.match(pattern);
    if (match) {
      const videoId = match[1];
      
      return {
        platform: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        originalUrl: trimmedUrl,
        isValid: true,
      };
    }
  }

  // No match found
  return {
    platform: null,
    videoId: null,
    embedUrl: null,
    originalUrl: trimmedUrl,
    isValid: false,
    error: 'Unsupported URL format. Please use TikTok, X (Twitter), or YouTube links.',
  };
}

/**
 * Validate if a URL is from a supported social media platform
 */
export function isSupportedSocialMediaUrl(url: string): boolean {
  const parsed = parseSocialMediaUrl(url);
  return parsed.isValid;
}

/**
 * Get platform name for display
 */
export function getPlatformDisplayName(platform: string | null): string {
  switch (platform) {
    case 'tiktok':
      return 'TikTok';
    case 'twitter':
      return 'X (Twitter)';
    case 'youtube':
      return 'YouTube';
    default:
      return 'Unknown';
  }
}

/**
 * Get aspect ratio for platform
 */
export function getPlatformAspectRatio(platform: string | null): string {
  switch (platform) {
    case 'tiktok':
      return '9:16'; // Vertical
    case 'twitter':
      return '16:9'; // Horizontal (most common)
    case 'youtube':
      return '16:9'; // Horizontal
    default:
      return '16:9';
  }
}

/**
 * Extract metadata from TikTok URL (if available in URL)
 */
export function extractTikTokMetadata(url: string): {
  username?: string;
  videoId?: string;
} {
  const match = url.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/i);
  if (match) {
    return {
      username: match[1],
      videoId: match[2],
    };
  }
  return {};
}

/**
 * Extract metadata from X/Twitter URL
 */
export function extractTwitterMetadata(url: string): {
  username?: string;
  tweetId?: string;
} {
  const match = url.match(/(?:twitter\.com|x\.com)\/([^/]+)\/status\/(\d+)/i);
  if (match) {
    return {
      username: match[1],
      tweetId: match[2],
    };
  }
  return {};
}

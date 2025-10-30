# Open Graph (OG) Implementation Guide

**Version:** 1.0.0  
**Last Updated:** October 19, 2025  
**Status:** ✅ Complete

---

## 📋 **Overview**

This document outlines the standardized Open Graph implementation across all SHELTR public pages. Open Graph metadata ensures that when links are shared on social media, messaging apps, or other platforms, they display with proper titles, descriptions, and hero images.

---

## 🎯 **Implementation Standard**

Every public page MUST have a `layout.tsx` file in its directory with the following structure:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | SHELTR',
  description: 'Compelling description (150-160 characters recommended)',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  authors: [{ name: 'SHELTR Team' }],
  creator: 'SHELTR',
  publisher: 'SHELTR',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Page Title for Social Sharing',
    description: 'Description optimized for social media (shorter, punchier)',
    url: 'https://sheltr-ai.web.app/page-path',
    siteName: 'SHELTR',
    images: [
      {
        url: '/images/og-page-name.jpg',
        width: 1200,
        height: 630,
        alt: 'Descriptive alt text for image',
        type: 'image/jpeg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Twitter-optimized title',
    description: 'Twitter-optimized description',
    images: ['/images/og-page-name.jpg'],
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
  category: 'Category Name',
  classification: 'Classification, Tags, Topics',
};

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
```

---

## 📊 **Implementation Status**

### ✅ **Pages WITH Open Graph Metadata**

| Page | Path | OG Image | Status |
|------|------|----------|--------|
| **Gallery** | `/gallery` | `/images/sheltr_units/hero-pods.png` | ✅ Complete |
| **PODS** | `/pods` | `/images/sheltr_units/hero-pods.png` | ✅ Complete |
| **PODS Buildout** | `/pods/buildout` | `/images/sheltr_units/hero-pods.png` | ✅ Complete |
| **MOBI** | `/pods/mobi` | `/images/sheltr_units/mobi-bike.jpeg` | ✅ Complete |
| **Drones** | `/drones` | `/images/sheltr_units/drone-delivery.jpeg` | ✅ Complete |
| **Landing Page** | `/` | `/og-image.jpg` | ✅ Complete |
| **About** | `/about` | `/images/og-about.jpg` | ✅ Complete |
| **Team** | `/team` | `/images/og-team.jpg` | ✅ Complete |
| **Solutions** | `/solutions` | `/images/og-solutions.jpg` | ✅ Complete |
| **For Donors** | `/solutions/donors` | `/images/og-donors.jpg` | ✅ Complete |
| **For Participants** | `/solutions/participants` | `/images/og-participants.jpg` | ✅ Complete |
| **For Organizations** | `/solutions/organizations` | `/images/og-organizations.jpg` | ✅ Complete |
| **Impact** | `/impact` | `/images/og-impact.jpg` | ✅ Complete |
| **Scan & Give** | `/scan-give` | `/images/og-scan-give.jpg` | ✅ Complete |
| **Donate** | `/donate` | `/images/og-donate.jpg` | ✅ Complete |
| **Contact** | `/contact` | `/images/og-contact.jpg` | ✅ Complete |

---

## 🖼️ **Hero Image Requirements**

### **Image Specifications**

- **Dimensions**: 1200 x 630 pixels (Facebook/LinkedIn standard)
- **Format**: JPEG or PNG
- **File Size**: < 1MB (optimized for fast loading)
- **Aspect Ratio**: 1.91:1
- **Safe Zone**: Keep important content within 1200 x 600 pixels (centered)

### **Branding Requirements**

Every hero image MUST include:

1. ✅ **SHELTR Logo** - Visible and prominent
2. ✅ **Clear Subject** - What the page is about
3. ✅ **High Contrast** - Readable text/logo
4. ✅ **Professional Quality** - No pixelation or artifacts

### **Image Naming Convention**

```
/images/og-{page-name}.jpg
```

Examples:
- `/images/og-about.jpg`
- `/images/og-scan-give.jpg`
- `/images/og-donors.jpg`

---

## 🎨 **Hero Images to Create**

The following hero images need to be created with SHELTR branding:

### **Priority 1 - Core Pages**
1. ❌ `/images/og-scan-give.jpg` - QR code donation demo
2. ❌ `/images/og-about.jpg` - About SHELTR mission
3. ❌ `/images/og-team.jpg` - Team photo/collage

### **Priority 2 - Solutions Pages**
4. ❌ `/images/og-solutions.jpg` - Solutions overview
5. ❌ `/images/og-donors.jpg` - Donor dashboard/giving
6. ❌ `/images/og-participants.jpg` - Participant empowerment
7. ❌ `/images/og-organizations.jpg` - Shelter management

### **Priority 3 - Additional Pages**
8. ❌ `/images/og-impact.jpg` - Impact stories/metrics
9. ❌ `/images/og-donate.jpg` - Donation page
10. ❌ `/images/og-contact.jpg` - Contact/support

### **Existing Images (Can be reused)**
- ✅ `/og-image.jpg` - General SHELTR logo (landing page)
- ✅ `/images/sheltr_units/hero-pods.png` - PODS showcase
- ✅ `/images/sheltr_units/mobi-bike.jpeg` - MOBI bike
- ✅ `/images/sheltr_units/drone-delivery.jpeg` - Drone delivery

---

## 📝 **Content Guidelines**

### **Title Best Practices**

1. **Length**: 50-60 characters (including " | SHELTR")
2. **Format**: `{Page Purpose} | SHELTR`
3. **Keywords**: Include primary keyword
4. **Action-Oriented**: Use verbs when appropriate

**Examples:**
- ✅ "Scan & Give - Direct QR Code Donations | SHELTR"
- ✅ "For Donors - Direct Impact Giving | SHELTR"
- ❌ "SHELTR Scan Give Page" (too generic)

### **Description Best Practices**

1. **Length**: 150-160 characters for SEO, 100-120 for OG
2. **Value Proposition**: Lead with benefit
3. **Call to Action**: Subtle encouragement
4. **Keywords**: Natural integration

**Examples:**
- ✅ "Scan a QR code and instantly support individuals experiencing homelessness. Watch your donation make an immediate impact with full transparency."
- ❌ "This is the SHELTR scan and give page where you can donate." (too bland)

### **Keywords Best Practices**

1. **Quantity**: 10-15 keywords per page
2. **Relevance**: Directly related to page content
3. **Variety**: Mix of broad and specific terms
4. **Long-tail**: Include 2-3 word phrases

---

## 🔍 **Testing & Validation**

### **Testing Tools**

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **WhatsApp**: Send link to yourself
5. **iMessage**: Send link to yourself

### **Testing Checklist**

For each page, verify:

- [ ] Title displays correctly
- [ ] Description displays correctly
- [ ] Hero image loads and displays
- [ ] Image has SHELTR branding visible
- [ ] Image is not cropped incorrectly
- [ ] Link preview looks professional
- [ ] Mobile preview looks good
- [ ] Desktop preview looks good

### **Common Issues & Fixes**

**Issue**: Image not updating after change  
**Fix**: Clear cache in testing tools, wait 24 hours for CDN refresh

**Issue**: Image cropped incorrectly  
**Fix**: Ensure image is exactly 1200x630px, keep content in safe zone

**Issue**: Title/description not showing  
**Fix**: Check `layout.tsx` file exists in correct directory

**Issue**: Wrong image showing  
**Fix**: Clear Facebook/Twitter cache, verify image URL is absolute

---

## 🚀 **Deployment Process**

### **Step 1: Create Hero Images**

1. Design hero image with SHELTR branding (1200x630px)
2. Optimize image (compress to < 1MB)
3. Save to `/apps/web/public/images/`
4. Name using convention: `og-{page-name}.jpg`

### **Step 2: Update Metadata**

1. Ensure `layout.tsx` exists in page directory
2. Update `openGraph.images[0].url` to point to new image
3. Verify all metadata fields are complete
4. Test locally

### **Step 3: Deploy**

1. Commit changes to Git
2. Push to main branch
3. Deploy using `./deploy.sh` (option 3)
4. Wait for deployment to complete

### **Step 4: Validate**

1. Test all sharing links on multiple platforms
2. Use Facebook Debugger to refresh cache
3. Use Twitter Card Validator to verify
4. Send test links via WhatsApp/iMessage
5. Document any issues

---

## 📱 **Platform-Specific Considerations**

### **Facebook**

- Uses `og:title`, `og:description`, `og:image`
- Caches aggressively (use debugger to refresh)
- Prefers 1200x630px images
- Shows larger preview for `summary_large_image`

### **Twitter**

- Uses `twitter:title`, `twitter:description`, `twitter:image`
- Respects `twitter:card` type
- `summary_large_image` shows full-width preview
- Requires `twitter:creator` and `twitter:site`

### **LinkedIn**

- Uses Open Graph tags
- Caches for 7 days
- Prefers professional, high-quality images
- Shows company name from `og:site_name`

### **WhatsApp**

- Uses Open Graph tags
- Shows image, title, description
- Mobile-optimized preview
- Caches on device

### **iMessage**

- Uses Open Graph tags
- Shows rich preview on iOS
- Respects image dimensions
- Caches locally

---

## 🔧 **Maintenance**

### **Monthly Tasks**

- [ ] Review all OG images for branding consistency
- [ ] Test sharing links on all platforms
- [ ] Update descriptions if content changes
- [ ] Check for broken image links
- [ ] Verify all pages have metadata

### **Quarterly Tasks**

- [ ] Refresh hero images with new content
- [ ] Update keywords based on SEO performance
- [ ] Review and optimize descriptions
- [ ] Test on new platforms/apps
- [ ] Audit for consistency

### **Annual Tasks**

- [ ] Complete redesign of all hero images
- [ ] Update branding if logo changes
- [ ] Review and update all metadata
- [ ] Comprehensive testing across all platforms
- [ ] Update this documentation

---

## 📚 **Resources**

### **Official Documentation**

- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing](https://developers.facebook.com/docs/sharing/webmasters)
- [LinkedIn Post Inspector](https://www.linkedin.com/help/linkedin/answer/46687)

### **Tools**

- [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
- [Metatags.io](https://metatags.io/) - Preview generator
- [Social Share Preview](https://socialsharepreview.com/) - Multi-platform preview

### **Image Creation**

- [Canva](https://www.canva.com/) - Design tool
- [Figma](https://www.figma.com/) - Design tool
- [TinyPNG](https://tinypng.com/) - Image compression
- [ImageOptim](https://imageoptim.com/) - Image optimization

---

## ✅ **Checklist for New Pages**

When creating a new public page:

- [ ] Create `layout.tsx` in page directory
- [ ] Add complete metadata (title, description, keywords)
- [ ] Configure Open Graph tags
- [ ] Configure Twitter Card tags
- [ ] Create hero image (1200x630px)
- [ ] Add SHELTR branding to hero image
- [ ] Optimize and compress image
- [ ] Upload image to `/public/images/`
- [ ] Update image URL in metadata
- [ ] Test locally
- [ ] Deploy to production
- [ ] Validate with Facebook Debugger
- [ ] Validate with Twitter Card Validator
- [ ] Test on WhatsApp/iMessage
- [ ] Document in this file

---

## 🎯 **Success Metrics**

Track the following to measure OG implementation success:

1. **Click-Through Rate (CTR)** - From social shares
2. **Engagement Rate** - Likes, comments, shares
3. **Bounce Rate** - From social traffic
4. **Time on Page** - From social traffic
5. **Conversion Rate** - Donations from social shares

---

## 📞 **Support**

For questions or issues with Open Graph implementation:

1. Review this documentation
2. Test with validation tools
3. Check browser console for errors
4. Verify image URLs are correct
5. Contact development team if issues persist

---

**Document Status:** ✅ Complete  
**Last Review:** October 19, 2025  
**Next Review:** January 19, 2026


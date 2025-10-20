# 🎨 Hero Images Needed for Open Graph Sharing

**Created:** October 19, 2025  
**Priority:** HIGH  
**Deadline:** Tonight (for sharing with friends and supporters)

---

## 📋 **Quick Summary**

We need to create **10 hero images** (1200x630px) with SHELTR branding for social media sharing. These images will appear when links are shared on Facebook, Twitter, LinkedIn, WhatsApp, iMessage, etc.

---

## ✅ **What's Already Done**

All pages now have proper Open Graph metadata configured! The code is ready - we just need the images.

**Existing Images (Can be reused):**
- ✅ `/og-image.jpg` - General SHELTR logo (landing page)
- ✅ `/images/sheltr_units/hero-pods.png` - PODS showcase
- ✅ `/images/sheltr_units/mobi-bike.jpeg` - MOBI bike
- ✅ `/images/sheltr_units/drone-delivery.jpeg` - Drone delivery

---

## 🎯 **Images to Create**

### **Priority 1 - Core Pages (Create First)**

#### 1. **Scan & Give Page**
- **Filename:** `/images/og-scan-give.jpg`
- **Content Ideas:**
  - QR code prominently displayed
  - Phone scanning QR code
  - "Scan & Give" text
  - SHELTR logo in corner
  - Modern, tech-forward feel

#### 2. **About Page**
- **Filename:** `/images/og-about.jpg`
- **Content Ideas:**
  - SHELTR mission statement
  - Team photo or collage
  - "Our Mission" text
  - SHELTR logo
  - Warm, inspiring feel

#### 3. **Team Page**
- **Filename:** `/images/og-team.jpg`
- **Content Ideas:**
  - Team photo/collage
  - "Meet the Team" text
  - SHELTR logo
  - Professional, friendly feel

---

### **Priority 2 - Solutions Pages**

#### 4. **Solutions Overview**
- **Filename:** `/images/og-solutions.jpg`
- **Content Ideas:**
  - Icons for donors, participants, organizations
  - "Solutions for Everyone" text
  - SHELTR logo
  - Clean, organized layout

#### 5. **For Donors**
- **Filename:** `/images/og-donors.jpg`
- **Content Ideas:**
  - Heart icon or giving hands
  - "Direct Impact Giving" text
  - Donation dashboard mockup
  - SHELTR logo
  - Trustworthy, transparent feel

#### 6. **For Participants**
- **Filename:** `/images/og-participants.jpg`
- **Content Ideas:**
  - POD, MOBI bike, or participant
  - "Empowerment & Dignity" text
  - SHELTR logo
  - Hopeful, empowering feel

#### 7. **For Organizations**
- **Filename:** `/images/og-organizations.jpg`
- **Content Ideas:**
  - Dashboard/analytics mockup
  - "Shelter Management Platform" text
  - SHELTR logo
  - Professional, enterprise feel

---

### **Priority 3 - Additional Pages**

#### 8. **Impact Stories**
- **Filename:** `/images/og-impact.jpg`
- **Content Ideas:**
  - Success story imagery
  - "Real Change, Real People" text
  - Impact metrics/stats
  - SHELTR logo
  - Inspiring, emotional feel

#### 9. **Donate Page**
- **Filename:** `/images/og-donate.jpg`
- **Content Ideas:**
  - Donation form mockup
  - "Make a Direct Impact" text
  - 100% transparency badge
  - SHELTR logo
  - Action-oriented, clear feel

#### 10. **Contact Page**
- **Filename:** `/images/og-contact.jpg`
- **Content Ideas:**
  - Contact form or communication icons
  - "Get in Touch" text
  - SHELTR logo
  - Welcoming, accessible feel

---

## 📐 **Technical Specifications**

### **Required Dimensions**
- **Width:** 1200 pixels
- **Height:** 630 pixels
- **Aspect Ratio:** 1.91:1
- **Format:** JPEG or PNG
- **File Size:** < 1MB (optimized)

### **Safe Zone**
Keep all important content (logo, text, faces) within:
- **Width:** 1200 pixels (full width)
- **Height:** 600 pixels (centered, 15px margin top/bottom)

### **Branding Requirements**
Every image MUST include:
1. ✅ **SHELTR Logo** - Visible and clear
2. ✅ **Page Title/Purpose** - Clear text
3. ✅ **High Contrast** - Readable on all devices
4. ✅ **Professional Quality** - No pixelation

---

## 🎨 **Design Guidelines**

### **Color Palette**
- **Primary:** Black (#000000)
- **Secondary:** White (#FFFFFF)
- **Accent:** Red (for borders/highlights)
- **Background:** Dark with subtle texture

### **Typography**
- **Headings:** Bold, sans-serif
- **Body:** Clean, readable
- **Logo:** Always use official SHELTR logo

### **Style**
- **Modern:** Clean, minimal design
- **Professional:** High-quality imagery
- **Consistent:** Similar style across all images
- **Branded:** SHELTR logo always visible

---

## 🛠️ **Tools & Resources**

### **Design Tools**
- **Canva** - Easy templates, drag-and-drop
- **Figma** - Professional design tool
- **Photoshop** - Advanced editing
- **Sketch** - Mac-based design

### **Image Optimization**
- **TinyPNG** - Compress without quality loss
- **ImageOptim** - Mac app for optimization
- **Squoosh** - Google's web-based tool

### **Stock Photos (If Needed)**
- **Unsplash** - Free high-quality photos
- **Pexels** - Free stock photos
- **SHELTR Gallery** - Use existing SHELTR photos

---

## 📝 **Creation Workflow**

### **Step 1: Design**
1. Create 1200x630px canvas
2. Add background (dark, textured)
3. Place SHELTR logo (top-left or bottom-right)
4. Add main content (photo, mockup, or graphic)
5. Add text overlay (page title/purpose)
6. Ensure all content in safe zone

### **Step 2: Optimize**
1. Export as JPEG (high quality)
2. Compress to < 1MB
3. Verify dimensions (exactly 1200x630px)
4. Check file size

### **Step 3: Deploy**
1. Save to `/apps/web/public/images/`
2. Name using convention: `og-{page-name}.jpg`
3. Commit to Git
4. Deploy using `./deploy.sh` (option 3)

### **Step 4: Test**
1. Visit page on production
2. Share link on Facebook
3. Use [Facebook Debugger](https://developers.facebook.com/tools/debug/)
4. Verify image displays correctly
5. Test on Twitter, WhatsApp, iMessage

---

## 🚀 **Quick Start (Canva Template)**

1. Go to [Canva.com](https://www.canva.com/)
2. Create custom size: 1200 x 630 px
3. Choose dark background
4. Add SHELTR logo (upload from `/apps/web/public/logo.svg`)
5. Add page-specific content
6. Add text overlay with page title
7. Download as JPEG (high quality)
8. Compress with TinyPNG
9. Upload to `/apps/web/public/images/`

---

## ✅ **Checklist for Each Image**

- [ ] Dimensions: 1200 x 630 pixels
- [ ] File size: < 1MB
- [ ] Format: JPEG or PNG
- [ ] SHELTR logo visible
- [ ] Page title/purpose clear
- [ ] High contrast (readable)
- [ ] Professional quality
- [ ] Content in safe zone
- [ ] Optimized/compressed
- [ ] Correct filename
- [ ] Uploaded to correct folder
- [ ] Tested on production

---

## 📊 **Progress Tracking**

### **Images Created: 0 / 10**

- [ ] og-scan-give.jpg
- [ ] og-about.jpg
- [ ] og-team.jpg
- [ ] og-solutions.jpg
- [ ] og-donors.jpg
- [ ] og-participants.jpg
- [ ] og-organizations.jpg
- [ ] og-impact.jpg
- [ ] og-donate.jpg
- [ ] og-contact.jpg

---

## 🎯 **Success Criteria**

When sharing any SHELTR link:
- ✅ Page title displays correctly
- ✅ Description is compelling
- ✅ Hero image loads and displays
- ✅ SHELTR logo is visible in image
- ✅ Image looks professional
- ✅ Preview is engaging and clickable

---

## 📞 **Need Help?**

- **Design Questions:** Review design guidelines above
- **Technical Issues:** Check `/docs/04-development/OPEN-GRAPH-IMPLEMENTATION.md`
- **Image Specs:** See technical specifications section
- **Testing:** Use Facebook Debugger and Twitter Card Validator

---

**Status:** 🔴 **URGENT - Needed Tonight**  
**All code is ready - just need the images!**


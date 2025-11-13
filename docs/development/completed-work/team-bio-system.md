# Team Bio System - Implementation Plan

## Overview
A comprehensive system for displaying team member biographies with custom image galleries, allowing super admins and leadership to upload and manage personal images for their bio pages.

---

## 🏗️ Architecture

### Data Structure (Firestore)

#### Users Collection Enhancement
```typescript
interface UserProfile {
  // Existing fields
  uid: string;
  displayName: string;
  email: string;
  role: string;
  profilePicture?: string;
  
  // New Bio Fields
  bio: {
    title: string;              // "Lead Developer"
    subtitle?: string;          // "CTO and Founder"
    tagline?: string;           // "Hacking Homelessness Through Technology"
    description: string;        // Full bio (markdown supported)
    expertise: string[];        // ["Strategic Leadership", "AI/ML", ...]
    experience: string;         // "25 years experience"
    department: string;         // "Leadership", "Operations", "Analytics"
    
    // Career Highlights
    careerHighlights?: Array<{
      id: string;
      title: string;
      organization: string;
      description: string;
      year: string;
      logo?: string;
      link?: string;
    }>;
    
    // Social Links
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
      email?: string;
    };
    
    // Settings
    showOnTeamPage: boolean;
    teamPageOrder?: number;
  };
  
  // Bio Images Collection Reference
  bioImages: Array<{
    id: string;
    url: string;
    storagePath: string;
    caption?: string;
    altText?: string;
    order: number;
    uploadedAt: Date;
    category?: 'career' | 'personal' | 'team' | 'event';
  }>;
  
  // Metadata
  slug: string;                 // "joel-yaffe" for URL
  updatedAt: Date;
  createdAt: Date;
}
```

### Firebase Storage Structure
```
/team-bios/
  /{userId}/
    /profile/
      profile-{timestamp}.jpg
    /bio-images/
      image-{id}-{timestamp}.jpg
```

---

## 📁 File Structure

### New Files to Create

```
apps/web/src/app/
├── team/
│   ├── page.tsx                          # Existing team listing
│   ├── [slug]/
│   │   ├── page.tsx                      # Dynamic bio page
│   │   └── loading.tsx                   # Loading state
│   └── components/
│       ├── TeamMemberCard.tsx            # Enhanced with link
│       ├── BioHero.tsx                   # Bio page hero section
│       ├── BioContent.tsx                # Main bio content
│       ├── BioImageGallery.tsx          # Image gallery component
│       └── CareerHighlights.tsx         # Career timeline
│
├── dashboard/super-admin/profile/
│   ├── page.tsx                          # Enhanced profile page
│   └── components/
│       ├── ImageManager.tsx              # NEW: Image upload & management
│       ├── BioEditor.tsx                 # NEW: Rich bio editor
│       └── ProfileImageUpload.tsx        # Enhanced profile pic upload
│
└── components/
    └── team/
        ├── BioPreview.tsx                # Preview bio before publishing
        └── ImageUploadModal.tsx          # Reusable image upload

lib/
└── services/
    ├── teamBioService.ts                 # Bio CRUD operations
    └── imageUploadService.ts             # Image upload utilities
```

---

## 🎨 Phase 1: Team Member Bio Pages

### 1.1 Dynamic Route Setup

**File**: `apps/web/src/app/team/[slug]/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BioHero from '../components/BioHero';
import BioContent from '../components/BioContent';
import BioImageGallery from '../components/BioImageGallery';
import CareerHighlights from '../components/CareerHighlights';

export default function TeamMemberBioPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeamMember();
  }, [slug]);

  const loadTeamMember = async () => {
    try {
      // Query users collection by slug
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('slug', '==', slug));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        setUserData(snapshot.docs[0].data());
      }
    } catch (error) {
      console.error('Error loading team member:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <BioPageSkeleton />;
  if (!userData) return <NotFound />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <BioHero 
        name={userData.displayName}
        title={userData.bio.title}
        tagline={userData.bio.tagline}
        profileImage={userData.profilePicture}
        socialLinks={userData.bio.socialLinks}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        <BioContent 
          description={userData.bio.description}
          expertise={userData.bio.expertise}
          experience={userData.bio.experience}
        />
        
        {userData.bioImages?.length > 0 && (
          <BioImageGallery images={userData.bioImages} />
        )}
        
        {userData.bio.careerHighlights?.length > 0 && (
          <CareerHighlights highlights={userData.bio.careerHighlights} />
        )}
      </div>
    </div>
  );
}
```

### 1.2 Bio Hero Component

**File**: `apps/web/src/app/team/components/BioHero.tsx`

```typescript
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Github, Globe, Mail } from 'lucide-react';

export default function BioHero({ 
  name, 
  title, 
  tagline, 
  profileImage, 
  socialLinks 
}) {
  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <Image 
                src={profileImage || '/images/default-avatar.jpg'}
                alt={name}
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
            <Badge className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white text-emerald-600">
              Leadership
            </Badge>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-bold mb-2">{name}</h1>
            <p className="text-2xl text-emerald-100 mb-4">{title}</p>
            {tagline && (
              <p className="text-xl italic opacity-90 mb-6">{tagline}</p>
            )}

            {/* Social Links */}
            <div className="flex gap-3 justify-center md:justify-start">
              {socialLinks?.linkedin && (
                <Button asChild variant="outline" size="sm">
                  <a href={socialLinks.linkedin} target="_blank">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.github && (
                <Button asChild variant="outline" size="sm">
                  <a href={socialLinks.github} target="_blank">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.website && (
                <Button asChild variant="outline" size="sm">
                  <a href={socialLinks.website} target="_blank">
                    <Globe className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {socialLinks?.email && (
                <Button asChild variant="outline" size="sm">
                  <a href={`mailto:${socialLinks.email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 1.3 Bio Image Gallery

**File**: `apps/web/src/app/team/components/BioImageGallery.tsx`

```typescript
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

export default function BioImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold text-center">Gallery</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedImages.map((image) => (
          <Card 
            key={image.id}
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all group"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={image.url}
                alt={image.altText || image.caption || 'Gallery image'}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            {image.caption && (
              <div className="p-4">
                <p className="text-sm text-muted-foreground">{image.caption}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-video">
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.altText || selectedImage.caption || ''}
                  fill
                  className="object-contain"
                />
              </div>
              {selectedImage.caption && (
                <p className="text-center text-muted-foreground">
                  {selectedImage.caption}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
```

---

## 🖼️ Phase 2: Profile Dashboard Image Management

### 2.1 Enhanced Profile Page with Tabs

**File**: `apps/web/src/app/dashboard/super-admin/profile/page.tsx`

```typescript
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, Shield, Image as ImageIcon } from 'lucide-react';
import ImageManager from './components/ImageManager';
import BioEditor from './components/BioEditor';
import ProfileImageUpload from './components/ProfileImageUpload';

export default function SuperAdminProfilePage() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="bio">
            <Briefcase className="h-4 w-4 mr-2" />
            Bio
          </TabsTrigger>
          <TabsTrigger value="images">
            <ImageIcon className="h-4 w-4 mr-2" />
            Images
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="h-4 w-4 mr-2" />
            Privacy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          {/* Existing profile content + ProfileImageUpload */}
        </TabsContent>

        <TabsContent value="bio">
          <BioEditor />
        </TabsContent>

        <TabsContent value="images">
          <ImageManager />
        </TabsContent>

        <TabsContent value="privacy">
          {/* Privacy settings */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### 2.2 Image Manager Component

**File**: `apps/web/src/app/dashboard/super-admin/profile/components/ImageManager.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Trash2, Edit, GripVertical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import Image from 'next/image';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ImageManager() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const timestamp = Date.now();
      const imageId = `img-${timestamp}`;
      const storagePath = `team-bios/${user.uid}/bio-images/${imageId}-${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const newImage = {
        id: imageId,
        url,
        storagePath,
        caption: '',
        altText: '',
        order: images.length,
        uploadedAt: new Date(),
        category: 'career'
      };

      // Update Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        bioImages: arrayUnion(newImage)
      });

      setImages([...images, newImage]);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleReorder = (result) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reorderedImages = items.map((img, index) => ({
      ...img,
      order: index
    }));

    setImages(reorderedImages);

    // Update Firestore
    const userRef = doc(db, 'users', user.uid);
    updateDoc(userRef, {
      bioImages: reorderedImages
    });
  };

  const handleDelete = async (imageId) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    setImages(updatedImages);

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      bioImages: updatedImages
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bio Image Gallery</CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload and manage images for your bio page. Drag to reorder.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="hidden"
            id="image-upload"
          />
          <Label htmlFor="image-upload" className="cursor-pointer">
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-semibold">Upload Image</p>
                <p className="text-sm text-muted-foreground">
                  Click to browse or drag and drop
                </p>
              </div>
            </div>
          </Label>
        </div>

        {/* Image Grid with Drag & Drop */}
        <DragDropContext onDragEnd={handleReorder}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative group"
                      >
                        <Card className="overflow-hidden">
                          <div className="relative aspect-square">
                            <Image
                              src={image.url}
                              alt={image.altText || 'Bio image'}
                              fill
                              className="object-cover"
                            />
                            <div 
                              {...provided.dragHandleProps}
                              className="absolute top-2 left-2 bg-black/50 p-1 rounded cursor-move"
                            >
                              <GripVertical className="h-4 w-4 text-white" />
                            </div>
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(image.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            <Input
                              placeholder="Caption..."
                              value={image.caption}
                              onChange={(e) => {
                                const updated = images.map(img =>
                                  img.id === image.id
                                    ? { ...img, caption: e.target.value }
                                    : img
                                );
                                setImages(updated);
                              }}
                              className="text-sm"
                            />
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button className="w-full">
          Save Image Gallery
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🔗 Phase 3: Link Team Cards to Bio Pages

### 3.1 Update Team Page Card Component

**File**: `apps/web/src/app/team/components/TeamMemberCard.tsx`

```typescript
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function TeamMemberCard({ member }) {
  return (
    <Link href={`/team/${member.slug}`}>
      <Card className="hover:shadow-xl transition-all group cursor-pointer">
        <CardContent className="p-6 space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <Image
              src={member.profilePicture || '/images/default-avatar.jpg'}
              alt={member.displayName}
              fill
              className="rounded-full object-cover"
            />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="font-bold text-xl group-hover:text-emerald-600 transition-colors">
              {member.displayName}
            </h3>
            <p className="text-blue-600 dark:text-blue-400">
              {member.bio.title}
            </p>
            <Badge variant="outline">{member.bio.department}</Badge>
          </div>

          <div className="pt-4 flex items-center justify-center gap-2 text-sm text-emerald-600 group-hover:gap-4 transition-all">
            <span>View Bio</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```

---

## 📊 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - bio fields
    match /users/{userId} {
      // Anyone can read public bio data
      allow read: if resource.data.bio.showOnTeamPage == true;
      
      // Users can update their own bio
      allow update: if request.auth.uid == userId 
        && request.auth.token.role in ['super_admin', 'leadership'];
      
      // Only super admin can set showOnTeamPage
      allow update: if request.auth.token.role == 'super_admin'
        && request.resource.data.bio.showOnTeamPage is bool;
    }
  }
}
```

---

## 🎯 Implementation Phases

### Phase 1: Foundation (Week 1)
- ✅ Set up data structure in Firestore
- ✅ Create dynamic bio page route
- ✅ Build BioHero component
- ✅ Build BioContent component

### Phase 2: Image System (Week 2)
- ✅ Build ImageManager component
- ✅ Implement Firebase Storage uploads
- ✅ Add drag-and-drop reordering
- ✅ Build BioImageGallery component

### Phase 3: Integration (Week 3)
- ✅ Update team page cards with links
- ✅ Add bio editor tab to profile
- ✅ Implement career highlights section
- ✅ Add preview functionality

### Phase 4: Polish (Week 4)
- ✅ Responsive design testing
- ✅ Loading states and error handling
- ✅ SEO optimization (meta tags, OG images)
- ✅ Performance optimization (image optimization)

---

## 🚀 Benefits

1. **For Team Members**:
   - Professional bio pages with custom galleries
   - Full control over personal narrative
   - Easy image management with drag-and-drop

2. **For Visitors/Investors**:
   - Get to know the team deeply
   - See career highlights and expertise
   - Connect via social links

3. **For SHELTR Platform**:
   - Professional presentation of leadership
   - SEO benefits from rich content
   - Increased trust and credibility

---

## 📝 Next Steps

1. **Immediate**: Set up Joel's bio with the comprehensive bio we just created
2. **Short-term**: Build out image upload system
3. **Medium-term**: Extend to all leadership team members
4. **Long-term**: Consider public API for team data

---

**Last Updated**: November 11, 2025  
**Status**: Planning Phase  
**Priority**: High


/**
 * File Storage Service
 * Handles secure file uploads to Firebase Storage with role-based access control
 * 
 * Security Model:
 * - Participant files: Private to owner, shelter admin, super admin
 * - Shelter files: Accessible by shelter admins and super admin
 * - Profile pictures: Visible to shelter community
 * - Donor files: Private to donor and super admin only
 */

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject, 
  listAll,
  uploadBytesResumable,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from '@/lib/firebase';

// File type definitions
export interface FileUploadOptions {
  folder: 'participants' | 'shelters' | 'profiles' | 'donors' | 'system' | 'public' | 'temp';
  userId: string;
  shelterId?: string;
  fileName?: string;
  metadata?: Record<string, string>;
}

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

export interface FileMetadata {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
  downloadURL: string;
  customMetadata?: Record<string, string>;
}

// Allowed file types by category
const ALLOWED_FILE_TYPES = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  documents: ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  spreadsheets: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  all: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
};

// File size limits (in bytes)
const SIZE_LIMITS = {
  profilePicture: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  report: 50 * 1024 * 1024, // 50MB
  default: 10 * 1024 * 1024 // 10MB
};

/**
 * Generate file path based on folder type and user/shelter IDs
 */
function generateFilePath(options: FileUploadOptions, fileName: string): string {
  const { folder, userId, shelterId } = options;
  
  switch (folder) {
    case 'participants':
      return `participants/${userId}/${fileName}`;
    case 'shelters':
      if (!shelterId) throw new Error('Shelter ID required for shelter files');
      return `shelters/${shelterId}/${fileName}`;
    case 'profiles':
      return `profiles/${userId}/${fileName}`;
    case 'donors':
      return `donors/${userId}/${fileName}`;
    case 'system':
      return `system/${fileName}`;
    case 'public':
      return `public/${fileName}`;
    case 'temp':
      return `temp/${userId}/${fileName}`;
    default:
      throw new Error(`Invalid folder type: ${folder}`);
  }
}

/**
 * Validate file type and size
 */
function validateFile(file: File, allowedTypes: string[] = ALLOWED_FILE_TYPES.all, maxSize: number = SIZE_LIMITS.default): void {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum allowed size of ${maxSize} bytes`);
  }
}

/**
 * Upload Profile Picture
 * Used by all user types for avatar images
 */
export async function uploadProfilePicture(
  file: File, 
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  validateFile(file, ALLOWED_FILE_TYPES.images, SIZE_LIMITS.profilePicture);
  
  const fileName = `avatar.${file.name.split('.').pop()}`;
  const filePath = generateFilePath({ folder: 'profiles', userId }, fileName);
  const storageRef = ref(storage, filePath);
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      customMetadata: {
        uploadedBy: userId,
        uploadDate: new Date().toISOString(),
        fileType: 'profile_picture'
      }
    });
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state as any
          };
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }
}

/**
 * Upload Participant Document
 * Secure uploads for participant files (ID, emergency docs, etc.)
 */
export async function uploadParticipantDocument(
  file: File,
  participantId: string,
  documentType: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  validateFile(file, ALLOWED_FILE_TYPES.all, SIZE_LIMITS.document);
  
  const timestamp = Date.now();
  const fileName = `${documentType}_${timestamp}.${file.name.split('.').pop()}`;
  const filePath = generateFilePath({ folder: 'participants', userId: participantId }, fileName);
  const storageRef = ref(storage, filePath);
  
  const metadata = {
    customMetadata: {
      uploadedBy: participantId,
      uploadDate: new Date().toISOString(),
      documentType,
      fileType: 'participant_document',
      originalFileName: file.name
    }
  };
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state as any
          };
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(storageRef);
  }
}

/**
 * Upload Shelter Document
 * For shelter admins to upload service photos, reports, etc.
 */
export async function uploadShelterDocument(
  file: File,
  shelterId: string,
  documentType: string,
  uploadedByUserId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  validateFile(file, ALLOWED_FILE_TYPES.all, SIZE_LIMITS.document);
  
  const timestamp = Date.now();
  const fileName = `${documentType}_${timestamp}.${file.name.split('.').pop()}`;
  const filePath = generateFilePath({ folder: 'shelters', userId: uploadedByUserId, shelterId }, fileName);
  const storageRef = ref(storage, filePath);
  
  const metadata = {
    customMetadata: {
      uploadedBy: uploadedByUserId,
      uploadDate: new Date().toISOString(),
      documentType,
      fileType: 'shelter_document',
      shelterId,
      originalFileName: file.name
    }
  };
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state as any
          };
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(storageRef);
  }
}

/**
 * Upload System Report
 * For super admins to upload platform-wide reports
 */
export async function uploadSystemReport(
  file: File,
  reportType: string,
  uploadedByUserId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  validateFile(file, [...ALLOWED_FILE_TYPES.documents, ...ALLOWED_FILE_TYPES.spreadsheets], SIZE_LIMITS.report);
  
  const timestamp = Date.now();
  const fileName = `${reportType}_${timestamp}.${file.name.split('.').pop()}`;
  const filePath = generateFilePath({ folder: 'system', userId: uploadedByUserId }, fileName);
  const storageRef = ref(storage, filePath);
  
  const metadata = {
    customMetadata: {
      uploadedBy: uploadedByUserId,
      uploadDate: new Date().toISOString(),
      reportType,
      fileType: 'system_report',
      originalFileName: file.name
    }
  };
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state as any
          };
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(storageRef);
  }
}

/**
 * List Files in Directory
 * Get all files in a specific directory with metadata
 */
export async function listFiles(options: FileUploadOptions): Promise<FileMetadata[]> {
  const dirPath = generateFilePath(options, '').slice(0, -1); // Remove trailing slash
  const dirRef = ref(storage, dirPath);
  
  try {
    const result = await listAll(dirRef);
    const files: FileMetadata[] = [];
    
    for (const fileRef of result.items) {
      const [metadata, downloadURL] = await Promise.all([
        getMetadata(fileRef),
        getDownloadURL(fileRef)
      ]);
      
      files.push({
        name: metadata.name,
        fullPath: metadata.fullPath,
        size: metadata.size,
        contentType: metadata.contentType || 'unknown',
        timeCreated: metadata.timeCreated,
        updated: metadata.updated,
        downloadURL,
        customMetadata: metadata.customMetadata
      });
    }
    
    return files.sort((a, b) => new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime());
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
}

/**
 * Delete File
 * Remove file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
}

/**
 * Get File Download URL
 * Get direct download link for a file
 */
export async function getFileDownloadURL(filePath: string): Promise<string> {
  const fileRef = ref(storage, filePath);
  return getDownloadURL(fileRef);
}

/**
 * Temporary Upload (for processing)
 * Upload to temp folder with automatic cleanup
 */
export async function uploadTempFile(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  validateFile(file);
  
  const timestamp = Date.now();
  const fileName = `temp_${timestamp}.${file.name.split('.').pop()}`;
  const filePath = generateFilePath({ folder: 'temp', userId }, fileName);
  const storageRef = ref(storage, filePath);
  
  const metadata = {
    customMetadata: {
      uploadedBy: userId,
      uploadDate: new Date().toISOString(),
      fileType: 'temporary',
      originalFileName: file.name,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
    }
  };
  
  if (onProgress) {
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress: UploadProgress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            state: snapshot.state as any
          };
          onProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } else {
    await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(storageRef);
  }
}

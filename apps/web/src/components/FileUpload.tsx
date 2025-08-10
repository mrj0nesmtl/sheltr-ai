'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  uploadProfilePicture, 
  uploadParticipantDocument,
  uploadShelterDocument,
  uploadSystemReport,
  listFiles,
  deleteFile,
  type UploadProgress,
  type FileMetadata
} from '@/services/fileStorageService';

interface FileUploadProps {
  uploadType: 'profile' | 'participant' | 'shelter' | 'system';
  userId: string;
  shelterId?: string;
  documentType?: string;
  allowedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  onUploadComplete?: (downloadURL: string, metadata?: FileMetadata) => void;
  onUploadError?: (error: string) => void;
  showFileList?: boolean;
  className?: string;
}

const getFileIcon = (contentType: string) => {
  if (contentType.startsWith('image/')) return <Image className="h-4 w-4" />;
  if (contentType.includes('pdf')) return <FileText className="h-4 w-4" />;
  return <File className="h-4 w-4" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export function FileUpload({
  uploadType,
  userId,
  shelterId,
  documentType = 'document',
  allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  multiple = false,
  onUploadComplete,
  onUploadError,
  showFileList = true,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing files on component mount
  React.useEffect(() => {
    if (showFileList) {
      loadFiles();
    }
  }, [uploadType, userId, shelterId, showFileList]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      let options;
      switch (uploadType) {
        case 'profile':
          options = { folder: 'profiles' as const, userId };
          break;
        case 'participant':
          options = { folder: 'participants' as const, userId };
          break;
        case 'shelter':
          if (!shelterId) return;
          options = { folder: 'shelters' as const, userId, shelterId };
          break;
        case 'system':
          options = { folder: 'system' as const, userId };
          break;
        default:
          return;
      }
      
      const fileList = await listFiles(options);
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const file = selectedFiles[0]; // Handle single file for now
    
    setUploading(true);
    setUploadProgress(null);

    try {
      let downloadURL: string;

      const progressCallback = (progress: UploadProgress) => {
        setUploadProgress(progress);
      };

      switch (uploadType) {
        case 'profile':
          downloadURL = await uploadProfilePicture(file, userId, progressCallback);
          break;
        case 'participant':
          downloadURL = await uploadParticipantDocument(file, userId, documentType, progressCallback);
          break;
        case 'shelter':
          if (!shelterId) throw new Error('Shelter ID required');
          downloadURL = await uploadShelterDocument(file, shelterId, documentType, userId, progressCallback);
          break;
        case 'system':
          downloadURL = await uploadSystemReport(file, documentType, userId, progressCallback);
          break;
        default:
          throw new Error('Invalid upload type');
      }

      // Success
      onUploadComplete?.(downloadURL);
      if (showFileList) {
        await loadFiles(); // Refresh file list
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDelete = async (filePath: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      await deleteFile(filePath);
      await loadFiles(); // Refresh file list
    } catch (error) {
      console.error('Delete error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const getUploadTitle = () => {
    switch (uploadType) {
      case 'profile': return 'Upload Profile Picture';
      case 'participant': return 'Upload Document';
      case 'shelter': return 'Upload Shelter File';
      case 'system': return 'Upload System Report';
      default: return 'Upload File';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mb-4">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold mt-2">{getUploadTitle()}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {uploadType === 'profile' 
                  ? 'Choose a profile picture (JPG, PNG, WebP - Max 5MB)'
                  : `Choose ${documentType} files (Max ${formatFileSize(maxSize)})`
                }
              </p>
            </div>

            {uploading ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">Uploading...</div>
                {uploadProgress && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress.progress} className="w-full" />
                    <div className="text-xs text-gray-500">
                      {formatFileSize(uploadProgress.bytesTransferred)} / {formatFileSize(uploadProgress.totalBytes)}
                      ({Math.round(uploadProgress.progress)}%)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  accept={allowedTypes.join(',')}
                  multiple={multiple}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {showFileList && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Uploaded Files</h4>
              <Button variant="outline" size="sm" onClick={loadFiles} disabled={loading}>
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading files...</div>
            ) : files.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No files uploaded yet</div>
            ) : (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      {getFileIcon(file.contentType)}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.name}</div>
                        <div className="text-sm text-gray-500">
                          {formatFileSize(file.size)} • {new Date(file.timeCreated).toLocaleDateString()}
                        </div>
                        {file.customMetadata?.documentType && (
                          <Badge variant="secondary" className="mt-1">
                            {file.customMetadata.documentType}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(file.downloadURL, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = file.downloadURL;
                          link.download = file.name;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(file.fullPath)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

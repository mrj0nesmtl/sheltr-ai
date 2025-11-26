/**
 * SHELTR-AI File Update Request Modal
 * Allows users to request changes to source files (GitHub/Local)
 */

'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  Send, 
  X, 
  AlertCircle, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { fileUpdateRequestService } from '@/services/fileUpdateRequestService';
import { useAuth } from '@/contexts/AuthContext';

interface FileUpdateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  documentPath?: string;
  sourceType: 'github' | 'secure_docs';
}

export function FileUpdateRequestModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  documentPath,
  sourceType
}: FileUpdateRequestModalProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [requestData, setRequestData] = useState({
    requestType: 'content_update' as 'content_update' | 'correction' | 'addition' | 'removal' | 'other',
    summary: '',
    details: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent'
  });

  const handleSubmit = async () => {
    if (!requestData.summary.trim() || !requestData.details.trim()) {
      setError('Please provide both a summary and details for your request.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      await fileUpdateRequestService.createRequest({
        document_id: documentId,
        document_title: documentTitle,
        document_path: documentPath || '',
        source_type: sourceType,
        request_type: requestData.requestType,
        summary: requestData.summary,
        details: requestData.details,
        priority: requestData.priority,
        requested_by: user?.email || 'Unknown',
        requested_by_name: user?.displayName || user?.email || 'Unknown User',
        status: 'pending'
      });

      setSuccess(true);
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setRequestData({
          requestType: 'content_update',
          summary: '',
          details: '',
          priority: 'normal'
        });
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error submitting file update request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setRequestData({
        requestType: 'content_update',
        summary: '',
        details: '',
        priority: 'normal'
      });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-purple-600" />
            Request File Update
          </DialogTitle>
          <DialogDescription className="text-sm">
            Submit a request to update the source file for this document. 
            Super admins will be notified and can make the changes.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8">
            <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200 ml-2">
                <strong>Request submitted successfully!</strong>
                <br />
                Super admins have been notified and will review your request.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Document Info */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Document:</span>
                <span className="font-medium">{documentTitle}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Source:</span>
                <Badge variant="outline" className="text-xs">
                  {sourceType === 'github' ? '🔗 GitHub Repository' : '🔒 Local Secure Docs'}
                </Badge>
              </div>
              {documentPath && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Path:</span>
                  <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                    {documentPath}
                  </code>
                </div>
              )}
            </div>

            {/* Request Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Request Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { value: 'content_update', label: 'Content Update', icon: '📝' },
                  { value: 'correction', label: 'Correction', icon: '✏️' },
                  { value: 'addition', label: 'Addition', icon: '➕' },
                  { value: 'removal', label: 'Removal', icon: '➖' },
                  { value: 'other', label: 'Other', icon: '💡' }
                ].map((type) => (
                  <Button
                    key={type.value}
                    type="button"
                    variant={requestData.requestType === type.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRequestData({ ...requestData, requestType: type.value as typeof requestData.requestType })}
                    className="justify-start"
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm font-medium mb-2 block">Priority *</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'low', label: 'Low', color: 'border-gray-300' },
                  { value: 'normal', label: 'Normal', color: 'border-blue-300' },
                  { value: 'high', label: 'High', color: 'border-orange-300' },
                  { value: 'urgent', label: 'Urgent', color: 'border-red-300' }
                ].map((priority) => (
                  <Button
                    key={priority.value}
                    type="button"
                    variant={requestData.priority === priority.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setRequestData({ ...requestData, priority: priority.value as typeof requestData.priority })}
                    className={requestData.priority === priority.value ? '' : priority.color}
                  >
                    {priority.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Summary * <span className="text-xs text-muted-foreground">(Brief one-line description)</span>
              </label>
              <Input
                value={requestData.summary}
                onChange={(e) => setRequestData({ ...requestData, summary: e.target.value })}
                placeholder="e.g., Update Adyen integration pricing section"
                maxLength={100}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {requestData.summary.length}/100
              </div>
            </div>

            {/* Details */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Details * <span className="text-xs text-muted-foreground">(What needs to be changed and why)</span>
              </label>
              <Textarea
                value={requestData.details}
                onChange={(e) => setRequestData({ ...requestData, details: e.target.value })}
                placeholder="Provide detailed information about the requested changes:&#10;• What needs to be updated?&#10;• Why is this change needed?&#10;• Any specific requirements or context?"
                className="min-h-[150px] font-mono text-sm"
                maxLength={2000}
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {requestData.details.length}/2000
              </div>
            </div>

            {/* Info Alert */}
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-xs text-blue-800 dark:text-blue-200 ml-2">
                <strong>Note:</strong> Your request will be visible to super admins and will remain 
                in the system until it's completed or rejected. You'll be notified of any status updates.
              </AlertDescription>
            </Alert>

            {/* Error Message */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="ml-2">{error}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          {!success && (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={submitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !requestData.summary.trim() || !requestData.details.trim()}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {submitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


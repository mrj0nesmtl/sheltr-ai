'use client';

import { useState } from 'react';
import {
  createQualifiedInvestor,
  CreateQualifiedInvestorRequest,
  QualifiedInvestorResponse,
  InvestorMetadata
} from '@/services/qualifiedInvestorService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  UserPlus, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  CheckCheck,
  Key
} from 'lucide-react';

interface QualifiedInvestorRegistrationProps {
  onSuccess?: (investor: QualifiedInvestorResponse) => void;
}

export default function QualifiedInvestorRegistration({ onSuccess }: QualifiedInvestorRegistrationProps) {
  // Form state
  const [formData, setFormData] = useState<CreateQualifiedInvestorRequest>({
    display_name: '',
    email: '',
    metadata: {
      email: '',
      phone: '',
      website: '',
      linkedin: '',
      company: '',
      investment_range: '',
      check_size: '',
      accreditation_status: 'pending',
      location: '',
      source: 'direct',
      referral_source: '',
      dataroom_access_level: 'full',
      notes: '',
      initial_contact_date: new Date().toISOString().split('T')[0], // Today's date
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Password display state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [createdInvestor, setCreatedInvestor] = useState<QualifiedInvestorResponse | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordCopied, setPasswordCopied] = useState(false);

  // Handle form field changes
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateMetadata = (field: keyof InvestorMetadata, value: any) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value,
      },
    }));
  };

  // Copy password to clipboard
  const copyPassword = async () => {
    if (createdInvestor) {
      await navigator.clipboard.writeText(createdInvestor.generated_password);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Sync email to metadata
      const requestData: CreateQualifiedInvestorRequest = {
        ...formData,
        metadata: {
          ...formData.metadata,
          email: formData.email, // Ensure email is in metadata
        },
      };

      const result = await createQualifiedInvestor(requestData);
      
      // Show password modal
      setCreatedInvestor(result);
      setShowPasswordModal(true);

      // Reset form
      setFormData({
        display_name: '',
        email: '',
        metadata: {
          email: '',
          phone: '',
          website: '',
          linkedin: '',
          company: '',
          investment_range: '',
          check_size: '',
          accreditation_status: 'pending',
          location: '',
          source: 'direct',
          referral_source: '',
          dataroom_access_level: 'full',
          notes: '',
          initial_contact_date: new Date().toISOString().split('T')[0],
        },
      });

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err: any) {
      console.error('Failed to create investor:', err);
      setError(err.message || 'Failed to create qualified investor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Register Qualified Investor
          </CardTitle>
          <CardDescription>
            Create a new investor account with dataroom access. Password will be auto-generated and displayed once.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Full Name *</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => updateFormData('display_name', e.target.value)}
                    placeholder="Armando Ceron"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="investor@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.metadata.phone}
                    onChange={(e) => updateMetadata('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.metadata.location}
                    onChange={(e) => updateMetadata('location', e.target.value)}
                    placeholder="Los Angeles, CA"
                  />
                </div>
              </div>
            </div>

            {/* Company & Investment Details */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">Company & Investment Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.metadata.company}
                    onChange={(e) => updateMetadata('company', e.target.value)}
                    placeholder="Acme Ventures"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment_range">Investment Range</Label>
                  <Input
                    id="investment_range"
                    value={formData.metadata.investment_range}
                    onChange={(e) => updateMetadata('investment_range', e.target.value)}
                    placeholder="$1M - $5M"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_size">Typical Check Size</Label>
                  <Input
                    id="check_size"
                    value={formData.metadata.check_size}
                    onChange={(e) => updateMetadata('check_size', e.target.value)}
                    placeholder="$2.5M"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accreditation_status">Accreditation Status</Label>
                  <Select
                    value={formData.metadata.accreditation_status}
                    onValueChange={(value: any) => updateMetadata('accreditation_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="not_verified">Not Verified</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">Contact & Social</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.metadata.website}
                    onChange={(e) => updateMetadata('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    value={formData.metadata.linkedin}
                    onChange={(e) => updateMetadata('linkedin', e.target.value)}
                    placeholder="linkedin.com/in/username"
                  />
                </div>
              </div>
            </div>

            {/* Source & Context */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">Source & Context</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={formData.metadata.source}
                    onValueChange={(value: any) => updateMetadata('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="direct">Direct Contact</SelectItem>
                      <SelectItem value="event">Event/Conference</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="referral_source">Referral Source (if applicable)</Label>
                  <Input
                    id="referral_source"
                    value={formData.metadata.referral_source}
                    onChange={(e) => updateMetadata('referral_source', e.target.value)}
                    placeholder="Alexander Kline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initial_contact_date">Initial Contact Date</Label>
                  <Input
                    id="initial_contact_date"
                    type="date"
                    value={formData.metadata.initial_contact_date}
                    onChange={(e) => updateMetadata('initial_contact_date', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Access & Notes */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-semibold">Access & Notes</h3>
              
              <div className="space-y-2">
                <Label htmlFor="dataroom_access_level">Dataroom Access Level</Label>
                <Select
                  value={formData.metadata.dataroom_access_level}
                  onValueChange={(value: any) => updateMetadata('dataroom_access_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Access</SelectItem>
                    <SelectItem value="limited">Limited Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.metadata.notes}
                  onChange={(e) => updateMetadata('notes', e.target.value)}
                  placeholder="Additional notes about this investor..."
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <Button
                type="submit"
                disabled={loading || !formData.display_name || !formData.email}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Investor Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Display Modal */}
      <AlertDialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Investor Account Created!
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="text-sm">
                <strong>{createdInvestor?.display_name}</strong> has been successfully registered as a qualified investor.
              </div>

              {/* Generated Password Display */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 dark:text-amber-100 font-semibold">
                  <Key className="h-4 w-4" />
                  Auto-Generated Password
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white dark:bg-slate-900 rounded px-3 py-2 border font-mono text-sm">
                    {passwordVisible ? (
                      createdInvestor?.generated_password
                    ) : (
                      '••••••••••••'
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPassword}
                  >
                    {passwordCopied ? <CheckCheck className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <Alert className="bg-amber-100 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700">
                  <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  <AlertDescription className="text-xs text-amber-900 dark:text-amber-100">
                    <strong>IMPORTANT:</strong> This password is displayed only once and is not sent via email. 
                    Please copy it now and securely provide it to the investor. Consider storing it in your secure credentials document.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Account Details */}
              <div className="space-y-2 text-sm">
                <div><strong>Email:</strong> {createdInvestor?.email}</div>
                <div><strong>UID:</strong> <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{createdInvestor?.uid}</code></div>
                <div><strong>Dataroom Access:</strong> {createdInvestor?.metadata.dataroom_access_level}</div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowPasswordModal(false)}>
              I&apos;ve Recorded the Password
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PlatformQRCodeService, PlatformQRCode, QRCodeStats } from '@/services/platformQRCodeService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  QrCode,
  Plus,
  Download,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  ExternalLink,
  TrendingUp,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export function PlatformQRCodeManager() {
  const { user } = useAuth();
  const [qrCodes, setQrCodes] = useState<PlatformQRCode[]>([]);
  const [stats, setStats] = useState<QRCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedQRCode, setSelectedQRCode] = useState<PlatformQRCode | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetUrl: '',
    category: 'info' as PlatformQRCode['category'],
    expiresAt: '',
    campaign: '',
    medium: '',
    source: ''
  });

  // Popular pages for quick selection
  const popularPages = [
    { label: 'Home Page', value: '/' },
    { label: 'About Us', value: '/about' },
    { label: 'Scan & Give', value: '/scan-give' },
    { label: 'Solutions', value: '/solutions' },
    { label: 'Team', value: '/team' },
    { label: 'Blog', value: '/blog' },
    { label: 'Contact', value: '/contact' },
    { label: 'Ecosystem', value: '/ecosystem' },
    { label: 'Impact', value: '/impact' },
    { label: 'Tokenomics', value: '/docs/tokenomics' },
    { label: 'Shelter Directory', value: '/shelters' },
  ];

  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const [codes, statistics] = await Promise.all([
        PlatformQRCodeService.getAllQRCodes(),
        PlatformQRCodeService.getQRCodeStats()
      ]);
      setQrCodes(codes);
      setStats(statistics);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQRCode = async () => {
    if (!user) return;
    if (!formData.name || !formData.targetUrl) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setCreating(true);

      const metadata: any = {};
      if (formData.campaign) metadata.campaign = formData.campaign;
      if (formData.medium) metadata.medium = formData.medium;
      if (formData.source) metadata.source = formData.source;

      await PlatformQRCodeService.generateQRCode(
        {
          name: formData.name,
          description: formData.description,
          targetUrl: formData.targetUrl,
          category: formData.category,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined
        },
        user.uid,
        user.displayName || user.email || 'Admin'
      );

      toast.success('QR code created successfully!');
      setShowCreateDialog(false);
      resetForm();
      loadQRCodes();
    } catch (error) {
      console.error('Error creating QR code:', error);
      toast.error('Failed to create QR code');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (qrCodeId: string, isActive: boolean) => {
    try {
      await PlatformQRCodeService.toggleActive(qrCodeId, !isActive);
      toast.success(`QR code ${!isActive ? 'activated' : 'deactivated'}`);
      loadQRCodes();
    } catch (error) {
      console.error('Error toggling QR code:', error);
      toast.error('Failed to update QR code');
    }
  };

  const handleDeleteQRCode = async (qrCodeId: string) => {
    if (!confirm('Are you sure you want to delete this QR code? This action cannot be undone.')) {
      return;
    }

    try {
      await PlatformQRCodeService.deleteQRCode(qrCodeId);
      toast.success('QR code deleted successfully');
      loadQRCodes();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const handleDownloadQRCode = (qrCode: PlatformQRCode) => {
    const link = document.createElement('a');
    link.href = qrCode.qrCodeUrl;
    link.download = `${qrCode.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR code downloaded');
  };

  const handleCopyURL = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetUrl: '',
      category: 'info',
      expiresAt: '',
      campaign: '',
      medium: '',
      source: ''
    });
  };

  const getCategoryColor = (category: PlatformQRCode['category']) => {
    const colors = {
      marketing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      donation: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      event: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[category];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCodes || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeCodes || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalScans || 0}</div>
            <p className="text-xs text-muted-foreground">
              All-time scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.topPerformingCodes[0]?.scanCount || 0}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {stats?.topPerformingCodes[0]?.name || 'No scans yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create QR Code Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">QR Code Management</h3>
          <p className="text-sm text-muted-foreground">
            Generate trackable QR codes for public pages
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New QR Code</DialogTitle>
              <DialogDescription>
                Generate a trackable QR code for any public page on the SHELTR platform
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">QR Code Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Homepage QR - Spring Campaign"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description for internal reference"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              {/* Target URL */}
              <div className="space-y-2">
                <Label htmlFor="targetUrl">Target Page *</Label>
                <Select
                  value={formData.targetUrl}
                  onValueChange={(value) => setFormData({ ...formData, targetUrl: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page or enter custom URL" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularPages.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Or enter custom path (e.g., /custom-page)"
                  value={formData.targetUrl}
                  onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="donation">Donation</SelectItem>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* UTM Parameters */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tracking Parameters (Optional)</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="Campaign"
                    value={formData.campaign}
                    onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
                  />
                  <Input
                    placeholder="Medium"
                    value={formData.medium}
                    onChange={(e) => setFormData({ ...formData, medium: e.target.value })}
                  />
                  <Input
                    placeholder="Source"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQRCode} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <QrCode className="h-4 w-4 mr-2" />
                    Create QR Code
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Codes Table */}
      <Card>
        <CardHeader>
          <CardTitle>All QR Codes</CardTitle>
          <CardDescription>
            Manage and track all platform QR codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <div className="text-center py-12">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No QR codes created yet</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowCreateDialog(true)}
              >
                Create Your First QR Code
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>QR Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Target URL</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Scans</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrCodes.map((qrCode) => (
                  <TableRow key={qrCode.id}>
                    <TableCell>
                      <img
                        src={qrCode.qrCodeUrl}
                        alt={qrCode.name}
                        className="h-12 w-12 rounded border"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{qrCode.name}</div>
                        {qrCode.description && (
                          <div className="text-xs text-muted-foreground">
                            {qrCode.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs">{qrCode.targetUrl}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCopyURL(qrCode.fullUrl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(qrCode.category)}>
                        {qrCode.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{qrCode.scanCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {qrCode.isActive ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadQRCode(qrCode)}
                          title="Download QR Code"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(qrCode.id, qrCode.isActive)}
                          title={qrCode.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {qrCode.isActive ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQRCode(qrCode.id)}
                          title="Delete QR Code"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


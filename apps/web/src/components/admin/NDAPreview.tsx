"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  FileText, 
  Clock, 
  MapPin, 
  User, 
  Eye,
  Users,
  CheckCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { NDAService } from '@/services/ndaService';

interface NDAPreviewProps {
  onClose: () => void;
}

export function NDAPreview({ onClose }: NDAPreviewProps) {
  const [ndaStats, setNdaStats] = useState({
    totalSigned: 0,
    recentSignatures: 0,
    pendingAdmins: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const stats = await NDAService.getNDAStatistics();
      setNdaStats(stats);
    };
    loadStats();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] bg-white dark:bg-gray-900">
        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div className="text-left">
                <CardTitle className="text-2xl sm:text-3xl font-bold">
                  NDA Preview & Statistics
                </CardTitle>
                <CardDescription className="text-base">
                  Platform Administrator Nondisclosure Agreement
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{ndaStats.totalSigned}</div>
              <div className="text-sm text-gray-600">Total Signed</div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{ndaStats.recentSignatures}</div>
              <div className="text-sm text-gray-600">Last 30 Days</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{ndaStats.pendingAdmins}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          <Badge variant="outline" className="mx-auto mt-4">
            <Eye className="w-4 h-4 mr-1" />
            Super Admin Preview
          </Badge>
        </CardHeader>

        <div className="max-h-[60vh] overflow-y-auto px-6">
          <CardContent className="pt-6">
            {/* Header Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium">Document:</span>
                  <span className="ml-1">SHELTR Platform NDA</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium">Version:</span>
                  <span className="ml-1">{NDAService.getDocumentVersion()}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="font-medium">Preview Date:</span>
                  <span className="ml-1">{currentDate}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-medium">Applies To:</span>
                  <span className="ml-1">Platform Administrators</span>
                </div>
              </div>
            </div>

            {/* NDA Content */}
            <div className="space-y-6 text-sm sm:text-base">
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">NONDISCLOSURE AGREEMENT</h1>
                <p className="text-lg font-semibold text-blue-600">SHELTR Multi-Tenant Platform</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 text-red-600">📋 CONFIDENTIAL INFORMATION</h3>
                <p className="mb-3">As a Platform Administrator, you will have access to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>User personal data, shelter operations data, donation records</li>
                  <li>System architecture, security protocols, API keys</li>
                  <li>Business strategies, financial metrics, proprietary algorithms</li>
                  <li>All data within the SHELTR ecosystem and connected shelters</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">✅ OBLIGATIONS</h3>
                <p className="mb-3 font-medium">You agree to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Keep all information strictly confidential</li>
                  <li>Use information solely for authorized platform administration</li>
                  <li>Not disclose information to unauthorized parties</li>
                  <li>Implement reasonable security measures to protect data</li>
                  <li>Report any suspected data breaches immediately</li>
                  <li>Return/delete all confidential information upon role termination</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-orange-600">🚫 RESTRICTIONS</h3>
                <p className="mb-3 font-medium">You will NOT:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Share login credentials or access with others</li>
                  <li>Access data beyond your administrative responsibilities</li>
                  <li>Use confidential information for personal benefit</li>
                  <li>Discuss sensitive information outside secure channels</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">⚖️ COMPLIANCE</h3>
                <p>
                  This agreement complies with applicable data protection laws including GDPR, CCPA, and PIPEDA. 
                  Violation may result in immediate access revocation and legal action.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">📅 TERM</h3>
                <p>
                  This agreement remains in effect throughout your tenure as Platform Administrator and for 
                  <strong> 2 years thereafter</strong>.
                </p>
              </div>

              <Separator className="my-6" />

              {/* Preview Notice */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-blue-600">Super Admin Preview Notice</h3>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  This is exactly what Platform Administrators see when they first log into their dashboard.
                  The modal cannot be dismissed until they sign the agreement.
                </p>
                <div className="text-xs text-gray-600 space-y-1">
                  <p><strong>Digital Signature:</strong> Platform Admins must type their full legal name</p>
                  <p><strong>Audit Trail:</strong> IP address, user agent, and timestamp are automatically captured</p>
                  <p><strong>Database Storage:</strong> Signatures stored in <code>nda_agreements</code> collection</p>
                  <p><strong>Notifications:</strong> Super Admins receive notifications when NDAs are signed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Close Preview
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3">
            Only Super Administrators can view this preview. Platform Administrators see this as a required modal.
          </p>
        </div>
      </Card>
    </div>
  );
}

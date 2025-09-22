"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
// Using simple scrollable div instead of ScrollArea for better compatibility
import { 
  Shield, 
  FileText, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NDAService } from '@/services/ndaService';

interface NDAModalProps {
  onAccept: () => void;
  onCancel?: () => void;
}

export function NDAModal({ onAccept, onCancel }: NDAModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signature, setSignature] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSign = async () => {
    if (!user || !agreed || !signature.trim()) return;

    setIsLoading(true);
    try {
      const success = await NDAService.signNDA({
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || user.email?.split('@')[0] || 'Platform Administrator',
        signature: signature.trim(),
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent
      });

      if (success) {
        onAccept();
      } else {
        alert('Failed to save NDA signature. Please try again.');
      }
    } catch (error) {
      console.error('Error signing NDA:', error);
      alert('An error occurred while saving your signature. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get client IP address (simplified for demo)
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Default behavior - sign out user if no cancel handler provided
      window.location.href = '/';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] bg-white dark:bg-gray-900">
        {/* Breadcrumb Navigation */}
        <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span>Dashboard</span>
              <span>/</span>
              <span className="font-medium text-blue-600">Required NDA Agreement</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Return to Home
            </Button>
          </div>
        </div>

        <CardHeader className="text-center border-b">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Required: Digital Signature
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Platform Administrator Nondisclosure Agreement
          </CardDescription>
          <Badge variant="outline" className="mx-auto mt-2">
            <AlertTriangle className="w-4 h-4 mr-1" />
            One-time requirement
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
                  <span className="font-medium">Date:</span>
                  <span className="ml-1">{currentDate}</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="font-medium">Administrator:</span>
                  <span className="ml-1">{user?.displayName || user?.email}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-medium">Role:</span>
                  <span className="ml-1">Platform Administrator</span>
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

              {/* Signature Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-center">Digital Signature Required</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="agreement"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="agreement" className="text-sm font-medium">
                      I acknowledge that I have read, understood, and agree to be bound by this 
                      Nondisclosure Agreement.
                    </label>
                  </div>

                  <div>
                    <label htmlFor="signature" className="block text-sm font-medium mb-2">
                      Digital Signature (Type your full name):
                    </label>
                    <input
                      type="text"
                      id="signature"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Type your full legal name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={!agreed}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                      <strong>Date:</strong> {currentDate}
                    </div>
                    <div>
                      <strong>IP Address:</strong> [Auto-captured for audit trail]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSign}
              disabled={!agreed || !signature.trim() || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving Signature...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Sign & Continue to Dashboard
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3">
            This signature is required to access the SHELTR Platform Administrator dashboard.
          </p>
        </div>
      </Card>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Refresh, 
  Download, 
  Share2,
  Copy,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useMockWallet } from './MockWalletProvider';

interface QRCodeDisplayProps {
  variant?: 'default' | 'compact' | 'detailed';
  showFeatures?: boolean;
  showExpiryTimer?: boolean;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  variant = 'default',
  showFeatures = true,
  showExpiryTimer = true,
  className = ''
}) => {
  const { 
    qrCode, 
    loading, 
    error, 
    generateQR,
    clearError
  } = useMockWallet();

  const [timeUntilExpiry, setTimeUntilExpiry] = useState<string>('');
  const [showQRData, setShowQRData] = useState(false);
  const [copied, setCopied] = useState(false);

  // Calculate time until expiry
  useEffect(() => {
    if (!qrCode?.displayData.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = qrCode.displayData.expiresAt;
      const timeLeft = expiry ? expiry - now : 0;

      if (timeLeft <= 0) {
        setTimeUntilExpiry('Expired');
        return;
      }

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (hours > 0) {
        setTimeUntilExpiry(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeUntilExpiry(`${minutes}m ${seconds}s`);
      } else {
        setTimeUntilExpiry(`${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrCode?.displayData.expiresAt]);

  const handleCopyQRData = async () => {
    if (qrCode?.qrString) {
      try {
        await navigator.clipboard.writeText(qrCode.qrString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy QR data:', err);
      }
    }
  };

  const handleGenerateNew = () => {
    generateQR();
  };

  const handleDownload = () => {
    // Mock download functionality
    console.log('QR Code download would be implemented here');
  };

  const handleShare = async () => {
    if (navigator.share && qrCode?.qrString) {
      try {
        await navigator.share({
          title: 'SHELTR Participant QR Code',
          text: 'My SHELTR QR Code for payments and identification',
          url: `data:text/plain,${qrCode.qrString}`
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <QrCode className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-pulse" />
            <p className="text-sm text-muted-foreground">Generating QR code...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2 text-red-600 mb-3">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">QR Generation Error</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={handleGenerateNew}>
              Try Again
            </Button>
            <Button size="sm" variant="ghost" onClick={clearError}>
              Dismiss
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!qrCode) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <QrCode className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-sm text-muted-foreground">No QR code generated</p>
            <Button size="sm" onClick={handleGenerateNew}>
              Generate QR Code
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Your QR Code</div>
              <div className="text-xs text-muted-foreground">
                ID: {qrCode.participantId}
              </div>
              {showExpiryTimer && timeUntilExpiry && (
                <div className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {timeUntilExpiry}
                </div>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleGenerateNew}>
              <Refresh className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant with full information
  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Participant QR Code</span>
            </CardTitle>
            <CardDescription>
              For payments, identification, and service access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* QR Code Display */}
            <div className="text-center">
              <div className="mx-auto w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                QR Code (Mock Display)
              </div>
            </div>

            {/* QR Information */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Participant ID:</span>
                <span className="text-sm">{qrCode.participantId}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Wallet Address:</span>
                <span className="text-xs font-mono">
                  {qrCode.walletAddress.slice(0, 6)}...{qrCode.walletAddress.slice(-4)}
                </span>
              </div>

              {showExpiryTimer && timeUntilExpiry && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Expires in:</span>
                  <span className={`text-sm ${timeUntilExpiry === 'Expired' ? 'text-red-600' : 'text-green-600'}`}>
                    <Clock className="h-3 w-3 inline mr-1" />
                    {timeUntilExpiry}
                  </span>
                </div>
              )}
            </div>

            {/* Features */}
            {showFeatures && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Enabled Features:</div>
                <div className="flex flex-wrap gap-2">
                  {qrCode.features.payments && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Payments
                    </Badge>
                  )}
                  {qrCode.features.identification && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ID Verification
                    </Badge>
                  )}
                  {qrCode.features.serviceAccess && (
                    <Badge variant="outline">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Service Access
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* QR Data (Developer View) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">QR Data:</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-1"
                    onClick={() => setShowQRData(!showQRData)}
                  >
                    {showQRData ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-auto p-1"
                    onClick={handleCopyQRData}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {showQRData && (
                <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded break-all max-h-32 overflow-y-auto">
                  {qrCode.qrString}
                </div>
              )}
              {copied && (
                <div className="text-xs text-green-600">QR data copied to clipboard!</div>
              )}
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={handleGenerateNew}>
                <Refresh className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>Your QR Code</span>
        </CardTitle>
        <CardDescription>For payments and identification</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {/* QR Code Display */}
        <div className="mx-auto w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <QrCode className="h-16 w-16 text-gray-400" />
        </div>

        {/* QR Information */}
        <div className="space-y-1">
          <div className="text-sm font-medium">ID: {qrCode.participantId}</div>
          {showExpiryTimer && timeUntilExpiry && (
            <div className={`text-xs ${timeUntilExpiry === 'Expired' ? 'text-red-600' : 'text-muted-foreground'}`}>
              <Clock className="h-3 w-3 inline mr-1" />
              {timeUntilExpiry === 'Expired' ? 'QR Code Expired' : `Expires in ${timeUntilExpiry}`}
            </div>
          )}
        </div>

        {/* Features */}
        {showFeatures && (
          <div className="flex justify-center space-x-1">
            {qrCode.features.payments && (
              <Badge variant="outline" className="text-xs">Payments</Badge>
            )}
            {qrCode.features.identification && (
              <Badge variant="outline" className="text-xs">ID</Badge>
            )}
            {qrCode.features.serviceAccess && (
              <Badge variant="outline" className="text-xs">Services</Badge>
            )}
          </div>
        )}

        {/* Action */}
        <Button size="sm" className="w-full" onClick={handleGenerateNew}>
          <QrCode className="mr-2 h-4 w-4" />
          Generate New QR
        </Button>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay; 
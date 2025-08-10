'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, User, MapPin, Target, Camera, ExternalLink, Heart, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface DemoQRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participant: any;
  qrCodeUrl: string;
}

export function DemoQRModal({ open, onOpenChange, participant, qrCodeUrl }: DemoQRModalProps) {
  const [scanningMode, setScanningMode] = useState(false);

  const handleSimulateScan = () => {
    // Simulate QR scan by redirecting to donation page
    if (participant?.id) {
      const donationUrl = `/donate?demo=true&participant=${participant.id}`;
      window.open(donationUrl, '_blank');
    }
  };

  const handleCameraScan = () => {
    // In a real implementation, this would open camera
    // For demo, we'll just show a message and then simulate
    setScanningMode(true);
    setTimeout(() => {
      setScanningMode(false);
      handleSimulateScan();
    }, 2000);
  };

  if (!participant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <QrCode className="h-6 w-6 text-primary" />
            Demo QR Code - Meet {participant.firstName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Participant Profile */}
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-semibold">{participant.firstName} {participant.lastName}</h3>
              <p className="text-muted-foreground text-sm mb-2">
                Age {participant.age} • {participant.shelter_name || 'Demo Shelter'}
              </p>
              <p className="text-sm leading-relaxed mb-3">{participant.story}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  <MapPin className="h-3 w-3 mr-1" />
                  {participant.location?.city || 'San Francisco'}, {participant.location?.state || 'CA'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  {participant.progress}% Complete
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              </div>
            </div>
          </div>

          {/* Goals Progress */}
          {participant.goals && participant.goals.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Current Goals
              </h4>
              <div className="grid gap-2">
                {participant.goals.slice(0, 3).map((goal: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                    <span className="text-sm font-medium">{goal.title}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-muted rounded-full">
                        <div 
                          className="h-2 bg-primary rounded-full transition-all"
                          style={{ width: `${Math.min(goal.progress || 0, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code Display */}
          <div className="text-center space-y-4">
            <div className="bg-white p-6 rounded-lg border-2 border-dashed border-primary/30 inline-block shadow-lg">
              {qrCodeUrl ? (
                <div className="relative">
                  <Image 
                    src={qrCodeUrl} 
                    alt="Demo QR Code" 
                    width={200} 
                    height={200}
                    className="mx-auto"
                  />
                  {scanningMode && (
                    <div className="absolute inset-0 bg-primary/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
                        <p className="text-sm font-medium">Scanning...</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Experience the QR Donation Flow</h4>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Scan this QR code with your phone camera or click the buttons below to experience how SHELTR's instant donation system works.
              </p>
            </div>
          </div>

          {/* Demo Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ${participant.total_received?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-muted-foreground">Total Received</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {participant.donation_count || 0}
              </div>
              <div className="text-xs text-muted-foreground">Donations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {participant.services_completed || 0}
              </div>
              <div className="text-xs text-muted-foreground">Services Used</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={handleCameraScan}
                className="h-12"
                variant="outline"
                disabled={scanningMode}
              >
                <Camera className="h-4 w-4 mr-2" />
                {scanningMode ? 'Scanning...' : 'Scan with Camera'}
              </Button>
              <Button 
                onClick={handleSimulateScan}
                className="h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                <Heart className="h-4 w-4 mr-2" />
                Simulate Donation
              </Button>
            </div>
            
            <Button
              onClick={() => window.open(`/participant/${participant.id}`, '_blank')}
              variant="outline"
              className="w-full h-10 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Profile
            </Button>
          </div>

          {/* SmartFund Preview */}
          <div className="p-4 bg-gradient-to-r from-primary/5 to-blue-600/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              SmartFund™ Distribution Preview
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-lg font-bold text-primary">80%</div>
                <div className="text-xs text-muted-foreground">Direct to {participant.firstName}</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">15%</div>
                <div className="text-xs text-muted-foreground">Housing Fund</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">5%</div>
                <div className="text-xs text-muted-foreground">Operations</div>
              </div>
            </div>
          </div>

          {/* Demo Disclaimer */}
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>🎭 Demo Mode:</strong> This is a demonstration using test payment methods. 
              No real money will be processed, but you'll experience the complete donation flow with Adyen payment processing.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
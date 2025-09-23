'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QrCode, Heart, Users, Building, Scan, DollarSign, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MakeNewDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shelter {
  id: string;
  name: string;
  location: string;
  description: string;
  participantCount: number;
  totalDonations: number;
}

interface Participant {
  id: string;
  name: string;
  shelter: string;
  story: string;
  goal: string;
  raised: number;
  target: number;
}

export function MakeNewDonationModal({ isOpen, onClose }: MakeNewDonationModalProps) {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('shelters');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one-time' | 'recurring'>('one-time');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Mock data for shelters
  useEffect(() => {
    setShelters([
      {
        id: 'old-brewery-mission',
        name: 'Old Brewery Mission',
        location: 'Montreal, QC',
        description: 'Providing shelter and support services since 1889',
        participantCount: 45,
        totalDonations: 125000
      },
      {
        id: 'dans-la-rue',
        name: 'Dans la rue',
        location: 'Montreal, QC', 
        description: 'Supporting homeless youth in Montreal',
        participantCount: 23,
        totalDonations: 67000
      },
      {
        id: 'mission-bon-accueil',
        name: 'Mission Bon Accueil',
        location: 'Montreal, QC',
        description: 'Emergency shelter and rehabilitation services',
        participantCount: 38,
        totalDonations: 89000
      }
    ]);

    setParticipants([
      {
        id: 'michael-rodriguez',
        name: 'Michael Rodriguez',
        shelter: 'Old Brewery Mission',
        story: 'Working towards stable housing and employment',
        goal: 'Secure permanent housing',
        raised: 850,
        target: 2000
      },
      {
        id: 'participant-2',
        name: 'Sarah Johnson',
        shelter: 'Dans la rue',
        story: 'Young mother seeking stable housing for her family',
        goal: 'Family housing program',
        raised: 1200,
        target: 3000
      },
      {
        id: 'participant-3',
        name: 'David Chen',
        shelter: 'Mission Bon Accueil',
        story: 'Recovering from addiction, rebuilding life',
        goal: 'Job training program',
        raised: 450,
        target: 1500
      }
    ]);
  }, []);

  const handleDonationSubmit = async () => {
    if (!selectedTarget || !amount || parseFloat(amount) <= 0) {
      alert('Please select a target and enter a valid amount');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate donation processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with your payment processor and donation API
      console.log('Processing donation:', {
        target: selectedTarget,
        amount: parseFloat(amount),
        type: donationType,
        donor: user?.uid
      });
      
      alert(`Donation of $${amount} submitted successfully!`);
      onClose();
      
      // Reset form
      setSelectedTarget('');
      setAmount('');
      setDonationType('one-time');
      
    } catch (error) {
      console.error('Donation failed:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRCodeScan = () => {
    // This would open a QR code scanner
    alert('QR Code scanner would open here. This feature integrates with your device camera to scan participant QR codes.');
  };

  const predefinedAmounts = ['25', '50', '100', '200', '500'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Make New Donation
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to help - donate to a shelter, support a specific participant, or scan a QR code
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="shelters" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Shelters
            </TabsTrigger>
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Participants
            </TabsTrigger>
            <TabsTrigger value="qr-scan" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              QR Scan
            </TabsTrigger>
          </TabsList>

          {/* Shelters Tab */}
          <TabsContent value="shelters" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shelters.map((shelter) => (
                <Card 
                  key={shelter.id}
                  className={`cursor-pointer transition-all ${
                    selectedTarget === shelter.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTarget(shelter.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{shelter.name}</CardTitle>
                    <CardDescription>{shelter.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {shelter.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {shelter.participantCount} people
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          ${shelter.totalDonations.toLocaleString()} raised
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {participants.map((participant) => (
                <Card 
                  key={participant.id}
                  className={`cursor-pointer transition-all ${
                    selectedTarget === participant.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTarget(participant.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{participant.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="outline">{participant.shelter}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {participant.story}
                    </p>
                    <p className="text-sm font-medium mb-3">Goal: {participant.goal}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>${participant.raised} / ${participant.target}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((participant.raised / participant.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* QR Scan Tab */}
          <TabsContent value="qr-scan" className="space-y-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Scan className="h-6 w-6" />
                  Scan QR Code
                </CardTitle>
                <CardDescription>
                  Scan a participant's QR code to make a direct donation
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Click the button below to open your camera and scan a QR code
                  </p>
                </div>
                <Button onClick={handleQRCodeScan} className="w-full">
                  <Scan className="mr-2 h-4 w-4" />
                  Open QR Scanner
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Donation Amount Section */}
        {selectedTarget && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-semibold">Donation Details</h3>
            
            {/* Donation Type */}
            <div className="space-y-2">
              <Label>Donation Type</Label>
              <div className="flex gap-2">
                <Button
                  variant={donationType === 'one-time' ? 'default' : 'outline'}
                  onClick={() => setDonationType('one-time')}
                  size="sm"
                >
                  One-time
                </Button>
                <Button
                  variant={donationType === 'recurring' ? 'default' : 'outline'}
                  onClick={() => setDonationType('recurring')}
                  size="sm"
                >
                  Monthly
                </Button>
              </div>
            </div>

            {/* Predefined Amounts */}
            <div className="space-y-2">
              <Label>Quick Amounts</Label>
              <div className="flex gap-2 flex-wrap">
                {predefinedAmounts.map((preAmount) => (
                  <Button
                    key={preAmount}
                    variant={amount === preAmount ? 'default' : 'outline'}
                    onClick={() => setAmount(preAmount)}
                    size="sm"
                  >
                    ${preAmount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Custom Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleDonationSubmit} 
                disabled={isProcessing || !selectedTarget || !amount}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Donate ${amount || '0'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

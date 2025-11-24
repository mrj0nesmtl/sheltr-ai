'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PiggyBank, Calendar, DollarSign, CreditCard, Loader2, Info } from 'lucide-react';

interface RecurringGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecurringGiftModal({ isOpen, onClose }: RecurringGiftModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('monthly');
  const [targetType, setTargetType] = useState<'shelter' | 'participant'>('shelter');
  const [shelter, setShelter] = useState<string>('');
  const [participant, setParticipant] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shelters, setShelters] = useState<Array<{ id: string; name: string }>>([]);
  const [participants, setParticipants] = useState<Array<{ id: string; name: string; shelter: string }>>([]);

  const predefinedAmounts = ['25', '50', '100', '200'];

  const frequencies = [
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'monthly', label: 'Monthly', description: 'Every month' },
    { value: 'quarterly', label: 'Quarterly', description: 'Every 3 months' },
    { value: 'annually', label: 'Annually', description: 'Every year' }
  ];

  // Load active shelters and participants from backend API
  React.useEffect(() => {
    const loadDonationTargets = async () => {
      if (!isOpen) return;
      
      try {
        console.log('🏢 Loading active donation targets for recurring gift...');
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/api/v1/donations/active-donation-targets`);
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        const activeShelters = (data.active_shelters || []).map((s: any) => ({
          id: s.id,
          name: s.name
        }));
        
        const activeParticipants = (data.verified_participants || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          shelter: p.shelter || 'Unknown Shelter'
        }));
        
        setShelters(activeShelters);
        setParticipants(activeParticipants);
        
        console.log(`✅ Loaded ${activeShelters.length} shelter(s) and ${activeParticipants.length} participant(s)`);
      } catch (error) {
        console.error('❌ Error loading donation targets:', error);
        setShelters([]);
        setParticipants([]);
      }
    };
    
    loadDonationTargets();
  }, [isOpen]);

  const handleSubmit = async () => {
    const selectedTarget = targetType === 'shelter' ? shelter : participant;
    
    if (!amount || !frequency || !selectedTarget || !startDate) {
      alert('Please fill in all fields');
      return;
    }

    if (!user) {
      alert('You must be logged in to set up a recurring gift');
      return;
    }

    setIsProcessing(true);
    
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      
      const donationAmount = parseFloat(amount);
      
      const selectedShelter = targetType === 'shelter' 
        ? shelters.find(s => s.id === shelter)
        : null;
      
      const selectedParticipant = targetType === 'participant'
        ? participants.find(p => p.id === participant)
        : null;
      
      // Calculate next payment date based on frequency
      const start = new Date(startDate);
      let nextPaymentDate = new Date(start);
      switch (frequency) {
        case 'weekly':
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
          break;
        case 'monthly':
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
          break;
        case 'annually':
          nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
          break;
      }
      
      // Create recurring gift document
      const recurringGiftData = {
        donor_id: user.uid,
        donor_email: user.email || '',
        donor_name: user.displayName || user.email || 'Anonymous Donor',
        target_type: targetType,
        shelter_id: targetType === 'shelter' ? shelter : (selectedParticipant?.shelter || ''),
        shelter_name: targetType === 'shelter' ? (selectedShelter?.name || 'Unknown Shelter') : (selectedParticipant?.shelter || 'Unknown Shelter'),
        ...(targetType === 'participant' && {
          participant_id: participant,
          participant_name: selectedParticipant?.name || 'Unknown Participant'
        }),
        amount: donationAmount,
        frequency: frequency,
        status: 'active',
        start_date: startDate,
        next_payment_date: nextPaymentDate.toISOString().split('T')[0],
        total_donated: 0, // Will be updated with each payment
        payment_count: 0,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      console.log('💳 Creating recurring gift:', recurringGiftData);
      const recurringRef = await addDoc(collection(db, 'recurring_gifts'), recurringGiftData);
      console.log('✅ Recurring gift created with ID:', recurringRef.id);
      
      alert(`Recurring gift of $${amount} ${frequency} set up successfully!`);
      onClose();
      
      // Reset form
      setAmount('');
      setFrequency('monthly');
      setShelter('');
      setStartDate('');
      
      // Refresh the page to show the new recurring gift
      window.location.reload();
      
    } catch (error: any) {
      console.error('❌ Failed to set up recurring gift:', error);
      
      // Provide more detailed error message
      let errorMessage = 'Failed to set up recurring gift. ';
      if (error?.code === 'permission-denied') {
        errorMessage += 'Permission denied. Please ensure you have donor access and try again.';
      } else if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again or contact support if the issue persists.';
      }
      
      alert(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateAnnualImpact = () => {
    if (!amount) return 0;
    const monthlyAmount = parseFloat(amount);
    switch (frequency) {
      case 'weekly': return monthlyAmount * 52;
      case 'monthly': return monthlyAmount * 12;
      case 'quarterly': return monthlyAmount * 4;
      case 'annually': return monthlyAmount;
      default: return monthlyAmount * 12;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-blue-500" />
            Setup Recurring Gift
          </DialogTitle>
          <DialogDescription>
            Set up automatic donations to provide consistent support to those in need
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto flex-1 pr-2">
          {/* Instructions */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900 dark:text-blue-100">
                  Setup Instructions
                </span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                Set up automatic recurring donations to provide consistent support. You can donate to shelters or individual participants.
              </p>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <p><strong>SmartFund Distribution:</strong></p>
                <ul className="list-disc list-inside ml-2 space-y-0.5">
                  <li><strong>Shelters:</strong> 95% to shelter operations, 5% platform fee</li>
                  <li><strong>Participants:</strong> 80% direct support, 15% housing fund, 5% operations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Target Type Selection */}
          <div className="space-y-2">
            <Label>I want to support</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={targetType === 'shelter' ? 'default' : 'outline'}
                onClick={() => {
                  setTargetType('shelter');
                  setParticipant('');
                }}
                className="flex-1"
              >
                A Shelter
              </Button>
              <Button
                type="button"
                variant={targetType === 'participant' ? 'default' : 'outline'}
                onClick={() => {
                  setTargetType('participant');
                  setShelter('');
                }}
                className="flex-1"
              >
                A Participant
              </Button>
            </div>
          </div>

          {/* Shelter Selection (shown when targetType is 'shelter') */}
          {targetType === 'shelter' && (
            <div className="space-y-2">
              <Label>Select Shelter</Label>
              <Select value={shelter} onValueChange={setShelter}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shelter to support" />
                </SelectTrigger>
                <SelectContent>
                  {shelters.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Participant Selection (shown when targetType is 'participant') */}
          {targetType === 'participant' && (
            <div className="space-y-2">
              <Label>Select Participant</Label>
              <Select value={participant} onValueChange={setParticipant}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a participant to support" />
                </SelectTrigger>
                <SelectContent>
                  {participants.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.shelter})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Amount Selection */}
          <div className="space-y-4">
            <Label>Donation Amount</Label>
            
            {/* Predefined Amounts */}
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

            {/* Custom Amount */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Frequency Selection */}
          <div className="space-y-2">
            <Label>Frequency</Label>
            <div className="grid grid-cols-2 gap-2">
              {frequencies.map((freq) => (
                <Card
                  key={freq.value}
                  className={`cursor-pointer transition-all ${
                    frequency === freq.value 
                      ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setFrequency(freq.value)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <div>
                        <p className="font-medium text-sm">{freq.label}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{freq.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Terms */}
          <Card className="bg-gray-50 dark:bg-gray-800/50">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <strong>Terms:</strong> You can modify or cancel your recurring gift at any time 
                through your donor dashboard. You'll receive email confirmations for each donation 
                and annual tax receipts. Your gift will be processed on the same day each period.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex gap-2 mt-4 pt-4 border-t flex-shrink-0">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || !amount || !(shelter || participant) || !startDate}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Setup ${amount} {frequency}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

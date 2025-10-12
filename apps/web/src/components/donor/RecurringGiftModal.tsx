'use client';

import React, { useState } from 'react';
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
  const [amount, setAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<string>('monthly');
  const [shelter, setShelter] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [shelters, setShelters] = useState<Array<{ id: string; name: string }>>([]);

  const predefinedAmounts = ['25', '50', '100', '200'];

  const frequencies = [
    { value: 'weekly', label: 'Weekly', description: 'Every week' },
    { value: 'monthly', label: 'Monthly', description: 'Every month' },
    { value: 'quarterly', label: 'Quarterly', description: 'Every 3 months' },
    { value: 'annually', label: 'Annually', description: 'Every year' }
  ];

  // Load active shelters from backend API
  React.useEffect(() => {
    const loadActiveShelters = async () => {
      if (!isOpen) return;
      
      try {
        console.log('🏢 Loading active shelters for recurring gift...');
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
        
        setShelters(activeShelters);
        console.log(`✅ Loaded ${activeShelters.length} active shelter(s) for recurring gift`);
      } catch (error) {
        console.error('❌ Error loading shelters for recurring gift:', error);
        // Fallback to empty array if API fails
        setShelters([]);
      }
    };
    
    loadActiveShelters();
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!amount || !frequency || !shelter || !startDate) {
      alert('Please fill in all fields');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Setting up recurring gift:', {
        amount: parseFloat(amount),
        frequency,
        shelter,
        startDate
      });
      
      alert(`Recurring gift of $${amount} ${frequency} set up successfully!`);
      onClose();
      
      // Reset form
      setAmount('');
      setFrequency('monthly');
      setShelter('');
      setStartDate('');
      
    } catch (error) {
      console.error('Failed to set up recurring gift:', error);
      alert('Failed to set up recurring gift. Please try again.');
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-blue-500" />
            Setup Recurring Gift
          </DialogTitle>
          <DialogDescription>
            Set up automatic donations to provide consistent support to those in need
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Impact Preview */}
          {amount && (
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    Annual Impact Preview
                  </span>
                </div>
                <p className="text-blue-800 dark:text-blue-200">
                  Your ${amount} {frequency} gift will provide ${calculateAnnualImpact().toLocaleString()} 
                  in annual support, helping provide approximately {Math.floor(calculateAnnualImpact() / 5)} meals 
                  or {Math.floor(calculateAnnualImpact() / 100)} nights of shelter per year.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Shelter Selection */}
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isProcessing || !amount || !shelter || !startDate}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

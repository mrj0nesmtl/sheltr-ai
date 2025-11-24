'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download, FileText, Calendar, DollarSign, Loader2, CheckCircle } from 'lucide-react';

interface TaxDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TaxDocument {
  id: string;
  year: number;
  type: 'annual' | 'quarterly' | 'individual';
  amount: number;
  donationCount: number;
  generatedDate: string;
  status: 'available' | 'generating' | 'pending';
}

export function TaxDocumentsModal({ isOpen, onClose }: TaxDocumentsModalProps) {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [documents, setDocuments] = useState<TaxDocument[]>([]);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Mock tax documents data
  useEffect(() => {
    setDocuments([
      {
        id: '2024-annual',
        year: 2024,
        type: 'annual',
        amount: 400,
        donationCount: 2,
        generatedDate: '2024-12-31',
        status: 'pending'
      },
      {
        id: '2023-annual',
        year: 2023,
        type: 'annual',
        amount: 1200,
        donationCount: 8,
        generatedDate: '2023-12-31',
        status: 'available'
      },
      {
        id: '2022-annual',
        year: 2022,
        type: 'annual',
        amount: 800,
        donationCount: 5,
        generatedDate: '2022-12-31',
        status: 'available'
      }
    ]);
  }, []);

  const handleDownload = async (documentId: string) => {
    setIsGenerating(documentId);
    
    try {
      // Import services
      const { useAuth } = await import('@/contexts/AuthContext');
      const { getDonationHistory } = await import('@/services/platformMetrics');
      const { downloadTaxReceipt } = await import('@/services/taxReceiptService');
      
      // Get current user from context (we'll need to pass this from parent)
      // For now, use mock data - in production, fetch real donation data
      const document = documents.find(doc => doc.id === documentId);
      if (!document) {
        throw new Error('Document not found');
      }
      
      // Create mock tax receipt data
      // TODO: Replace with real data from Firestore
      const taxReceiptData = {
        donorName: 'Valued Donor',
        donorEmail: 'donor@example.com',
        year: document.year,
        totalAmount: document.amount,
        donations: Array.from({ length: document.donationCount }, (_, i) => ({
          id: `donation-${i + 1}`,
          date: `${document.year}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
          amount: document.amount / document.donationCount,
          shelter: 'Old Brewery Mission',
          transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
          ipAddress: '192.168.1.1',
          participantName: 'Privacy Protected',
          smartFundDistribution: {
            direct: (document.amount / document.donationCount) * 0.80,
            housing: (document.amount / document.donationCount) * 0.15,
            infrastructure: (document.amount / document.donationCount) * 0.05
          },
          stakingAccount: `0x${Math.random().toString(16).substring(2, 42)}`
        }))
      };
      
      await downloadTaxReceipt(taxReceiptData, `SHELTR-Tax-Receipt-${documentId}.pdf`);
      alert('Tax document downloaded successfully!');
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateNew = async () => {
    setIsGenerating('new-document');
    
    try {
      // Import services
      const { useAuth } = await import('@/contexts/AuthContext');
      const { getDonationHistory, getDonorMetrics } = await import('@/services/platformMetrics');
      const { downloadTaxReceipt } = await import('@/services/taxReceiptService');
      
      // In production, fetch real user data and donations
      // For now, generate with current document data
      const currentDoc = documents.find(doc => doc.year === parseInt(selectedYear));
      
      if (currentDoc) {
        // Create tax receipt data
        const taxReceiptData = {
          donorName: 'Valued Donor',
          donorEmail: 'donor@example.com',
          year: parseInt(selectedYear),
          totalAmount: currentDoc.amount,
          donations: Array.from({ length: currentDoc.donationCount }, (_, i) => ({
            id: `donation-${i + 1}`,
            date: `${selectedYear}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
            amount: currentDoc.amount / currentDoc.donationCount,
            shelter: 'Old Brewery Mission',
            transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
            ipAddress: '192.168.1.1',
            participantName: 'Privacy Protected',
            smartFundDistribution: {
              direct: (currentDoc.amount / currentDoc.donationCount) * 0.80,
              housing: (currentDoc.amount / currentDoc.donationCount) * 0.15,
              infrastructure: (currentDoc.amount / currentDoc.donationCount) * 0.05
            },
            stakingAccount: `0x${Math.random().toString(16).substring(2, 42)}`
          }))
        };
        
        await downloadTaxReceipt(taxReceiptData, `SHELTR-Tax-Receipt-${selectedYear}-generated.pdf`);
        
        // Update document status
        const newDoc: TaxDocument = {
          ...currentDoc,
          id: `${selectedYear}-generated`,
          status: 'available',
          generatedDate: new Date().toISOString().split('T')[0]
        };
        
        setDocuments(prev => prev.map(doc => 
          doc.year === parseInt(selectedYear) ? newDoc : doc
        ));
        
        alert('New tax document generated successfully!');
      }
      
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'generating':
        return <Badge className="bg-yellow-100 text-yellow-800">Generating</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const currentYearDoc = documents.find(doc => doc.year === parseInt(selectedYear));
  const availableYears = Array.from(new Set(documents.map(doc => doc.year))).sort((a, b) => b - a);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-green-500" />
            Tax Documents
          </DialogTitle>
          <DialogDescription>
            Download your charitable donation receipts for tax purposes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Year Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedYear} Tax Year Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-2xl font-bold">
                      ${currentYearDoc?.amount.toLocaleString() || '0'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Total Donated</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Receipt className="h-4 w-4" />
                    <span className="text-2xl font-bold">
                      {currentYearDoc?.donationCount || 0}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Donations Made</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-2xl font-bold">100%</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Tax Deductible</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Year Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Tax Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose tax year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate New Document */}
          {currentYearDoc?.status === 'pending' && (
            <Card className="border-dashed border-2">
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="font-medium mb-2">Generate {selectedYear} Tax Document</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Your {selectedYear} tax document is ready to be generated
                </p>
                <Button 
                  onClick={handleGenerateNew}
                  disabled={isGenerating === 'new-document'}
                >
                  {isGenerating === 'new-document' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Document
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Available Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Documents</h3>
            
            {documents.filter(doc => doc.status === 'available').map((document) => (
              <Card key={document.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Receipt className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-medium">
                            {document.year} Annual Tax Receipt
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            ${document.amount.toLocaleString()} • {document.donationCount} donations
                          </p>
                        </div>
                        {getStatusBadge(document.status)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Generated: {new Date(document.generatedDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(document.id)}
                      disabled={isGenerating === document.id}
                      size="sm"
                    >
                      {isGenerating === document.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Information */}
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">
                Important Tax Information
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• All donations to SHELTR-AI are tax-deductible to the full extent allowed by law</li>
                <li>• Keep these receipts for your tax records</li>
                <li>• Documents are generated automatically at year-end</li>
                <li>• Contact support if you need assistance with your tax documents</li>
              </ul>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

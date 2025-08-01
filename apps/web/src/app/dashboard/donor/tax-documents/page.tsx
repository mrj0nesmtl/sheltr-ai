'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Eye,
  Mail,
  Printer,
  Archive
} from 'lucide-react';

export default function DonorTaxDocumentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock tax document data
  const taxSummary = {
    currentYear: 2024,
    totalDeductible: 2850,
    numberOfDonations: 12,
    eligibleDeductions: 2850,
    estimatedTaxSaving: 855 // Assuming 30% tax bracket
  };

  const yearlyRecords = [
    { year: '2024', amount: 2850, donations: 12, status: 'current' },
    { year: '2023', amount: 2200, donations: 8, status: 'complete' },
    { year: '2022', amount: 1800, donations: 6, status: 'complete' },
    { year: '2021', amount: 1500, donations: 5, status: 'complete' }
  ];

  const donationReceipts = [
    {
      id: 'RC-2024-001',
      date: '2024-01-09',
      amount: 150.00,
      shelter: 'Downtown Hope Shelter',
      receiptNumber: 'DHS-2024-0109-001',
      status: 'available',
      type: 'one-time',
      method: 'Credit Card'
    },
    {
      id: 'RC-2024-002',
      date: '2024-01-01',
      amount: 75.00,
      shelter: 'Old Brewery Mission',
      receiptNumber: 'OBM-2024-0101-001',
      status: 'available',
      type: 'monthly',
      method: 'Bank Transfer'
    },
    {
      id: 'RC-2023-012',
      date: '2023-12-15',
      amount: 200.00,
      shelter: 'Union Gospel Mission',
      receiptNumber: 'UGM-2023-1215-001',
      status: 'available',
      type: 'one-time',
      method: 'Credit Card'
    },
    {
      id: 'RC-2023-011',
      date: '2023-12-01',
      amount: 75.00,
      shelter: 'Old Brewery Mission',
      receiptNumber: 'OBM-2023-1201-001',
      status: 'available',
      type: 'monthly',
      method: 'Bank Transfer'
    }
  ];

  const annualForms = [
    {
      year: '2024',
      form: 'Annual Donation Summary',
      description: 'Complete tax summary for 2024',
      status: 'processing',
      availableDate: '2025-01-31',
      amount: 2850
    },
    {
      year: '2023',
      form: 'Annual Donation Summary',
      description: 'Complete tax summary for 2023',
      status: 'available',
      availableDate: '2024-01-31',
      amount: 2200
    },
    {
      year: '2022',
      form: 'Annual Donation Summary',
      description: 'Complete tax summary for 2022',
      status: 'available',
      availableDate: '2023-01-31',
      amount: 1800
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'current':
        return 'bg-blue-100 text-blue-800';
      case 'complete':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Only show for donor role
  if (user?.role !== 'donor' && user?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Donor role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tax Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Download receipts, annual summaries, and tax forms for your donations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email All Documents
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download Tax Package
          </Button>
        </div>
      </div>

      {/* Tax Summary Card */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-6 w-6 text-green-600 mr-2" />
            {taxSummary.currentYear} Tax Year Summary
          </CardTitle>
          <CardDescription>
            Your charitable contribution summary for tax filing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${taxSummary.totalDeductible.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total Deductible</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{taxSummary.numberOfDonations}</p>
              <p className="text-sm text-gray-600">Donations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">${taxSummary.estimatedTaxSaving.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Est. Tax Savings*</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">100%</p>
              <p className="text-sm text-gray-600">Eligible</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> *Estimated tax savings based on 30% tax bracket. Consult your tax advisor for accurate calculations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Year Selection */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Tax Year</h3>
            <div className="flex gap-2">
              {yearlyRecords.map((record) => (
                <Button
                  key={record.year}
                  variant={selectedYear === record.year ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedYear(record.year)}
                >
                  {record.year}
                  <Badge variant="secondary" className={`ml-2 ${getStatusColor(record.status)}`}>
                    ${record.amount.toLocaleString()}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="receipts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="receipts">Individual Receipts</TabsTrigger>
          <TabsTrigger value="annual">Annual Summaries</TabsTrigger>
          <TabsTrigger value="help">Tax Information</TabsTrigger>
        </TabsList>

        {/* Individual Receipts Tab */}
        <TabsContent value="receipts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation Receipts</CardTitle>
              <CardDescription>
                Download individual receipts for each donation
              </CardDescription>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search receipts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationReceipts.map((receipt) => (
                  <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(receipt.status)}
                      <div>
                        <p className="font-medium">Receipt #{receipt.receiptNumber}</p>
                        <p className="text-sm text-gray-600">{receipt.shelter}</p>
                        <p className="text-xs text-gray-500">{receipt.method} • {receipt.type}</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${receipt.amount.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">{receipt.date}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annual Summaries Tab */}
        <TabsContent value="annual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Annual Tax Summaries</CardTitle>
              <CardDescription>
                Comprehensive yearly donation summaries for tax filing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {annualForms.map((form) => (
                  <div key={form.year} className="flex items-center justify-between p-6 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(form.status)}
                      <div>
                        <h3 className="font-medium">{form.form} - {form.year}</h3>
                        <p className="text-sm text-gray-600">{form.description}</p>
                        <p className="text-xs text-gray-500">
                          {form.status === 'available' ? `Available since ${form.availableDate}` : `Available on ${form.availableDate}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${form.amount.toLocaleString()}</p>
                      <Badge variant="secondary" className={getStatusColor(form.status)}>
                        {form.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      {form.status === 'available' ? (
                        <>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <Calendar className="h-4 w-4 mr-2" />
                          Pending
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Year Summary</CardTitle>
              <CardDescription>
                Your donation history across multiple tax years
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {yearlyRecords.map((record) => (
                  <div key={record.year} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Tax Year {record.year}</p>
                      <p className="text-sm text-gray-600">{record.donations} donations</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">${record.amount.toLocaleString()}</p>
                      <Badge variant="secondary" className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Information Tab */}
        <TabsContent value="help" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Deduction Information</CardTitle>
              <CardDescription>
                Important information about charitable tax deductions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Eligibility Requirements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>All shelters are registered 501(c)(3) organizations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Donations are 100% tax-deductible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Receipts provided for all donations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>No goods or services received in return</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Documentation Requirements</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <DollarSign className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>Under $250: Bank record or receipt required</span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>$250+: Written acknowledgment required</span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>$500+: Form 8283 may be required</span>
                    </li>
                    <li className="flex items-start">
                      <DollarSign className="h-4 w-4 text-blue-600 mr-2 mt-0.5" />
                      <span>Keep records for at least 3 years</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Important Notice</h4>
                <p className="text-sm text-blue-800">
                  This information is provided for general guidance only. Tax laws vary by jurisdiction and individual circumstances. 
                  Please consult with a qualified tax professional for advice specific to your situation.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Shelter Tax ID Numbers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Downtown Hope Shelter</p>
                    <p className="text-sm text-gray-600">EIN: 12-3456789</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Old Brewery Mission</p>
                    <p className="text-sm text-gray-600">EIN: 23-4567890</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Union Gospel Mission</p>
                    <p className="text-sm text-gray-600">EIN: 34-5678901</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">SHELTR Platform</p>
                    <p className="text-sm text-gray-600">EIN: 45-6789012</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
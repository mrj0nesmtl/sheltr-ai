'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDonorMetrics, getDonationHistory } from '@/services/platformMetrics';
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

interface YearlyRecord {
  year: string;
  amount: number;
  donations: number;
  status: 'current' | 'complete';
}

export default function DonorTaxDocumentsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [loading, setLoading] = useState(true);
  
  // Real data from Firestore
  const [taxSummary, setTaxSummary] = useState({
    currentYear: 2025,
    totalDeductible: 0,
    numberOfDonations: 0,
    eligibleDeductions: 0,
    estimatedTaxSaving: 0
  });
  
  const [yearlyRecords, setYearlyRecords] = useState<YearlyRecord[]>([]);
  const [donationReceipts, setDonationReceipts] = useState<any[]>([]);

  useEffect(() => {
    const loadTaxData = async () => {
      if (!user?.uid) return;
      
      try {
        const [metrics, history] = await Promise.all([
          getDonorMetrics(user.uid),
          getDonationHistory(user.uid)
        ]);
        
        const currentYear = new Date().getFullYear();
        const totalDonated = metrics.totalDonated || 0;
        const donationCount = metrics.totalDonations || 0;
        
        // Group donations by year
        const donationsByYear: { [year: string]: { amount: number; count: number } } = {};
        history.forEach(donation => {
          const year = new Date(donation.date).getFullYear().toString();
          if (!donationsByYear[year]) {
            donationsByYear[year] = { amount: 0, count: 0 };
          }
          donationsByYear[year].amount += donation.amount;
          donationsByYear[year].count += 1;
        });
        
        // Create yearly records
        const years: YearlyRecord[] = Object.keys(donationsByYear)
          .sort((a, b) => parseInt(b) - parseInt(a))
          .map(year => ({
            year,
            amount: donationsByYear[year].amount,
            donations: donationsByYear[year].count,
            status: year === currentYear.toString() ? 'current' : 'complete'
          }));
        
        // If current year has no donations, add it with $0
        if (!donationsByYear[currentYear.toString()]) {
          years.unshift({
            year: currentYear.toString(),
            amount: 0,
            donations: 0,
            status: 'current'
          });
        }
        
        setTaxSummary({
          currentYear,
          totalDeductible: donationsByYear[currentYear.toString()]?.amount || 0,
          numberOfDonations: donationsByYear[currentYear.toString()]?.count || 0,
          eligibleDeductions: donationsByYear[currentYear.toString()]?.amount || 0,
          estimatedTaxSaving: Math.round((donationsByYear[currentYear.toString()]?.amount || 0) * 0.3)
        });
        
        setYearlyRecords(years);
        setDonationReceipts(history);
        
        console.log('✅ Loaded tax documents data:', {
          totalDonated,
          donationCount,
          yearlyRecords: years
        });
        
      } catch (error) {
        console.error('❌ Failed to load tax data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTaxData();
  }, [user]);

  const annualForms = yearlyRecords.map(record => ({
    year: record.year,
    form: 'Annual Donation Summary',
    description: `Complete tax summary for ${record.year}`,
    status: parseInt(record.year) < new Date().getFullYear() ? 'available' : 'processing',
    availableDate: `${parseInt(record.year) + 1}-01-31`,
    amount: record.amount
  }));

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tax documents...</p>
        </div>
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
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            {taxSummary.currentYear} Tax Year Summary
          </CardTitle>
          <CardDescription>
            Your charitable contribution summary for tax filing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">${taxSummary.totalDeductible.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Deductible</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{taxSummary.numberOfDonations}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Donations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">${taxSummary.estimatedTaxSaving.toLocaleString()}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Est. Tax Savings*</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">100%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Eligible</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
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
              {donationReceipts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No receipts yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your donation receipts will appear here
                  </p>
                  <Button className="mt-4" onClick={() => window.location.href = '/donate'}>
                    Make Your First Donation
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {donationReceipts
                    .filter(receipt => 
                      receipt.participant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      receipt.shelter_name?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((receipt) => (
                      <div key={receipt.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center space-x-4">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="font-medium">Receipt #{receipt.reference || receipt.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {receipt.participant_name ? `To: ${receipt.participant_name}` : 'Direct donation'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {receipt.shelter_name || 'SHELTR Platform'} • one-time
                            </p>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="font-medium">${receipt.amount.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(receipt.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
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
              )}
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
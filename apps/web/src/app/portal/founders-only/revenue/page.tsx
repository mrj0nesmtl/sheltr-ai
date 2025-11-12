'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  DollarSign,
  Building,
  Zap,
  Download,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
  ArrowLeft,
  Briefcase,
  Edit,
  Save,
  X as XIcon,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

// Type definitions
interface RevenueStream {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  budget_values: number[];
  actual_values: (number | null)[];
  growth_rate?: string;
  notes?: string;
}

interface RevenueCategory {
  name: string;
  color: string;
  icon: string;
  streams: RevenueStream[];
}

interface RevenueData {
  id: string;
  title: string;
  type: string;
  period: {
    start: string;
    end: string;
    fiscal_years: string;
    months: string[];
    month_codes: string[];
  };
  targets: {
    year_1_target: number;
    year_2_target: number;
    total_24_month: number;
  };
  streams: {
    core_revenue: RevenueCategory;
    enterprise_revenue: RevenueCategory;
    defi_revenue: RevenueCategory;
  };
  calculated: {
    budget_monthly_revenue: number[];
    budget_cumulative_revenue: number[];
    actual_monthly_revenue: (number | null)[];
    actual_cumulative_revenue: (number | null)[];
    category_totals: {
      core: number;
      enterprise: number;
      defi: number;
    };
    growth: {
      active_shelters: number[];
      active_participants: number[];
      avg_donation_per_participant: number[];
      monthly_transaction_volume: number[];
    };
  };
  metadata?: {
    created_at?: Date | object;
    updated_at?: Date | object;
    created_by?: string;
    created_by_name?: string;
    last_edited_by?: string;
    last_edited_by_name?: string;
    version?: number;
  };
}

export default function FoundersRevenueP() {
  const router = useRouter();
  const { user, isSuperAdmin: checkIsSuperAdmin } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'core' | 'enterprise' | 'defi'>('all');
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [editedData, setEditedData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isSuperAdmin = checkIsSuperAdmin();

  // Load revenue data from Firestore
  useEffect(() => {
    const loadRevenueData = async () => {
      try {
        const revenueRef = doc(db, 'financial_revenues', 'revenue-projections-2025-2027');
        const revenueSnap = await getDoc(revenueRef);
        
        if (revenueSnap.exists()) {
          const data = revenueSnap.data() as RevenueData;
          setRevenueData(data);
          setEditedData(JSON.parse(JSON.stringify(data))); // Deep clone for editing
          console.log('✅ Revenue data loaded from Firestore');
        } else {
          setError('Revenue data not found. Please run the migration script.');
        }
      } catch (err) {
        console.error('Error loading revenue:', err);
        setError('Failed to load revenue data');
      } finally {
        setLoading(false);
      }
    };

    loadRevenueData();
  }, []);

  // Format currency
  const formatCurrency = (value: number | null) => {
    if (value === null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get category total
  const getCategoryTotal = (category: keyof RevenueData['streams']) => {
    if (!revenueData) return 0;
    return revenueData.streams[category].streams.reduce((sum, stream) => {
      return sum + stream.budget_values.reduce((a, b) => a + b, 0);
    }, 0);
  };

  // Get category breakdown for a specific month
  const getCategoryMonthlyBreakdown = (monthIndex: number) => {
    if (!editedData) return { core: 0, enterprise: 0, defi: 0 };
    
    const core = editedData.streams.core_revenue.streams.reduce((sum, stream) => {
      return sum + (stream.budget_values[monthIndex] || 0);
    }, 0);
    
    const enterprise = editedData.streams.enterprise_revenue.streams.reduce((sum, stream) => {
      return sum + (stream.budget_values[monthIndex] || 0);
    }, 0);
    
    const defi = editedData.streams.defi_revenue.streams.reduce((sum, stream) => {
      return sum + (stream.budget_values[monthIndex] || 0);
    }, 0);
    
    return { core, enterprise, defi };
  };

  // Handle edit mode toggle
  const handleEditModeToggle = () => {
    if (isEditMode && hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Discard them?');
      if (!confirmDiscard) return;
    }
    
    setIsEditMode(!isEditMode);
    setHasUnsavedChanges(false);
    
    // Reset edited data to original
    if (revenueData) {
      setEditedData(JSON.parse(JSON.stringify(revenueData)));
    }
  };

  // Handle value change in edit mode
  const handleValueChange = (
    category: keyof RevenueData['streams'],
    streamId: string,
    monthIndex: number,
    newValue: string
  ) => {
    if (!editedData) return;
    
    const numValue = parseFloat(newValue) || 0;
    
    // Update the specific value
    const updatedData = { ...editedData };
    const categoryData = updatedData.streams[category];
    const streamIndex = categoryData.streams.findIndex(stream => stream.id === streamId);
    
    if (streamIndex !== -1) {
      categoryData.streams[streamIndex].budget_values[monthIndex] = numValue;
      
      // Recalculate monthly revenue and cumulative totals
      const newMonthlyRevenue = [...updatedData.calculated.budget_monthly_revenue];
      const newCumulativeRevenue = [...updatedData.calculated.budget_cumulative_revenue];
      
      // Recalculate from scratch
      for (let month = 0; month < 24; month++) {
        let monthTotal = 0;
        Object.keys(updatedData.streams).forEach((cat) => {
          const catKey = cat as keyof RevenueData['streams'];
          updatedData.streams[catKey].streams.forEach((stream) => {
            monthTotal += stream.budget_values[month] || 0;
          });
        });
        newMonthlyRevenue[month] = monthTotal;
        newCumulativeRevenue[month] = month === 0 ? monthTotal : newCumulativeRevenue[month - 1] + monthTotal;
      }
      
      updatedData.calculated.budget_monthly_revenue = newMonthlyRevenue;
      updatedData.calculated.budget_cumulative_revenue = newCumulativeRevenue;
      updatedData.targets.year_1_target = newCumulativeRevenue[11]; // Month 12 (Aug 2026)
      updatedData.targets.year_2_target = newCumulativeRevenue[23]; // Month 24 (Aug 2027)
      updatedData.targets.total_24_month = newCumulativeRevenue[23];
      
      setEditedData(updatedData);
      setHasUnsavedChanges(true);
    }
  };

  // Save changes to Firestore
  const handleSave = async () => {
    if (!editedData || !user) return;
    
    try {
      setIsSaving(true);
      
      const revenueRef = doc(db, 'financial_revenues', 'revenue-projections-2025-2027');
      
      // Update metadata
      const updateData = {
        ...editedData,
        metadata: {
          ...editedData.metadata,
          updated_at: new Date(),
          last_edited_by: user.uid,
          last_edited_by_name: user.displayName || user.email || 'Unknown',
          version: (editedData.metadata?.version || 1) + 1
        }
      };
      
      await updateDoc(revenueRef, updateData);
      
      // Log change to audit trail (future: implement revenue_history collection)
      const historyRef = doc(db, 'financial_revenue_history', `${Date.now()}`);
      await setDoc(historyRef, {
        revenue_id: 'revenue-projections-2025-2027',
        change_type: 'bulk_update',
        changed_by: user.uid,
        changed_by_name: user.displayName || user.email || 'Unknown',
        changed_by_role: 'super_admin',
        changed_at: new Date(),
        changes: {
          description: 'Revenue projections updated via edit interface'
        }
      });
      
      setRevenueData(updateData);
      setIsEditMode(false);
      setHasUnsavedChanges(false);
      
      alert('✅ Revenue data saved successfully!');
    } catch (err) {
      console.error('Error saving revenue:', err);
      alert('❌ Failed to save revenue data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !revenueData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <Alert className="max-w-2xl mx-auto border-red-500 bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">
            {error || 'Revenue data not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayData = isEditMode ? editedData! : revenueData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/portal/founders-only" className="text-2xl font-bold hover:opacity-80 transition-opacity">
              SHELTR
            </Link>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-600 text-white">
                <Briefcase className="h-3 w-3 mr-1" />
                Founders Portal
              </Badge>
              
              {isSuperAdmin && (
                <>
                  {isEditMode ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={!hasUnsavedChanges || isSaving}
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditModeToggle}
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <XIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditModeToggle}
                      className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Revenue
                    </Button>
                  )}
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/portal" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              Portal
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/portal/founders-only" className="hover:text-foreground transition-colors">
              Founders Only
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Revenue Projections</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{displayData.title}</h1>
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  24-Month Projection
                </Badge>
                {isEditMode && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                    <Edit className="h-3 w-3 mr-1" />
                    Editing Mode
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                Revenue Projections • Sep 2025 - Aug 2027 • {displayData.period.fiscal_years}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Details
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Year 1 Target (Aug 2026)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(displayData.targets.year_1_target)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">First 12 months</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Year 2 Target (Aug 2027)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(displayData.targets.year_2_target)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">24-month cumulative</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">24-Month Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(displayData.targets.total_24_month)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total projected revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Streams by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Total revenue across 24 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'core' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-border hover:border-blue-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'core' ? 'all' : 'core')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Core Revenue</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('core_revenue'))}</div>
                <p className="text-xs text-muted-foreground mt-1">{displayData.streams.core_revenue.streams.length} streams</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'enterprise' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                    : 'border-border hover:border-green-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'enterprise' ? 'all' : 'enterprise')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Building className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Enterprise</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('enterprise_revenue'))}</div>
                <p className="text-xs text-muted-foreground mt-1">{displayData.streams.enterprise_revenue.streams.length} streams</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'defi' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                    : 'border-border hover:border-purple-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'defi' ? 'all' : 'defi')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">DeFi & Platform</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('defi_revenue'))}</div>
                <p className="text-xs text-muted-foreground mt-1">{displayData.streams.defi_revenue.streams.length} streams</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart - Stacked by Category */}
        <Accordion type="single" collapsible defaultValue="revenue-chart" className="mb-8">
          <AccordionItem value="revenue-chart" className="border rounded-lg px-6 bg-white dark:bg-slate-900">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex flex-col items-start text-left">
                <h3 className="text-2xl font-bold">Monthly Revenue by Category</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCategory === 'all' 
                    ? 'Projected monthly revenue Sep 2025 - Aug 2027 (Click to expand/collapse)'
                    : `Filtered to ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} category`
                  }
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-4">
                {displayData.period.months.map((month, index) => {
                  const breakdown = getCategoryMonthlyBreakdown(index);
                  
                  const isFiltered = selectedCategory !== 'all';
                  const categoryValue = isFiltered ? breakdown[selectedCategory as keyof typeof breakdown] : 0;
                  const totalRevenue = displayData.calculated.budget_monthly_revenue[index];
                  
                  const maxRevenue = isFiltered 
                    ? Math.max(...displayData.period.months.map((_, idx) => getCategoryMonthlyBreakdown(idx)[selectedCategory as keyof typeof breakdown]))
                    : Math.max(...displayData.calculated.budget_monthly_revenue);
                  
                  const categoryColors = {
                    core: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', name: 'Core Revenue' },
                    enterprise: { bg: 'bg-green-500', hover: 'hover:bg-green-600', name: 'Enterprise' },
                    defi: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', name: 'DeFi & Platform' }
                  };
                  
                  const corePercent = (breakdown.core / maxRevenue) * 100;
                  const enterprisePercent = (breakdown.enterprise / maxRevenue) * 100;
                  const defiPercent = (breakdown.defi / maxRevenue) * 100;
                  const singleCategoryPercent = isFiltered ? (categoryValue / maxRevenue) * 100 : 0;
                  
                  return (
                    <div key={month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{month}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(isFiltered ? categoryValue : totalRevenue)}
                        </span>
                      </div>
                      
                      <div className="h-6 bg-muted rounded-lg overflow-hidden flex">
                        {isFiltered ? (
                          categoryValue > 0 && (
                            <div 
                              className={`${categoryColors[selectedCategory as keyof typeof categoryColors].bg} ${categoryColors[selectedCategory as keyof typeof categoryColors].hover} transition-colors relative group`}
                              style={{ width: `${singleCategoryPercent}%` }}
                              title={`${categoryColors[selectedCategory as keyof typeof categoryColors].name}: ${formatCurrency(categoryValue)}`}
                            >
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                {categoryColors[selectedCategory as keyof typeof categoryColors].name}: {formatCurrency(categoryValue)}
                              </div>
                            </div>
                          )
                        ) : (
                          <>
                            {breakdown.core > 0 && (
                              <div 
                                className="bg-blue-500 hover:bg-blue-600 transition-colors relative group"
                                style={{ width: `${corePercent}%` }}
                                title={`Core Revenue: ${formatCurrency(breakdown.core)}`}
                              >
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                  Core: {formatCurrency(breakdown.core)}
                                </div>
                              </div>
                            )}
                            
                            {breakdown.enterprise > 0 && (
                              <div 
                                className="bg-green-500 hover:bg-green-600 transition-colors relative group"
                                style={{ width: `${enterprisePercent}%` }}
                                title={`Enterprise: ${formatCurrency(breakdown.enterprise)}`}
                              >
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                  Enterprise: {formatCurrency(breakdown.enterprise)}
                                </div>
                              </div>
                            )}
                            
                            {breakdown.defi > 0 && (
                              <div 
                                className="bg-purple-500 hover:bg-purple-600 transition-colors relative group"
                                style={{ width: `${defiPercent}%` }}
                                title={`DeFi: ${formatCurrency(breakdown.defi)}`}
                              >
                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                  DeFi: {formatCurrency(breakdown.defi)}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      
                      {!isFiltered && (
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-blue-500"></div>
                            Core: {formatCurrency(breakdown.core)}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-green-500"></div>
                            Enterprise: {formatCurrency(breakdown.enterprise)}
                          </span>
                          <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded bg-purple-500"></div>
                            DeFi: {formatCurrency(breakdown.defi)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Detailed Revenue Breakdown - Only showing stub message for now */}
        {showDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Detailed Revenue Streams</CardTitle>
              <CardDescription>Line-item revenue projections by month - Feature in development</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="border-blue-500 bg-blue-950/20">
                <AlertTriangle className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-400">
                  Detailed revenue breakdown table with inline editing is currently in development.
                  Please use the monthly revenue chart above for now.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Revenue Notes */}
        <Card className="border-2 border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-800 dark:text-green-200">Revenue Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-green-900 dark:text-green-100">
              📈 24-Month Revenue Projection • Sep 2025 - Aug 2027
            </p>
            <div className="border-l-4 border-green-400 pl-4 space-y-2">
              <p>• <strong>Core Revenue:</strong> Transaction fees and SaaS subscriptions form the foundation</p>
              <p>• <strong>Enterprise Revenue:</strong> Sponsorships, white label, and grants scale with adoption</p>
              <p>• <strong>DeFi Revenue:</strong> Token yields begin after launch in Nov 2026</p>
              <p>• <strong>Revenue Start:</strong> Q2 2026 (April 2026) when first shelter goes live</p>
              <p>• <strong>Growth Rate:</strong> Accelerates significantly in Year 2 with expanded shelter network</p>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4">
              Note: These are projected revenue targets. Actual performance will be tracked separately.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

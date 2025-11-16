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
  Users,
  Server,
  Wrench,
  Megaphone,
  Download,
  Eye,
  EyeOff,
  Home,
  ChevronRight,
  ArrowLeft,
  Lock,
  Briefcase,
  Edit,
  Save,
  X as XIcon,
  AlertTriangle
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
interface BudgetItem {
  id: string;
  name: string;
  role: string;
  cost_type: string;
  payment_frequency: string;
  budget_values: number[];
  actual_values: (number | null)[];
  notes?: string;
  vendor?: string;
}

interface BudgetCategory {
  name: string;
  icon: string;
  color: string;
  type: string;
  items: BudgetItem[];
}

interface BudgetData {
  id: string;
  title: string;
  type: string;
  period: {
    months: string[];
    month_codes: string[];
  };
  funding: {
    seed_round: number;
  };
  categories: {
    team: BudgetCategory;
    infrastructure: BudgetCategory;
    operations: BudgetCategory;
    marketing: BudgetCategory;
  };
  calculated: {
    budget_monthly_burn: number[];
    budget_running_total: number[];
    runway: {
      average_burn: number;
      projected_allocation: number;
      reserve_buffer: number;
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
    status?: string;
    approved_by?: string | null;
    approved_at?: Date | object | null;
  };
}

export default function BudgetPage() {
  const router = useRouter();
  const { user, isSuperAdmin: checkIsSuperAdmin } = useAuth();
  
  const [budgetData, setBudgetData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'team' | 'infrastructure' | 'operations' | 'marketing'>('all');
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedData, setEditedData] = useState<BudgetData | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Check if user is super admin
  const isSuperAdmin = checkIsSuperAdmin();
  
  // Debug logging
  useEffect(() => {
    console.log('🔐 Budget Page Auth State:', {
      user: !!user,
      isSuperAdmin
    });
  }, [user, isSuperAdmin]);

  // Load budget data from Firestore
  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        setLoading(true);
        const budgetRef = doc(db, 'financial_budgets', 'seed-budget-2025-2026');
        const budgetSnap = await getDoc(budgetRef);
        
        if (budgetSnap.exists()) {
          const data = budgetSnap.data() as BudgetData;
          setBudgetData(data);
          setEditedData(JSON.parse(JSON.stringify(data))); // Deep clone for editing
          console.log('✅ Budget data loaded from Firestore');
        } else {
          setError('Budget data not found. Please run the migration script.');
        }
      } catch (err) {
        console.error('Error loading budget:', err);
        setError('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    loadBudgetData();
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
  const getCategoryTotal = (category: keyof BudgetData['categories']) => {
    if (!budgetData) return 0;
    return budgetData.categories[category].items.reduce((sum, item) => {
      return sum + item.budget_values.reduce((a, b) => a + b, 0);
    }, 0);
  };

  // Get category breakdown for a specific month
  const getCategoryMonthlyBreakdown = (monthIndex: number, data: BudgetData) => {
    const categories = ['team', 'infrastructure', 'operations', 'marketing'] as const;
    const breakdown: Record<string, number> = {};
    
    categories.forEach((category) => {
      breakdown[category] = data.categories[category].items.reduce((sum, item) => {
        return sum + (item.budget_values[monthIndex] || 0);
      }, 0);
    });
    
    return breakdown;
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
    if (budgetData) {
      setEditedData(JSON.parse(JSON.stringify(budgetData)));
    }
  };

  // Handle value change in edit mode
  const handleValueChange = (
    category: keyof BudgetData['categories'],
    itemId: string,
    monthIndex: number,
    newValue: string
  ) => {
    if (!editedData) return;
    
    const numValue = parseFloat(newValue) || 0;
    
    // Update the specific value
    const updatedData = { ...editedData };
    const categoryData = updatedData.categories[category];
    const itemIndex = categoryData.items.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
      categoryData.items[itemIndex].budget_values[monthIndex] = numValue;
      
      // Recalculate monthly burn and running totals
      const newMonthlyBurn = [...updatedData.calculated.budget_monthly_burn];
      const newRunningTotal = [...updatedData.calculated.budget_running_total];
      
      // Recalculate from scratch
      for (let month = 0; month < 12; month++) {
        let monthTotal = 0;
        Object.keys(updatedData.categories).forEach((cat) => {
          const catKey = cat as keyof BudgetData['categories'];
          updatedData.categories[catKey].items.forEach((item) => {
            monthTotal += item.budget_values[month] || 0;
          });
        });
        newMonthlyBurn[month] = monthTotal;
        newRunningTotal[month] = month === 0 ? monthTotal : newRunningTotal[month - 1] + monthTotal;
      }
      
      updatedData.calculated.budget_monthly_burn = newMonthlyBurn;
      updatedData.calculated.budget_running_total = newRunningTotal;
      updatedData.calculated.runway.average_burn = newMonthlyBurn[11];
      updatedData.calculated.runway.projected_allocation = newRunningTotal[11];
      updatedData.calculated.runway.reserve_buffer = updatedData.funding.seed_round - newRunningTotal[11];
      
      setEditedData(updatedData);
      setHasUnsavedChanges(true);
    }
  };

  // Save changes to Firestore
  const handleSave = async () => {
    if (!editedData || !user) return;
    
    try {
      setIsSaving(true);
      
      const budgetRef = doc(db, 'financial_budgets', 'seed-budget-2025-2026');
      
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
      
      await updateDoc(budgetRef, updateData);
      
      // Log change to audit trail
      const historyRef = doc(db, 'financial_budget_history', `${Date.now()}`);
      await setDoc(historyRef, {
        budget_id: 'seed-budget-2025-2026',
        change_type: 'bulk_update',
        changed_by: user.uid,
        changed_by_name: user.displayName || user.email || 'Unknown',
        changed_by_role: 'super_admin', // Only super admins can save budgets
        changed_at: new Date(),
        changes: {
          description: 'Budget values updated via edit interface'
        }
      });
      
      setBudgetData(updateData);
      setIsEditMode(false);
      setHasUnsavedChanges(false);
      
      alert('✅ Budget saved successfully!');
    } catch (err) {
      console.error('Error saving budget:', err);
      alert('❌ Failed to save budget. Please try again.');
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
          <p className="text-muted-foreground">Loading budget data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !budgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
        <Alert className="max-w-2xl mx-auto border-red-500 bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-400">
            {error || 'Budget data not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayData = isEditMode ? editedData! : budgetData;

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
                      Edit Budget
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
            <span className="text-foreground font-medium">Seed Budget</span>
          </div>
        </div>
      </div>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="bg-blue-600 text-white py-2">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              <span className="font-medium">Edit Mode Active</span>
              {hasUnsavedChanges && <Badge variant="secondary" className="bg-yellow-500 text-black">Unsaved Changes</Badge>}
            </div>
            <span className="text-sm text-blue-100">Click any value to edit</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{displayData.title}</h1>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Lock className="h-3 w-3 mr-1" />
                  Projected Allocation Plan
                </Badge>
              </div>
              <p className="text-muted-foreground">
                2026 Financial Planning • ${displayData.funding.seed_round.toLocaleString()} Seed Investment
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSensitive(!showSensitive)}
              >
                {showSensitive ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-green-200 dark:border-green-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Seed Round</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(displayData.funding.seed_round)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Target raise amount</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(displayData.calculated.runway.projected_allocation)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Through December 2026</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 dark:border-purple-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reserve Buffer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {formatCurrency(displayData.calculated.runway.reserve_buffer)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {((displayData.calculated.runway.reserve_buffer / displayData.funding.seed_round) * 100).toFixed(1)}% remaining
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200 dark:border-cyan-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Projected Runway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                12 mo
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                At {formatCurrency(displayData.calculated.runway.average_burn)}/month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Budget Allocation by Category</CardTitle>
            <CardDescription>Total spend across 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'team' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' 
                    : 'border-border hover:border-blue-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'team' ? 'all' : 'team')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold">Team</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('team'))}</div>
                <p className="text-xs text-muted-foreground mt-1">{displayData.categories.team.items.length} team members</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'infrastructure' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                    : 'border-border hover:border-green-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'infrastructure' ? 'all' : 'infrastructure')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Server className="h-5 w-5 text-green-500" />
                  <span className="font-semibold">Infrastructure</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('infrastructure'))}</div>
                <p className="text-xs text-muted-foreground mt-1">Tech & hosting</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'operations' 
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950' 
                    : 'border-border hover:border-orange-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'operations' ? 'all' : 'operations')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="h-5 w-5 text-orange-500" />
                  <span className="font-semibold">Operations</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('operations'))}</div>
                <p className="text-xs text-muted-foreground mt-1">PODs, tokens, travel</p>
              </div>

              <div 
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedCategory === 'marketing' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950' 
                    : 'border-border hover:border-purple-300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === 'marketing' ? 'all' : 'marketing')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Megaphone className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold">Marketing</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(getCategoryTotal('marketing'))}</div>
                <p className="text-xs text-muted-foreground mt-1">Social & creative</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Burn Chart - Stacked by Category (Collapsible) */}
        <Accordion type="single" collapsible defaultValue="burn-rate" className="mb-8">
          <AccordionItem value="burn-rate" className="border rounded-lg px-6 bg-white dark:bg-slate-900">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex flex-col items-start text-left">
                <h3 className="text-2xl font-bold">Monthly Burn Rate by Category</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedCategory === 'all' 
                    ? 'Projected monthly expenses Jan 2026 - Dec 2026 (Click to expand/collapse)'
                    : `Filtered to ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} category`
                  }
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
            <div className="space-y-4">
              {displayData.period.months.map((month, index) => {
                const breakdown = getCategoryMonthlyBreakdown(index, displayData);
                
                // Determine what to show based on selected category
                const isFiltered = selectedCategory !== 'all';
                const categoryValue = isFiltered ? breakdown[selectedCategory] : 0;
                const totalBurn = displayData.calculated.budget_monthly_burn[index];
                
                // Calculate max for scaling (either category-specific or overall)
                const maxBurn = isFiltered 
                  ? Math.max(...displayData.period.months.map((_, idx) => getCategoryMonthlyBreakdown(idx, displayData)[selectedCategory]))
                  : Math.max(...displayData.calculated.budget_monthly_burn);
                
                // Get color for single-category view
                const categoryColors = {
                  team: { bg: 'bg-blue-500', hover: 'hover:bg-blue-600', name: 'Team' },
                  infrastructure: { bg: 'bg-green-500', hover: 'hover:bg-green-600', name: 'Infrastructure' },
                  operations: { bg: 'bg-orange-500', hover: 'hover:bg-orange-600', name: 'Operations' },
                  marketing: { bg: 'bg-purple-500', hover: 'hover:bg-purple-600', name: 'Marketing' }
                };
                
                // Calculate percentages
                const teamPercent = (breakdown.team / maxBurn) * 100;
                const infraPercent = (breakdown.infrastructure / maxBurn) * 100;
                const opsPercent = (breakdown.operations / maxBurn) * 100;
                const marketingPercent = (breakdown.marketing / maxBurn) * 100;
                const singleCategoryPercent = isFiltered ? (categoryValue / maxBurn) * 100 : 0;
                
                return (
                  <div key={month} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{month}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(isFiltered ? categoryValue : totalBurn)}
                      </span>
                    </div>
                    
                    {/* Conditional Bar Chart - Stacked or Single */}
                    <div className="h-6 bg-muted rounded-lg overflow-hidden flex">
                      {isFiltered ? (
                        /* Single Category View */
                        categoryValue > 0 && (
                          <div 
                            className={`${categoryColors[selectedCategory].bg} ${categoryColors[selectedCategory].hover} transition-colors relative group`}
                            style={{ width: `${singleCategoryPercent}%` }}
                            title={`${categoryColors[selectedCategory].name}: ${formatCurrency(categoryValue)}`}
                          >
                            <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                              {categoryColors[selectedCategory].name}: {formatCurrency(categoryValue)}
                            </div>
                          </div>
                        )
                      ) : (
                        /* Stacked Multi-Category View */
                        <>
                          {/* Team - Blue */}
                          {breakdown.team > 0 && (
                            <div 
                              className="bg-blue-500 hover:bg-blue-600 transition-colors relative group"
                              style={{ width: `${teamPercent}%` }}
                              title={`Team: ${formatCurrency(breakdown.team)}`}
                            >
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                Team: {formatCurrency(breakdown.team)}
                              </div>
                            </div>
                          )}
                          
                          {/* Infrastructure - Green */}
                          {breakdown.infrastructure > 0 && (
                            <div 
                              className="bg-green-500 hover:bg-green-600 transition-colors relative group"
                              style={{ width: `${infraPercent}%` }}
                              title={`Infrastructure: ${formatCurrency(breakdown.infrastructure)}`}
                            >
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                Infrastructure: {formatCurrency(breakdown.infrastructure)}
                              </div>
                            </div>
                          )}
                          
                          {/* Operations - Orange */}
                          {breakdown.operations > 0 && (
                            <div 
                              className="bg-orange-500 hover:bg-orange-600 transition-colors relative group"
                              style={{ width: `${opsPercent}%` }}
                              title={`Operations: ${formatCurrency(breakdown.operations)}`}
                            >
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                Operations: {formatCurrency(breakdown.operations)}
                              </div>
                            </div>
                          )}
                          
                          {/* Marketing - Purple */}
                          {breakdown.marketing > 0 && (
                            <div 
                              className="bg-purple-500 hover:bg-purple-600 transition-colors relative group"
                              style={{ width: `${marketingPercent}%` }}
                              title={`Marketing: ${formatCurrency(breakdown.marketing)}`}
                            >
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap z-10">
                                Marketing: {formatCurrency(breakdown.marketing)}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Legend - Only show when viewing all categories */}
                    {!isFiltered && (
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-blue-500"></div>
                          Team: {formatCurrency(breakdown.team)}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-green-500"></div>
                          Infrastructure: {formatCurrency(breakdown.infrastructure)}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-orange-500"></div>
                          Operations: {formatCurrency(breakdown.operations)}
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-purple-500"></div>
                          Marketing: {formatCurrency(breakdown.marketing)}
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

        {/* Detailed Budget Table */}
        {showSensitive && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detailed Budget Breakdown</CardTitle>
              <CardDescription>
                {isEditMode ? 'Click any value to edit it' : 'Line-item expenses by month'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="sticky top-0 z-20 bg-background">
                      <TableHead className="sticky left-0 z-30 bg-background w-[200px] border-r-2">Account</TableHead>
                      <TableHead className="sticky left-[200px] z-30 bg-background w-[200px] border-r-2">Role/Description</TableHead>
                      {displayData.period.months.slice(4).map((month) => (
                        <TableHead key={month} className="text-right">{month.slice(0, 3)}</TableHead>
                      ))}
                      <TableHead className="text-right font-bold">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Team Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'team') && (
                      <>
                        <TableRow className="bg-blue-50 dark:bg-blue-950">
                          <TableCell colSpan={15} className="font-bold">
                            <Users className="h-4 w-4 inline mr-2" />
                            Team & Compensation
                          </TableCell>
                        </TableRow>
                        {displayData.categories.team.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="sticky left-0 z-10 bg-background font-medium border-r-2">{item.name}</TableCell>
                            <TableCell className="sticky left-[200px] z-10 bg-background text-sm text-muted-foreground border-r-2">{item.role}</TableCell>
                            {item.budget_values.slice(4).map((value, idx) => (
                              <TableCell key={idx + 4} className="text-right">
                                {isEditMode ? (
                                  <Input
                                    type="number"
                                    value={value || 0}
                                    onChange={(e) => handleValueChange('team', item.id, idx + 4, e.target.value)}
                                    className="w-20 h-8 text-right"
                                  />
                                ) : (
                                  value > 0 ? formatCurrency(value) : '-'
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.budget_values.slice(4).reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Infrastructure Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'infrastructure') && (
                      <>
                        <TableRow className="bg-green-50 dark:bg-green-950">
                          <TableCell colSpan={15} className="font-bold">
                            <Server className="h-4 w-4 inline mr-2" />
                            Infrastructure & Technology
                          </TableCell>
                        </TableRow>
                        {displayData.categories.infrastructure.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="sticky left-0 z-10 bg-background font-medium border-r-2">{item.name}</TableCell>
                            <TableCell className="sticky left-[200px] z-10 bg-background text-sm text-muted-foreground border-r-2">{item.role}</TableCell>
                            {item.budget_values.slice(4).map((value, idx) => (
                              <TableCell key={idx + 4} className="text-right">
                                {isEditMode ? (
                                  <Input
                                    type="number"
                                    value={value || 0}
                                    onChange={(e) => handleValueChange('infrastructure', item.id, idx + 4, e.target.value)}
                                    className="w-20 h-8 text-right"
                                  />
                                ) : (
                                  value > 0 ? formatCurrency(value) : '-'
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.budget_values.slice(4).reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Operations Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'operations') && (
                      <>
                        <TableRow className="bg-orange-50 dark:bg-orange-950">
                          <TableCell colSpan={15} className="font-bold">
                            <Wrench className="h-4 w-4 inline mr-2" />
                            Operations & Production
                          </TableCell>
                        </TableRow>
                        {displayData.categories.operations.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="sticky left-0 z-10 bg-background font-medium border-r-2">{item.name}</TableCell>
                            <TableCell className="sticky left-[200px] z-10 bg-background text-sm text-muted-foreground border-r-2">{item.role}</TableCell>
                            {item.budget_values.slice(4).map((value, idx) => (
                              <TableCell key={idx + 4} className="text-right">
                                {isEditMode ? (
                                  <Input
                                    type="number"
                                    value={value || 0}
                                    onChange={(e) => handleValueChange('operations', item.id, idx + 4, e.target.value)}
                                    className="w-20 h-8 text-right"
                                  />
                                ) : (
                                  value > 0 ? formatCurrency(value) : '-'
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.budget_values.slice(4).reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Marketing Section */}
                    {(selectedCategory === 'all' || selectedCategory === 'marketing') && (
                      <>
                        <TableRow className="bg-purple-50 dark:bg-purple-950">
                          <TableCell colSpan={15} className="font-bold">
                            <Megaphone className="h-4 w-4 inline mr-2" />
                            Marketing & Growth
                          </TableCell>
                        </TableRow>
                        {displayData.categories.marketing.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="sticky left-0 z-10 bg-background font-medium border-r-2">{item.name}</TableCell>
                            <TableCell className="sticky left-[200px] z-10 bg-background text-sm text-muted-foreground border-r-2">{item.role}</TableCell>
                            {item.budget_values.slice(4).map((value, idx) => (
                              <TableCell key={idx + 4} className="text-right">
                                {isEditMode ? (
                                  <Input
                                    type="number"
                                    value={value || 0}
                                    onChange={(e) => handleValueChange('marketing', item.id, idx + 4, e.target.value)}
                                    className="w-20 h-8 text-right"
                                  />
                                ) : (
                                  value > 0 ? formatCurrency(value) : '-'
                                )}
                              </TableCell>
                            ))}
                            <TableCell className="text-right font-bold">
                              {formatCurrency(item.budget_values.slice(4).reduce((a, b) => a + b, 0))}
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    )}

                    {/* Totals */}
                    <TableRow className="bg-muted font-bold">
                      <TableCell className="sticky left-0 z-10 bg-muted" colSpan={2}>Monthly Burn</TableCell>
                      {displayData.calculated.budget_monthly_burn.slice(4).map((burn, idx) => (
                        <TableCell key={idx + 4} className="text-right">
                          {formatCurrency(burn)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">{formatCurrency(displayData.calculated.budget_monthly_burn.slice(4).reduce((a, b) => a + b, 0))}</TableCell>
                    </TableRow>

                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell className="sticky left-0 z-10 bg-muted/50" colSpan={2}>Running Total</TableCell>
                      {displayData.calculated.budget_running_total.slice(4).map((total, idx) => (
                        <TableCell key={idx + 4} className="text-right">
                          {formatCurrency(total)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right text-blue-600 dark:text-blue-400">
                        {formatCurrency(displayData.calculated.budget_monthly_burn.slice(4).reduce((a, b) => a + b, 0))}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-blue-800 dark:text-blue-200">Budget Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              📊 This is a <strong>projected allocation plan</strong> for the ${displayData.funding.seed_round.toLocaleString()} seed round we are currently raising
            </p>
            <div className="border-l-4 border-blue-400 pl-4 space-y-2">
              <p>• <strong>Status:</strong> Funds not yet raised - this represents planned spending once capital is secured</p>
              <p>• <strong>Timeline:</strong> 12-month runway for 2026 (January 2026 - December 2026)</p>
              <p>• <strong>Major expenses in Q1-Q2 2026:</strong> Token listing, payment rails setup, initial POD/MOBI materials</p>
              <p>• <strong>Stabilized monthly burn:</strong> ~{formatCurrency(displayData.calculated.runway.average_burn)} throughout 2026</p>
              <p>• <strong>Team ramp-up:</strong> Full team operational by end of Q1 2026</p>
              <p>• <strong>Reserve buffer:</strong> {formatCurrency(displayData.calculated.runway.reserve_buffer)} ({((displayData.calculated.runway.reserve_buffer / displayData.funding.seed_round) * 100).toFixed(1)}%) held for contingencies and extended runway</p>
            </div>
            <p className="text-xs text-muted-foreground italic mt-4">
              Note: This budget does not include revenue projections. Actual spending will be tracked against this plan once funding is secured.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

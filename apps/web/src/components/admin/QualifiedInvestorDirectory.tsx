'use client';

import { useEffect, useState } from 'react';
import {
  listQualifiedInvestors,
  deactivateQualifiedInvestor,
  InvestorListItem,
  getAccreditationBadgeColor,
  getStatusBadgeColor,
  formatInvestmentRange
} from '@/services/qualifiedInvestorService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Building2, 
  Mail, 
  Calendar, 
  UserCheck, 
  UserX,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface QualifiedInvestorDirectoryProps {
  onRefresh?: () => void;
}

export default function QualifiedInvestorDirectory({ onRefresh }: QualifiedInvestorDirectoryProps) {
  const [investors, setInvestors] = useState<InvestorListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  // Load investors
  const loadInvestors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await listQualifiedInvestors();
      setInvestors(data);
    } catch (err) {
      const error = err as Error;
      console.error('Failed to load investors:', error);
      setError(error.message || 'Failed to load qualified investors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestors();
  }, []);

  // Handle deactivation
  const handleDeactivate = async (uid: string) => {
    setDeactivating(uid);
    
    try {
      await deactivateQualifiedInvestor(uid);
      
      // Refresh list
      await loadInvestors();
      
      // Call parent refresh if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      const error = err as Error;
      console.error('Failed to deactivate investor:', error);
      alert(`Failed to deactivate investor: ${error.message}`);
    } finally {
      setDeactivating(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Qualified Investors
            </CardTitle>
            <CardDescription>
              Manage qualified investors with dataroom access
            </CardDescription>
          </div>
          <Button
            onClick={loadInvestors}
            disabled={loading}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900 dark:text-red-100">Error Loading Investors</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading && !error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading qualified investors...</p>
            </div>
          </div>
        ) : investors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Qualified Investors Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Get started by registering your first qualified investor using the form above.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Investment Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Accreditation</TableHead>
                  <TableHead>Access Level</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investors.map((investor) => (
                  <TableRow key={investor.uid}>
                    {/* Investor Name & Email */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{investor.display_name}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {investor.email}
                        </div>
                      </div>
                    </TableCell>

                    {/* Company */}
                    <TableCell>
                      {investor.company ? (
                        <div className="flex items-center gap-1 text-sm">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          {investor.company}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not specified</span>
                      )}
                    </TableCell>

                    {/* Investment Range */}
                    <TableCell>
                      <div className="text-sm font-medium">
                        {formatInvestmentRange(investor.investment_range)}
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getStatusBadgeColor(investor.status)}
                      >
                        {investor.status}
                      </Badge>
                    </TableCell>

                    {/* Accreditation */}
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={getAccreditationBadgeColor(investor.accreditation_status)}
                      >
                        {investor.accreditation_status}
                      </Badge>
                    </TableCell>

                    {/* Access Level */}
                    <TableCell>
                      <Badge variant="outline">
                        {investor.access_level}
                      </Badge>
                    </TableCell>

                    {/* Registration Date */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDate(investor.created_at)}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {investor.status === 'active' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deactivating === investor.uid}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              {deactivating === investor.uid ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                'Deactivate'
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Deactivate Investor Access?</DialogTitle>
                              <DialogDescription>
                                This will revoke <strong>{investor.display_name}&apos;s</strong> access to the IR Dataroom.
                                Their account will be disabled, and they will no longer be able to log in.
                                <br /><br />
                                This action can be reversed by a Super Admin if needed.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button
                                onClick={() => handleDeactivate(investor.uid)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Deactivate Access
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {investor.status === 'inactive' && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary Stats */}
        {!loading && investors.length > 0 && (
          <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              <span>Total: <strong className="text-foreground">{investors.length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Active: <strong className="text-green-600">{investors.filter(i => i.status === 'active').length}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>Verified: <strong className="text-blue-600">{investors.filter(i => i.accreditation_status === 'verified').length}</strong></span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


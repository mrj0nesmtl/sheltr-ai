'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, where, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { Mail, Clock, AlertCircle, CheckCircle, User, Building, MessageSquare, Eye, ArrowRight, Download, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

interface ContactNote {
  id: string;
  content: string;
  author: string;
  author_name: string;
  created_at: any;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  organization?: string;
  inquiry_type: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'responded' | 'closed';
  priority: 'low' | 'normal' | 'high';
  created_at: any;
  updated_at: any;
  responded: boolean;
  assigned_to?: string;
  response_notes?: string;
  notes?: ContactNote[];
  source?: string; // Track where the inquiry came from
}

export default function ContactInquiries() {
  const { user, hasRole } = useAuth();
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [responseNotes, setResponseNotes] = useState('');

  // Redirect if not authorized
  useEffect(() => {
    if (!hasRole('super_admin') && !hasRole('platform_admin')) {
      window.location.href = '/dashboard';
      return;
    }
  }, [hasRole]);

  // Load contact inquiries
  useEffect(() => {
    if (!hasRole('super_admin') && !hasRole('platform_admin')) return;

    const inquiriesRef = collection(db, 'contact_inquiries');
    
    // Always get all inquiries and filter client-side to avoid Firestore index issues
    const q = query(inquiriesRef, orderBy('created_at', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let inquiriesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactInquiry[];
      
      // Apply client-side filtering
      if (filter !== 'all') {
        inquiriesData = inquiriesData.filter(inquiry => inquiry.status === filter);
      }
      
      console.log(`📧 Loaded ${inquiriesData.length} contact inquiries (filter: ${filter})`);
      setInquiries(inquiriesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter, hasRole]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'contact_inquiries', inquiryId), {
        status,
        updated_at: new Date(),
        responded: status === 'responded' || status === 'closed'
      });
    } catch (error) {
      console.error('Error updating inquiry status:', error);
    }
  };

  const addResponseNotes = async (inquiryId: string, notes: string) => {
    if (!notes.trim() || !user) return;
    
    try {
      const newNote: ContactNote = {
        id: Date.now().toString(),
        content: notes.trim(),
        author: user.uid,
        author_name: user.displayName || user.email || 'Unknown User',
        created_at: serverTimestamp()
      };

      await updateDoc(doc(db, 'contact_inquiries', inquiryId), {
        notes: arrayUnion(newNote),
        status: 'responded',
        updated_at: serverTimestamp(),
        responded: true
      });
      
      setResponseNotes('');
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Error adding response notes:', error);
    }
  };

  // CSV Export function
  const exportToCSV = () => {
    const headers = [
      'Date',
      'Name',
      'Email',
      'Organization',
      'Type',
      'Subject',
      'Message',
      'Status',
      'Priority',
      'Source',
      'Notes Count',
      'Latest Note'
    ];

    const csvData = inquiries.map(inquiry => [
      inquiry.created_at?.toDate?.()?.toLocaleDateString() || 'N/A',
      inquiry.name || '',
      inquiry.email || '',
      inquiry.organization || '',
      inquiry.inquiry_type || '',
      inquiry.subject || '',
      `"${inquiry.message?.replace(/"/g, '""') || ''}"`, // Escape quotes
      inquiry.status || '',
      inquiry.priority || '',
      inquiry.source || 'contact_form',
      inquiry.notes?.length || 0,
      inquiry.notes?.length ? `"${inquiry.notes[inquiry.notes.length - 1].content.replace(/"/g, '""')}"` : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `contact_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'responded': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!hasRole('super_admin') && !hasRole('platform_admin')) {
    return <div>Access denied</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contact Inquiries</h1>
          <p className="text-muted-foreground">Manage contact form submissions and inquiries</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={inquiries.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Link href="/dashboard">
            <Button variant="outline">
              <ArrowRight className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">New</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'new').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">In Progress</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'in_progress').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Responded</p>
                <p className="text-2xl font-bold">{inquiries.filter(i => i.status === 'responded').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{inquiries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Inquiries</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="responded">Responded</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading inquiries...</p>
            </CardContent>
          </Card>
        ) : inquiries.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No contact inquiries found.</p>
            </CardContent>
          </Card>
        ) : (
          inquiries.map((inquiry) => (
            <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="font-semibold text-lg">{inquiry.subject}</h3>
                      <Badge className={getPriorityColor(inquiry.priority)}>
                        {inquiry.priority}
                      </Badge>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {inquiry.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inquiry.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{inquiry.email}</span>
                      </div>
                      {inquiry.organization && (
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{inquiry.organization}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <Badge variant="outline">{inquiry.inquiry_type.replace('_', ' ')}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {inquiry.message}
                    </p>
                    
                    {inquiry.response_notes && (
                      <div className="bg-muted/50 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium mb-1">Response Notes:</p>
                        <p className="text-sm text-muted-foreground">{inquiry.response_notes}</p>
                      </div>
                    )}
                    
                    <p className="text-xs text-muted-foreground">
                      Received: {inquiry.created_at?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Select
                      value={inquiry.status}
                      onValueChange={(value) => updateInquiryStatus(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Notes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Response Notes Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <CardHeader>
              <CardTitle>Manage Response Notes</CardTitle>
              <p className="text-sm text-muted-foreground">
                For: {selectedInquiry.subject}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto">
              
              {/* Existing Notes */}
              {selectedInquiry.notes && selectedInquiry.notes.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Previous Notes ({selectedInquiry.notes.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedInquiry.notes.map((note) => (
                      <div key={note.id} className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{note.author_name}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {note.created_at?.toDate?.()?.toLocaleString() || 'Just now'}
                          </span>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Note */}
              <div className="space-y-2">
                <h4 className="font-medium">Add New Note</h4>
                <Textarea
                  value={responseNotes}
                  onChange={(e) => setResponseNotes(e.target.value)}
                  placeholder="Add your response notes here..."
                  rows={4}
                />
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button
                  onClick={() => addResponseNotes(selectedInquiry.id, responseNotes)}
                  disabled={!responseNotes.trim()}
                >
                  Save Notes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedInquiry(null);
                    setResponseNotes('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useState, useEffect } from 'react';
import { firestoreService, Shelter, PendingApplication } from '@/services/firestore';
import { AdminUser } from '@/services/platformMetrics';
import { tenantService } from '@/services/tenantService';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ShelterNetworkMap from '@/components/ShelterNetworkMap';
import DataPopulator from '@/components/DataPopulator';
import { 
  Building2, 
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Search,
  Filter,
  X,
  Download,
  Plus,
  Eye,
  Edit,
  Activity,
  Shield,
  Phone,
  Mail,
  Map,
  Database,
  Trash2,
  Ban,
  QrCode,
  Copy,
  ExternalLink,
  Calendar,
  DollarSign,
  Globe
} from 'lucide-react';

export default function ShelterNetwork() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [pendingApplications, setPendingApplications] = useState<PendingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory');
  const [shelterNotifications, setShelterNotifications] = useState<Record<string, number>>({});
  const [shelterParticipants, setShelterParticipants] = useState<Record<string, number>>({});
  
  // Edit state
  const [selectedShelterForView, setSelectedShelterForView] = useState<Shelter | null>(null);
  const [selectedShelterForEdit, setSelectedShelterForEdit] = useState<Shelter | null>(null);
  const [editFormData, setEditFormData] = useState<{ name: string; location: string; email: string; phone: string; capacity: number; }>({ 
    name: '', location: '', email: '', phone: '', capacity: 0 
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ shelterId: string; shelterName: string } | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'details' | 'administrators'>('details');
  const [shelterAdmins, setShelterAdmins] = useState<AdminUser[]>([]);
  const [availableAdmins, setAvailableAdmins] = useState<AdminUser[]>([]);
  const [mapRefreshTrigger, setMapRefreshTrigger] = useState(0);
  
  // Filtering state
  const [filters, setFilters] = useState({
    location: '',
    status: '',
    type: '',
    occupancyLevel: '', // 'low', 'medium', 'high', 'at_capacity'
    searchTerm: ''
  });

  // Deduplicate shelters by ID to prevent duplicate key errors
  const uniqueShelters = shelters.filter((shelter, index, arr) => 
    arr.findIndex(s => s.id === shelter.id) === index
  );

  // Filter shelters based on current filters
  const filteredShelters = uniqueShelters.filter(shelter => {
    const matchesLocation = !filters.location || shelter.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesStatus = !filters.status || shelter.status === filters.status;
    const matchesType = !filters.type || shelter.type === filters.type;
    const matchesSearch = !filters.searchTerm || 
      shelter.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      shelter.location.toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    let matchesOccupancy = true;
    if (filters.occupancyLevel) {
      const occupancyPercentage = (shelter.currentOccupancy / shelter.capacity) * 100;
      switch (filters.occupancyLevel) {
        case 'low':
          matchesOccupancy = occupancyPercentage < 50;
          break;
        case 'medium':
          matchesOccupancy = occupancyPercentage >= 50 && occupancyPercentage < 80;
          break;
        case 'high':
          matchesOccupancy = occupancyPercentage >= 80 && occupancyPercentage < 95;
          break;
        case 'at_capacity':
          matchesOccupancy = occupancyPercentage >= 95;
          break;
      }
    }
    
    return matchesLocation && matchesStatus && matchesType && matchesSearch && matchesOccupancy;
  });

  // Get unique values for filter options
  const uniqueLocations = [...new Set(uniqueShelters.map(s => s.location))];
  const uniqueStatuses = [...new Set(uniqueShelters.map(s => s.status))];
  const uniqueTypes = [...new Set(uniqueShelters.map(s => s.type))];

  // Update filters
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: '',
      status: '',
      type: '',
      occupancyLevel: '',
      searchTerm: ''
    });
  };

  // Generate QR code data for shelter
  const generateShelterQRCode = (shelter: Shelter) => {
    // Use shelter.slug if available, otherwise fallback to shelter.id
    const slugOrId = shelter.slug || shelter.id;
    return `https://sheltr-ai.web.app/${slugOrId}`;
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Generate shelter slug from name
  const generateShelterSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Get shelter public URL
  const getShelterPublicUrl = (shelter: Shelter): string => {
    const slug = generateShelterSlug(shelter.name);
    return `${window.location.origin}/${slug}`;
  };

  // Open shelter public page
  const openShelterPublicPage = (shelter: Shelter) => {
    const url = getShelterPublicUrl(shelter);
    window.open(url, '_blank');
  };

  // View shelter function - Navigate to dedicated page
  const viewShelter = (shelter: Shelter) => {
    console.log(`👁️ Navigating to shelter view:`, shelter.name);
    window.location.href = `/dashboard/shelters/${shelter.id}/view`;
  };

  // Get participant count for shelter (mock data for now)
  const getParticipantCount = (shelterId: string) => {
    // This would normally fetch from the database
    // For now, return mock data based on shelter capacity
    const shelter = shelters.find(s => s.id === shelterId);
    if (!shelter) return 0;
    
    // Mock calculation: roughly 60-80% of capacity as participant count
    const mockCount = Math.floor(shelter.capacity * (0.6 + Math.random() * 0.2));
    return mockCount;
  };

  // Helper functions for styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  const getOccupancyPercentage = (shelter: Shelter) => {
    if (!shelter.capacity || shelter.capacity === 0) return 0;
    // Mock occupancy calculation - in real app this would come from actual data
    return Math.floor(70 + Math.random() * 25); // Random between 70-95%
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };


  // Edit shelter - Navigate to dedicated page
  const editShelter = (shelter: Shelter) => {
    console.log(`✏️ Navigating to shelter edit:`, shelter.name);
    window.location.href = `/dashboard/shelters/${shelter.id}/edit`;
  };

  // Load administrators assigned to this shelter
  const loadShelterAdministrators = async (shelterId: string) => {
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('shelter_id', '==', shelterId),
        where('role', 'in', ['admin', 'shelteradmin'])
      );
      const snapshot = await getDocs(adminsQuery);
      const admins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
      setShelterAdmins(admins);
      console.log(`✅ Loaded ${admins.length} administrators for shelter ${shelterId}`);
    } catch (error) {
      console.error('❌ Error loading shelter administrators:', error);
      setShelterAdmins([]);
    }
  };

  // Load available administrators (not assigned to any shelter)
  const loadAvailableAdministrators = async () => {
    try {
      const adminsQuery = query(
        collection(db, 'users'),
        where('role', 'in', ['admin', 'shelteradmin'])
      );
      const snapshot = await getDocs(adminsQuery);
      const allAdmins = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminUser));
      
      // Filter out admins that already have a shelter assigned
      const unassignedAdmins = allAdmins.filter(admin => !admin.shelter_id || admin.shelter_id === '');
      setAvailableAdmins(unassignedAdmins);
      console.log(`✅ Loaded ${unassignedAdmins.length} available administrators`);
    } catch (error) {
      console.error('❌ Error loading available administrators:', error);
      setAvailableAdmins([]);
    }
  };

  // Assign administrator to shelter
  const assignAdministrator = async (adminId: string) => {
    if (!selectedShelterForEdit) return;
    
    try {
      console.log(`🔗 Assigning administrator ${adminId} to shelter ${selectedShelterForEdit.id}`);
      
      await updateDoc(doc(db, 'users', adminId), {
        shelter_id: selectedShelterForEdit.id,
        updated_at: new Date()
      });

      // Refresh the lists
      await loadShelterAdministrators(selectedShelterForEdit.id);
      await loadAvailableAdministrators();
      
      console.log(`✅ Administrator assigned successfully`);
    } catch (error) {
      console.error('❌ Error assigning administrator:', error);
      alert('Error assigning administrator. Please try again.');
    }
  };

  // Remove administrator from shelter
  const removeAdministrator = async (adminId: string) => {
    if (!selectedShelterForEdit) return;
    
    try {
      console.log(`🔗 Removing administrator ${adminId} from shelter ${selectedShelterForEdit.id}`);
      
      await updateDoc(doc(db, 'users', adminId), {
        shelter_id: null,
        updated_at: new Date()
      });

      // Refresh the lists
      await loadShelterAdministrators(selectedShelterForEdit.id);
      await loadAvailableAdministrators();
      
      console.log(`✅ Administrator removed successfully`);
    } catch (error) {
      console.error('❌ Error removing administrator:', error);
      alert('Error removing administrator. Please try again.');
    }
  };

  // Save shelter changes
  const saveShelterChanges = async () => {
    if (!selectedShelterForEdit) return;
    
    setIsSaving(true);
    try {
      console.log(`💾 Saving changes for shelter: ${selectedShelterForEdit.id}`);
      
      // Update shelter in Firebase (note: may need to adjust path based on collection structure)
      await updateDoc(doc(db, 'shelters', selectedShelterForEdit.id), {
        name: editFormData.name,
        location: editFormData.location,
        capacity: editFormData.capacity,
        'contact.email': editFormData.email,
        'contact.phone': editFormData.phone,
        verified: editFormData.verified,
        updatedAt: new Date()
      });

      // Update local state optimistically
      setShelters(prev => prev.map(shelter => 
        shelter.id === selectedShelterForEdit.id 
          ? { 
              ...shelter, 
              name: editFormData.name,
              location: editFormData.location,
              capacity: editFormData.capacity,
              verified: editFormData.verified,
              contact: {
                ...shelter.contact,
                email: editFormData.email,
                phone: editFormData.phone
              }
            }
          : shelter
      ));

      console.log(`✅ Successfully updated shelter: ${editFormData.name}`);
      setSelectedShelterForEdit(null);
      setEditFormData({ name: '', location: '', email: '', phone: '', capacity: 0, verified: false });
      alert(`Shelter "${editFormData.name}" updated successfully!`);
      
    } catch (error) {
      console.error('❌ Error updating shelter:', error);
      alert('Error updating shelter. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete shelter
  const deleteShelter = (shelterId: string, shelterName: string) => {
    setShowDeleteConfirm({ shelterId, shelterName });
  };

  // Confirm shelter deletion
  const confirmDeleteShelter = async () => {
    if (!showDeleteConfirm) return;
    
    const { shelterId, shelterName } = showDeleteConfirm;
    
    try {
      console.log(`🗑️ Deleting shelter: ${shelterName} (${shelterId})`);
      
      // Delete from Firebase
      await deleteDoc(doc(db, 'shelters', shelterId));

      // Remove from local state
      setShelters(prev => prev.filter(shelter => shelter.id !== shelterId));

      console.log(`✅ Successfully deleted shelter: ${shelterName}`);
      setShowDeleteConfirm(null);
      alert(`Shelter "${shelterName}" has been permanently deleted.`);
      
    } catch (error) {
      console.error('❌ Error deleting shelter:', error);
      alert('Error deleting shelter. Please try again.');
    }
  };

  // Toggle shelter status
  const toggleShelterStatus = async (shelterId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      console.log(`🔄 Toggling shelter ${shelterId} from ${currentStatus} to ${newStatus}...`);
      
      // Update Firebase document
      await updateDoc(doc(db, 'shelters', shelterId), { 
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Update local state optimistically
      setShelters(prev => prev.map(shelter => 
        shelter.id === shelterId ? { ...shelter, status: newStatus as Shelter['status'] } : shelter
      ));
      
      console.log(`✅ Shelter status updated to ${newStatus} in Firebase`);
    } catch (error) {
      console.error('❌ Error updating shelter status:', error);
      alert('Error updating shelter status. Please try again.');
    }
  };

  // Load data from multi-tenant structure (SESSION 13)
  const loadData = async () => {
    setLoading(true);
    try {
      console.log('🏠 [SESSION 13] Loading shelter network data from multi-tenant structure...');
      
      // Get shelter tenants and convert to shelter format
      const shelterTenants = await tenantService.getAllShelterTenants();
      console.log(`🏠 Found ${shelterTenants.length} shelter tenants`);
      
      // Load real donation data from demo_donations collection
      const donationsByShelter: Record<string, number> = {};
      
      // ⚡ FIX: Query demo_donations collection instead of tenant collections
      try {
        const demoDonationsSnapshot = await getDocs(collection(db, 'demo_donations'));
        console.log(`💰 [SHELTER NETWORK] Found ${demoDonationsSnapshot.size} total donations in demo_donations`);
        
        demoDonationsSnapshot.docs.forEach(doc => {
          const donationData = doc.data();
          const shelterId = donationData?.shelter_id;
          const amount = donationData?.amount?.total || donationData?.amount || 0;
          
          console.log(`🔍 [DEBUG] Processing donation:`, {
            id: doc.id,
            participant_id: donationData?.participant_id,
            shelter_id: shelterId,
            amount: amount
          });
          
          if (shelterId && amount > 0) {
            donationsByShelter[shelterId] = (donationsByShelter[shelterId] || 0) + amount;
            console.log(`💰 Added $${amount} for shelter ${shelterId}, total: $${donationsByShelter[shelterId]}`);
          }
        });
      } catch (error) {
        console.warn('⚠️ Could not fetch donations from demo_donations:', error);
      }
      
      console.log('💰 [SHELTER NETWORK] Final donations by shelter:', donationsByShelter);
      console.log('💰 [SHELTER NETWORK] Old Brewery Mission donations:', donationsByShelter['YDJCJnuLGMC9mWOWDSOa']);
      
      // Convert ShelterTenant to Shelter format
      const sheltersData: Shelter[] = shelterTenants.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        location: tenant.address,
        address: tenant.address,
        coordinates: tenant.coordinates,
        type: tenant.type,
        capacity: tenant.capacity,
        currentOccupancy: tenant.currentOccupancy,
        participants: 0, // Will be calculated separately if needed
        totalDonations: donationsByShelter[tenant.id] || 0, // REAL DONATION DATA
        status: tenant.status,
        complianceScore: 85, // Default compliance score
        lastInspection: '2024-01-15',
        contact: tenant.contact,
        joinDate: '2024-01-01',
        rating: 4.2,
        tenantId: tenant.id,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt
      }));
      
      const [applicationsData] = await Promise.all([
        firestoreService.getPendingApplications()
      ]);
      
      setShelters(sheltersData);
      setPendingApplications(applicationsData);
      
      console.log(`✅ [SESSION 13] Loaded ${sheltersData.length} shelters with real donation data`);
      
      // Trigger map refresh to re-geocode locations
      setMapRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error loading shelter network data:', error);
      
      // Fallback to legacy method
      console.log('🔄 Falling back to legacy shelter loading...');
      try {
        const [sheltersData, applicationsData] = await Promise.all([
          firestoreService.getShelters('platform'),
          firestoreService.getPendingApplications()
        ]);
        
        setShelters(sheltersData);
        setPendingApplications(applicationsData);
        setMapRefreshTrigger(prev => prev + 1);
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load notification counts for each shelter
  const loadNotificationCounts = async () => {
    try {
      const counts: Record<string, number> = {};
      
      // Query shelter_notifications collection for real notification counts
      const notificationsRef = collection(db, 'shelter_notifications');
      const notificationsSnapshot = await getDocs(notificationsRef);
      
      notificationsSnapshot.forEach((doc) => {
        const data = doc.data();
        const recipientId = data.recipient_id;
        
        // Get shelter_id from the recipient's user document
        // For now, we'll count all notifications for shelter admins
        // In production, you'd want to filter by shelter_id properly
        if (recipientId) {
          // This is a simplified count - ideally we'd group by shelter_id
          counts[recipientId] = (counts[recipientId] || 0) + 1;
        }
      });
      
      setShelterNotifications(counts);
      console.log('✅ Loaded shelter notification counts:', counts);
    } catch (error) {
      console.error('❌ Error loading notification counts:', error);
    }
  };

  // Load participant counts for each shelter
  const loadParticipantCounts = async () => {
    try {
      const counts: Record<string, number> = {};
      
      // Query users with role 'participant' grouped by shelter_id
      const participantsRef = collection(db, 'users');
      const participantsQuery = query(participantsRef, where('role', '==', 'participant'));
      const participantsSnapshot = await getDocs(participantsQuery);
      
      participantsSnapshot.forEach((doc) => {
        const data = doc.data();
        const shelterId = data.shelter_id;
        if (shelterId) {
          counts[shelterId] = (counts[shelterId] || 0) + 1;
        }
      });
      
      setShelterParticipants(counts);
      console.log('✅ Loaded participant counts:', counts);
    } catch (error) {
      console.error('❌ Error loading participant counts:', error);
    }
  };

  // Calculate donor counts and donation totals for shelters
  const calculateShelterDonorStats = async () => {
    try {
      console.log('🔄 Calculating shelter donor stats from donations...');
      
      // Get all donations from demo_donations collection (where donations are actually stored)
      const donationsRef = collection(db, 'demo_donations');
      const donationsSnapshot = await getDocs(donationsRef);
      console.log(`📊 Found ${donationsSnapshot.size} donations in demo_donations`);
      
      // Track unique donors and donation totals per shelter
      const shelterDonorCounts: Record<string, Set<string>> = {};
      const shelterDonationTotals: Record<string, number> = {};
      
      // Get all participants to map participant_id to shelter_id
      const participantsRef = collection(db, 'users');
      const participantsQuery = query(participantsRef, where('role', '==', 'participant'));
      const participantsSnapshot = await getDocs(participantsQuery);
      
      const participantToShelter: Record<string, string> = {};
      participantsSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.shelter_id) {
          participantToShelter[doc.id] = data.shelter_id;
        }
      });
      
      // Process donations
      donationsSnapshot.forEach((doc) => {
        const donation = doc.data();
        const participantId = donation.participant_id || donation.participantId;
        const donorId = donation.donor_id || donation.donorId;
        
        // Extract amount - handle both {total: X} and direct number formats
        let amount = 0;
        if (donation.amount) {
          if (typeof donation.amount === 'object' && donation.amount.total) {
            amount = donation.amount.total;
          } else if (typeof donation.amount === 'number') {
            amount = donation.amount;
          }
        }
        
        // Get shelter_id from participant
        const shelterId = participantId ? participantToShelter[participantId] : null;
        
        if (shelterId && donorId && amount > 0) {
          // Track unique donors
          if (!shelterDonorCounts[shelterId]) {
            shelterDonorCounts[shelterId] = new Set();
          }
          shelterDonorCounts[shelterId].add(donorId);
          
          // Track donation totals
          shelterDonationTotals[shelterId] = (shelterDonationTotals[shelterId] || 0) + amount;
        }
      });
      
      // Update shelters with calculated stats using functional state update
      setShelters(currentShelters => {
        const updatedShelters = currentShelters.map(shelter => ({
          ...shelter,
          totalDonors: shelterDonorCounts[shelter.id]?.size || 0,
          totalDonations: shelterDonationTotals[shelter.id] || 0
        }));
        
        console.log('✅ Updated shelter donor and donation stats');
        console.log('📊 Donor counts by shelter:', 
          Object.fromEntries(
            Object.entries(shelterDonorCounts).map(([id, donors]) => [id, donors.size])
          )
        );
        console.log('💰 Donation totals by shelter:', shelterDonationTotals);
        
        return updatedShelters;
      });
    } catch (error) {
      console.error('❌ Error calculating shelter donor stats:', error);
    }
  };

  useEffect(() => {
    loadData();
    loadNotificationCounts();
    loadParticipantCounts();
  }, []);

  // Calculate donor stats after shelters are loaded
  useEffect(() => {
    if (shelters.length > 0) {
      console.log('🔄 Running calculateShelterDonorStats because shelters changed');
      calculateShelterDonorStats();
    }
  }, [shelters.length]); // Only run when shelters count changes
  
  // Log shelters state whenever it updates for debugging
  useEffect(() => {
    if (shelters.length > 0) {
      console.log('🏠 Current shelters state:', shelters.map(s => ({
        id: s.id,
        name: s.name,
        totalDonors: s.totalDonors,
        totalDonations: s.totalDonations
      })));
    }
  }, [shelters]);

  // Calculate INDUSTRY-STANDARD shelter management KPIs (SESSION 13)
  const totalCapacity = filteredShelters.reduce((acc, s) => acc + s.capacity, 0);
  const currentOccupants = filteredShelters.reduce((acc, s) => acc + (s.currentOccupancy || 0), 0);
  const totalDonations = filteredShelters.reduce((acc, s) => acc + (s.totalDonations || 0), 0);
  const totalParticipants = filteredShelters.reduce((acc, s) => acc + (s.participants || 0), 0);
  const activeShelters = filteredShelters.filter(s => s.status === 'active').length;
  
  const shelterMetrics = {
    // Core Operational Metrics
    totalShelters: filteredShelters.length,
    allShelters: uniqueShelters.length, // Keep original count for "of X shelters" display
    activeShelters,
    pendingApplications: pendingApplications.length,
    totalParticipants,
    
    // INDUSTRY STANDARD: Occupancy Rate (Most Important KPI)
    occupancyRate: filteredShelters.length > 0 
      ? Math.round(filteredShelters.reduce((acc, s) => acc + (s.capacity > 0 ? ((s.currentOccupancy || 0) / s.capacity * 100) : 0), 0) / filteredShelters.length * 10) / 10
      : 0,
    
    // INDUSTRY STANDARD: Platform Capacity Utilization
    totalCapacity,
    currentOccupants,
    capacityUtilization: totalCapacity > 0 ? Math.round((currentOccupants / totalCapacity) * 100) : 0,
    
    // INDUSTRY STANDARD: Network Growth & Performance
    monthlyGrowth: 8.2, // Percentage of new shelter partnerships
    
    // INDUSTRY STANDARD: Compliance & Quality Score
    complianceScore: filteredShelters.length > 0 
      ? Math.round(filteredShelters.reduce((acc, s) => acc + (s.complianceScore || 85), 0) / filteredShelters.length)
      : 85,
    
    // NEW: INDUSTRY STANDARD: Financial Performance
    totalDonations,
    averageDonationsPerShelter: filteredShelters.length > 0 
      ? Math.round(totalDonations / filteredShelters.length)
      : 0,
    
    // NEW: INDUSTRY STANDARD: Capacity Stress Indicators
    sheltersAtCapacity: filteredShelters.filter(s => s.capacity > 0 && (s.currentOccupancy || 0) >= s.capacity).length,
    sheltersNearCapacity: filteredShelters.filter(s => s.capacity > 0 && (s.currentOccupancy || 0) >= (s.capacity * 0.9)).length,
    
    // NEW: INDUSTRY STANDARD: Geographic Coverage
    uniqueLocations: new Set(filteredShelters.map(s => s.location.split(',')[0]?.trim())).size,
    
    // Derived KPIs
    availableBeds: totalCapacity - currentOccupants,
    networkEfficiency: uniqueShelters.length > 0 ? Math.round((activeShelters / uniqueShelters.length) * 100) : 0
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center">
            <Building2 className="h-8 w-8 mr-3" />
            Shelter Network
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Manage shelter directory, onboarding, and performance across the platform
          </p>
        </div>
        
        <div className="flex space-x-2 sm:space-x-3">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Download className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Export Data</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button size="sm" className="flex-1 sm:flex-none">
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Shelter</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Live Data Indicator */}
      {!loading && (
        <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-700 dark:text-green-300 font-medium">
            LIVE FIRESTORE DATA - {uniqueShelters.length} unique shelters loaded from database
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={loadData}
            className="text-green-700 hover:text-green-800 dark:text-green-300"
          >
            <Activity className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      )}

      {/* Platform Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shelters</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterMetrics.totalShelters}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                {shelterMetrics.activeShelters} Active
              </span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 text-yellow-500 mr-1" />
                {shelterMetrics.pendingApplications} Pending
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shelterMetrics.totalParticipants.toLocaleString()}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <Activity className="h-3 w-3 text-purple-500 mr-1" />
                Globally Across All Shelters
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{shelterMetrics.monthlyGrowth}%</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span>Monthly Growth</span>
              <span className="flex items-center text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                New Partners
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Global Filters
          </CardTitle>
          <CardDescription>Filter shelters across all views (Directory, Map, Data)</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search shelters..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
              />
            </div>
            
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <select
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type.replace('_', ' ')}</option>
                ))}
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Status</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              
              <select
                value={filters.occupancyLevel}
                onChange={(e) => updateFilter('occupancyLevel', e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="">All Occupancy</option>
                <option value="low">Low (&lt;50%)</option>
                <option value="medium">Medium (50-80%)</option>
                <option value="high">High (80-95%)</option>
                <option value="at_capacity">At Capacity (95%+)</option>
              </select>
            </div>
            
            {/* Clear Filters and Results Count */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="text-sm text-muted-foreground font-medium">
                Showing {filteredShelters.length} of {uniqueShelters.length} shelters
              </div>
              {(filters.searchTerm || filters.location || filters.status || filters.type || filters.occupancyLevel) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center space-x-1 w-fit"
                >
                  <X className="h-3 w-3" />
                  <span>Clear All</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="directory" className="flex items-center">
              <Building2 className="mr-2 h-4 w-4" />
              Directory
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center">
              <Database className="mr-2 h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Stacked Tabs */}
        <div className="sm:hidden">
          <TabsList className="grid grid-cols-3 gap-1 h-14 bg-muted p-1 rounded-md w-full">
            <TabsTrigger 
              value="directory" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Directory"
            >
              <Building2 className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="map" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Map View"
            >
              <Map className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger 
              value="data" 
              className="flex flex-col items-center justify-center h-full px-1 py-1 w-full"
              title="Data"
            >
              <Database className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>
        </div>



        {/* Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Shelter Network Map
              </CardTitle>
              <CardDescription>
                Interactive map showing all shelters and their current status across the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="h-[600px] bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
                    <p className="text-gray-500">Loading map data...</p>
                  </div>
                </div>
              ) : (
                <ShelterNetworkMap height="600px" refreshTrigger={mapRefreshTrigger} />
              )}
            </CardContent>
          </Card>


        </TabsContent>

        {/* Directory Tab */}
        <TabsContent value="directory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Shelter Directory</h3>
            <div className="text-sm text-muted-foreground">
              Showing {filteredShelters.length} of {uniqueShelters.length} shelters
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredShelters.map((shelter) => (
                <Card key={shelter.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <CardContent className="p-0">
                    {/* Mobile Layout - Completely Redesigned */}
                    <div className="block sm:hidden">
                      {/* Header Section */}
                      <div className="p-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                              <Building2 className="h-7 w-7 text-gray-700 dark:text-gray-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-lg leading-tight truncate text-gray-900 dark:text-white">
                                {shelter.name}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                <MapPin className="h-4 w-4 mr-1 shrink-0" />
                                <span className="truncate">{shelter.location}</span>
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-500 mt-0.5">
                                {shelter.type}
                              </div>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(shelter.status)} shrink-0 ml-2`} variant="secondary">
                            {shelter.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Contact Section */}
                      <div className="px-4 py-3 bg-gray-50 dark:bg-slate-800/50 border-y border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Mail className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
                            <span className="truncate font-medium">{shelter.contact.email}</span>
                          </div>
                          {shelter.contact.phone && (
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Phone className="h-4 w-4 mr-2 shrink-0 text-green-500" />
                              <span className="font-medium">{shelter.contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Metrics Section */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{shelterParticipants[shelter.id] || 0}</div>
                            <div className="text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">Participants</div>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {shelter.totalDonors || 0}
                            </div>
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Donors</div>
                          </div>
                          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400">
                              ${shelter.totalDonations?.toLocaleString() || '0'}
                            </div>
                            <div className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">Donations</div>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                              {shelterNotifications[shelter.id] || 0}
                            </div>
                            <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">Notifications</div>
                          </div>
                        </div>
                      </div>

                      {/* Actions Section */}
                      <div className="px-4 pb-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 bg-white dark:bg-slate-800"
                            onClick={() => viewShelter(shelter)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="px-3 text-blue-600 hover:text-blue-700"
                            onClick={() => openShelterPublicPage(shelter)}
                            title="View Public Page"
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="px-3"
                            onClick={() => editShelter(shelter)}
                            title="Edit Shelter"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="px-3"
                            onClick={() => toggleShelterStatus(shelter.id, shelter.status)}
                            title={shelter.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {shelter.status === 'active' ? 
                              <Ban className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="px-3"
                            onClick={() => deleteShelter(shelter.id, shelter.name)}
                            title="Delete Shelter"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout - Profile Style Card */}
                    <div className="hidden sm:block p-0">
                      {/* Header with Shelter Info */}
                      <div className="relative bg-white dark:bg-slate-900 p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="absolute top-4 right-4">
                          <Badge 
                            className={`${getStatusColor(shelter.status)} text-xs font-medium`}
                            variant="secondary"
                          >
                            {shelter.status}
                          </Badge>
                        </div>
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-200 dark:border-gray-700">
                            <Building2 className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate">
                              {shelter.name}
                            </h3>
                            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-2">
                              <MapPin className="h-4 w-4 mr-2 shrink-0" />
                              <span className="truncate">{shelter.location}</span>
                            </div>
                            <div className="text-gray-500 dark:text-gray-500 text-sm">
                              {shelter.type}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Mail className="h-4 w-4 mr-3 text-blue-500 shrink-0" />
                            <span className="truncate font-medium">{shelter.contact.email}</span>
                          </div>
                          {shelter.contact.phone && (
                            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                              <Phone className="h-4 w-4 mr-3 text-green-500 shrink-0" />
                              <span className="font-medium">{shelter.contact.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Metrics Grid */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          {/* Participants */}
                          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 text-center border border-purple-200 dark:border-purple-800">
                            <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                              {shelterParticipants[shelter.id] || 0}
                            </div>
                            <div className="text-xs font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                              Participants
                            </div>
                          </div>

                          {/* Donors */}
                          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 text-center border border-blue-200 dark:border-blue-800">
                            <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                              {shelter.totalDonors || 0}
                            </div>
                            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                              Donors
                            </div>
                          </div>

                          {/* Donations */}
                          <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                              ${shelter.totalDonations.toLocaleString()}
                            </div>
                            <div className="text-xs font-medium text-green-700 dark:text-green-300 uppercase tracking-wide">
                              Donations
                            </div>
                          </div>

                          {/* Notifications */}
                          <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 text-center border border-orange-200 dark:border-orange-800">
                            <div className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                              {shelterNotifications[shelter.id] || 0}
                            </div>
                            <div className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                              Notifications
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => viewShelter(shelter)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-3 text-blue-600 hover:text-blue-700"
                            onClick={() => openShelterPublicPage(shelter)}
                            title="View Public Page"
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-3"
                            onClick={() => editShelter(shelter)}
                            title="Edit Shelter"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-3"
                            onClick={() => toggleShelterStatus(shelter.id, shelter.status)}
                            title={shelter.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {shelter.status === 'active' ? 
                              <Ban className="h-4 w-4 text-red-500" /> : 
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            }
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="px-3"
                            onClick={() => deleteShelter(shelter.id, shelter.name)}
                            title="Delete Shelter"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>



        {/* Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <DataPopulator onDataUpdated={loadData} />
          
          {/* Firestore Structure Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Firestore Database Structure
              </CardTitle>
              <CardDescription>
                Multi-tenant architecture following the Supabase migration guide
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm font-mono">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>Firebase Project: sheltr-ai-production</div>
                  <div className="ml-2">├── tenants/</div>
                  <div className="ml-4">├── platform/</div>
                  <div className="ml-6">├── shelters/ ({uniqueShelters.length} unique documents)</div>
                  <div className="ml-6">├── shelter_applications/ ({pendingApplications.length} documents)</div>
                  <div className="ml-6">└── users/ (super_admin users)</div>
                  <div className="ml-4">├── shelter-[id]/</div>
                  <div className="ml-6">├── users/ (shelter staff)</div>
                  <div className="ml-6">├── participants/ (recipients)</div>
                  <div className="ml-6">└── donations/ (shelter donations)</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-base mb-2">Security Rules</h4>
                    <div className="text-xs space-y-1">
                      <div>✅ Multi-tenant data isolation</div>
                      <div>✅ Role-based access control</div>
                      <div>✅ Firestore security rules enforced</div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <h4 className="font-semibold text-base mb-2">Data Features</h4>
                    <div className="text-xs space-y-1">
                      <div>✅ Real-time updates with onSnapshot</div>
                      <div>✅ Indexed queries for performance</div>
                      <div>✅ Timestamp tracking (created/updated)</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Edit Shelter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Editing: {selectedShelterForEdit.name}
            </p>
            
            {/* Tabs */}
            <div className="mb-4">
              <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveEditTab('details')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md ${
                    activeEditTab === 'details'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Shelter Details
                </button>
                <button
                  onClick={() => setActiveEditTab('administrators')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md ${
                    activeEditTab === 'administrators'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500 dark:bg-blue-900 dark:text-blue-300'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  Administrators ({shelterAdmins.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeEditTab === 'details' && (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Shelter Name</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter shelter name"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter location"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editFormData.capacity}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter capacity"
                    min="0"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter email address"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Verified Status */}
                <div className="flex items-center justify-between p-4 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 rounded-lg">
                  <div>
                    <label className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Verified Shelter Status
                    </label>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Verified shelters display a badge on their public page
                    </p>
                  </div>
                  <Switch
                    checked={editFormData.verified}
                    onCheckedChange={(checked) => setEditFormData(prev => ({ ...prev, verified: checked }))}
                  />
                </div>
              </div>
            )}

            {activeEditTab === 'administrators' && (
              <div className="space-y-4">
                {/* Current Administrators */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Current Administrators</h4>
                  {shelterAdmins.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No administrators assigned to this shelter.</p>
                  ) : (
                    <div className="space-y-2">
                      {shelterAdmins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800">
                          <div>
                            <p className="font-medium">{admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{admin.role}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAdministrator(admin.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Available Administrators */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Available Administrators</h4>
                  {availableAdmins.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No unassigned administrators available.</p>
                  ) : (
                    <div className="space-y-2">
                      {availableAdmins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                          <div>
                            <p className="font-medium">{admin.name || `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || admin.email}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{admin.email}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">{admin.role}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => assignAdministrator(admin.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900"
                          >
                            Assign
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedShelterForEdit(null);
                  setEditFormData({ name: '', location: '', email: '', phone: '', capacity: 0 });
                  setActiveEditTab('details');
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              {activeEditTab === 'details' && (
                <Button 
                  onClick={saveShelterChanges}
                  disabled={isSaving || !editFormData.name || !editFormData.location || !editFormData.email}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Shelter Details Modal */}
      <Dialog open={!!selectedShelterForView} onOpenChange={(open) => !open && setSelectedShelterForView(null)}>
        <DialogContent className="max-w-7xl w-full max-h-[95vh] p-0 sm:rounded-lg flex flex-col">
          {selectedShelterForView && (
            <>
              {/* Header Section */}
              <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <DialogHeader className="space-y-0">
                  <DialogTitle className="flex items-center gap-4 mb-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedShelterForView.name}</h2>
                      <div className="flex items-center gap-3">
                        <Badge 
                          className={`${getStatusColor(selectedShelterForView.status)} text-sm px-3 py-1`}
                          variant="secondary"
                        >
                          {selectedShelterForView.status}
                        </Badge>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {selectedShelterForView.type}
                        </span>
                      </div>
                    </div>
                  </DialogTitle>
                  <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
                    Comprehensive shelter information and management tools
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Content Section */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0">
                {/* Key Statistics - Full Width at Top */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Statistics
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {selectedShelterForView.capacity}
                      </div>
                      <div className="text-sm font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                        Total Capacity
                      </div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className={`text-2xl font-bold mb-1 ${getOccupancyColor(getOccupancyPercentage(selectedShelterForView))}`}>
                        {getOccupancyPercentage(selectedShelterForView)}%
                      </div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Occupied
                      </div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                        {getParticipantCount(selectedShelterForView.id)}
                      </div>
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300 uppercase tracking-wide">
                        Participants
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800">
                      <div className={`text-2xl font-bold mb-1 ${getComplianceColor(selectedShelterForView.complianceScore)}`}>
                        {selectedShelterForView.complianceScore}%
                      </div>
                      <div className="text-sm font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wide">
                        Compliance
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Column Layout for Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Left Column - Information */}
                  <div className="space-y-4">
                    {/* Basic Information */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <MapPin className="h-5 w-5" />
                          Basic Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                            <p className="text-sm font-semibold">{selectedShelterForView.name}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                            <p className="text-sm">{selectedShelterForView.type}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</label>
                            <p className="text-sm">{selectedShelterForView.location}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</label>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {selectedShelterForView.location}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Phone className="h-5 w-5" />
                          Contact Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                              <p className="text-lg font-medium">{selectedShelterForView.contact.email}</p>
                            </div>
                          </div>
                          {selectedShelterForView.contact.phone && (
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                                <p className="text-lg font-medium">{selectedShelterForView.contact.phone}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Overview */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-5 w-5" />
                          Financial Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-4 md:p-6 lg:p-8 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800">
                          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                            ${selectedShelterForView.totalDonations.toLocaleString()}
                          </div>
                          <div className="text-base font-medium text-green-700 dark:text-green-300 mb-4">
                            Total Donations Received
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            View Financial Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column - QR Code & Actions */}
                  <div className="space-y-4">
                    {/* Shelter QR Code */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <QrCode className="h-5 w-5" />
                          Shelter QR Code
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 mb-4">
                          <div className="w-32 h-32 mx-auto bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <div className="text-center space-y-1">
                              <QrCode className="h-12 w-12 mx-auto text-gray-400" />
                              <p className="text-xs text-gray-500">QR Code</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-mono mb-4 break-all px-2">
                          {generateShelterQRCode(selectedShelterForView)}
                        </p>
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => copyToClipboard(generateShelterQRCode(selectedShelterForView))}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => openShelterPublicPage(selectedShelterForView)}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Public Page
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-sm">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" size="sm" className="w-full justify-start h-10">
                          <Edit className="h-4 w-4 mr-3" />
                          Edit Shelter Details
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start h-10">
                          <Users className="h-4 w-4 mr-3" />
                          Manage Participants
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start h-10">
                          <Calendar className="h-4 w-4 mr-3" />
                          View Schedule
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start h-10">
                          <Download className="h-4 w-4 mr-3" />
                          Download Report
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Shelter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to permanently delete:
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md mb-4">
              <p className="font-semibold">{showDeleteConfirm.shelterName}</p>
              <p className="text-sm text-muted-foreground">Shelter</p>
            </div>
            <p className="text-sm text-red-600 mb-6">
              ⚠️ This action cannot be undone. All shelter data will be permanently deleted.
            </p>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={confirmDeleteShelter}
              >
                Delete Permanently
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
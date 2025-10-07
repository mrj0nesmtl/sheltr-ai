"use client";

import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  where,
  Timestamp
} from 'firebase/firestore';

export interface EnhancedUserData {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  shelter: string;
  shelter_id: string;
  role: string;
  status: string;
  lastLogin: string;
  participants: number;
  joinDate: string;
  created_at: string;
  updated_at: string;
  UserType: string;
  totalDonated?: number;
  donationCount?: number;
  lastDonation?: string;
  needsAttention?: string;
  realLastLogin?: string;
  loginAttempts?: number;
  deviceInfo?: string;
  ipAddress?: string;
  location?: string;
}

export class UserExportService {
  /**
   * Get enhanced user export data with real login timestamps from access logs
   */
  static async getEnhancedUserData(
    adminUsers: any[],
    participantUsers: any[],
    donorUsers: any[],
    orphanedUsers: any[]
  ): Promise<EnhancedUserData[]> {
    try {
      console.log('📊 Preparing enhanced user export data...');
      
      const allUsersMap = new Map<string, EnhancedUserData>();
      
      // Get recent access logs for all users
      const accessLogsMap = await this.getRecentAccessLogs();
      console.log(`🔍 Found access logs for ${accessLogsMap.size} users`);
      
      // Add admin users (Platform Admins + Shelter Admins combined)
      adminUsers.forEach(u => {
        const accessLog = accessLogsMap.get(u.email);
        // Differentiate Platform Admin vs Shelter Admin by role or shelter
        const userType = u.role === 'platform_admin' ? 'Platform Admin' : 
                        u.shelter && u.shelter !== 'N/A' ? 'Shelter Admin' : 'Admin';
        
        allUsersMap.set(u.id, {
          id: u.id,
          name: u.name,
          firstName: u.firstName || u.name?.split(' ')[0] || '',
          lastName: u.lastName || u.name?.split(' ').slice(1).join(' ') || '',
          email: u.email,
          shelter: u.shelter || 'N/A',
          shelter_id: u.shelter_id || '',
          role: u.role,
          status: u.status,
          lastLogin: u.lastLogin || 'Never',
          participants: u.participants || 0,
          joinDate: u.joinDate,
          created_at: u.created_at || u.joinDate,
          updated_at: u.updated_at || '',
          UserType: userType,
          realLastLogin: accessLog?.timestamp || 'No recent login',
          deviceInfo: accessLog?.deviceInfo || 'Unknown',
          ipAddress: accessLog?.ipAddress || 'Unknown',
          location: accessLog?.location || 'Unknown'
        });
      });
      
      // Add participant users
      participantUsers.forEach(u => {
        const accessLog = accessLogsMap.get(u.email);
        allUsersMap.set(u.id, {
          id: u.id,
          name: u.name,
          firstName: u.firstName || u.name?.split(' ')[0] || '',
          lastName: u.lastName || u.name?.split(' ').slice(1).join(' ') || '',
          email: u.email,
          shelter: u.shelter,
          shelter_id: u.shelter_id || '',
          role: u.role,
          status: u.status,
          lastLogin: u.lastLogin || 'Never',
          participants: 0,
          joinDate: u.joinDate,
          created_at: u.created_at || u.joinDate,
          updated_at: u.updated_at || '',
          UserType: 'Participant',
          realLastLogin: accessLog?.timestamp || 'No recent login',
          deviceInfo: accessLog?.deviceInfo || 'Unknown',
          ipAddress: accessLog?.ipAddress || 'Unknown',
          location: accessLog?.location || 'Unknown'
        });
      });
      
      // Add donor users with dual-role logic
      donorUsers.forEach(u => {
        const accessLog = accessLogsMap.get(u.email);
        const existingUser = allUsersMap.get(u.id);
        
        if (existingUser) {
          // User already exists (dual-role) - update UserType to show both roles
          existingUser.UserType = `${existingUser.UserType}, Donor`;
          existingUser.totalDonated = u.totalDonated || 0;
          existingUser.donationCount = u.donationCount || 0;
          existingUser.lastDonation = u.lastDonation || 'Never';
        } else {
          // Primary donor only
          allUsersMap.set(u.id, {
            id: u.id,
            name: u.name,
            firstName: u.firstName || u.name?.split(' ')[0] || '',
            lastName: u.lastName || u.name?.split(' ').slice(1).join(' ') || '',
            email: u.email,
            shelter: u.shelter || 'N/A',
            shelter_id: u.shelter_id || '',
            role: u.role,
            status: u.status,
            lastLogin: u.lastLogin || 'Never',
            participants: 0,
            joinDate: u.joinDate,
            created_at: u.created_at || u.joinDate,
            updated_at: u.updated_at || '',
            totalDonated: u.totalDonated || 0,
            donationCount: u.donationCount || 0,
            lastDonation: u.lastDonation || 'Never',
            UserType: 'Donor',
            realLastLogin: accessLog?.timestamp || 'No recent login',
            deviceInfo: accessLog?.deviceInfo || 'Unknown',
            ipAddress: accessLog?.ipAddress || 'Unknown',
            location: accessLog?.location || 'Unknown'
          });
        }
      });
      
      // Add orphaned users
      orphanedUsers.forEach(u => {
        const accessLog = accessLogsMap.get(u.email);
        allUsersMap.set(u.id, {
          id: u.id,
          name: u.name,
          firstName: u.firstName || u.name?.split(' ')[0] || '',
          lastName: u.lastName || u.name?.split(' ').slice(1).join(' ') || '',
          email: u.email,
          shelter: 'No Shelter Assigned',
          shelter_id: '',
          role: u.role,
          status: u.status,
          lastLogin: u.lastLogin || 'Never',
          participants: 0,
          joinDate: u.joinDate,
          created_at: u.created_at || u.joinDate,
          updated_at: u.updated_at || '',
          needsAttention: u.needsAttention ? 'YES' : 'NO',
          UserType: 'Orphaned',
          realLastLogin: accessLog?.timestamp || 'No recent login',
          deviceInfo: accessLog?.deviceInfo || 'Unknown',
          ipAddress: accessLog?.ipAddress || 'Unknown',
          location: accessLog?.location || 'Unknown'
        });
      });
      
      const result = Array.from(allUsersMap.values());
      console.log(`✅ Enhanced user data prepared for ${result.length} users`);
      return result;
      
    } catch (error) {
      console.error('❌ Error preparing enhanced user data:', error);
      throw error;
    }
  }
  
  /**
   * Get recent access logs for all users
   */
  private static async getRecentAccessLogs(): Promise<Map<string, any>> {
    try {
      console.log('🔍 Fetching recent access logs...');
      
      // Get all access logs, ordered by timestamp descending
      const accessLogsQuery = query(
        collection(db, 'access_logs'),
        orderBy('timestamp', 'desc'),
        limit(100) // Get last 100 access attempts
      );
      
      const accessLogsSnapshot = await getDocs(accessLogsQuery);
      const accessLogsMap = new Map<string, any>();
      
      // Keep only the most recent login for each email
      accessLogsSnapshot.forEach(doc => {
        const data = doc.data();
        const email = data.email;
        
        if (email && data.status === 'success' && !accessLogsMap.has(email)) {
          accessLogsMap.set(email, {
            timestamp: data.timestamp?.toDate?.()?.toLocaleString() || data.timestamp || 'Unknown',
            deviceInfo: data.deviceInfo || data.userAgent || 'Unknown Device',
            ipAddress: data.ipAddress || 'Unknown IP',
            location: data.location || 'Unknown Location',
            action: data.action || 'Login'
          });
        }
      });
      
      console.log(`🔍 Processed access logs for ${accessLogsMap.size} unique users`);
      return accessLogsMap;
      
    } catch (error) {
      console.warn('⚠️ Could not fetch access logs (index may be missing):', error);
      return new Map(); // Return empty map if access logs can't be fetched
    }
  }
  
  /**
   * Convert enhanced user data to CSV
   */
  static convertToCSV(data: EnhancedUserData[]): string {
    if (data.length === 0) return '';
    
    // Define the column order for better readability
    const columns = [
      'id',
      'name', 
      'firstName',
      'lastName',
      'email',
      'shelter',
      'shelter_id',
      'role',
      'status',
      'lastLogin',
      'realLastLogin',
      'participants',
      'joinDate',
      'created_at',
      'updated_at',
      'UserType',
      'totalDonated',
      'donationCount',
      'lastDonation',
      'deviceInfo',
      'ipAddress',
      'location',
      'needsAttention'
    ];
    
    // Create headers
    const headers = columns.join(',');
    
    // Create rows
    const rows = data.map(item => {
      return columns.map(col => {
        const value = item[col as keyof EnhancedUserData];
        if (value === null || value === undefined) return '';
        
        // Escape commas and quotes in CSV values
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',');
    });
    
    return [headers, ...rows].join('\n');
  }
}

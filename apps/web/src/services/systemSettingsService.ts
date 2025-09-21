import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SystemSettings {
  general: {
    platformName: string;
    platformVersion: string;
    maintenanceMode: boolean;
    debugMode: boolean;
    dataRetentionDays: number;
    maxFileUploadSize: number;
    emailVerificationRequired: boolean;
    multiFactorAuthEnabled: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    maxLoginAttempts: number;
    ipWhitelistEnabled: boolean;
    encryptionLevel: string;
    auditLoggingEnabled: boolean;
    dataBackupFrequency: string;
  };
  notifications: {
    emailNotificationsEnabled: boolean;
    smsNotificationsEnabled: boolean;
    pushNotificationsEnabled: boolean;
    newUserRegistrations: boolean;
    newShelterApplications: boolean;
    systemAlerts: boolean;
    dailyReports: boolean;
    adminDigestFrequency: string;
  };
  integrations: {
    firebaseConfigured: boolean;
    adyenConfigured: boolean;
    emailServiceConfigured: boolean;
    smsServiceConfigured: boolean;
    blockchainIntegration: string;
    analyticsTracking: boolean;
    errorReporting: boolean;
    performanceMonitoring: boolean;
  };
  lastUpdated: Date;
  updatedBy: string;
}

export interface SuperAdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  timezone: string;
  language: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  loginAlerts: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

const SYSTEM_SETTINGS_DOC = 'system_settings';
const ADMIN_PROFILES_COLLECTION = 'admin_profiles';

export class SystemSettingsService {
  /**
   * Get current system settings
   */
  static async getSystemSettings(): Promise<SystemSettings | null> {
    try {
      const settingsDoc = await getDoc(doc(db, 'platform_config', SYSTEM_SETTINGS_DOC));
      
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        return {
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        } as SystemSettings;
      }
      
      // Return default settings if none exist
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error fetching system settings:', error);
      return null;
    }
  }

  /**
   * Save system settings
   */
  static async saveSystemSettings(
    settings: Partial<SystemSettings>, 
    userId: string,
    settingsType: string
  ): Promise<boolean> {
    try {
      const settingsRef = doc(db, 'platform_config', SYSTEM_SETTINGS_DOC);
      
      const updateData = {
        ...settings,
        lastUpdated: new Date(),
        updatedBy: userId,
        [`${settingsType}LastModified`]: new Date()
      };

      await setDoc(settingsRef, updateData, { merge: true });
      
      console.log(`✅ System settings (${settingsType}) saved successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving ${settingsType} settings:`, error);
      return false;
    }
  }

  /**
   * Get super admin profile
   */
  static async getSuperAdminProfile(userId: string): Promise<SuperAdminProfile | null> {
    try {
      const profileDoc = await getDoc(doc(db, ADMIN_PROFILES_COLLECTION, userId));
      
      if (profileDoc.exists()) {
        const data = profileDoc.data();
        return {
          ...data,
          lastUpdated: data.lastUpdated?.toDate() || new Date()
        } as SuperAdminProfile;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching super admin profile:', error);
      return null;
    }
  }

  /**
   * Save super admin profile
   */
  static async saveSuperAdminProfile(
    userId: string, 
    profile: Partial<SuperAdminProfile>
  ): Promise<boolean> {
    try {
      const profileRef = doc(db, ADMIN_PROFILES_COLLECTION, userId);
      
      const updateData = {
        ...profile,
        lastUpdated: new Date(),
        updatedBy: userId
      };

      await setDoc(profileRef, updateData, { merge: true });
      
      console.log('✅ Super admin profile saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving super admin profile:', error);
      return false;
    }
  }

  /**
   * Get system status metrics
   */
  static async getSystemStatus() {
    try {
      // This would typically call various system health endpoints
      return {
        platformStatus: 'operational',
        databaseStatus: 'connected',
        securityStatus: 'protected',
        uptime: '99.9%',
        version: '2.7.0'
      };
    } catch (error) {
      console.error('Error fetching system status:', error);
      return {
        platformStatus: 'unknown',
        databaseStatus: 'unknown',
        securityStatus: 'unknown',
        uptime: 'N/A',
        version: 'N/A'
      };
    }
  }

  /**
   * Get default system settings
   */
  private static getDefaultSettings(): SystemSettings {
    return {
      general: {
        platformName: 'SHELTR',
        platformVersion: '2.7.0',
        maintenanceMode: false,
        debugMode: false,
        dataRetentionDays: 365,
        maxFileUploadSize: 10,
        emailVerificationRequired: true,
        multiFactorAuthEnabled: false
      },
      security: {
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireSpecialChars: true,
        maxLoginAttempts: 5,
        ipWhitelistEnabled: false,
        encryptionLevel: 'AES-256',
        auditLoggingEnabled: true,
        dataBackupFrequency: 'daily'
      },
      notifications: {
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false,
        pushNotificationsEnabled: true,
        newUserRegistrations: true,
        newShelterApplications: true,
        systemAlerts: true,
        dailyReports: true,
        adminDigestFrequency: 'weekly'
      },
      integrations: {
        firebaseConfigured: true,
        adyenConfigured: true,
        emailServiceConfigured: true,
        smsServiceConfigured: false,
        blockchainIntegration: 'development',
        analyticsTracking: true,
        errorReporting: true,
        performanceMonitoring: true
      },
      lastUpdated: new Date(),
      updatedBy: 'system'
    };
  }

  /**
   * Test database connectivity
   */
  static async testDatabaseConnection(): Promise<boolean> {
    try {
      await getDoc(doc(db, 'platform_config', 'connection_test'));
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Create audit log entry for settings changes
   */
  static async createAuditLog(
    userId: string,
    action: string,
    settingsType: string,
    changes: Record<string, unknown>
  ): Promise<void> {
    try {
      const auditRef = doc(db, 'audit_logs', `settings_${Date.now()}`);
      
      await setDoc(auditRef, {
        userId,
        userEmail: '', // Would be filled from user context
        action,
        settingsType,
        changes,
        timestamp: new Date(),
        ipAddress: '', // Would be captured from request
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Error creating audit log:', error);
    }
  }
}

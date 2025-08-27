import { collection, addDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface InvestorAccessAttempt {
  id?: string;
  email: string;
  accessType: 'team_login' | 'access_code' | 'failed_attempt';
  userRole?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: any;
  success: boolean;
  errorMessage?: string;
}

export interface InvestorAccessMetrics {
  totalAttempts: number;
  successfulLogins: number;
  teamLogins: number;
  accessCodeLogins: number;
  failedAttempts: number;
  uniqueVisitors: number;
  lastAccessDate?: string;
  recentAttempts: InvestorAccessAttempt[];
}

/**
 * Valid access codes for investor relations
 */
const VALID_ACCESS_CODES = [
  'SHELTR2025',
  'INVESTOR2025',
  'DEMO2025'
];

/**
 * Authenticate SHELTR team member (Super Admin or Platform Admin)
 */
export async function authenticateTeamMember(email: string, password: string): Promise<{
  success: boolean;
  user?: any;
  role?: string;
  error?: string;
}> {
  try {
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from token
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role as string;
    
    // Check if user is Super Admin or Platform Admin
    if (role === 'super_admin' || role === 'platform_admin') {
      // Log successful team login
      await logInvestorAccessAttempt({
        email,
        accessType: 'team_login',
        userRole: role,
        userId: user.uid,
        timestamp: serverTimestamp(),
        success: true
      });
      
      return {
        success: true,
        user,
        role
      };
    } else {
      // User exists but doesn't have required role
      await logInvestorAccessAttempt({
        email,
        accessType: 'failed_attempt',
        userRole: role,
        userId: user.uid,
        timestamp: serverTimestamp(),
        success: false,
        errorMessage: 'Insufficient permissions for investor access'
      });
      
      return {
        success: false,
        error: 'You do not have permission to access investor relations. Contact your administrator.'
      };
    }
  } catch (error: any) {
    // Log failed attempt
    await logInvestorAccessAttempt({
      email,
      accessType: 'failed_attempt',
      timestamp: serverTimestamp(),
      success: false,
      errorMessage: error.message || 'Authentication failed'
    });
    
    let errorMessage = 'Authentication failed. Please check your credentials.';
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No SHELTR team account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Validate investor access code
 */
export async function validateAccessCode(email: string, accessCode: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (VALID_ACCESS_CODES.includes(accessCode)) {
      // Log successful access code login
      await logInvestorAccessAttempt({
        email,
        accessType: 'access_code',
        timestamp: serverTimestamp(),
        success: true
      });
      
      return { success: true };
    } else {
      // Log failed access code attempt
      await logInvestorAccessAttempt({
        email,
        accessType: 'failed_attempt',
        timestamp: serverTimestamp(),
        success: false,
        errorMessage: 'Invalid access code'
      });
      
      return {
        success: false,
        error: 'Invalid access code. Please contact SHELTR-AI for assistance.'
      };
    }
  } catch (error: any) {
    console.error('Access code validation error:', error);
    return {
      success: false,
      error: 'Validation failed. Please try again.'
    };
  }
}

/**
 * Log investor access attempt for analytics
 */
export async function logInvestorAccessAttempt(attempt: Omit<InvestorAccessAttempt, 'id'>): Promise<string | null> {
  try {
    // Add browser/environment info if available
    const attemptData = {
      ...attempt,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ipAddress: 'client', // In production, this would be captured server-side
    };
    
    const docRef = await addDoc(collection(db, 'investor_access_logs'), attemptData);
    console.log('📊 Investor access attempt logged:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error logging investor access attempt:', error);
    return null;
  }
}

/**
 * Get investor access metrics for Super Admin dashboard
 */
export async function getInvestorAccessMetrics(): Promise<InvestorAccessMetrics> {
  try {
    console.log('📊 Fetching investor access metrics...');
    
    // Get all access attempts
    const logsQuery = query(
      collection(db, 'investor_access_logs'),
      orderBy('timestamp', 'desc')
    );
    const logsSnapshot = await getDocs(logsQuery);
    
    const allAttempts: InvestorAccessAttempt[] = [];
    logsSnapshot.forEach((doc) => {
      const data = doc.data();
      allAttempts.push({
        id: doc.id,
        ...data,
      } as InvestorAccessAttempt);
    });
    
    // Calculate metrics
    const totalAttempts = allAttempts.length;
    const successfulAttempts = allAttempts.filter(attempt => attempt.success);
    const successfulLogins = successfulAttempts.length;
    const teamLogins = allAttempts.filter(attempt => attempt.accessType === 'team_login' && attempt.success).length;
    const accessCodeLogins = allAttempts.filter(attempt => attempt.accessType === 'access_code' && attempt.success).length;
    const failedAttempts = allAttempts.filter(attempt => !attempt.success).length;
    
    // Count unique visitors (by email)
    const uniqueEmails = new Set(allAttempts.map(attempt => attempt.email));
    const uniqueVisitors = uniqueEmails.size;
    
    // Get last access date
    const lastAccess = successfulAttempts[0]; // Most recent successful access
    const lastAccessDate = lastAccess?.timestamp?.toDate?.()?.toISOString() || undefined;
    
    // Get recent attempts (last 10)
    const recentAttempts = allAttempts.slice(0, 10);
    
    const metrics: InvestorAccessMetrics = {
      totalAttempts,
      successfulLogins,
      teamLogins,
      accessCodeLogins,
      failedAttempts,
      uniqueVisitors,
      lastAccessDate,
      recentAttempts
    };
    
    console.log('✅ Investor access metrics loaded:', metrics);
    return metrics;
    
  } catch (error) {
    console.error('❌ Error fetching investor access metrics:', error);
    return {
      totalAttempts: 0,
      successfulLogins: 0,
      teamLogins: 0,
      accessCodeLogins: 0,
      failedAttempts: 0,
      uniqueVisitors: 0,
      recentAttempts: []
    };
  }
}

/**
 * Check if user has active investor access session
 */
export function checkInvestorAccess(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for session storage (team login) or cookie (access code)
  const sessionAccess = sessionStorage.getItem('investor-relations-access');
  const cookieAccess = document.cookie.includes('investor-access=verified');
  
  return sessionAccess === 'granted' || cookieAccess;
}

/**
 * Set investor access session
 */
export function setInvestorAccess(accessType: 'team_login' | 'access_code', userInfo?: any): void {
  if (typeof window === 'undefined') return;
  
  // Set session storage for tracking
  sessionStorage.setItem('investor-relations-access', 'granted');
  sessionStorage.setItem('investor-access-type', accessType);
  
  if (userInfo) {
    sessionStorage.setItem('investor-user-info', JSON.stringify(userInfo));
  }
  
  // Set cookie for compatibility
  if (accessType === 'access_code') {
    document.cookie = 'investor-access=verified; path=/; max-age=86400'; // 24 hours
  } else {
    // Team login gets longer session (7 days)
    document.cookie = 'investor-access=verified; path=/; max-age=604800';
  }
}

/**
 * Clear investor access session
 */
export function clearInvestorAccess(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('investor-relations-access');
  sessionStorage.removeItem('investor-access-type');
  sessionStorage.removeItem('investor-user-info');
  
  // Clear cookie
  document.cookie = 'investor-access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

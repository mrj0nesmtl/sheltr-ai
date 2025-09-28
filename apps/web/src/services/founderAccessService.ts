import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface FounderAccessAttempt {
  id?: string;
  email: string;
  founderName?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: unknown;
  success: boolean;
  errorMessage?: string;
}

/**
 * Authorized SHELTR co-founders
 */
const AUTHORIZED_FOUNDERS = [
  { email: 'joel.yaffe@gmail.com', name: 'Joel Yaffe' },
  { email: 'alexanderkline13@gmail.com', name: 'Alexander Kline' },
  { email: 'alaghetts@gmail.com', name: 'Marc Reichel' },
  { email: 'doug.kukura@gmail.com', name: 'Doug Kukura' },
  { email: 'morganhirtle@gmail.com', name: 'Morgan Hirtle' }
];

/**
 * Authenticate SHELTR co-founder
 */
export async function authenticateFounder(email: string, password: string): Promise<{
  success: boolean;
  user?: unknown;
  name?: string;
  error?: string;
}> {
  try {
    // Check if email is in authorized founders list
    const founder = AUTHORIZED_FOUNDERS.find(f => f.email.toLowerCase() === email.toLowerCase());
    
    if (!founder) {
      // Log failed attempt - unauthorized email
      await logFounderAccessAttempt({
        email,
        timestamp: serverTimestamp(),
        success: false,
        errorMessage: 'Email not authorized for founders portal'
      });
      
      return {
        success: false,
        error: 'This email is not authorized for founders portal access. Contact Joel Yaffe if you believe this is an error.'
      };
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from token
    const idTokenResult = await user.getIdTokenResult();
    const role = idTokenResult.claims.role as string;
    
    // Check if user has admin privileges (super_admin or platform_admin)
    if (role === 'super_admin' || role === 'platform_admin') {
      // Log successful founder login
      await logFounderAccessAttempt({
        email,
        founderName: founder.name,
        userId: user.uid,
        timestamp: serverTimestamp(),
        success: true
      });
      
      return {
        success: true,
        user,
        name: founder.name
      };
    } else {
      // User exists but doesn't have required role
      await logFounderAccessAttempt({
        email,
        founderName: founder.name,
        userId: user.uid,
        timestamp: serverTimestamp(),
        success: false,
        errorMessage: 'Insufficient permissions for founders portal'
      });
      
      return {
        success: false,
        error: 'Your account does not have the required permissions for founders portal access. Contact Joel Yaffe for assistance.'
      };
    }
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    
    // Log failed attempt
    await logFounderAccessAttempt({
      email,
      timestamp: serverTimestamp(),
      success: false,
      errorMessage: firebaseError.message || 'Authentication failed'
    });
    
    let errorMessage = 'Authentication failed. Please check your credentials.';
    
    if (firebaseError.code === 'auth/user-not-found') {
      errorMessage = 'No SHELTR account found with this email address.';
    } else if (firebaseError.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password. Please try again.';
    } else if (firebaseError.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    
    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Log founder access attempt for security monitoring
 */
export async function logFounderAccessAttempt(attempt: Omit<FounderAccessAttempt, 'id'>): Promise<string | null> {
  try {
    // Add browser/environment info if available
    const attemptData = {
      ...attempt,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
      ipAddress: 'client', // In production, this would be captured server-side
    };
    
    const docRef = await addDoc(collection(db, 'founder_access_logs'), attemptData);
    console.log('🔐 Founder access attempt logged:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error logging founder access attempt:', error);
    return null;
  }
}

/**
 * Check if user has active founder access session
 */
export function checkFounderAccess(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for session storage
  const sessionAccess = sessionStorage.getItem('founders-portal-access');
  
  return sessionAccess === 'granted';
}

/**
 * Set founder access session
 */
export function setFounderAccess(founderInfo: { email: string; name?: string; userId?: string }): void {
  if (typeof window === 'undefined') return;
  
  // Set session storage for tracking
  sessionStorage.setItem('founders-portal-access', 'granted');
  sessionStorage.setItem('founder-info', JSON.stringify(founderInfo));
  
  // Set cookie for compatibility (session-based, no persistence)
  document.cookie = 'founders-access=verified; path=/; max-age=28800'; // 8 hours max
}

/**
 * Clear founder access session
 */
export function clearFounderAccess(): void {
  if (typeof window === 'undefined') return;
  
  sessionStorage.removeItem('founders-portal-access');
  sessionStorage.removeItem('founder-info');
  
  // Clear cookie
  document.cookie = 'founders-access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * Get founder info from session
 */
export function getFounderInfo(): { email: string; name?: string; userId?: string } | null {
  if (typeof window === 'undefined') return null;
  
  const founderInfoStr = sessionStorage.getItem('founder-info');
  if (!founderInfoStr) return null;
  
  try {
    return JSON.parse(founderInfoStr);
  } catch {
    return null;
  }
}

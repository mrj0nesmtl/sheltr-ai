"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Types for our RBAC system
export type UserRole = 'super_admin' | 'platform_admin' | 'admin' | 'participant' | 'donor';

export interface CustomClaims {
  role?: UserRole;
  tenant_id?: string;
  permissions?: string[];
  shelter_id?: string;
}

export interface AuthUser extends User {
  role?: UserRole;
  sheltrTenantId?: string;
  permissions?: string[];
  shelterId?: string;
  customClaims?: CustomClaims;
}

export interface UserRegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  shelterId?: string;
  phone?: string;
  shelterOnboardingData?: any; // Will be properly typed when we import the interface
}

interface AuthContextType {
  // User state
  user: AuthUser | null;
  loading: boolean;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserRegistrationData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Permission helpers
  hasRole: (role: UserRole) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isSuperAdmin: () => boolean;
  isPlatformAdmin: () => boolean;
  isAdmin: () => boolean;
  isParticipant: () => boolean;
  isDonor: () => boolean;
  
  // Utility methods
  refreshUser: () => Promise<void>;
  getCurrentToken: () => Promise<string | null>;
  
  // Error state
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Clear error helper
  const clearError = () => setError(null);

    // Extract custom claims from Firebase user and Firestore data
  const extractCustomClaims = async (firebaseUser: User): Promise<AuthUser> => {
    try {
      // First, try to get custom claims from Firebase (for backend-created users)
      const idTokenResult = await firebaseUser.getIdTokenResult();
      const customClaims = idTokenResult.claims as CustomClaims;
      
      // Also fetch user data from Firestore (for direct Firebase Auth users)
      let firestoreData: any = null;
      try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          firestoreData = userDocSnap.data();
          console.log('📄 Loaded user data from Firestore:', firestoreData);
        }
      } catch (firestoreError) {
        console.warn('⚠️ Could not fetch user data from Firestore:', firestoreError);
      }
      
      // Merge Firebase custom claims with Firestore data (Firestore takes priority for newer users)
      const role = firestoreData?.role || customClaims.role;
      const tenantId = firestoreData?.tenant_id || customClaims.tenant_id;
      const permissions = firestoreData?.permissions || customClaims.permissions || [];
      const shelterId = firestoreData?.shelter_id || customClaims.shelter_id;
      
      console.log('🔐 User role detected:', role);
      console.log('🔍 Full user data debug:', {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        firestoreRole: firestoreData?.role,
        customClaimsRole: customClaims.role,
        finalRole: role,
        tenantId,
        shelterId
      });
      
      return {
        ...firebaseUser,
        role: role as UserRole,
        sheltrTenantId: tenantId,
        permissions: permissions,
        shelterId: shelterId,
        customClaims: {
          ...customClaims,
          role: role,
          tenant_id: tenantId,
          permissions: permissions,
          shelter_id: shelterId
        }
      };
    } catch (error) {
      console.error('Error extracting user data:', error);
      return {
        ...firebaseUser,
        role: undefined,
        sheltrTenantId: undefined,
        permissions: [],
        shelterId: undefined,
        customClaims: {}
      };
    }
  };

  // Refresh user data and custom claims
  const refreshUser = async (): Promise<void> => {
    if (auth.currentUser) {
      try {
        // Force token refresh to get latest custom claims
        await auth.currentUser.getIdToken(true);
        const updatedUser = await extractCustomClaims(auth.currentUser);
        setUser(updatedUser);
      } catch (error) {
        console.error('Error refreshing user:', error);
        setError('Failed to refresh user data');
      }
    }
  };

  // Get current Firebase ID token
  const getCurrentToken = async (): Promise<string | null> => {
    if (auth.currentUser) {
      try {
        return await auth.currentUser.getIdToken();
      } catch (error) {
        console.error('Error getting token:', error);
        return null;
      }
    }
    return null;
  };

  // Handle shelter admin registration with onboarding data
  const handleShelterAdminRegistration = async (user: any, userData: UserRegistrationData): Promise<void> => {
    const { shelterOnboardingData } = userData;
    
    // Generate a unique shelter ID
    const shelterId = shelterOnboardingData.shelterName.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    // Create pending shelter admin user
    const userDocData = {
      uid: user.uid,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: 'admin',
      phone: userData.phone || '',
      shelter_id: shelterId,
      tenant_id: `shelter-${shelterId}`,
      adminRole: shelterOnboardingData.adminRole,
      yearsOfExperience: shelterOnboardingData.yearsOfExperience,
      previousShelterExperience: shelterOnboardingData.previousShelterExperience,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      profileComplete: false,
      lastLoginAt: new Date().toISOString(),
      status: 'pending_approval', // Different status for shelter admins
      applicationStatus: 'pending_review',
      submittedAt: new Date().toISOString()
    };

    // Create shelter application document
    const shelterApplicationData = {
      id: shelterId,
      adminUserId: user.uid,
      adminEmail: userData.email,
      adminName: `${userData.firstName} ${userData.lastName}`,
      
      // Basic shelter info
      shelterName: shelterOnboardingData.shelterName,
      shelterType: shelterOnboardingData.shelterType,
      description: shelterOnboardingData.description,
      
      // Location
      address: shelterOnboardingData.address,
      city: shelterOnboardingData.city,
      province: shelterOnboardingData.province,
      postalCode: shelterOnboardingData.postalCode,
      
      // Contact
      phone: shelterOnboardingData.phone,
      website: shelterOnboardingData.website,
      emergencyContact: shelterOnboardingData.emergencyContact,
      
      // Capacity & Services
      totalCapacity: shelterOnboardingData.totalCapacity,
      currentOccupancy: shelterOnboardingData.currentOccupancy,
      services: shelterOnboardingData.services,
      specializations: shelterOnboardingData.specializations,
      
      // Operations
      operatingHours: shelterOnboardingData.operatingHours,
      checkInTime: shelterOnboardingData.checkInTime,
      checkOutTime: shelterOnboardingData.checkOutTime,
      genderRestrictions: shelterOnboardingData.genderRestrictions,
      ageRestrictions: shelterOnboardingData.ageRestrictions,
      
      // Additional info
      specialNeeds: shelterOnboardingData.specialNeeds,
      languages: shelterOnboardingData.languages,
      accessibilityFeatures: shelterOnboardingData.accessibilityFeatures,
      
      // Application details
      reason: shelterOnboardingData.reason,
      goals: shelterOnboardingData.goals,
      timeline: shelterOnboardingData.timeline,
      
      // License info
      licenseNumber: shelterOnboardingData.licenseNumber,
      registrationNumber: shelterOnboardingData.registrationNumber,
      
      // Status
      status: 'pending_review',
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      rejectionReason: null,
      
      // Platform admin will review
      requiresReview: true,
      notificationSent: false
    };

    // Store both documents (using top-level collections)
    await Promise.all([
      setDoc(doc(db, 'users', user.uid), userDocData),
      setDoc(doc(db, 'shelter_applications', shelterId), shelterApplicationData)
    ]);

    // TODO: Send notification to super admins
    // TODO: Update platform metrics for pending applications
    
    console.log('✅ Shelter admin application submitted:', shelterId);
  };

  // Register user directly with Firebase Auth and Firestore
  const register = async (userData: UserRegistrationData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // Create user with Firebase Auth directly
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`
      });

      // Handle shelter admin registration differently
      if (userData.role === 'admin' && userData.shelterOnboardingData) {
        await handleShelterAdminRegistration(user, userData);
      } else {
        // Regular user registration
        const userDocData = {
          uid: user.uid,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role || 'participant',
          phone: userData.phone || '',
          shelterId: userData.shelterId || null,
          createdAt: new Date().toISOString(),
          emailVerified: false,
          profileComplete: false,
          lastLoginAt: new Date().toISOString(),
          status: 'active'
        };

        // Store user data in Firestore
        await setDoc(doc(db, 'users', user.uid), userDocData);
      }

      // Send email verification
      await sendEmailVerification(user);

      console.log('✅ User registered successfully:', user.uid);

    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const provider = new GoogleAuthProvider();
      
      // Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user exists in SHELTR system by looking for their profile in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      // If user doesn't exist in SHELTR system, sign them out and show error
      if (!userDoc.exists()) {
        console.log('🚫 User not found in SHELTR system - signing out');
        await signOut(auth);
        setError('Account not found. Please register for a SHELTR account first before signing in with Google.');
        throw new Error('User must register first');
      }
      
      // Check if this is a new user or existing user
      const existingUser = await auth.currentUser?.getIdTokenResult();
      
      // If this is joel.yaffe@gmail.com and no custom claims, it might be a first-time Google login
      // for the super admin account - we should call our backend to ensure proper claims
      if (user.email === 'joel.yaffe@gmail.com' && (!existingUser?.claims?.role)) {
        console.log('🔐 Super admin detected - ensuring proper claims...');
        
        // Call backend to verify and set claims if needed
        try {
          const token = await user.getIdToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/auth/verify-token`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            // Force token refresh to get updated claims
            await user.getIdToken(true);
            console.log('✅ Super admin claims verified');
          }
        } catch (claimsError) {
          console.warn('⚠️ Could not verify super admin claims:', claimsError);
        }
      }
      
      console.log('✅ Google login successful for existing SHELTR user');
      
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error.message === 'User must register first') {
        // Keep the specific error message for unregistered users
        setError('Account not found. Please register for a SHELTR account first before signing in with Google.');
      } else {
        setError(error.message || 'Google login failed');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      setError(error.message || 'Logout failed');
    }
  };

  // Permission helper functions
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role || user?.role === 'super_admin';
  };

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || user?.role === 'super_admin';
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const isSuperAdmin = (): boolean => user?.role === 'super_admin';
  const isPlatformAdmin = (): boolean => user?.role === 'platform_admin';
  const isAdmin = (): boolean => user?.role === 'admin' || isPlatformAdmin() || isSuperAdmin();
  const isParticipant = (): boolean => user?.role === 'participant';
  const isDonor = (): boolean => user?.role === 'donor';

  // Set up Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const authUser = await extractCustomClaims(firebaseUser);
          setUser(authUser);
          
          // Set up periodic token refresh to keep custom claims updated
          const refreshInterval = setInterval(async () => {
            try {
              await firebaseUser.getIdToken(true);
              const updatedUser = await extractCustomClaims(firebaseUser);
              setUser(updatedUser);
            } catch (error) {
              console.error('Token refresh error:', error);
            }
          }, 10 * 60 * 1000); // Refresh every 10 minutes

          // Clean up interval when user changes
          return () => clearInterval(refreshInterval);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Authentication error occurred');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    // State
    user,
    loading,
    error,
    
    // Authentication methods
    login,
    register,
    loginWithGoogle,
    logout,
    
    // Permission helpers
    hasRole,
    hasPermission,
    hasAnyRole,
    isSuperAdmin,
    isPlatformAdmin,
    isAdmin,
    isParticipant,
    isDonor,
    
    // Utility methods
    refreshUser,
    getCurrentToken,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for authentication requirements
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: UserRole,
  requiredPermission?: string
) => {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, hasRole, hasPermission } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return <div>Please log in to access this content.</div>;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      return <div>Access denied. Required role: {requiredRole}</div>;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      return <div>Access denied. Required permission: {requiredPermission}</div>;
    }

    return <Component {...props} />;
  };
}; 
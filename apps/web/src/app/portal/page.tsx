'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeLogo from '@/components/ThemeLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Lock, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Mail,
  Eye,
  EyeOff
} from 'lucide-react';
import Image from 'next/image';
import { authenticateFounder, setFounderAccess } from '@/services/founderAccessService';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';

export default function FoundersPortalPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  const handleFounderLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      const result = await authenticateFounder(email, password);
      
      if (result.success) {
        // Set session with founder login info
        setFounderAccess({
          email: email,
          name: result.name,
          userId: result.user?.uid
        });
        
        // Redirect to founders-only page
        router.push('/portal/founders-only');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsVerifying(true);
    setError('');

    try {
      // Use the existing Google OAuth from AuthContext
      await loginWithGoogle();
      
      // After successful Google login, check if user has platform_admin or super_admin role
      // The AuthContext will handle the Firebase authentication
      
      // Get the current user after Google login
      const currentUser = auth.currentUser;
      if (currentUser?.email) {
        // Check user's role in Firestore
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userRole = userData.role;
          
          // Allow access for Super Admins and Platform Admins
          if (userRole === 'super_admin' || userRole === 'platform_admin') {
            // Set founder access session
            const founderName = currentUser.displayName || userData.name || currentUser.email.split('@')[0];
            setFounderAccess({
              email: currentUser.email,
              name: founderName,
              userId: currentUser.uid
            });
            
            // Redirect to founders-only page
            router.push('/portal/founders-only');
          } else {
            setError('This Google account is not authorized for founders portal access. Contact Joel Yaffe if you believe this is an error.');
          }
        } else {
          setError('User account not found in system. Please contact SHELTR Team.');
        }
      }
    } catch (err) {
      console.error('Google login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Google login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContactRequest = () => {
    window.open('mailto:founders@sheltr-ai.com?subject=Founders Portal Access Request', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            
            <div className="flex items-center space-x-4">
              <Lock className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {/* Access Verification Card */}
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image 
                  src="/logo.svg" 
                  alt="SHELTR Logo" 
                  width={32} 
                  height={32}
                  className="brightness-0 invert"
                />
              </div>
              <CardTitle className="text-2xl">Portal Access</CardTitle>
              <p className="text-muted-foreground">
                This area is restricted to SHELTR Leadership.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Access Requirements */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Access Requirements:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SHELTR co-founder status</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Valid SHELTR team credentials</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Authorized founder email address</span>
                  </div>
                </div>
              </div>

              {/* Founder Login */}
              <div className="space-y-4">
                <form onSubmit={handleFounderLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isVerifying}
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        Access Founders Portal
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign-In Button */}
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Signing in with Google...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mt-4">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                </div>
              )}

              {/* Contact for Access */}
              <div className="text-center space-y-3">
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Need assistance with access?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleContactRequest}
                    className="w-full"
                  >
                    Contact SHELTR Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-700 dark:text-purple-300 text-sm">
                  Security & Confidentiality
                </h4>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                  All information beyond this point is highly confidential and proprietary to SHELTR. 
                  Access is logged and monitored for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

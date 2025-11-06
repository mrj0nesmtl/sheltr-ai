'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';

export default function InvestorLoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in as qualified investor, investor, super_admin, or platform_admin
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role === 'qualified_investor' || user.role === 'investor' || user.role === 'super_admin' || user.role === 'platform_admin') {
        router.push('/ir/dataroom');
      } else {
        setError('Access denied. This portal is for investors and administrators only.');
      }
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Set investor access session storage (for accessing founder portal pages)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('investor-access', 'granted');
        sessionStorage.setItem('investor-info', JSON.stringify({
          email: userCredential.user.email,
          uid: userCredential.user.uid
        }));
      }
      
      // The useEffect above will handle the redirect after user state updates
      toast.success('Welcome to the SHELTR Investor Data Room');
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No investor account found with this email.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
      
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Set access session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('investor-access', 'granted');
        sessionStorage.setItem('investor-info', JSON.stringify({
          email: userCredential.user.email,
          uid: userCredential.user.uid
        }));
      }
      
      toast.success('Welcome to the SHELTR Investor Data Room');
    } catch (err: any) {
      console.error('Google login error:', err);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google sign-in.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // User cancelled, don't show error
        return;
      } else {
        setError('An error occurred during Google sign-in. Please try again.');
      }
      
      toast.error('Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md border-2 shadow-2xl">
        <CardHeader className="space-y-4 text-center">
          {/* SHELTR Logo - Clickable to Homepage */}
          <div className="flex justify-center mb-4">
            <Link href="/" className="relative w-32 h-32 hover:opacity-80 transition-opacity cursor-pointer">
              <Image
                src="/logo-sheltr-white.png"
                alt="SHELTR Logo - Return to Homepage"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>
          
          <div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              Investor Data Room
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Secure access to SHELTR investment materials
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="investor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="border-2"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="border-2"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border-2 border-destructive/50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Access Data Room
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-2"
            onClick={handleGoogleLogin}
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <FcGoogle className="mr-2 h-5 w-5" />
                Sign in with Google
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            <strong>Super Admins & Platform Admins:</strong> Use Google Sign-In
            <br />
            <strong>Investors:</strong> Use email/password credentials
          </p>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              This portal is restricted to authorized investors only.
              <br />
              For access inquiries, contact{' '}
              <a 
                href="mailto:joel@arcanaconcept.com" 
                className="text-primary hover:underline"
              >
                joel@arcanaconcept.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


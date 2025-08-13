"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuthActionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [actionMode, setActionMode] = useState<string | null>(null);
  const [actionCode, setActionCode] = useState<string | null>(null);
  
  // Password reset specific state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState<string | null>(null);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const code = searchParams.get('oobCode');
    
    setActionMode(mode);
    setActionCode(code);
    
    if (!mode || !code) {
      setError('Invalid or missing action parameters.');
      setLoading(false);
      return;
    }

    // Handle different action modes
    switch (mode) {
      case 'verifyEmail':
        handleEmailVerification(code);
        break;
      case 'resetPassword':
        handlePasswordResetVerification(code);
        break;
      default:
        setError('Unknown action mode.');
        setLoading(false);
    }
  }, [searchParams]);

  const handleEmailVerification = async (code: string) => {
    try {
      setLoading(true);
      await applyActionCode(auth, code);
      setSuccess('Your email has been successfully verified! You can now close this window and continue using SHELTR.');
    } catch (error: any) {
      console.error('Email verification error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetVerification = async (code: string) => {
    try {
      setLoading(true);
      const email = await verifyPasswordResetCode(auth, code);
      setResetEmail(email);
      setSuccess(`Password reset verified for ${email}. Please enter your new password below.`);
    } catch (error: any) {
      console.error('Password reset verification error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!actionCode) {
      setError('Missing action code.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await confirmPasswordReset(auth, actionCode, newPassword);
      setSuccess('Your password has been successfully reset! You can now sign in with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/expired-action-code':
        return 'This action link has expired. Please request a new one.';
      case 'auth/invalid-action-code':
        return 'This action link is invalid. Please check the link or request a new one.';
      case 'auth/user-disabled':
        return 'This user account has been disabled.';
      case 'auth/user-not-found':
        return 'No user found with this email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      default:
        return 'An error occurred. Please try again or contact support.';
    }
  };

  const getPageTitle = () => {
    switch (actionMode) {
      case 'verifyEmail':
        return 'Email Verification';
      case 'resetPassword':
        return 'Reset Password';
      default:
        return 'Authentication Action';
    }
  };

  const getPageIcon = () => {
    switch (actionMode) {
      case 'verifyEmail':
        return <Mail className="h-8 w-8" />;
      case 'resetPassword':
        return <Lock className="h-8 w-8" />;
      default:
        return <CheckCircle className="h-8 w-8" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 text-blue-600">
            {getPageIcon()}
          </div>
          <CardTitle className="text-2xl font-bold">{getPageTitle()}</CardTitle>
          <CardDescription>
            SHELTR Authentication System
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing your request...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && !loading && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Password Reset Form */}
          {actionMode === 'resetPassword' && resetEmail && !error && (
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !newPassword || !confirmPassword}
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </Button>
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-4">
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/">
                Go to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

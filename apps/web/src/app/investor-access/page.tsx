'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ThemeLogo } from '@/components/ThemeLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Mail,
  Key
} from 'lucide-react';

export default function InvestorAccessPage() {
  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      // Simulate verification process
      // In production, this would validate against a secure database
      if (accessCode === 'SHELTR2025' || accessCode === 'INVESTOR2025') {
        // Set investor access cookie
        document.cookie = 'investor-access=verified; path=/; max-age=86400'; // 24 hours
        
        // Redirect to investor relations
        router.push('/investor-relations');
      } else {
        setError('Invalid access code. Please contact SHELTR-AI for assistance.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContactRequest = () => {
    window.open('mailto:investors@sheltr-ai.com?subject=Investor Relations Access Request', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ThemeLogo />
              <span className="text-xl font-bold">SHELTR-AI</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Lock className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-muted-foreground">Investor Access</span>
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
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Investor Relations Access</CardTitle>
              <p className="text-muted-foreground">
                This area is restricted to qualified, vetted investors only.
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Access Requirements */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Access Requirements:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Accredited investor status</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>KYC/AML verification complete</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Valid access code from SHELTR-AI team</span>
                  </div>
                </div>
              </div>

              {/* Access Form */}
              <form onSubmit={handleAccessRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="investor@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessCode">Access Code</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="accessCode"
                      type="password"
                      placeholder="Enter your access code"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isVerifying || !email || !accessCode}
                >
                  {isVerifying ? (
                    'Verifying Access...'
                  ) : (
                    <>
                      Access Investor Relations
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Contact for Access */}
              <div className="text-center space-y-3">
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Don't have an access code?
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleContactRequest}
                    className="w-full"
                  >
                    Request Investor Access
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-700 dark:text-amber-300 text-sm">
                  Security & Confidentiality
                </h4>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  All information beyond this point is confidential and proprietary. 
                  Access is logged and monitored for security purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Demo Access Note */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <Badge variant="secondary" className="mb-2">DEMO ACCESS</Badge>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              For demonstration purposes, use access code: <code className="font-mono">SHELTR2025</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
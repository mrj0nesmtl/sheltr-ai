'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ThemeLogo from '@/components/ThemeLogo';
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
  Eye,
  EyeOff,
  Users
} from 'lucide-react';
import { authenticateFounder, setFounderAccess } from '@/services/founderAccessService';

export default function FoundersPortalPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
    } catch (err) {
      setError('Login failed. Please try again.');
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
              <span className="text-sm text-muted-foreground">Founders Portal</span>
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
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Founders Portal Access</CardTitle>
              <p className="text-muted-foreground">
                This area is restricted to SHELTR co-founders only.
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
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Co-Founder Access
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Joel Yaffe • Alexander Kline • Marc Reichel • Doug Kukura • Morgan Hirtle
                  </p>
                </div>
                
                <form onSubmit={handleFounderLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="founder@sheltr-ai.com"
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
                  All information beyond this point is highly confidential and proprietary to SHELTR co-founders. 
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

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock, 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Mail,
  Key,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { authenticateTeamMember, validateAccessCode, setInvestorAccess } from '@/services/investorAccessService';

export default function InvestorAccessPage() {
  // Common state
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('team');
  const router = useRouter();

  // Team login state
  const [teamEmail, setTeamEmail] = useState('');
  const [teamPassword, setTeamPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Investor access state
  const [investorEmail, setInvestorEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');

  const handleTeamLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      const result = await authenticateTeamMember(teamEmail, teamPassword);
      
      if (result.success) {
        // Set session with team login info
        setInvestorAccess('team_login', {
          email: teamEmail,
          role: result.role,
          userId: result.user?.uid
        });
        
        // Redirect to investor relations
        router.push('/investor-relations');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAccessCodeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      const result = await validateAccessCode(investorEmail, accessCode);
      
      if (result.success) {
        // Set session with access code info
        setInvestorAccess('access_code', {
          email: investorEmail
        });
        
        // Redirect to investor relations
        router.push('/investor-relations');
      } else {
        setError(result.error || 'Invalid access code');
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
            <Link href="/" className="flex items-center">
              <ThemeLogo />
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

              {/* Dual Authentication Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="team" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    SHELTR Team
                  </TabsTrigger>
                  <TabsTrigger value="investor" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Investor Access
                  </TabsTrigger>
                </TabsList>

                {/* SHELTR Team Login */}
                <TabsContent value="team" className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SHELTR Team Login</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For Super Admins and Platform Administrators
                    </p>
                  </div>
                  
                  <form onSubmit={handleTeamLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="teamEmail">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="teamEmail"
                          type="email"
                          placeholder="admin@sheltr-ai.com"
                          value={teamEmail}
                          onChange={(e) => setTeamEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teamPassword">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="teamPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={teamPassword}
                          onChange={(e) => setTeamPassword(e.target.value)}
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
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Authenticating...
                        </>
                      ) : (
                        <>
                          Login as SHELTR Team
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Investor Access Code */}
                <TabsContent value="investor" className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investor Access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      For qualified investors with access codes
                    </p>
                  </div>
                  
                  <form onSubmit={handleAccessCodeRequest} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="investorEmail">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="investorEmail"
                          type="email"
                          placeholder="investor@example.com"
                          value={investorEmail}
                          onChange={(e) => setInvestorEmail(e.target.value)}
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

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying Access...
                        </>
                      ) : (
                        <>
                          Access Investor Relations
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

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
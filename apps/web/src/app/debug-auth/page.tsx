'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle } from 'lucide-react';

export default function DebugAuthPage() {
  const { user, refreshUser, getCurrentToken } = useAuth();
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTokenInfo();
    }
  }, [user]);

  const fetchTokenInfo = async () => {
    try {
      const token = await getCurrentToken();
      if (token) {
        // Decode JWT to show claims
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        setTokenInfo(JSON.parse(jsonPayload));
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  const handleRefreshToken = async () => {
    setLoading(true);
    try {
      await refreshUser();
      await fetchTokenInfo();
      console.log('✅ Token refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Please log in to view authentication debug info.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Authentication Debug</span>
            <Button 
              onClick={handleRefreshToken} 
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Token
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">User Object</h3>
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">UID:</span>
                <span className="text-sm font-mono text-xs">{user.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Role:</span>
                <Badge variant={user.role === 'super_admin' ? 'default' : 'secondary'}>
                  {user.role || '❌ UNDEFINED'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Tenant ID:</span>
                <span className="text-sm">{user.sheltrTenantId || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Custom Claims from User Object */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Custom Claims (from user object)</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <pre className="text-xs overflow-x-auto">
                {JSON.stringify(user.customClaims, null, 2)}
              </pre>
            </div>
          </div>

          {/* Token Info */}
          {tokenInfo && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Firebase ID Token (decoded)</h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(tokenInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Authorization Status */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Authorization Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Can Access Secure Documents:</span>
                {(user.role === 'super_admin' || user.role === 'platform_admin') ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    YES
                  </Badge>
                ) : (
                  <Badge variant="destructive">NO</Badge>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Can Access Founders Portal:</span>
                {(user.role === 'super_admin' || user.role === 'platform_admin') ? (
                  <Badge variant="default" className="bg-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    YES
                  </Badge>
                ) : (
                  <Badge variant="destructive">NO</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <h3 className="text-sm font-semibold mb-2 text-amber-900 dark:text-amber-300">Troubleshooting</h3>
            <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
              <li>• If role is UNDEFINED, click "Refresh Token" above</li>
              <li>• If that doesn't work, log out and log back in</li>
              <li>• Clear browser cache if issue persists</li>
              <li>• Check that Firebase Auth has custom claims set</li>
            </ul>
          </div>

          {/* Test Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Test Secure Document Access</h3>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="/secure-docs/msb-registration-canada" target="_blank">
                  Test: MSB Registration Guide
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="/secure-docs/shelter-research" target="_blank">
                  Test: Shelter Research Hub
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <a href="/secure-docs/royaltri-design-guide" target="_blank">
                  Test: Royaltri Design Guide
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


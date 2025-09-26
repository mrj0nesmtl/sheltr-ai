'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ShortcodeInitService } from '@/services/shortcodeInitService';

export default function InitMessagingPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [initResult, setInitResult] = useState<{
    success: boolean;
    initialized: number;
    errors: string[];
  } | null>(null);
  const [stats, setStats] = useState<{
    totalShortcodes: number;
    activeShortcodes: number;
    shortcodesByRole: Record<string, number>;
  } | null>(null);

  // Check if user has access
  const hasAccess = user && ['super_admin', 'platform_admin'].includes(user.role || '');

  const handleInitializeShortcodes = async () => {
    setIsLoading(true);
    try {
      console.log('🎯 Starting shortcode initialization...');
      const result = await ShortcodeInitService.initializeAllAdminShortcodes();
      setInitResult(result);
      
      // Load stats after initialization
      const statsResult = await ShortcodeInitService.getShortcodeStats();
      setStats(statsResult);
      
      console.log('✅ Initialization complete:', result);
    } catch (error) {
      console.error('❌ Error initializing shortcodes:', error);
      setInitResult({
        success: false,
        initialized: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadStats = async () => {
    try {
      const statsResult = await ShortcodeInitService.getShortcodeStats();
      setStats(statsResult);
    } catch (error) {
      console.error('❌ Error loading stats:', error);
    }
  };

  if (!hasAccess) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-96">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Settings className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This initialization page is only available to Super Admins and Platform Admins.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Initialize Messaging System</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Set up @shortcodes for all admin users to enable messaging
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Initialization Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Shortcode Initialization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This will create @shortcodes for all admin users (Super Admin, Platform Admin, Shelter Admin) 
              to enable the internal messaging system.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInitializeShortcodes}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4" />
                )}
                Initialize All Shortcodes
              </Button>
              
              <Button
                variant="outline"
                onClick={handleLoadStats}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Load Stats
              </Button>
            </div>

            {/* Initialization Results */}
            {initResult && (
              <div className="mt-4 p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {initResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-semibold">
                    {initResult.success ? 'Initialization Successful' : 'Initialization Failed'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Users Initialized:</strong> {initResult.initialized}
                  </p>
                  
                  {initResult.errors.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-red-600 mb-1">Errors:</p>
                      <ul className="text-sm space-y-1">
                        {initResult.errors.map((error, index) => (
                          <li key={index} className="text-red-600">• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Shortcode Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalShortcodes}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Shortcodes</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.activeShortcodes}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Active Shortcodes</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">By Role:</h4>
                  <div className="space-y-2">
                    {Object.entries(stats.shortcodesByRole).map(([role, count]) => (
                      <div key={role} className="flex justify-between items-center">
                        <Badge variant="outline" className="capitalize">
                          {role.replace('_', ' ')}
                        </Badge>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Click "Load Stats" to view shortcode statistics</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Initialize All Shortcodes" to create @mentions for all admin users</li>
            <li>Wait for the initialization to complete</li>
            <li>Go to <a href="/dashboard/messages" className="text-blue-600 hover:underline">/dashboard/messages</a> to test messaging</li>
            <li>The recipient dropdown should now be populated with all admin users</li>
            <li>You can also use @username format in messages (e.g., "@joel Can you help?")</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function OAuthSetupPage() {
  const [loading, setLoading] = useState(false);
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGetAuthUrl = async () => {
    setLoading(true);
    setError(null);
    setAuthUrl(null);

    try {
      const functions = getFunctions();
      const getOAuthUrl = httpsCallable(functions, 'getOAuthUrl');
      const result = await getOAuthUrl();
      const data = result.data as { authUrl: string; message: string };
      
      setAuthUrl(data.authUrl);
      console.log('OAuth URL:', data.authUrl);
    } catch (err: any) {
      console.error('Error getting OAuth URL:', err);
      setError(err.message || 'Failed to get OAuth URL. Make sure you are signed in as super_admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">OAuth Setup for Google Meet</h1>
        <p className="text-muted-foreground">
          One-time setup to enable automatic Google Meet link generation for calendar events
        </p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </span>
              Generate Authorization URL
            </CardTitle>
            <CardDescription>
              Click the button below to generate your OAuth authorization URL.
              You must be signed in as a <strong>super_admin</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGetAuthUrl}
              disabled={loading || !!authUrl}
              size="lg"
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : authUrl ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  URL Generated
                </>
              ) : (
                'Generate OAuth URL'
              )}
            </Button>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Step 2 */}
        {authUrl && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </span>
                Authorize Application
              </CardTitle>
              <CardDescription>
                Click the link below to authorize SHELTR to create Google Meet links.
                You'll be redirected to Google to grant permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-muted p-4 break-all text-sm">
                {authUrl}
              </div>
              
              <Button
                asChild
                size="lg"
                className="w-full"
              >
                <a href={authUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Authorization Page
                </a>
              </Button>

              <Alert>
                <AlertDescription>
                  <strong>What happens next:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>You'll be redirected to Google</li>
                    <li>Sign in with your Google account</li>
                    <li>Grant calendar and Meet permissions</li>
                    <li>You'll be redirected back with a success message</li>
                    <li>All future meetings will automatically include Meet links!</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                3
              </span>
              Test the Integration
            </CardTitle>
            <CardDescription>
              After completing authorization, test by scheduling a new meeting from the contact page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Once OAuth is set up, all new calendar events will automatically include real Google Meet links!
            </p>
            <Button variant="outline" asChild>
              <a href="/contact">
                Go to Contact Page
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>ℹ️ Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>One-time setup:</strong> You only need to do this once. The authorization tokens are stored securely.
            </p>
            <p>
              <strong>Automatic refresh:</strong> Tokens are automatically refreshed when they expire.
            </p>
            <p>
              <strong>Fallback:</strong> If OAuth fails, meetings will still be created (just without automatic Meet links).
            </p>
            <p>
              <strong>Security:</strong> Only super_admin users can initiate the OAuth flow.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

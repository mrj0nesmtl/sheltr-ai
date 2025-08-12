'use client';

import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DonorWalletPreview from '@/components/demo/DonorWalletPreview';
import { ThemeToggle } from '@/components/theme-toggle';
import ThemeLogo from '@/components/ThemeLogo';

export default function DonorWalletDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/docs/donor-guide">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Donor Guide
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-8 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-red-100 text-red-800 mb-4">Demo Preview</Badge>
            <h1 className="text-4xl font-bold mb-4">SHELTR Donor Wallet</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Experience the future of transparent, connected charitable giving
            </p>
            
            <Alert className="max-w-2xl mx-auto">
              <Info className="h-4 w-4" />
              <AlertDescription>
                This is a preview of what a typical donor wallet would look like after 6 months of using SHELTR. 
                All data shown is simulated for demonstration purposes.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* Demo Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <DonorWalletPreview />
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Key Features Showcased</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-2">📊 Real-time Impact Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  See exactly how your donations are being used and track participant progress toward housing independence.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-2">🔄 Recurring Support Management</h3>
                <p className="text-sm text-muted-foreground">
                  Easily manage multiple recurring donations with different schedules and amounts for consistent support.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-2">🌟 Milestone Celebrations</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications and celebrate when participants achieve major milestones like employment or housing.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-2">💰 SmartFund™ Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Complete visibility into the 85/10/5 distribution showing direct support, housing fund, and shelter operations.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-2">🚀 One-Click Donations</h3>
                <p className="text-sm text-muted-foreground">
                  Quick donation buttons and QR code scanning for instant giving when you encounter participants.
                </p>
              </div>
              
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border">
                <h3 className="font-semibold mb-2">🌍 Distance Connection</h3>
                <p className="text-sm text-muted-foreground">
                  Support participants from anywhere while maintaining privacy and security for both parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Real Impact?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of donors who are transforming lives through transparent, connected giving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                Start Your Journey
              </Button>
            </Link>
            <Link href="/docs/donor-guide">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-red-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

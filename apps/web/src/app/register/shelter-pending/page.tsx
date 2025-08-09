"use client";

import Link from 'next/link';
import { CheckCircle, Clock, Mail, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ShelterPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link 
        href="/"
        className="fixed top-6 left-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors z-10"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="text-sm">Back to Home</span>
      </Link>

      <div className="w-full max-w-2xl mx-auto">
        {/* SHELTR Icon */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Link href="/" className="cursor-pointer transition-transform hover:scale-105">
              <img 
                src="/icon.svg" 
                alt="SHELTR" 
                className="h-16 w-auto filter invert dark:invert-0"
              />
            </Link>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Hacking Homelessness Through Technology
          </p>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              Application Submitted Successfully!
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your shelter registration is now under review
            </p>
            <Badge variant="outline" className="text-yellow-600 border-yellow-600 mt-4 w-fit mx-auto">
              Pending Approval
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Status Message */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    Application Received
                  </h4>
                  <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                    We&apos;ve received your shelter registration application and all required information. 
                    Our team will review your submission within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                What happens next?
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Review Process</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Our team will verify your shelter information, credentials, and documentation.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Background Check</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      We&apos;ll conduct necessary background checks and verify your shelter&apos;s status.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Approval Notification</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      You&apos;ll receive an email notification once your application is approved or if we need additional information.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Platform Access</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Once approved, you&apos;ll gain full access to the SHELTR platform and can begin managing your shelter operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center mb-2">
                <Clock className="h-4 w-4 mr-2" />
                Expected Timeline
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">1-2 Days</div>
                  <div className="text-blue-700 dark:text-blue-300">Initial Review</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">2-3 Days</div>
                  <div className="text-blue-700 dark:text-blue-300">Verification</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-800 dark:text-blue-200">3-5 Days</div>
                  <div className="text-blue-700 dark:text-blue-300">Final Approval</div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Need assistance?
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Email Support</p>
                    <a 
                      href="mailto:admin@sheltr-ai.com" 
                      className="text-blue-600 hover:text-blue-500 text-sm"
                    >
                      admin@sheltr-ai.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">Documentation</p>
                    <Link 
                      href="/docs/shelter-admin-guide" 
                      className="text-blue-600 hover:text-blue-500 text-sm"
                    >
                      Admin Guide
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Return to Homepage
                </Button>
              </Link>
              
              <Link href="/login" className="flex-1">
                <Button className="w-full">
                  Sign In to Existing Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <div className="mt-8 text-center space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              📧 Check Your Email
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We&apos;ve sent a confirmation email with your application reference number. 
              Please check your spam folder if you don&apos;t see it in your inbox.
            </p>
          </div>
        </div>

        {/* SHELTR Wordmark */}
        <div className="text-center mt-12">
          <div className="flex justify-center">
            <img 
              src="/logo.svg" 
              alt="SHELTR" 
              className="h-8 w-auto filter invert dark:invert-0 opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

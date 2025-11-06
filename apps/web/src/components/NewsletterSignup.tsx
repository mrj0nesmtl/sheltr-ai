'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Send, CheckCircle, Loader2, Sparkles } from 'lucide-react';
import { UnifiedInquiryService } from '@/services/unifiedInquiryService';

interface NewsletterSignupProps {
  source: 'landing' | 'about' | 'team' | 'other';
  variant?: 'default' | 'compact' | 'banner';
  className?: string;
}

export default function NewsletterSignup({ source, variant = 'default', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      console.log('📧 Attempting newsletter signup via UnifiedInquiryService:', { email, name, source });
      
      // Get current page for tracking
      const currentPage = typeof window !== 'undefined' 
        ? window.location.pathname.replace('/', '') || 'landing'
        : 'landing';
      
      await UnifiedInquiryService.createNewsletterSignup({
        email: email.trim(),
        name: name.trim() || undefined,
        source: source,
        page: currentPage
      });
      
      console.log('✅ Newsletter signup successful');
      setIsSuccess(true);
      setEmail('');
      setName('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
      
    } catch (error: any) {
      console.error('❌ Newsletter signup exception:', error);
      setErrorMessage(error?.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compact variant for sidebars/footers
  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Stay Updated</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Get impact stories and platform updates
        </p>
        <form onSubmit={handleSubmit} className="space-y-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting || isSuccess}
            className="h-9"
          />
          <Button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="w-full h-9"
            size="sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                Subscribing...
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle className="h-3 w-3 mr-2" />
                Subscribed!
              </>
            ) : (
              <>
                Subscribe
                <Send className="h-3 w-3 ml-2" />
              </>
            )}
          </Button>
        </form>
        {errorMessage && (
          <p className="text-xs text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }

  // Banner variant for prominent placement
  if (variant === 'banner') {
    return (
      <section className={`py-16 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8 md:p-12">
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-600">Welcome to the Movement!</h3>
                  <p className="text-muted-foreground">
                    You&apos;re now part of our community. We&apos;ll keep you updated on our journey to revolutionize homelessness solutions.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="flex justify-center">
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold">Subscribe to our Newsletter</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Be the first to hear about breakthrough innovations, inspiring success stories, and opportunities to make a real difference in the lives of those experiencing homelessness.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="Your Name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        className="h-12"
                      />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        required
                        className="h-12"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 text-lg"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Get Impact Updates
                          <Send className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>

                    {errorMessage && (
                      <p className="text-sm text-red-500 text-center">{errorMessage}</p>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      📧 Weekly inspiration • 🎯 Impact metrics • 🚀 Platform updates • ❤️ Community stories
                    </p>
                    <p className="text-xs text-muted-foreground text-center">
                      We respect your privacy. Unsubscribe anytime.
                    </p>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Default variant
  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        {isSuccess ? (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-green-600">You&apos;re In!</h3>
            <p className="text-sm text-muted-foreground">
              Check your inbox for a welcome message.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Stay Connected</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe to receive impact updates and platform news
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Your Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
              {errorMessage && (
                <p className="text-sm text-red-500 text-center">{errorMessage}</p>
              )}
              <p className="text-xs text-muted-foreground text-center">
                Unsubscribe anytime
              </p>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


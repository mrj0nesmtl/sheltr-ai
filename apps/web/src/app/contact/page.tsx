'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Mail, Phone, MapPin, MessageCircle, Send, ExternalLink, Github, FileText, Sparkles, Users, Heart, BarChart3, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import Head from 'next/head';

export default function ContactPage() {
  const { user, hasRole } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    type: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save contact inquiry to Firestore
      const contactData = {
        name: formData.name,
        email: formData.email,
        organization: formData.organization || null,
        inquiry_type: formData.type,
        subject: formData.subject,
        message: formData.message,
        status: 'new',
        priority: formData.type === 'partnership' ? 'high' : formData.type === 'investor' ? 'high' : 'normal',
        user_id: user?.uid || null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        responded: false,
        assigned_to: null,
        response_notes: null,
        metadata: {
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          referrer: typeof document !== 'undefined' ? document.referrer : null,
          page_url: typeof window !== 'undefined' ? window.location.href : null
        }
      };

      console.log('💬 [CONTACT] Submitting contact inquiry:', contactData);
      
      const docRef = await addDoc(collection(db, 'contact_inquiries'), contactData);
      
      console.log('✅ [CONTACT] Contact inquiry saved with ID:', docRef.id);
      
      setSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        organization: '',
        type: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('❌ [CONTACT] Error submitting contact form:', error);
      // You could show an error message here
      alert('There was an error submitting your message. Please try again or email us directly at joel@arcanaconcept.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Head>
        <title>Contact SHELTR - Get in Touch | Homeless Support Platform</title>
        <meta name="description" content="Contact SHELTR for partnerships, support, or questions about our blockchain-powered homeless support platform. Multiple ways to connect with our team." />
        <meta name="keywords" content="contact SHELTR, homeless support contact, shelter partnerships, donation platform support, blockchain social impact contact" />
        <meta property="og:title" content="Contact SHELTR - Get in Touch | Homeless Support Platform" />
        <meta property="og:description" content="Contact SHELTR for partnerships, support, or questions about our blockchain-powered homeless support platform. Multiple ways to connect with our team." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sheltr-ai.web.app/contact" />
        <meta property="og:image" content="https://sheltr-ai.web.app/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact SHELTR - Get in Touch" />
        <meta name="twitter:description" content="Contact SHELTR for partnerships, support, or questions about our blockchain-powered homeless support platform." />
        <meta name="twitter:image" content="https://sheltr-ai.web.app/og-image.jpg" />
        <link rel="canonical" href="https://sheltr-ai.web.app/contact" />
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <ThemeLogo className="h-8 w-auto" />
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link href="/solutions" className="text-muted-foreground hover:text-foreground transition-colors">
                  Solutions
                </Link>
                <Link href="/scan-give" className="text-muted-foreground hover:text-foreground transition-colors">
                  Scan & Give
                </Link>
                <Link href="/impact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Impact
                </Link>
              </div>

              {/* User Awareness Navigation */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      Welcome, {user.displayName || user.email}
                    </span>
                    <Link href={hasRole('donor') ? '/dashboard/donor' : hasRole('super_admin') ? '/dashboard' : hasRole('platform_admin') ? '/dashboard' : hasRole('participant') ? '/dashboard/participant' : '/dashboard'}>
                      <Button variant="ghost" size="sm">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to join the movement? Whether you're a shelter, donor, participant, or partner, 
                we're here to help you make an impact.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2">
                  <Users className="h-4 w-4 mr-2" />
                  Partnership Opportunities
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Heart className="h-4 w-4 mr-2" />
                  Donor Support
                </Badge>
                <Badge variant="secondary" className="px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Technical Questions
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Multiple Ways to Connect</h2>
                  <p className="text-muted-foreground mb-8">
                    Choose the communication method that works best for you. Our team is committed to 
                    responding to all inquiries within 24 hours.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="space-y-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                        <p className="text-muted-foreground mb-3">
                          General inquiries, partnerships, and technical support
                        </p>
                        <Link href="mailto:joel@arcanaconcept.com" className="text-blue-600 hover:underline font-medium">
                          joel@arcanaconcept.com
                        </Link>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
                        <p className="text-muted-foreground mb-3">
                          Get instant answers to common questions
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Use the chat widget in the bottom-right corner →
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="flex items-start space-x-4 p-6">
                      <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Headquarters</h3>
                        <p className="text-muted-foreground mb-3">
                          Visit us in Montreal, Quebec
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Montreal, QC, Canada<br />
                          (Specific address provided upon partnership)
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Social Media & Resources */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Follow Our Journey</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Link 
                      href="https://substack.com/@arcanaconcept" 
                      target="_blank"
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium">Substack</p>
                        <p className="text-sm text-muted-foreground">Latest insights</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>

                    <Link 
                      href="https://bsky.app/profile/sheltrops.bsky.social" 
                      target="_blank"
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">BlueSky</p>
                        <p className="text-sm text-muted-foreground">Social updates</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>

                    <Link 
                      href="https://github.com/mrj0nesmtl/sheltr-ai" 
                      target="_blank"
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Github className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                      <div>
                        <p className="font-medium">GitHub</p>
                        <p className="text-sm text-muted-foreground">Open source</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>

                    <Link 
                      href="https://notebooklm.google.com/notebook/9be5b193-5d20-469f-8cbe-32fabcf2e7f6" 
                      target="_blank"
                      className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">NotebookLM</p>
                        <p className="text-sm text-muted-foreground">Research notes</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <p className="text-muted-foreground">
                      Tell us about your interest in SHELTR. We'll get back to you within 24 hours.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MessageCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                        <p className="text-muted-foreground mb-6">
                          Thank you for reaching out. We'll respond within 24 hours.
                        </p>
                        <Button onClick={() => setSubmitted(false)} variant="outline">
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">Name *</label>
                            <Input
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium mb-2 block">Email *</label>
                            <Input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="your@email.com"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Organization</label>
                          <Input
                            value={formData.organization}
                            onChange={(e) => handleInputChange('organization', e.target.value)}
                            placeholder="Your organization (optional)"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Inquiry Type *</label>
                          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="partnership">Shelter Partnership</SelectItem>
                              <SelectItem value="donor">Donor Support</SelectItem>
                              <SelectItem value="participant">Participant Questions</SelectItem>
                              <SelectItem value="investor">Investment Inquiry</SelectItem>
                              <SelectItem value="media">Media & Press</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="general">General Question</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Subject *</label>
                          <Input
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="Brief subject line"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Message *</label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Tell us about your inquiry, goals, or questions..."
                            rows={5}
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <MessageCircle className="h-4 w-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Connect to Shelters */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make an Impact?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Explore our network of partner shelters and see how SHELTR is creating 
                transparent, immediate impact for people experiencing homelessness.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/shelters">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                    <MapPin className="h-5 w-5 mr-2" />
                    Explore Shelters
                  </Button>
                </Link>
                <Link href="/scan-give">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Heart className="h-5 w-5 mr-2" />
                    Try Scan & Give
                  </Button>
                </Link>
                <Link href="/solutions">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

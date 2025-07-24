import Link from 'next/link';
import { Home, Heart, Shield, Users, ArrowRight, Github, Twitter, Mail, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                         <Link href="/" className="flex items-center">
               <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto hover:opacity-80 transition-opacity" />
             </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/tokenomics" className="text-muted-foreground hover:text-primary transition-colors">Tokenomics</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Our Story</Badge>
          <h1 className="text-4xl font-bold mb-6">
            Hacking Homelessness Through Technology
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            SHELTR-AI was born from the belief that technology should bridge the gap between 
            those who need help and those who want to help. Our platform revolutionizes 
            charitable giving through transparency, efficiency, and genuine impact.
          </p>
        </div>
      </section>

      {/* Mission Cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Loyalty</CardTitle>
                <CardDescription>
                  Unwavering commitment to our users and their dignity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We stand by every participant, donor, and shelter partner with 
                  the same commitment to transparency and impact.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Protection</CardTitle>
                <CardDescription>
                  Safeguarding the vulnerable through secure technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our blockchain technology ensures every donation reaches its 
                  intended recipient with complete transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Care</CardTitle>
                <CardDescription>
                  Unconditional support for those experiencing homelessness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every feature we build is designed with compassion, respect, 
                  and the goal of restoring dignity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact & Mission */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Real Impact, Real Change</h2>
            <Badge variant="outline" className="mb-6">Transparent • Scalable • Effective</Badge>
          </div>
          
          <Card className="text-left max-w-2xl mx-auto">
            <CardContent className="p-8">
              <p className="text-lg mb-6">
                SHELTR-AI represents a revolutionary approach to charitable giving, combining 
                cutting-edge technology with compassionate action to create meaningful change 
                in the fight against homelessness.
              </p>
              <p className="text-muted-foreground mb-6">
                Every QR code scan, every blockchain transaction, and every smart contract execution 
                brings us closer to a world where technology bridges the gap between those who need 
                help and those ready to provide it.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border-l-4 border-primary">
                <p className="italic text-sm">
                  &quot;Technology should empower dignity, transparency should build trust, 
                  and every donation should create lasting impact for those who need it most.&quot;
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button>
                  <Heart className="h-4 w-4 mr-2" />
                  Start Giving
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* The Phoenix Moment */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Phoenix Moment</h2>
            <p className="text-xl text-muted-foreground">
              How a devastating setback became the catalyst for something far better
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Challenge</h3>
                  <p className="text-muted-foreground">
                    In early 2025, we lost our entire Supabase database due to account neglect during 
                    paid project work. What seemed like a catastrophic failure became an opportunity 
                    to build something revolutionary.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3">The Transformation</h3>
                  <p className="text-muted-foreground mb-4">
                    Instead of rebuilding the same system, we used this moment to create SHELTR-AI 2.0 
                    with modern architecture, enhanced features, and a commitment to real impact.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Legacy SHELTR</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Supabase backend</li>
                        <li>• Single-tenant architecture</li>
                        <li>• Basic blockchain integration</li>
                        <li>• 3-role system</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">SHELTR-AI 2.0</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Firebase + FastAPI</li>
                        <li>• Multi-tenant SaaS platform</li>
                        <li>• Full token system integration</li>
                        <li>• 4-role system with independent participants</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Movement</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Help us hack homelessness through technology. Every contribution, whether code, 
            donations, or community support, brings us closer to our mission.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scan-give">
              <Button size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving
              </Button>
            </Link>
            <Link href="/tokenomics">
              <Button variant="outline" size="lg">
                <Coins className="h-4 w-4 mr-2" />
                Learn About $SHLTR
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              <Github className="h-4 w-4 mr-2" />
              Contribute Code
            </Button>
            <Button variant="outline" size="lg">
              <Users className="h-4 w-4 mr-2" />
              Join Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
                             <Link href="/" className="flex items-center mb-4">
                 <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto hover:opacity-80 transition-opacity" />
               </Link>
              <p className="text-muted-foreground text-sm">
                Hacking homelessness through technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/solutions" className="hover:text-foreground">Solutions</Link></li>
                <li><Link href="/scan-give" className="hover:text-foreground">Scan & Give</Link></li>
                <li><Link href="/impact" className="hover:text-foreground">Impact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground flex items-center">
                  <Github className="h-3 w-3 mr-1" /> GitHub
                </a></li>
                <li><a href="#" className="hover:text-foreground flex items-center">
                  <Twitter className="h-3 w-3 mr-1" /> Twitter
                </a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground flex items-center">
                  <Mail className="h-3 w-3 mr-1" /> Contact
                </a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SHELTR-AI. Built with ❤️ in memory of Gunnar Blaze.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
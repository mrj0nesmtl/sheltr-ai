'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, Mail, Linkedin, Globe, Heart, Users, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function TeamPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const teamMembers = [
    { name: 'Joel Y.', email: 'joel@example.com', linkedin: '#', website: '#' },
    { name: 'Doug K.', email: 'doug@example.com', linkedin: '#', website: '#' },
    { name: 'Alex K.', email: 'alex@example.com', linkedin: '#', website: '#' },
    { name: 'Terry M.', email: 'terry@example.com', linkedin: '#', website: '#' },
    { name: 'Zaffia L.', email: 'zaffia@example.com', linkedin: '#', website: '#' },
    { name: 'Ami R.', email: 'ami@example.com', linkedin: '#', website: '#' },
    { name: 'Marc R.', email: 'marc@example.com', linkedin: '#', website: '#' },
    { name: 'Morgan H.', email: 'morgan@example.com', linkedin: '#', website: '#' },
    { name: 'Dominique L.', email: 'dominique@example.com', linkedin: '#', website: '#' },
    { name: 'Sara S.', email: 'sara@example.com', linkedin: '#', website: '#' },
    { name: 'Sen W.', email: 'sen@example.com', linkedin: '#', website: '#' },
    { name: 'Zell A.', email: 'zell@example.com', linkedin: '#', website: '#' },
  ];

  const inMemoryMembers = [
    { name: 'Mihai Frimu', email: 'mihai@example.com', linkedin: '#', website: '#' },
    { name: 'Toni Lane Casserly', email: 'toni@example.com', linkedin: '#', website: '#' },
    { name: 'Jim Anastassiou', email: 'jim@example.com', linkedin: '#', website: '#' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <ThemeLogo />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">
                Solutions
              </Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">
                Scan & Give
              </Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">
                Impact
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
                <Link 
                  href="/about" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/solutions" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solutions
                </Link>
                <Link 
                  href="/scan-give" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Scan & Give
                </Link>
                <Link 
                  href="/impact" 
                  className="block px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Impact
                </Link>
                <div className="border-t pt-2 mt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start mb-2">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative py-24 min-h-[60vh] flex items-center"
        style={{
          backgroundImage: "url('/backgrounds/about-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-semibold mb-6">
              MEET THE TEAM
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Who's <span className="text-blue-400">Behind</span> SHELTR?
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto">
              A diverse team of innovators, technologists, and humanitarian leaders committed to transforming charitable giving.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Leadership Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Dedicated professionals working together to create lasting social impact through technology and innovation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-center space-x-3 mb-4">
                      <Link href={`mailto:${member.email}`} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-4 w-4" />
                      </Link>
                      <Link href={member.linkedin} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                      <Link href={member.website} className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Globe className="h-4 w-4" />
                      </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      [Bio placeholder - to be provided]
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* In Memory Section */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: "url('/backgrounds/impact-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6 text-white">
                <Heart className="h-4 w-4" />
                IN MEMORY
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Honoring Our Legacy
              </h2>
              <p className="text-xl text-gray-200 max-w-3xl mx-auto">
                Remembering the incredible individuals who inspired our mission and continue to guide our work.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {inMemoryMembers.map((member, index) => (
                <Card key={index} className="text-center border-2 border-white/20 bg-white/10 backdrop-blur-sm hover:border-white/40 transition-all duration-300 hover:shadow-lg group">
                  <CardHeader className="pb-4">
                    <div className="mx-auto mb-4 w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <CardTitle className="text-lg text-white">{member.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-orange-300">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-center space-x-3 mb-4">
                      <Link href={`mailto:${member.email}`} className="p-2 text-gray-300 hover:text-white transition-colors">
                        <Mail className="h-4 w-4" />
                      </Link>
                      <Link href={member.linkedin} className="p-2 text-gray-300 hover:text-white transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                      <Link href={member.website} className="p-2 text-gray-300 hover:text-white transition-colors">
                        <Globe className="h-4 w-4" />
                      </Link>
                    </div>
                    <p className="text-xs text-gray-300">
                      [Memorial tribute placeholder - to be provided]
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border-2 border-white/20">
                <h3 className="text-2xl font-bold mb-4 text-white">Their Legacy Lives On</h3>
                <p className="text-lg text-gray-200 mb-6">
                  These remarkable individuals continue to inspire our mission and remind us of the profound impact 
                  that dedicated people can have on the world. Their vision and values guide every decision we make.
                </p>
                <div className="flex justify-center">
                  <Link href="/about">
                    <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                      <Heart className="h-5 w-5 mr-2" />
                      Learn About Our Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We&apos;re always looking for passionate individuals who share our vision of transforming charitable giving through technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  <Users className="h-5 w-5 mr-2" />
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  <Star className="h-5 w-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

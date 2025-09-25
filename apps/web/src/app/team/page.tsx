'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogIn, Mail, Linkedin, Globe, Heart, Users, Award, Building2, Calendar, Twitter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// Using custom avatar implementation instead of external component
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import { TeamSyncService, type PublicTeamMember } from '@/services/teamSyncService';

export default function TeamPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<PublicTeamMember[]>([]);
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    foundingMembers: 0,
    departments: [] as { name: string; count: number }[],
    totalExperience: 0,
    averageExperience: 0
  });
  const [loading, setLoading] = useState(true);

  // Load team data from Platform Admin profiles
  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading dynamic team data from Platform Admin profiles...');
        
        const [members, stats] = await Promise.all([
          TeamSyncService.getPublicTeamMembers(),
          TeamSyncService.getTeamStats()
        ]);
        
        setTeamMembers(members);
        setTeamStats(stats);
        
        console.log('✅ Team data loaded successfully:', {
          totalMembers: members.length,
          stats
        });
        
      } catch (error) {
        console.error('❌ Error loading team data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTeamData();
  }, []);

  // In-memory tribute members (those who are no longer with us)
  const inMemoryMembers = [
    { name: 'Mihai Frimu', role: 'Technical Visionary', description: 'Pioneered our blockchain architecture' },
    { name: 'Toni Lane Casserly', role: 'Strategic Advisor', description: 'Guided our early platform vision' },
    { name: 'Jim Anastassiou', role: 'Community Builder', description: 'Connected hearts and minds to our mission' },
  ];

  // Render team member card
  const renderTeamMemberCard = (member: PublicTeamMember) => (
    <Card key={member.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="relative mx-auto w-fit">
          <div className="h-24 w-24 mx-auto ring-2 ring-blue-200 dark:ring-blue-800 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {member.profilePicture ? (
              <img 
                src={member.profilePicture} 
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-white">
                {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg">{member.displayName}</CardTitle>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{member.jobTitle}</p>
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 mr-1" />
            {member.department}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bio */}
        {member.bio && (
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {member.bio}
          </p>
        )}
        
        {/* Specialization */}
        {member.specialization && (
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              {member.specialization}
            </Badge>
          </div>
        )}
        
        {/* Expertise */}
        {member.expertise.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <Award className="h-3 w-3 mr-1" />
              Expertise
            </div>
            <div className="flex flex-wrap gap-1">
              {member.expertise.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {member.expertise.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{member.expertise.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Experience */}
        {member.yearsOfExperience > 0 && (
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {member.yearsOfExperience} years experience
          </div>
        )}
        
        {/* Contact Links */}
        <div className="flex justify-center space-x-2 pt-2">
          {member.email && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={`mailto:${member.email}`} title="Email">
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.linkedIn && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={member.linkedIn} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.twitter && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={member.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.website && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={member.website} target="_blank" rel="noopener noreferrer" title="Website">
                <Globe className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

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
              <Button variant="outline" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md hover:bg-accent"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-2">
                <Link href="/about" className="px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
                <Link href="/solutions" className="px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Solutions
                </Link>
                <Link href="/scan-give" className="px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Scan & Give
                </Link>
                <Link href="/impact" className="px-4 py-2 text-muted-foreground hover:text-primary transition-colors">
                  Impact
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" 
          style={{backgroundImage: 'url(/images/sheltr_units/hero-pods.png)'}}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-6">Meet Our Team</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Passionate individuals united by a shared mission to revolutionize homelessness solutions 
            through innovative technology and compassionate action.
          </p>
          
          {!loading && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.totalMembers}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.foundingMembers}</div>
                <div className="text-sm text-muted-foreground">Founders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.departments.length}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.averageExperience}</div>
                <div className="text-sm text-muted-foreground">Avg. Experience</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading our amazing team...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Our team members haven&apos;t made their profiles public yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Team Members in Corporate Hierarchy Order */}
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-4">Our Leadership Team</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Meet our dedicated team - from founding visionaries to specialists 
                  driving innovation across engineering, finance, operations, and outreach.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {teamMembers.map(renderTeamMemberCard)}
              </div>
            </>
          )}
        </div>
      </section>

      {/* In Memory Section */}
      {inMemoryMembers.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center">
                <Heart className="h-6 w-6 mr-2 text-red-500" />
                In Loving Memory
              </h2>
              <p className="text-muted-foreground">
                Honoring those who helped shape our vision and will forever be part of our story.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {inMemoryMembers.map((member, index) => (
                <Card key={index} className="text-center border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription className="font-medium text-red-600 dark:text-red-400">
                      {member.role}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Ready to make a difference? Whether you&apos;re looking to donate, volunteer, or partner with us, 
            there are many ways to get involved in revolutionizing homelessness solutions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/scan-give">
                <Heart className="h-4 w-4 mr-2" />
                Start Giving
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/solutions">
                <Building2 className="h-4 w-4 mr-2" />
                Partner With Us
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Mail className="h-4 w-4 mr-2" />
                Get In Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
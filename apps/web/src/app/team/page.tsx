'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Linkedin, Globe, Heart, Users, Award, Building2, Calendar, Twitter, Loader2, Share2, Rss, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from '@/components/Footer';
import { PublicTeamService, type PublicTeamMember } from '@/services/publicTeamService';
import PublicNavigation from '@/components/PublicNavigation';

export default function TeamPage() {
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
          PublicTeamService.getPublicTeamMembers(),
          PublicTeamService.getTeamStats()
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
          {/* Display specialization as the primary job title for more exciting descriptions */}
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {member.specialization || member.jobTitle}
          </p>
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
      {/* Navigation - Now using unified PublicNavigation component */}
      <PublicNavigation />

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.totalMembers}</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.departments.length}</div>
                <div className="text-sm text-muted-foreground">Departments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{teamStats.averageExperience}</div>
                <div className="text-sm text-muted-foreground">Avg. Experience (Years)</div>
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

      {/* Social Media Connection Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-blue-500/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
                <Share2 className="h-7 w-7 mr-3 text-primary" />
                Connect With Us
              </h2>
              <p className="text-muted-foreground text-lg">
                Follow our journey and stay updated on our mission to revolutionize homelessness solutions
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {/* Bluesky */}
              <a
                href="https://bsky.app/profile/sheltr.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-blue-200 dark:border-blue-800 cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">Bluesky</span>
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/sheltr_ai"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-gray-200 dark:border-gray-800 cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Twitter className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">X</span>
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@sheltr.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-pink-200 dark:border-pink-800 cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">TikTok</span>
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* Blog */}
              <a
                href="/blog"
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-orange-200 dark:border-orange-800 cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Rss className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">Blog</span>
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* Arcana Concept */}
              <a
                href="https://www.arcanaconcept.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-purple-200 dark:border-purple-800 cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">Arcana</span>
                    </div>
                  </CardContent>
                </Card>
              </a>

              {/* Spotify Podcast */}
              <a
                href="https://open.spotify.com/show/3Q2RpnzF9sUv26yPMP9tWI?si=d5018fdbb33b445d"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border-green-200 dark:border-green-800 cursor-pointer">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">Spotify</span>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </div>
          </div>
        </section>

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
'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, TrendingUp, ExternalLink, Play, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function AngelsPage() {
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
              <Link href="/impact">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Impact
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/backgrounds/hero-bg.jpg)'}}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">Internet Angels</Badge>
            <h1 className="text-4xl font-bold mb-6">Angels Amongst Us</h1>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Digital humanitarians who prove that social media platforms can be forces for genuine change. 
              These creators inspire our vision for systematic, scalable solutions that ensure every act of kindness 
              creates lasting impact through technology and compassion.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24.8M</div>
              <div className="text-sm text-muted-foreground">Combined Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">656M</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Lives Touched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">6</div>
              <div className="text-sm text-muted-foreground">Featured Angels</div>
            </div>
          </div>
        </div>
      </section>

      {/* Angel Showcases */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Just Knate */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  JK
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Just Knate</h2>
                  <p className="text-muted-foreground">@justknate</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.8M</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">78.5M</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  A digital humanitarian who uses his massive platform to directly help people in need. 
                  Known for his genuine approach to charity and his ability to mobilize his community for good causes.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@justknate" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Play className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  </a>
                  <Button variant="outline">
                    <span className="mr-2">💰</span>
                    Cash App: $justknate
                  </Button>
                  <Button variant="outline">
                    <span className="mr-2">💳</span>
                    Venmo: @justknate
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8">
              <h3 className="font-semibold mb-4">Recent Impact Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm">Direct financial assistance to families in crisis</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Community mobilization for emergency support</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Viral campaigns raising awareness for homelessness</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tiny Tiny Homes */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  TTH
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Tiny Tiny Homes</h2>
                  <p className="text-muted-foreground">@tinytinyhomes</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">237.4K</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.1M</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  Based in Toronto, Ryan creates innovative mobile emergency shelters that replace unsafe tent encampments 
                  with dignified, secure alternatives. A true pioneer in homelessness solutions.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@tinytinyhomes" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Play className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  </a>
                  <a href="https://linktr.ee/tinytinyhomes" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:order-1 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8">
              <h3 className="font-semibold mb-4">Innovation Highlights</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏠</span>
                  <span className="text-sm">Mobile emergency shelter design</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🔧</span>
                  <span className="text-sm">Practical solutions for urban homelessness</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span className="text-sm">Toronto-based community impact</span>
                </div>
              </div>
            </div>
          </div>

          {/* THE GOOD BOSS */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  GB
                </div>
                <div>
                  <h2 className="text-3xl font-bold">THE GOOD BOSS</h2>
                  <p className="text-muted-foreground">@victorthegoodboss</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">4M</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">83.7M</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  Creator, entrepreneur, and dedicated humanitarian who loves helping others. Known for his positive 
                  approach to business and his commitment to making a difference in people's lives.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@victorthegoodboss" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Play className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-8">
              <h3 className="font-semibold mb-4">Leadership Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💼</span>
                  <span className="text-sm">Entrepreneurial philanthropy</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🤝</span>
                  <span className="text-sm">Community building and support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">💡</span>
                  <span className="text-sm">Innovative approach to giving</span>
                </div>
              </div>
            </div>
          </div>

          {/* EdHelpsYT */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  EH
                </div>
                <div>
                  <h2 className="text-3xl font-bold">EdHelpsYT</h2>
                  <p className="text-muted-foreground">@edhelpsyt</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-600">3.3K</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">138.6K</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  Dedicated to helping those in need through direct action and community engagement. 
                  Though smaller in following, their impact per person is remarkable in their dedication to service.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@edhelpsyt" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Play className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:order-1 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-8">
              <h3 className="font-semibold mb-4">Grassroots Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎯</span>
                  <span className="text-sm">Targeted community assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">❤️</span>
                  <span className="text-sm">Personal connection with community</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📈</span>
                  <span className="text-sm">Growing influence and reach</span>
                </div>
              </div>
            </div>
          </div>

          {/* Acts of Heart */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  AH
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Acts of Heart</h2>
                  <p className="text-muted-foreground">@actsofheart4</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-pink-600">1.5K</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-rose-600">19.8K</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  Focused on genuine acts of kindness and heart-centered giving. Demonstrates that impact 
                  isn't about follower count, but about the authenticity and love behind every action.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@actsofheart4" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Play className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl p-8">
              <h3 className="font-semibold mb-4">Heart-Centered Giving</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💖</span>
                  <span className="text-sm">Authentic, compassionate outreach</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🤲</span>
                  <span className="text-sm">Direct, personal assistance</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌱</span>
                  <span className="text-sm">Growing community of kindness</span>
                </div>
              </div>
            </div>
          </div>

          {/* Caleb Simpson */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  CS
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Caleb Simpson</h2>
                  <p className="text-muted-foreground">@calebwsimpson</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">8.5M</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">322.2M</div>
                    <div className="text-sm text-muted-foreground">Likes</div>
                  </div>
                </div>
                <p className="text-lg leading-relaxed">
                  International humanitarian building 51 homes in Cambodia. Demonstrates the global impact possible 
                  when social media influence is channeled toward meaningful, sustainable change.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.tiktok.com/@calebwsimpson" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-black text-white hover:bg-gray-800">
                      <Play className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  </a>
                  <a href="https://linktr.ee/calebwsimpson92" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Links
                    </Button>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:order-1 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-8">
              <h3 className="font-semibold mb-4">Global Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏗️</span>
                  <span className="text-sm">51 homes being built in Cambodia</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🌍</span>
                  <span className="text-sm">International humanitarian projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📱</span>
                  <span className="text-sm">Massive social media influence for good</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SHELTR Connection */}
      <section className="py-16 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">The SHELTR Connection</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              These Angels inspire our mission to create systematic, scalable solutions that amplify the incredible work 
              of digital humanitarians. SHELTR's blockchain technology and AI-driven insights ensure every act of kindness 
              creates lasting, measurable impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">Amplify Impact</h3>
                <p className="text-sm text-muted-foreground">
                  Technology that scales the compassionate work these creators already do
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">Build Networks</h3>
                <p className="text-sm text-muted-foreground">
                  Connect Angels with sustainable support systems and resources
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="font-bold mb-2">Ensure Legacy</h3>
                <p className="text-sm text-muted-foreground">
                  Blockchain transparency guarantees their impact continues and grows
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/impact">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Heart className="h-4 w-4 mr-2" />
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

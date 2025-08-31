'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, TrendingUp, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

// TikTok video data for carousel - using clickable preview cards
const tiktokVideos = [
  {
    id: '7539670401589218582',
    url: 'https://www.tiktok.com/@london_news_exposed/video/7539670401589218582',
    username: '@london_news_exposed',
    displayName: 'London News Exposed',
    description: 'Veteran homeless Phil speaks outside once of prison after being bailed',
    tags: ['#londonnewsexposed', '#homeless', '#veteran'],
    thumbnail: '/api/placeholder/300/534' // TikTok aspect ratio
  },
  {
    id: '7534020508094942494',
    url: 'https://www.tiktok.com/@hard.knock.gospel/video/7534020508094942494',
    username: '@hard.knock.gospel',
    displayName: 'Hard Knock Gospel',
    description: 'HOW TO MAKE A HOMELESS SHELTER - Survival tactics from someone who lived it',
    tags: ['#homelesspeople', '#lifehack', '#recovery'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7524300608296324383',
    url: 'https://www.tiktok.com/@hard.knock.gospel/video/7524300608296324383',
    username: '@hard.knock.gospel',
    displayName: 'Hard Knock Gospel',
    description: 'Street rules that kept me safe and out of jail for a year on the streets',
    tags: ['#streetlife', '#homeless', '#recovery'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7540096124321860878',
    url: 'https://www.tiktok.com/@truthonthestreets/video/7540096124321860878',
    username: '@truthonthestreets',
    displayName: 'Truth on the Streets',
    description: 'Real talk about life on the streets',
    tags: ['#homeless', '#truth'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7538894385593797902',
    url: 'https://www.tiktok.com/@justknate/video/7538894385593797902',
    username: '@justknate',
    displayName: 'Just Knate',
    description: 'Helping those in need - one person at a time',
    tags: ['#teamjustus', '#kindness'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7538923245353864478',
    url: 'https://www.tiktok.com/@pearlmania500/video/7538923245353864478',
    username: '@pearlmania500',
    displayName: 'Pearlmania500',
    description: 'Food has never cost more, and our tank budget has never been higher',
    tags: ['#economy', '#struggle'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7538685893805149458',
    url: 'https://www.tiktok.com/@jonfromnova/video/7538685893805149458',
    username: '@jonfromnova',
    displayName: 'Jon from Nova',
    description: 'Ever thought about it? 💭 AI and society',
    tags: ['#ai', '#technology'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7538847495368002838',
    url: 'https://www.tiktok.com/@officialmtclips/video/7538847495368002838',
    username: '@officialmtclips',
    displayName: 'Official MT Clips',
    description: 'Levels of wealth and money mindset',
    tags: ['#wealth', '#money', '#mindset'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7537778081012911391',
    url: 'https://www.tiktok.com/@livenowfox/video/7537778081012911391',
    username: '@livenowfox',
    displayName: 'LiveNOW from FOX',
    description: 'Trump promises to remove homeless people from DC under threat of jail',
    tags: ['#politics', '#homeless'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7537396358668406046',
    url: 'https://www.tiktok.com/@pearlmania500/video/7537396358668406046',
    username: '@pearlmania500',
    displayName: 'Pearlmania500',
    description: 'Congress abandoned organizations doing real work at home',
    tags: ['#politics', '#government'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7536168186941623574',
    url: 'https://www.tiktok.com/@wateraid/video/7536168186941623574',
    username: '@wateraid',
    displayName: 'WaterAid',
    description: 'In Colombia: Bicycle parts pulley system + MrBeast = Clean water for 1,000 people',
    tags: ['#water', '#mrbeast', '#colombia'],
    thumbnail: '/api/placeholder/300/534'
  },
  {
    id: '7537678541589122318',
    url: 'https://www.tiktok.com/@mohbd97/video/7537678541589122318',
    username: '@mohbd97',
    displayName: 'Mohbd97',
    description: 'Breaking news and current events',
    tags: ['#news', '#breaking'],
    thumbnail: '/api/placeholder/300/534'
  }
];

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
            <Badge variant="secondary" className="mb-4">Internet Angels</Badge>
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
                  approach to business and his commitment to making a difference in people&apos;s lives.
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
                  isn&apos;t about follower count, but about the authenticity and love behind every action.
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

      {/* Because the System is Broken Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="destructive" className="mb-4">Reality Check</Badge>
            <h2 className="text-3xl font-bold mb-4">Because the System is Broken</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              These voices from the streets, advocates, and truth-tellers show us why we need to build something better.
            </p>
          </div>

          {/* TikTok Video Cards */}
          <div className="max-w-full mx-auto">
            {/* Desktop Grid View - Hidden on Mobile */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiktokVideos.slice(0, 6).map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-b from-slate-900 to-black border-slate-800"
                >
                  <div className="aspect-[9/16] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                    <div className="absolute top-4 right-4 z-20">
                      <div className="bg-black/70 rounded-full p-2">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                      <p className="font-semibold text-sm mb-1">{video.displayName}</p>
                      <p className="text-xs opacity-90 mb-2 line-clamp-3">{video.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* TikTok Embed */}
                    <iframe
                      src={`https://www.tiktok.com/embed/v2/${video.id}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full pointer-events-auto"
                      style={{
                        border: 'none',
                        borderRadius: '0',
                      }}
                      onError={() => {
                        // Fallback to gradient if embed fails
                        const iframe = document.querySelector(`iframe[src*="${video.id}"]`) as HTMLIFrameElement;
                        if (iframe) {
                          iframe.style.display = 'none';
                          const fallbacks = iframe.parentElement?.querySelectorAll('.tiktok-fallback');
                          fallbacks?.forEach((fallback) => {
                            (fallback as HTMLElement).style.display = 'block';
                          });
                        }
                      }}
                    />
                    {/* Fallback gradient (hidden by default) */}
                    <div className="tiktok-fallback absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900" style={{display: 'none'}} />
                    <div className="tiktok-fallback absolute inset-0 bg-black/20" style={{display: 'none'}} />
                    <div className="tiktok-fallback absolute inset-0 flex items-center justify-center" style={{display: 'none'}}>
                      <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Mobile Carousel - Only on Mobile */}
            <div className="md:hidden">
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full mx-auto"
              >
                <CarouselContent className="-ml-4">
                  {tiktokVideos.map((video) => (
                    <CarouselItem key={video.id} className="pl-4 basis-[85%]">
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-b from-slate-900 to-black border-slate-800 mx-2"
                      >
                        <div className="aspect-[9/16] relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
                          <div className="absolute top-4 right-4 z-20">
                            <div className="bg-black/70 rounded-full p-2">
                              <Play className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white">
                            <p className="font-semibold text-sm mb-1">{video.displayName}</p>
                            <p className="text-xs opacity-90 mb-2 line-clamp-2">{video.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {video.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs bg-white/20 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          {/* TikTok Embed */}
                          <iframe
                            src={`https://www.tiktok.com/embed/v2/${video.id}`}
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full pointer-events-auto"
                            style={{
                              border: 'none',
                              borderRadius: '0',
                            }}
                            onError={() => {
                              // Fallback to gradient if embed fails
                              const iframe = document.querySelector(`iframe[src*="${video.id}"]`) as HTMLIFrameElement;
                              if (iframe) {
                                iframe.style.display = 'none';
                                const fallbacks = iframe.parentElement?.querySelectorAll('.tiktok-fallback');
                                fallbacks?.forEach((fallback) => {
                                  (fallback as HTMLElement).style.display = 'block';
                                });
                              }
                            }}
                          />
                          {/* Fallback gradient (hidden by default) */}
                          <div className="tiktok-fallback absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900" style={{display: 'none'}} />
                          <div className="tiktok-fallback absolute inset-0 bg-black/20" style={{display: 'none'}} />
                          <div className="tiktok-fallback absolute inset-0 flex items-center justify-center" style={{display: 'none'}}>
                            <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                              <Play className="w-6 h-6 text-white fill-white" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-black/80 hover:bg-black border-white/20 text-white shadow-lg" />
                <CarouselNext className="right-2 bg-black/80 hover:bg-black border-white/20 text-white shadow-lg" />
              </Carousel>
              
              {/* Carousel Info */}
              <div className="text-center mt-6">
                <p className="text-sm text-muted-foreground">
                  Swipe to navigate • {tiktokVideos.length} powerful stories
                </p>
              </div>
            </div>
          </div>

          {/* Closing Quote */}
          <div className="text-center mt-16">
            <blockquote className="text-2xl md:text-3xl lg:text-4xl italic font-light text-foreground/90 max-w-4xl mx-auto leading-relaxed">
              &ldquo;These are just a few voices. There are millions more stories that need to be heard.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      {/* The SHELTR Connection */}
      <section className="py-16 bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-6">The SHELTR Connection</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
              These Angels inspire our mission to create systematic, scalable solutions that amplify the incredible work 
              of digital humanitarians. SHELTR&apos;s blockchain technology and AI-driven insights ensure every act of kindness 
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

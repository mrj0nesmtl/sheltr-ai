'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Users, TrendingUp, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';
import Script from 'next/script';

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

          {/* TikTok Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Video 1 - London News Exposed */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@london_news_exposed/video/7539670401589218582" data-video-id="7539670401589218582" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@london_news_exposed" href="https://www.tiktok.com/@london_news_exposed?refer=embed">@london_news_exposed</a> veteran homeless Phil speaks outside once of prison after being bailed
                  <a title="londonnewsexposed" target="_blank" href="https://www.tiktok.com/tag/londonnewsexposed?refer=embed">#londonnewsexposed</a>
                  <a title="wandsworthprison" target="_blank" href="https://www.tiktok.com/tag/wandsworthprison?refer=embed">#Wandsworthprison</a>
                  <a title="vetetan" target="_blank" href="https://www.tiktok.com/tag/vetetan?refer=embed">#vetetan</a>
                  <a title="phil" target="_blank" href="https://www.tiktok.com/tag/phil?refer=embed">#phil</a>
                  <a title="homeless" target="_blank" href="https://www.tiktok.com/tag/homeless?refer=embed">#homeless</a>
                  <a target="_blank" title="♬ original sound - London News Exposed" href="https://www.tiktok.com/music/original-sound-7539670421080197910?refer=embed">♬ original sound - London News Exposed</a>
                </section>
              </blockquote>
            </div>

            {/* Video 2 - Hard Knock Gospel */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@hard.knock.gospel/video/7534020508094942494" data-video-id="7534020508094942494" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@hard.knock.gospel" href="https://www.tiktok.com/@hard.knock.gospel?refer=embed">@hard.knock.gospel</a> HOW TO MAKE A HOMELESS SHELTER 💯 FOLLOW ME for more homeless survival tactics, and to hear more about my journey through homelessness and addiction
                  <a title="homelesspeople" target="_blank" href="https://www.tiktok.com/tag/homelesspeople?refer=embed">#homelesspeople</a>
                  <a title="lifehack" target="_blank" href="https://www.tiktok.com/tag/lifehack?refer=embed">#lifehack</a>
                  <a title="recovery" target="_blank" href="https://www.tiktok.com/tag/recovery?refer=embed">#recovery</a>
                  <a title="spencerbrooksotto" target="_blank" href="https://www.tiktok.com/tag/spencerbrooksotto?refer=embed">#spencerbrooksotto</a>
                  <a target="_blank" title="♬ When I Get There - Big Wild" href="https://www.tiktok.com/music/When-I-Get-There-6966232552366180353?refer=embed">♬ When I Get There - Big Wild</a>
                </section>
              </blockquote>
            </div>

            {/* Video 3 - Hard Knock Gospel Street Rules */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@hard.knock.gospel/video/7524300608296324383" data-video-id="7524300608296324383" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@hard.knock.gospel" href="https://www.tiktok.com/@hard.knock.gospel?refer=embed">@hard.knock.gospel</a> These rules kept me safe, and out of jail, the entire year I lived on the streets💯 FULL VIDEO: YT@spencer_brooks_otto
                  <a title="streetlife" target="_blank" href="https://www.tiktok.com/tag/streetlife?refer=embed">#streetlife</a>
                  <a title="homeless" target="_blank" href="https://www.tiktok.com/tag/homeless?refer=embed">#homeless</a>
                  <a title="recovery" target="_blank" href="https://www.tiktok.com/tag/recovery?refer=embed">#recovery</a>
                  <a target="_blank" title="♬ original sound - Spencer Brooks Otto" href="https://www.tiktok.com/music/original-sound-7524300680518699806?refer=embed">♬ original sound - Spencer Brooks Otto</a>
                </section>
              </blockquote>
            </div>

            {/* Video 4 - Truth on the Streets */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@truthonthestreets/video/7540096124321860878" data-video-id="7540096124321860878" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@truthonthestreets" href="https://www.tiktok.com/@truthonthestreets?refer=embed">@truthonthestreets</a>
                  <a title="homeless" target="_blank" href="https://www.tiktok.com/tag/homeless?refer=embed">#homeless</a>
                  <a target="_blank" title="♬ original sound - KevinDahlgren" href="https://www.tiktok.com/music/original-sound-7540096161198115598?refer=embed">♬ original sound - KevinDahlgren</a>
                </section>
              </blockquote>
            </div>

            {/* Video 5 - Just Knate */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@justknate/video/7538894385593797902" data-video-id="7538894385593797902" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@justknate" href="https://www.tiktok.com/@justknate?refer=embed">@justknate</a>
                  <a title="teamjustus" target="_blank" href="https://www.tiktok.com/tag/teamjustus?refer=embed">#teamjustus</a>
                  <a target="_blank" title="♬ Pieces (Solo Piano Version) - Danilo Stankovic" href="https://www.tiktok.com/music/Pieces-Solo-Piano-Version-6777274113254754306?refer=embed">♬ Pieces (Solo Piano Version) - Danilo Stankovic</a>
                </section>
              </blockquote>
            </div>

            {/* Video 6 - Pearlmania500 */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@pearlmania500/video/7538923245353864478" data-video-id="7538923245353864478" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@pearlmania500" href="https://www.tiktok.com/@pearlmania500?refer=embed">@pearlmania500</a>
                  <p>Food has never cost more, and our tank budget has never been higher</p>
                  <a target="_blank" title="♬ original sound - Pearlmania500" href="https://www.tiktok.com/music/original-sound-7538928396525390622?refer=embed">♬ original sound - Pearlmania500</a>
                </section>
              </blockquote>
            </div>

            {/* Video 7 - Jon from Nova */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@jonfromnova/video/7538685893805149458" data-video-id="7538685893805149458" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@jonfromnova" href="https://www.tiktok.com/@jonfromnova?refer=embed">@jonfromnova</a> ever thought about it? 💭
                  <a title="ai" target="_blank" href="https://www.tiktok.com/tag/ai?refer=embed">#ai</a>
                  <a target="_blank" title="♬ original sound - Jonathan R. Halberg" href="https://www.tiktok.com/music/original-sound-7538685927695731457?refer=embed">♬ original sound - Jonathan R. Halberg</a>
                </section>
              </blockquote>
            </div>

            {/* Video 8 - Official MT Clips */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@officialmtclips/video/7538847495368002838" data-video-id="7538847495368002838" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@officialmtclips" href="https://www.tiktok.com/@officialmtclips?refer=embed">@officialmtclips</a>
                  <a title="levelsofwealth" target="_blank" href="https://www.tiktok.com/tag/levelsofwealth?refer=embed">#levelsofwealth</a>
                  <a title="moneyfacts" target="_blank" href="https://www.tiktok.com/tag/moneyfacts?refer=embed">#moneyfacts</a>
                  <a title="moneymindset" target="_blank" href="https://www.tiktok.com/tag/moneymindset?refer=embed">#moneymindset</a>
                  <a target="_blank" title="♬ original sound - TIME FOR EXPLANATION ⏳✔️" href="https://www.tiktok.com/music/original-sound-7538847625825405718?refer=embed">♬ original sound - TIME FOR EXPLANATION ⏳✔️</a>
                </section>
              </blockquote>
            </div>

            {/* Video 9 - LiveNOW from FOX */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@livenowfox/video/7537778081012911391" data-video-id="7537778081012911391" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@livenowfox" href="https://www.tiktok.com/@livenowfox?refer=embed">@livenowfox</a>
                  <p>President Trump promises to remove homeless people from DC under threat of jail or removal from the city</p>
                  <a target="_blank" title="♬ original sound - LiveNOW from FOX" href="https://www.tiktok.com/music/original-sound-7537778031176321823?refer=embed">♬ original sound - LiveNOW from FOX</a>
                </section>
              </blockquote>
            </div>

            {/* Video 10 - Pearlmania500 Congress */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@pearlmania500/video/7537396358668406046" data-video-id="7537396358668406046" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@pearlmania500" href="https://www.tiktok.com/@pearlmania500?refer=embed">@pearlmania500</a> Congress&apos;s abandoned the organizations that do the real work right here at home, then they abandoned DC to let us all know they abandoned their own principles
                  <a title="food" target="_blank" href="https://www.tiktok.com/tag/food?refer=embed">#food</a>
                  <a target="_blank" title="♬ original sound - Pearlmania500" href="https://www.tiktok.com/music/original-sound-7537396373004487454?refer=embed">♬ original sound - Pearlmania500</a>
                </section>
              </blockquote>
            </div>

            {/* Video 11 - WaterAid */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@wateraid/video/7536168186941623574" data-video-id="7536168186941623574" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@wateraid" href="https://www.tiktok.com/@wateraid?refer=embed">@wateraid</a> In Colombia, inventor Cristobal built a pulley system out of bicycle parts so his community could access water 💡 But the water wasn&apos;t safe to drink. So together with the community, @MrBeast @#TeamWater, installed a purification system, giving 1,000 people clean water 💧
                  <a title="teamwater" target="_blank" href="https://www.tiktok.com/tag/teamwater?refer=embed">#TeamWater</a>
                  <a title="wateraid" target="_blank" href="https://www.tiktok.com/tag/wateraid?refer=embed">#WaterAid</a>
                  <a title="water" target="_blank" href="https://www.tiktok.com/tag/water?refer=embed">#water</a>
                  <a title="mrbeast" target="_blank" href="https://www.tiktok.com/tag/mrbeast?refer=embed">#mrbeast</a>
                  <a title="colombia" target="_blank" href="https://www.tiktok.com/tag/colombia?refer=embed">#colombia</a>
                  <a target="_blank" title="♬ Way down We Go - KALEO" href="https://www.tiktok.com/music/Way-down-We-Go-6704985044194166786?refer=embed">♬ Way down We Go - KALEO</a>
                </section>
              </blockquote>
            </div>

            {/* Video 12 - mohbd97 */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@mohbd97/video/7537678541589122318" data-video-id="7537678541589122318" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@mohbd97" href="https://www.tiktok.com/@mohbd97?refer=embed">@mohbd97</a>
                  <a title="tiktok" target="_blank" href="https://www.tiktok.com/tag/tiktok?refer=embed">#tiktok</a>
                  <a title="news" target="_blank" href="https://www.tiktok.com/tag/news?refer=embed">#news</a>
                  <a title="fouyou" target="_blank" href="https://www.tiktok.com/tag/fouyou?refer=embed">#fouyou</a>
                  <a title="usa🇺🇸" target="_blank" href="https://www.tiktok.com/tag/usa%F0%9F%87%BA%F0%9F%87%B8?refer=embed">#usa🇺🇸</a>
                  <a title="breakingnews" target="_blank" href="https://www.tiktok.com/tag/breakingnews?refer=embed">#breakingnews</a>
                  <a title="tik" target="_blank" href="https://www.tiktok.com/tag/tik?refer=embed">#tik</a>
                  <a target="_blank" title="♬ original sound - mohbd" href="https://www.tiktok.com/music/original-sound-7537678745449089805?refer=embed">♬ original sound - mohbd</a>
                </section>
              </blockquote>
            </div>

            {/* Video 13 - Aaron Parnas */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@aaronparnas1/video/7537080409121688887" data-video-id="7537080409121688887" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@aaronparnas1" href="https://www.tiktok.com/@aaronparnas1?refer=embed">@aaronparnas1</a>
                  <p>8/10</p>
                  <a target="_blank" title="♬ original sound - Aaron Parnas" href="https://www.tiktok.com/music/original-sound-7537080525641157431?refer=embed">♬ original sound - Aaron Parnas</a>
                </section>
              </blockquote>
            </div>

            {/* Video 14 - Mario Zelaya */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@officialmariozelaya/video/7533684445468052742" data-video-id="7533684445468052742" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@officialmariozelaya" href="https://www.tiktok.com/@officialmariozelaya?refer=embed">@officialmariozelaya</a> Toronto spends nearly the same amount on their police task force as they do on shelters. Every single year. And the Number keeps getting bigger with them employing over 1500 people, the majority of them making over $115,000 per year.
                  <a title="toronto" target="_blank" href="https://www.tiktok.com/tag/toronto?refer=embed">#toronto</a>
                  <a title="ontario" target="_blank" href="https://www.tiktok.com/tag/ontario?refer=embed">#ontario</a>
                  <a title="tsss" target="_blank" href="https://www.tiktok.com/tag/tsss?refer=embed">#TSSS</a>
                  <a target="_blank" title="♬ original sound - Mario Zelaya" href="https://www.tiktok.com/music/original-sound-7533684445960899334?refer=embed">♬ original sound - Mario Zelaya</a>
                </section>
              </blockquote>
            </div>

            {/* Video 15 - Adin Ross Clips */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@adin_clip/video/7533775068569029906" data-video-id="7533775068569029906" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@adin_clip" href="https://www.tiktok.com/@adin_clip?refer=embed">@adin_clip</a> Adin was nervous 💀
                  <a title="adinross" target="_blank" href="https://www.tiktok.com/tag/adinross?refer=embed">#adinross</a>
                  <a title="mrbeast" target="_blank" href="https://www.tiktok.com/tag/mrbeast?refer=embed">#mrbeast</a>
                  <a title="viral" target="_blank" href="https://www.tiktok.com/tag/viral?refer=embed">#viral</a>
                  <a title="foryoupage" target="_blank" href="https://www.tiktok.com/tag/foryoupage?refer=embed">#foryoupage</a>
                  <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a>
                  <a target="_blank" title="♬ original sound - Adin Ross Clips" href="https://www.tiktok.com/music/original-sound-7533775192175201040?refer=embed">♬ original sound - Adin Ross Clips</a>
                </section>
              </blockquote>
            </div>

            {/* Video 16 - Victor The Good Boss */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@victorthegoodboss/video/7517401644951293214" data-video-id="7517401644951293214" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@victorthegoodboss" href="https://www.tiktok.com/@victorthegoodboss?refer=embed">@victorthegoodboss</a> Full video buying an RV for a homeless man and his dog!!!!!!
                  <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a>
                  <a target="_blank" title="♬ original sound - THE GOOD BOSS" href="https://www.tiktok.com/music/original-sound-7517401687720561439?refer=embed">♬ original sound - THE GOOD BOSS</a>
                </section>
              </blockquote>
            </div>

            {/* Video 17 - Truth on the Streets 2 */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@truthonthestreets/video/7534008461068111118" data-video-id="7534008461068111118" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@truthonthestreets" href="https://www.tiktok.com/@truthonthestreets?refer=embed">@truthonthestreets</a>
                  <a title="homeless" target="_blank" href="https://www.tiktok.com/tag/homeless?refer=embed">#homeless</a>
                  <a target="_blank" title="♬ original sound - KevinDahlgren" href="https://www.tiktok.com/music/original-sound-7534008569265277709?refer=embed">♬ original sound - KevinDahlgren</a>
                </section>
              </blockquote>
            </div>

            {/* Video 18 - Truth on the Streets 3 */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@truthonthestreets/video/7534437418368273719" data-video-id="7534437418368273719" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@truthonthestreets" href="https://www.tiktok.com/@truthonthestreets?refer=embed">@truthonthestreets</a>
                  <a title="homeless" target="_blank" href="https://www.tiktok.com/tag/homeless?refer=embed">#homeless</a>
                  <a target="_blank" title="♬ original sound - KevinDahlgren" href="https://www.tiktok.com/music/original-sound-7534437442074495758?refer=embed">♬ original sound - KevinDahlgren</a>
                </section>
              </blockquote>
            </div>

            {/* Video 19 - MD Motivator */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@mdmotivator/video/7533438045299854648" data-video-id="7533438045299854648" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@mdmotivator" href="https://www.tiktok.com/@mdmotivator?refer=embed">@mdmotivator</a> &quot;I don&apos;t have a drivers license, but I have a heart&quot; 🥹❤️ (GoFundMe 1N B10)
                  <a title="money" target="_blank" href="https://www.tiktok.com/tag/money?refer=embed">#money</a>
                  <a title="art" target="_blank" href="https://www.tiktok.com/tag/art?refer=embed">#art</a>
                  <a title="kindness" target="_blank" href="https://www.tiktok.com/tag/kindness?refer=embed">#kindness</a>
                  <a title="work" target="_blank" href="https://www.tiktok.com/tag/work?refer=embed">#work</a>
                  <a title="job" target="_blank" href="https://www.tiktok.com/tag/job?refer=embed">#job</a>
                  <a title="crowdfund" target="_blank" href="https://www.tiktok.com/tag/crowdfund?refer=embed">#crowdfund</a>
                  <a title="love" target="_blank" href="https://www.tiktok.com/tag/love?refer=embed">#love</a>
                  <a title="familia" target="_blank" href="https://www.tiktok.com/tag/familia?refer=embed">#familia</a>
                  <a target="_blank" title="♬ original sound - Zachery Dereniowski" href="https://www.tiktok.com/music/original-sound-7533438077747579704?refer=embed">♬ original sound - Zachery Dereniowski</a>
                </section>
              </blockquote>
            </div>

            {/* Video 20 - Sky News */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@skynews/video/7533563200642551062" data-video-id="7533563200642551062" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@skynews" href="https://www.tiktok.com/@skynews?refer=embed">@skynews</a> Working but #homeless: The #carpenter forced to sleep on #trains. Despite being a skilled worker, Daniel Wren is unable to afford somewhere to live.
                  <a title="homeless" target="_blank" href="https://www.tiktok.com/tag/homeless?refer=embed">#homeless</a>
                  <a title="carpenter" target="_blank" href="https://www.tiktok.com/tag/carpenter?refer=embed">#carpenter</a>
                  <a title="trains" target="_blank" href="https://www.tiktok.com/tag/trains?refer=embed">#trains</a>
                  <a title="homelessness" target="_blank" href="https://www.tiktok.com/tag/homelessness?refer=embed">#homelessness</a>
                  <a title="charities" target="_blank" href="https://www.tiktok.com/tag/charities?refer=embed">#charities</a>
                  <a target="_blank" title="♬ original sound  - Sky News" href="https://www.tiktok.com/music/original-sound-Sky-News-7533563266292517654?refer=embed">♬ original sound  - Sky News</a>
                </section>
              </blockquote>
            </div>

            {/* Video 21 - Broke Apprentice Rants */}
            <div className="flex justify-center">
              <blockquote className="tiktok-embed" cite="https://www.tiktok.com/@brokeapprenticerants/video/7511520136432520491" data-video-id="7511520136432520491" style={{maxWidth: '605px', minWidth: '325px'}}>
                <section>
                  <a target="_blank" title="@brokeapprenticerants" href="https://www.tiktok.com/@brokeapprenticerants?refer=embed">@brokeapprenticerants</a>
                  <a title="fyp" target="_blank" href="https://www.tiktok.com/tag/fyp?refer=embed">#fyp</a>
                  <a title="digitalrevolution" target="_blank" href="https://www.tiktok.com/tag/digitalrevolution?refer=embed">#digitalrevolution</a>
                  <a target="_blank" title="♬ original sound - BrokeApprenticeRants" href="https://www.tiktok.com/music/original-sound-7511520197405068075?refer=embed">♬ original sound - BrokeApprenticeRants</a>
                </section>
              </blockquote>
            </div>

          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              These are just a few voices. There are millions more stories that need to be heard.
            </p>
            <Button variant="outline" size="lg">
              <Play className="h-4 w-4 mr-2" />
              Load More Stories
            </Button>
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
      
      {/* TikTok Embed Script */}
      <Script 
        src="https://www.tiktok.com/embed.js" 
        strategy="lazyOnload"
      />
    </div>
  );
}

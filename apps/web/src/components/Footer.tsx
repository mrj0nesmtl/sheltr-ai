import Link from 'next/link';
import { Github, Users } from 'lucide-react';
import ThemeLogo from './ThemeLogo';

export default function Footer() {
  return (
    <footer className="bg-background border-t py-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Brand Section */}
          <div>
            <ThemeLogo className="h-5 w-auto mb-3" />
            <p className="text-xs text-muted-foreground">
              Hacking homelessness through technology.
            </p>
            
            {/* Mini Spotify Widget - Desktop Only */}
            <div className="hidden lg:block mt-4 p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-xs font-medium">Featured Podcast</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Hacking Homelessness • Tomes of Arcana
              </div>
              <a 
                href="https://open.spotify.com/episode/2TZquGVy7vT6yZMgDraMYe?si=rTIdTJ8MSW687rKZBbFJ6Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
                Listen on Spotify
              </a>
            </div>
          </div>
          
          {/* Platform Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Platform</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground">About</Link></li>
              <li><Link href="/solutions" className="hover:text-foreground">Solutions</Link></li>
              <li><Link href="/scan-give" className="hover:text-foreground">Scan & Give</Link></li>
              <li><Link href="/impact" className="hover:text-foreground">Impact</Link></li>
            </ul>
          </div>
          
          {/* Technology Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Technology</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><Link href="/tokenomics" className="hover:text-foreground">Tokenomics</Link></li>
              <li><Link href="/docs/whitepaper" className="hover:text-foreground">White Paper</Link></li>
              <li>
                <a href="https://github.com/mrj0nesmtl/sheltr-ai" target="_blank" className="hover:text-foreground flex items-center">
                  <Github className="h-3 w-3 mr-1" /> GitHub
                </a>
              </li>
            </ul>
          </div>
          
          {/* Community Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Community</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><Link href="/angels" className="hover:text-foreground">Angels</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li>
                <a href="https://bsky.app/profile/sheltrops.bsky.social" target="_blank" className="hover:text-foreground">
                  BlueSky
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t pt-6 mt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 SHELTR. Built with ❤️ for a better world.</p>
        </div>
      </div>
    </footer>
  );
} 
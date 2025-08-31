import Link from 'next/link';
import { Github, Users } from 'lucide-react';
import ThemeLogo from './ThemeLogo';

export default function Footer() {
  return (
    <footer className="bg-background border-t py-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
          {/* Main Footer Content - Centered Columns */}
          <div className="grid md:grid-cols-5 gap-3 lg:gap-4 flex-1 lg:max-w-4xl lg:mx-auto">
            {/* Brand Section */}
            <div>
              <ThemeLogo className="h-5 w-auto mb-3" />
              <p className="text-xs text-muted-foreground">
                Tech for Good.
              </p>
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

          {/* Spotify Widget - Right Side Desktop */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src="/Spotify_Primary_Logo_RGB_Green.png" 
                  alt="Spotify" 
                  className="h-5 w-5"
                />
                <span className="text-sm font-medium">Featured on Spotify</span>
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                Hacking Homelessness • Tomes of Arcana
              </div>
              <a 
                href="https://open.spotify.com/episode/2TZquGVy7vT6yZMgDraMYe?si=rTIdTJ8MSW687rKZBbFJ6Q" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-md"
              >
                <img 
                  src="/Spotify_Primary_Logo_RGB_Green.png" 
                  alt="Spotify" 
                  className="h-3 w-3"
                />
                Listen on Spotify
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Spotify Widget */}
        <div className="lg:hidden mt-6 pt-6 border-t">
          <div className="max-w-sm mx-auto p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="/Spotify_Primary_Logo_RGB_Green.png" 
                alt="Spotify" 
                className="h-5 w-5"
              />
              <span className="text-sm font-medium">Featured on Spotify</span>
            </div>
            <div className="text-xs text-muted-foreground mb-3 text-center">
              Hacking Homelessness • Tomes of Arcana
            </div>
            <a 
              href="https://open.spotify.com/episode/2TZquGVy7vT6yZMgDraMYe?si=rTIdTJ8MSW687rKZBbFJ6Q" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-4 py-3 rounded-md w-full"
            >
              <img 
                src="/Spotify_Primary_Logo_RGB_Green.png" 
                alt="Spotify" 
                className="h-4 w-4"
              />
              Listen on Spotify
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t pt-6 mt-6 text-center text-xs text-muted-foreground">
          <p>&copy; Arcana Labs 2025</p>
        </div>
      </div>
    </footer>
  );
} 
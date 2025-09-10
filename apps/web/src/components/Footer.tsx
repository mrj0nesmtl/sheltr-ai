import Link from 'next/link';
import { Github, MessageCircle } from 'lucide-react';
import ThemeLogo from './ThemeLogo';

export default function Footer() {
  return (
    <footer className="bg-background border-t py-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
          {/* Left Side - Brand */}
          <div className="lg:w-1/3">
            <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
              <ThemeLogo className="h-6 w-auto mb-4" />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Tech for Good.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a 
                href="https://github.com/mrj0nesmtl/sheltr-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://bsky.app/profile/sheltrops.bsky.social" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                aria-label="BlueSky"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/sheltrops" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Center - Main Navigation */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {/* Platform & Technology Combined */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Platform</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li><Link href="/solutions" className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1">Solutions</Link></li>
                  <li><Link href="/tokenomics" className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1">Token</Link></li>
                  <li><Link href="/scan-give" className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1">Scan</Link></li>
                  <li><Link href="/pods" className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1">Pods</Link></li>
                  <li><Link href="/pods/mobi" className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1">Mobi</Link></li>
                  <li><Link href="/drones" className="hover:text-blue-400 transition-all duration-300 hover:translate-x-1">Drones</Link></li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Resources</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li><Link href="/docs" className="hover:text-green-400 transition-all duration-300 hover:translate-x-1">Documentation</Link></li>
                  <li><Link href="/docs/whitepaper" className="hover:text-green-400 transition-all duration-300 hover:translate-x-1">White Paper</Link></li>
                  <li><Link href="/angels" className="hover:text-green-400 transition-all duration-300 hover:translate-x-1">Angels</Link></li>
                  <li><Link href="/blog" className="hover:text-green-400 transition-all duration-300 hover:translate-x-1">Blog</Link></li>
                </ul>
              </div>
              
              {/* Support */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Support</h3>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li><Link href="/contact" className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1">Contact</Link></li>
                  <li><Link href="/terms" className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1">Terms</Link></li>
                  <li><Link href="/privacy" className="hover:text-purple-400 transition-all duration-300 hover:translate-x-1">Privacy</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Spotify Widget - Full Width */}
        <div className="mt-8 pt-6 border-t">
          <div className="max-w-sm mx-auto p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3 justify-center">
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
          <p>&copy; SHELTR 2025</p>
        </div>
      </div>
    </footer>
  );
} 
import Link from 'next/link';
import { Github, Users } from 'lucide-react';
import ThemeLogo from './ThemeLogo';

export default function Footer() {
  return (
    <footer className="bg-background border-t py-8 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div>
            <ThemeLogo className="h-5 w-auto mb-3" />
            <p className="text-xs text-muted-foreground">
              Hacking homelessness through technology.
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
          
          {/* Community & Support Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Community & Support</h3>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>
                <a href="https://bsky.app/profile/sheltrops.bsky.social" target="_blank" className="hover:text-foreground">
                  BlueSky
                </a>
              </li>
              <li><a href="/wiki" className="hover:text-foreground">Wiki</a></li>
              <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><span className="text-muted-foreground/60">🤖 AI Support (Soon)</span></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t pt-6 mt-6 text-center text-xs text-muted-foreground">
          <p>&copy; 2025 SHELTR-AI. Built with ❤️ in memory of Gunnar Blaze.</p>
        </div>
      </div>
    </footer>
  );
} 
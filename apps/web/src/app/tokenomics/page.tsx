import Link from 'next/link';
import { ArrowLeft, Coins, TrendingUp, Shield, Zap, DollarSign, Users, BarChart3, CheckCircle, ExternalLink, Copy, Eye, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';

export default function TokenomicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/solutions" className="text-muted-foreground hover:text-primary transition-colors">Solutions</Link>
              <Link href="/scan-give" className="text-muted-foreground hover:text-primary transition-colors">Scan & Give</Link>
              <Link href="/impact" className="text-muted-foreground hover:text-primary transition-colors">Impact</Link>
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
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <span className="text-foreground">Tokenomics</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-orange-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coins className="h-10 w-10 text-white" />
          </div>
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">$SHLTR Tokenomics</Badge>
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SHELTR SmartFund™ & Dual-Token Economy
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Revolutionary dual-token architecture combining stability for participants with growth potential for the community. 
            Built on Base network with Visa MCP integration for seamless real-world utility.
          </p>
        </div>
      </section>

      {/* Token Overview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Dual-Token Architecture</h2>
            <p className="text-xl text-muted-foreground">Two tokens, one mission: stability for participants, growth for community</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* SHELTR-S (Stable) */}
            <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-500/5 to-green-500/10">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-green-600 dark:text-green-400">SHELTR-S</CardTitle>
                    <CardDescription className="text-green-600/70">Stable Utility Token</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">$1.00 USD</div>
                  <p className="text-sm text-green-600/70">Always stable, always reliable</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>USD-pegged stablecoin backed by USDC reserves</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Primary token for participants and daily transactions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Zero volatility risk for essential needs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>Accepted at Homeless Depot marketplace</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>No transaction fees for participants</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">Use Cases:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Daily necessities and essential purchases</li>
                    <li>• Food, clothing, and transportation</li>
                    <li>• Healthcare and emergency expenses</li>
                    <li>• Homeless Depot marketplace transactions</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* SHELTR (Community) */}
            <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-purple-500/10">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-purple-600 dark:text-purple-400">SHELTR</CardTitle>
                    <CardDescription className="text-purple-600/70">Community & Governance Token</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Market Price</div>
                  <p className="text-sm text-purple-600/70">Growth potential with community engagement</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Governance rights and platform decisions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Staking rewards and revenue sharing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Deflationary tokenomics with buyback program</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Premium discounts in Homeless Depot</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>Optional participation for participants</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h4 className="font-semibold mb-2 text-purple-600 dark:text-purple-400">Use Cases:</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Governance voting and platform decisions</li>
                    <li>• Staking for additional rewards</li>
                    <li>• Premium marketplace features</li>
                    <li>• Community incentives and recognition</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SmartFund Distribution */}
      <section className="py-20 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">SmartFund™ Distribution Model</h2>
            <p className="text-xl text-muted-foreground">Transparent, automated allocation ensuring maximum impact</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-blue-500/20 bg-blue-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-600 dark:text-blue-400">80%</CardTitle>
                <CardDescription className="text-blue-600/70">Direct Participant Support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Immediate conversion to SHELTR-S tokens for participants&apos; essential needs
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Food and nutrition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Clothing and hygiene</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Transportation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Emergency expenses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20 bg-green-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400">15%</CardTitle>
                <CardDescription className="text-green-600/70">Housing Fund Initiative</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Long-term housing solutions through smart contract governed investment
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Emergency housing</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Transitional programs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Permanent solutions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span>Support services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-500/20 bg-purple-500/5">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600 dark:text-purple-400">5%</CardTitle>
                <CardDescription className="text-purple-600/70">Platform Operations</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground mb-4">
                  Sustainable platform development and community growth
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Technical development</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Security audits</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Community support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <span>Platform scaling</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blockchain Integration */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Base Network Integration</h2>
            <p className="text-xl text-muted-foreground">Built on Coinbase&apos;s L2 for optimal performance and compliance</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Technical Specifications</CardTitle>
                <CardDescription>Robust blockchain architecture for real-world utility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Network</div>
                    <div className="text-sm text-muted-foreground">Base (Coinbase L2)</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Transaction Speed</div>
                    <div className="text-sm text-muted-foreground">~2 seconds</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Gas Fees</div>
                    <div className="text-sm text-muted-foreground">~$0.01 USD</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="font-semibold">Standard</div>
                    <div className="text-sm text-muted-foreground">ERC-20</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Coinbase integration for fiat on/off ramps</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Visa MCP agent integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>OpenZeppelin security standards</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Multi-signature treasury management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl">Sample Transactions</CardTitle>
                <CardDescription>Live examples from our test network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Donation Processing</span>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      <div>Hash: 0xa1b2c3d4e5f6789...</div>
                      <div>Amount: $100.00 → 80 SHELTR-S</div>
                      <div>Gas: $0.008</div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Housing Fund Allocation</span>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      <div>Hash: 0x9f8e7d6c5b4a321...</div>
                      <div>Amount: $15.00 → Housing Fund</div>
                      <div>Gas: $0.006</div>
                    </div>
                  </div>

                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Marketplace Purchase</span>
                      <Badge variant="secondary">Success</Badge>
                    </div>
                    <div className="text-muted-foreground">
                      <div>Hash: 0x5g6h7i8j9k0l123...</div>
                      <div>Amount: 25 SHELTR-S → Food Kit</div>
                      <div>Gas: $0.004</div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Base Explorer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Sustainable Revenue Model</h2>
          <p className="text-xl text-muted-foreground mb-12">
            Multiple revenue streams ensure platform growth while protecting participants
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Participant Protection</CardTitle>
                <CardDescription>Zero fees for essential services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>No fees on SHELTR-S transactions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Free donation-to-token conversion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Emergency fund access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Optional SHELTR participation</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Streams</CardTitle>
                <CardDescription>Diversified sustainability model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span>Marketplace transaction fees (2-3%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span>SHELTR token appreciation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span>Premium organization features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <span>Corporate partnership fees</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the SHELTR Economy</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of the revolution that&apos;s making charitable giving transparent, efficient, and impactful.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Coins className="h-4 w-4 mr-2" />
                Get SHELTR Tokens
              </Button>
            </Link>
            <Link href="/impact">
              <Button variant="outline" size="lg">
                <Eye className="h-4 w-4 mr-2" />
                View Live Transactions
              </Button>
            </Link>
            <Link href="/scan-give">
              <Button variant="outline" size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Start Donating
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center mb-4">
                <img src="/logo.svg" alt="SHELTR-AI" className="h-6 w-auto hover:opacity-80 transition-opacity" />
              </Link>
              <p className="text-muted-foreground text-sm">
                Hacking homelessness through technology.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/solutions" className="hover:text-foreground">Solutions</Link></li>
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/scan-give" className="hover:text-foreground">Scan & Give</Link></li>
                <li><Link href="/tokenomics" className="hover:text-foreground">Tokenomics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://github.com/mrj0nesmtl/sheltr-ai" target="_blank" className="hover:text-foreground">GitHub</a></li>
                <li><Link href="/tokenomics" className="hover:text-foreground">$SHLTR</Link></li>
                <li><a href="https://bsky.app/profile/sheltrops.bsky.social" target="_blank" className="hover:text-foreground">BlueSky</a></li>
                <li><a href="#" className="hover:text-foreground">Wiki</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">Documentation</Link></li>
                <li><a href="#" className="hover:text-foreground">Wiki</a></li>
                <li><Link href="/register" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/register" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 SHELTR-AI. Built with ❤️ in memory of Gunnar Blaze.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
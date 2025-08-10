'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Share, Code, Shield, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function BlockchainPage() {
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
              <Link href="/docs">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="h-12 w-12 text-green-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">SHELTR Blockchain Architecture</h1>
                  <Badge className="bg-green-500 text-white">Peer Review</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  Dual-Token Smart Contract Implementation on Base Network
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Version 1.0.0</span>
                  <span>•</span>
                  <span>January 25, 2025</span>
                  <span>•</span>
                  <span>45 pages</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Production Ready</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/blockchain.md" target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Code className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Document
              </Button>
              <a href="https://github.com/mrj0nesmtl/sheltr-ai">
                <Button variant="outline">
                  <Code className="h-4 w-4 mr-2" />
                  View Repository
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Document Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                🔧 Technical Documentation
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                This document provides deep technical analysis of SHELTR's blockchain implementation, 
                smart contract architecture, and security protocols. Designed for developers, 
                blockchain engineers, and security auditors.
              </p>
            </div>

            {/* Executive Summary */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p>
                  SHELTR implements the world's first <strong>dual-token charitable ecosystem</strong> on Base network, 
                  combining participant protection through SHELTR-S (stable token) with community governance 
                  via SHELTR (growth token). Our revolutionary architecture ensures 80% of donations reach 
                  participants as stable value while building sustainable long-term solutions through 
                  smart contract-governed fund allocation.
                </p>
                <div className="mt-6">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/blockchain.md" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Code className="h-4 w-4 mr-2" />
                      Read Full Paper on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Token Architecture */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-blue-500" />
                    SHELTR-S (Stable Token)
                  </CardTitle>
                  <CardDescription>
                    USD-pegged utility token for participant protection
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Backing Mechanism:</span>
                      <span className="text-sm font-mono">1:1 USDC Reserve</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Volatility:</span>
                      <span className="text-sm font-mono text-green-600">0% Target</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Welcome Bonus:</span>
                      <span className="text-sm font-mono">100 tokens/signup</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Participant Fees:</span>
                      <span className="text-sm font-mono text-green-600">$0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-500" />
                    SHELTR (Governance Token)
                  </CardTitle>
                  <CardDescription>
                    Community governance and investor returns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Supply:</span>
                      <span className="text-sm font-mono">100,000,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pre-seed Price:</span>
                      <span className="text-sm font-mono">$0.05</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Deflationary Rate:</span>
                      <span className="text-sm font-mono">2% annually</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Staking Yield:</span>
                      <span className="text-sm font-mono text-green-600">8% APY target</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Smart Contract Example */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Smart Contract Architecture</h2>
              <div className="bg-slate-900 text-white rounded-lg p-6 overflow-x-auto">
                <h3 className="text-lg font-semibold mb-4 text-green-400">Core Distribution Contract</h3>
                <pre className="text-sm">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SHELTRCore is AccessControl, ReentrancyGuard, Pausable {
    // Distribution constants (immutable for security)
    uint256 public constant DIRECT_SUPPORT = 80;
    uint256 public constant HOUSING_FUND = 15;
    uint256 public constant OPERATIONS = 5;
    uint256 public constant WELCOME_BONUS = 100 * 1e18; // 100 SHELTR-S
    
    function processDonation(
        address donor,
        address participant,
        uint256 amount
    ) external onlyRole(DISTRIBUTOR_ROLE) nonReentrant whenNotPaused {
        uint256 directSupport = (amount * DIRECT_SUPPORT) / 100;
        uint256 housingContribution = (amount * HOUSING_FUND) / 100;
        uint256 operationsFee = (amount * OPERATIONS) / 100;
        
        // Mint SHELTR-S tokens for participant (1:1 with USDC)
        ISheltrStable(address(sheltrStable)).mint(participant, directSupport);
        
        emit DonationProcessed(donor, participant, amount, directSupport, housingContribution);
    }
}`}
                </pre>
              </div>
            </div>

            {/* Base Network Integration */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Base Network Integration</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Why Base Network?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                      <span>Transaction Fees</span>
                      <Badge className="bg-green-500">~$0.01</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                      <span>Block Finality</span>
                      <Badge className="bg-blue-500">2 seconds</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                      <span>Coinbase Integration</span>
                      <Badge className="bg-purple-500">Native</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
                      <span>Security</span>
                      <Badge className="bg-orange-500">Ethereum-backed</Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Network Configuration</h3>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded p-4">
                    <pre className="text-sm">
{`const BASE_CONFIG = {
  network: 'base-mainnet',
  chainId: 8453,
  rpcUrl: 'https://mainnet.base.org',
  blockTime: 2, // seconds
  contracts: {
    sheltrCore: '0x...',
    sheltrStable: '0x...',
    sheltrGrowth: '0x...',
    usdcReserve: '0xa0b86a33e6...'
  }
};`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Framework */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Security Architecture</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Smart Contract Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• OpenZeppelin frameworks</li>
                      <li>• Multi-signature governance (3-of-5)</li>
                      <li>• Emergency pause capabilities</li>
                      <li>• Formal verification</li>
                      <li>• Insurance coverage ($1M)</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Operational Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Role-based permissions</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Hardware security modules</li>
                      <li>• Encrypted backups</li>
                      <li>• Penetration testing</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Monitoring & Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Real-time transaction monitoring</li>
                      <li>• Automated vulnerability scanning</li>
                      <li>• Bug bounty program ($50K max)</li>
                      <li>• Incident response procedures</li>
                      <li>• Forensic logging</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Full Document Access */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Access Complete Technical Documentation</h2>
              <p className="mb-6">
                View the full 45-page blockchain architecture document with detailed smart contract code, 
                security protocols, and implementation specifications.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/02-architecture/technical/blockchain.md">
                  <Button className="bg-white text-green-600 hover:bg-green-50">
                    <Code className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </a>
                <a href="https://github.com/mrj0nesmtl/sheltr-ai/raw/main/docs/02-architecture/technical/blockchain.md">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                    <Download className="h-4 w-4 mr-2" />
                    Download Markdown
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 
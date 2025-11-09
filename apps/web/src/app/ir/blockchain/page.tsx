'use client';

import Link from 'next/link';
import { ArrowLeft, Download, Code, Shield, Coins, CreditCard, TrendingUp, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function IRBlockchainPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/ir/dataroom" className="flex items-center">
              <ThemeLogo />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/ir/dataroom">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Data Room
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Strategic Pivot Alert */}
      <section className="py-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 text-amber-900 dark:text-amber-100">
                  Blockchain Architecture v2.0
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                  Our blockchain implementation has evolved from dual-token complexity to a <strong>single-token stable fund ecosystem</strong> 
                  with enterprise-grade infrastructure and zero participant cryptocurrency exposure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Document Header */}
      <section className="py-12 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <Shield className="h-12 w-12 text-emerald-600 mt-1" />
              <div className="flex-1">
                <div className="mb-3">
                  <h1 className="text-3xl sm:text-4xl font-bold mb-2 leading-tight">SHELTR Blockchain Architecture v2.0</h1>
                  <Badge className="bg-emerald-500 text-white text-sm">TESTNET ARCHITECTURE</Badge>
                </div>
                <p className="text-lg text-muted-foreground mb-3">
                  Single-token stable fund ecosystem with enterprise payment infrastructure and guaranteed institutional returns
                </p>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
                  <span>Version 2.0.0</span>
                  <span>•</span>
                  <span>September 26, 2025</span>
                  <span>•</span>
                  <Badge className="bg-blue-500 text-white text-xs">ENTERPRISE-GRADE</Badge>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/tokenomics/blockchain.md" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Download className="h-4 w-4 mr-2" />
                      View Full Technical Spec
                    </Button>
                  </a>
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/tokenomics/blockchain.md" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline">
                      <Code className="h-4 w-4 mr-2" />
                      View on GitHub
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Document Notice */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
                🔧 Enterprise Blockchain Architecture
              </h3>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                This document provides comprehensive technical analysis of SHELTR&rsquo;s single-token stable fund blockchain implementation, 
                smart contract architecture, and enterprise security protocols. Designed for developers, 
                blockchain engineers, and enterprise partners.
              </p>
            </div>

            {/* Executive Summary */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Executive Summary</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p>
                  SHELTR implements a revolutionary <strong>single-token stable fund ecosystem</strong> that combines 
                  traditional payment stability with blockchain transparency. Our architecture ensures <strong>zero participant risk</strong> 
                  through virtual debit cards for 80% allocation, <strong>guaranteed 4-6% APY growth</strong> for 15% housing fund 
                  via Coinbase institutional staking, and complete <strong>blockchain transparency</strong> through SHELTR Stablecoin tracking.
                </p>
                <p>
                  Built on <strong>Base network</strong> for ultra-low fees (~$0.01) and enterprise-grade security, our smart contracts 
                  implement <strong>OpenZeppelin standards</strong> with multi-signature governance and emergency pause capabilities. 
                  The SHELTR Stablecoin serves exclusively as a <strong>housing fund tracking token</strong> with 1:1 USDT backing, 
                  eliminating participant cryptocurrency exposure while maintaining complete donation transparency.
                </p>
                <div className="mt-6">
                  <a href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/docs/architecture/technical/tokenomics/blockchain.md" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Code className="h-4 w-4 mr-2" />
                      Read Full Technical Specification
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* SHELTR Solution */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">SHELTR Solution: Zero Risk Protection + Guaranteed Growth</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 border-emerald-500/20 bg-emerald-50 dark:bg-emerald-900/20">
                  <CardHeader>
                    <CardTitle className="text-emerald-700 dark:text-emerald-300">🛡️ Zero Risk Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>80% allocation via traditional payment cards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>No participant cryptocurrency exposure</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Global Visa/Mastercard acceptance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>Zero transaction fees for participants</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-500/20 bg-orange-50 dark:bg-orange-900/20">
                  <CardHeader>
                    <CardTitle className="text-orange-700 dark:text-orange-300">📈 Guaranteed Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        <span>4-6% APY guaranteed returns</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        <span>Coinbase institutional staking</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        <span>Daily liquidity access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-500" />
                        <span>SHELTR token transparency tracking</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Single-Token Architecture */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Single-Token Stable Architecture</h2>
              <div className="bg-muted/20 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 text-center">SHELTR Stablecoin (Housing Fund Tracking Only)</h3>
                <div className="grid md:grid-cols-4 gap-4 text-center">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-emerald-600">Purpose</div>
                    <div className="text-sm text-muted-foreground">Housing fund tracking, transparency, yield</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">Network</div>
                    <div className="text-sm text-muted-foreground">Base (Coinbase L2)</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">Standard</div>
                    <div className="text-sm text-muted-foreground">ERC-20</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">Backing</div>
                    <div className="text-sm text-muted-foreground">USDT 1:1 Peg via Coinbase</div>
                  </div>
                </div>
                <div className="mt-6 grid md:grid-cols-3 gap-4 text-center">
                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-gray-600">Volatility</div>
                    <div className="text-sm text-muted-foreground">0% (Stable)</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600">Yield</div>
                    <div className="text-sm text-muted-foreground">4-6% APY</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-red-600">Purpose</div>
                    <div className="text-sm text-muted-foreground">Housing fund only</div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      Participant Payment Flow (80% Allocation)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Payment Method:</strong> Virtual Debit Card</li>
                      <li><strong>Settlement Speed:</strong> &lt;30s</li>
                      <li><strong>Risk Level:</strong> Zero</li>
                      <li><strong>Usage:</strong> Essential needs</li>
                      <li><strong>Fees:</strong> $0 for participants</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      Housing Fund Growth (15% Allocation)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Staking Provider:</strong> Coinbase Institutional</li>
                      <li><strong>Asset:</strong> USDT</li>
                      <li><strong>APY:</strong> 4-6% Guaranteed</li>
                      <li><strong>Liquidity:</strong> Daily access</li>
                      <li><strong>Tracking:</strong> SHELTR tokens (1:1)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Smart Contract Architecture */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Smart Contract Architecture</h2>
              
              {/* Enterprise Contract Links */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  🔗 Enterprise Smart Contract Repository
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Core Contracts</h4>
                    <ul className="space-y-1 text-blue-600 dark:text-blue-400">
                      <li>
                        <a 
                          href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/SHELTRPaymentDistributor.sol" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          • SHELTRPaymentDistributor.sol
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/SHELTRStablecoin.sol" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          • SHELTRStablecoin.sol
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-purple-700 dark:text-purple-300">Integration Contracts</h4>
                    <ul className="space-y-1 text-purple-600 dark:text-purple-400">
                      <li>
                        <a 
                          href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/AdyenPayoutIntegration.sol" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          • AdyenPayoutIntegration.sol
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/CoinbaseStakingIntegration.sol" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          • CoinbaseStakingIntegration.sol
                        </a>
                      </li>
                      <li>
                        <a 
                          href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/BaseNetworkOptimization.sol" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          • BaseNetworkOptimization.sol
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                  <h4 className="font-semibold mb-2 text-emerald-700 dark:text-emerald-300">Deployment Scripts</h4>
                  <div className="grid md:grid-cols-3 gap-2 text-xs">
                    <a 
                      href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/script/DeployEnterpriseArchitecture.s.sol" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      • DeployEnterpriseArchitecture.s.sol
                    </a>
                    <a 
                      href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/script/SetupPartnershipIntegrations.s.sol" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      • SetupPartnershipIntegrations.s.sol
                    </a>
                    <a 
                      href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/script/ConfigureEnterpriseSettings.s.sol" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      • ConfigureEnterpriseSettings.s.sol
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Core Distribution Contract */}
              <Card className="mb-6 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-600" />
                    SHELTRPaymentDistributor (Core Contract)
                  </CardTitle>
                  <CardDescription>
                    Enterprise-grade payment distribution with multi-signature governance
                    <br />
                    <a 
                      href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/SHELTRPaymentDistributor.sol" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      📄 View Full Contract Source
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 text-xs overflow-x-auto">
{`contract SHELTRPaymentDistributor is AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant PROCESSOR_ROLE = keccak256("PROCESSOR_ROLE");
    
    // Integration contracts
    ISHELTRStablecoin public immutable sheltrToken;
    IAdyenPayout public immutable adyenPayout;
    IERC20 public immutable USDT;
    
    // Distribution constants
    uint256 public constant PARTICIPANT_PERCENTAGE = 8000; // 80%
    uint256 public constant HOUSING_FUND_PERCENTAGE = 1500; // 15%
    uint256 public constant SHELTER_OPS_PERCENTAGE = 500;   // 5%
    
    function processDonation(
        address participant,
        address shelter,
        uint256 totalAmount,
        bytes32 adyenTransactionId
    ) external onlyRole(PROCESSOR_ROLE) nonReentrant whenNotPaused {
        DonationSplit memory split = _calculateSplit(totalAmount);
        
        // 1. Load 80% to participant's virtual card
        adyenPayout.loadParticipantCard(participant, split.participantAmount, adyenTransactionId);
        
        // 2. Deposit 15% to housing fund and mint SHELTR tokens
        sheltrToken.depositHousingFund(participant, split.housingFundAmount);
        
        // 3. Handle 5% shelter operations or redirect to housing fund
        if (shelter != participant) {
            USDT.transfer(shelter, split.shelterOpsAmount);
        } else {
            sheltrToken.depositHousingFund(participant, split.shelterOpsAmount);
        }
    }
}`}
                    </pre>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Roles</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• PROCESSOR_ROLE</li>
                        <li>• DEFAULT_ADMIN_ROLE</li>
                        <li>• Multi-signature governance</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Integration Contracts</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• ISHELTRStablecoin sheltrToken</li>
                        <li>• IAdyenPayout adyenPayout</li>
                        <li>• IERC20 usdt</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Security Features</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• ReentrancyGuard</li>
                        <li>• Pausable emergency stop</li>
                        <li>• Access control roles</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SHELTR Stablecoin Implementation */}
              <Card className="mb-6 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5 text-emerald-600" />
                    SHELTRStablecoin (Housing Fund Token)
                  </CardTitle>
                  <CardDescription>
                    USDT-backed stablecoin for transparent housing fund tracking
                    <br />
                    <a 
                      href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/SHELTRStablecoin.sol" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      📄 View Full Contract Source
                    </a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-4 mb-4">
                    <pre className="text-green-400 text-xs overflow-x-auto">
{`contract SHELTRStablecoin is ERC20, AccessControl, ReentrancyGuard {
    IERC20 public immutable USDT;
    ICoinbaseStaking public immutable coinbaseStaking;
    
    // Housing fund participant tracking
    mapping(address => uint256) public participantHousingFunds;
    uint256 public totalHousingFund;
    uint256 public currentAPY = 500; // 5.00% in basis points
    
    event HousingFundDeposit(address indexed participant, uint256 amount, uint256 timestamp);
    
    function depositHousingFund(address participant, uint256 amount) 
        external onlyRole(MINTER_ROLE) nonReentrant {
        // Transfer USDT from payment processor
        USDT.transferFrom(msg.sender, address(this), amount);
        
        // Mint SHELTR tokens 1:1 with USDT
        _mint(address(this), amount);
        
        // Track participant allocation
        participantHousingFunds[participant] += amount;
        totalHousingFund += amount;
        
        // Stake in Coinbase for guaranteed yield
        USDT.approve(address(coinbaseStaking), amount);
        coinbaseStaking.stake(amount);
        
        emit HousingFundDeposit(participant, amount, block.timestamp);
    }
    
    function getParticipantHousingBalance(address participant) 
        external view returns (uint256) {
        // Calculate proportional share including Coinbase staking rewards
        uint256 totalStaked = coinbaseStaking.getTotalStaked();
        if (totalStaked == 0) return participantHousingFunds[participant];
        
        uint256 totalValue = totalStaked + coinbaseStaking.getAccruedRewards();
        return (participantHousingFunds[participant] * totalValue) / totalHousingFund;
    }
}`}
                    </pre>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Roles</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• MINTER_ROLE</li>
                        <li>• STAKER_ROLE</li>
                        <li>• DEFAULT_ADMIN_ROLE</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• 1:1 USDT backing</li>
                        <li>• Automatic Coinbase staking</li>
                        <li>• Proportional reward distribution</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Tracking</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• participantHousingFunds</li>
                        <li>• totalHousingFund</li>
                        <li>• currentAPY</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Base Network Integration */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Base Network Integration</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Network Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li><strong>Network:</strong> Base (Coinbase L2)</li>
                      <li><strong>Transaction Fees:</strong> ~$0.01</li>
                      <li><strong>Block Time:</strong> 2 seconds</li>
                      <li><strong>Finality:</strong> Instant</li>
                      <li><strong>Security:</strong> Ethereum-grade</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Enterprise Contract Suite</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <strong className="text-purple-600">Core Contracts:</strong>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/SHELTRPaymentDistributor.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              SHELTRPaymentDistributor
                            </a>
                            : TBD
                          </li>
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/SHELTRStablecoin.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              SHELTRStablecoin
                            </a>
                            : TBD
                          </li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-emerald-600">Integration Contracts:</strong>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/AdyenPayoutIntegration.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              AdyenPayoutIntegration
                            </a>
                            : TBD
                          </li>
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/CoinbaseStakingIntegration.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              CoinbaseStakingIntegration
                            </a>
                            : TBD
                          </li>
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/src/BaseNetworkOptimization.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              BaseNetworkOptimization
                            </a>
                            : TBD
                          </li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-orange-600">Deployment Scripts:</strong>
                        <ul className="ml-4 mt-1 space-y-1">
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/script/DeployEnterpriseArchitecture.s.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              DeployEnterpriseArchitecture.s.sol
                            </a>
                          </li>
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/script/SetupPartnershipIntegrations.s.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              SetupPartnershipIntegrations.s.sol
                            </a>
                          </li>
                          <li>
                            <a 
                              href="https://github.com/mrj0nesmtl/sheltr-ai/blob/main/sheltr-tokens/script/ConfigureEnterpriseSettings.s.sol" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-xs"
                            >
                              ConfigureEnterpriseSettings.s.sol
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Architecture */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Security Architecture</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="border-2 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Smart Contract Security</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li>• OpenZeppelin battle-tested contracts</li>
                      <li>• Multi-signature governance (3-of-5)</li>
                      <li>• ReentrancyGuard protection</li>
                      <li>• Emergency pause capabilities</li>
                      <li>• Formal verification processes</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-500/20">
                  <CardHeader>
                    <CardTitle className="text-emerald-600">Enterprise Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li>• PCI DSS Level 1 compliance</li>
                      <li>• SOC 2 Type II certified custody</li>
                      <li>• FDIC protection available</li>
                      <li>• Real-time fraud monitoring</li>
                      <li>• Institutional-grade infrastructure</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="text-orange-600">Operational Security</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-2">
                      <li>• 24/7 monitoring and alerting</li>
                      <li>• Automated threat detection</li>
                      <li>• Incident response procedures</li>
                      <li>• Regular security audits</li>
                      <li>• Insurance coverage available</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Implementation Roadmap */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Implementation Roadmap</h2>
              <div className="space-y-4">
                <Card className="border-l-4 border-l-emerald-500">
                  <CardHeader>
                    <CardTitle className="text-emerald-600">Phase 1: Smart Contract Development (Q4 2025)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• SHELTR Stablecoin deployment and testing</li>
                      <li>• Payment distributor contract implementation</li>
                      <li>• Multi-signature governance setup</li>
                      <li>• Security audit by leading firms</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Phase 2: Enterprise Integration (Q1 2026)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Payment processing integration</li>
                      <li>• Coinbase institutional staking connection</li>
                      <li>• Production deployment on Base network</li>
                      <li>• Real-time monitoring implementation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-orange-600">Phase 3: Scale Operations (Q2-Q4 2026)</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <ul className="space-y-1">
                      <li>• Multi-shelter network deployment</li>
                      <li>• Advanced analytics and reporting</li>
                      <li>• Government partnership integration</li>
                      <li>• International expansion support</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Technical Specifications</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <div className="text-lg font-bold text-blue-600">~$0.01</div>
                      <div className="text-sm text-muted-foreground">Average transaction cost</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                      <div className="text-lg font-bold text-green-600">&lt;5s</div>
                      <div className="text-sm text-muted-foreground">Transaction finality</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
                      <div className="text-lg font-bold text-purple-600">99.99%</div>
                      <div className="text-sm text-muted-foreground">Network uptime</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Integration Standards</h3>
                  <div className="space-y-3">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded">
                      <div className="text-lg font-bold text-emerald-600">ERC-20</div>
                      <div className="text-sm text-muted-foreground">Token standard</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
                      <div className="text-lg font-bold text-orange-600">OpenZeppelin</div>
                      <div className="text-sm text-muted-foreground">Security framework</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                      <div className="text-lg font-bold text-red-600">Multi-Sig</div>
                      <div className="text-sm text-muted-foreground">Governance model</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Document Information</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Version Details</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li><strong>Version:</strong> 2.0.0</li>
                    <li><strong>Last Updated:</strong> September 26, 2025</li>
                    <li><strong>Status:</strong> Strategic Implementation</li>
                    <li><strong>Classification:</strong> Enterprise-Grade Architecture Documentation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 text-foreground">Key Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">Single-Token Architecture</Badge>
                    <Badge variant="outline" className="text-xs">Smart Contracts</Badge>
                    <Badge variant="outline" className="text-xs">Base Network</Badge>
                    <Badge variant="outline" className="text-xs">Enterprise Security</Badge>
                    <Badge variant="outline" className="text-xs">Coinbase Integration</Badge>
                    <Badge variant="outline" className="text-xs">Zero Risk Design</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
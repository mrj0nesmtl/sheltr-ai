'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, AlertTriangle, FileText, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function TermsPage() {
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
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Scale className="h-12 w-12 text-blue-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">Terms of Service</h1>
                  <Badge className="bg-blue-500 text-white">Legal</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  SHELTR-AI Platform Terms and Conditions
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Effective: July 31, 2025</span>
                  <span>•</span>
                  <span>Last Updated: July 31, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Important Warnings */}
            <div className="mb-8 space-y-4">
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                    <AlertTriangle className="h-5 w-5" />
                    Cryptocurrency & Token Investment Warning
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-red-700 dark:text-red-300 text-sm">
                  <p className="mb-2">
                    <strong>HIGH-RISK INVESTMENT:</strong> SHELTR and SHELTR-S tokens are digital assets that carry significant financial risk. 
                    Token values can fluctuate dramatically and you may lose your entire investment.
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Tokens are not securities and provide no ownership rights in SHELTR-AI Technologies Inc.</li>
                    <li>No guarantee of return on investment or token value appreciation</li>
                    <li>Regulatory changes may affect token utility or legal status</li>
                    <li>Platform development may not proceed as planned</li>
                    <li>Smart contracts may contain bugs or vulnerabilities</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <Shield className="h-5 w-5" />
                    AI & Automated Systems Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-amber-700 dark:text-amber-300 text-sm">
                  <p>
                    SHELTR employs artificial intelligence and automated systems for various platform functions. 
                    These systems may make errors or produce unexpected results. Users acknowledge that AI recommendations 
                    are not financial, legal, or professional advice and should conduct their own due diligence.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Terms Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the SHELTR platform ("Platform"), including the website, mobile applications, 
                smart contracts, and related services provided by SHELTR Technologies Inc. ("Company", "we", "us", or "our"), 
                you ("User", "you", or "your") agree to be bound by these Terms of Service ("Terms").
              </p>
              <p>
                If you do not agree to these Terms, you must not access or use the Platform. 
                These Terms constitute a legally binding agreement between you and the Company.
              </p>

              <h2>2. Platform Description</h2>
              <p>
                SHELTR is a blockchain-based charitable giving platform that facilitates:
              </p>
              <ul>
                <li>QR code-based donations using SHELTR-S stable tokens</li>
                <li>AI-powered matching between donors and participants</li>
                <li>Smart contract-governed fund distribution</li>
                <li>Governance via SHELTR tokens</li>
                <li>Emergency housing funding mechanisms</li>
                <li>E-commerce marketplace for homeless services ("Homeless Depot")</li>
              </ul>

              <h2>3. User Eligibility</h2>
              <p>
                To use the Platform, you must:
              </p>
              <ul>
                <li>Be at least 18 years of age</li>
                <li>Have legal capacity to enter into contracts</li>
                <li>Not be prohibited by law from using cryptocurrency services</li>
                <li>Comply with all applicable laws in your jurisdiction</li>
                <li>Not be located in a jurisdiction where the Platform is prohibited</li>
              </ul>

              <h2>4. User Accounts and Verification</h2>
              <h3>4.1 Account Creation</h3>
              <p>
                Users may create accounts as Donors, Participants, Shelter Administrators, or Super Administrators. 
                Each account type has specific verification requirements and platform privileges.
              </p>
              
              <h3>4.2 Identity Verification</h3>
              <p>
                Certain platform features require identity verification, including:
              </p>
              <ul>
                <li>Know Your Customer (KYC) procedures for high-value transactions</li>
                <li>Participant verification for benefit access</li>
                <li>Organization verification for shelter administrators</li>
                <li>Investor accreditation for token purchases</li>
              </ul>

              <h3>4.3 Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials, 
                private keys, and wallet information. The Company is not liable for unauthorized access 
                resulting from your failure to secure your account.
              </p>

              <h2>5. Token Economics and Risks</h2>
              <h3>5.1 SHELTR-S Stable Token</h3>
              <p>
                SHELTR-S is designed as a stable utility token pegged to USD value. However:
              </p>
              <ul>
                <li>Stability mechanisms may fail during extreme market conditions</li>
                <li>Underlying USDC reserves may face liquidity or regulatory issues</li>
                <li>Smart contract bugs could affect token functionality</li>
                <li>No guarantee of perfect USD parity at all times</li>
              </ul>

              <h3>5.2 SHELTR Governance Token</h3>
              <p>
                SHELTR tokens provide governance rights but are highly speculative investments:
              </p>
              <ul>
                <li>Token value may fluctuate dramatically</li>
                <li>Governance decisions may negatively impact token value</li>
                <li>Platform failure could render tokens worthless</li>
                <li>Regulatory action may restrict token utility</li>
              </ul>

              <h3>5.3 Investment Risks</h3>
              <p>
                <strong>WARNING:</strong> Purchasing SHELTR tokens involves substantial risk and may not be suitable for all investors. 
                Consider the following risks:
              </p>
              <ul>
                <li><strong>Total Loss Risk:</strong> You may lose your entire investment</li>
                <li><strong>Volatility:</strong> Token prices can change rapidly and unpredictably</li>
                <li><strong>Liquidity Risk:</strong> You may not be able to sell tokens when desired</li>
                <li><strong>Technology Risk:</strong> Smart contracts and blockchain technology may fail</li>
                <li><strong>Regulatory Risk:</strong> Government regulation may prohibit or restrict tokens</li>
                <li><strong>Market Risk:</strong> Cryptocurrency markets are highly speculative</li>
              </ul>

              <h2>6. Artificial Intelligence and Automated Systems</h2>
              <h3>6.1 AI Scope and Limitations</h3>
              <p>
                The Platform uses AI for:
              </p>
              <ul>
                <li>Donor-participant matching algorithms</li>
                <li>Fraud detection and prevention</li>
                <li>Personalized service recommendations</li>
                <li>Automated customer support</li>
                <li>Impact measurement and analytics</li>
                <li>Smart contract optimization</li>
              </ul>

              <h3>6.2 AI Disclaimers</h3>
              <p>
                Users acknowledge that:
              </p>
              <ul>
                <li>AI systems may produce errors, biases, or unexpected results</li>
                <li>AI recommendations are not professional advice</li>
                <li>Users should verify AI-generated information independently</li>
                <li>The Company is not liable for AI system failures or inaccuracies</li>
                <li>AI training data may contain historical biases</li>
              </ul>

              <h2>7. Platform Services and Limitations</h2>
              <h3>7.1 Service Availability</h3>
              <p>
                The Platform is provided "as is" without guarantees of:
              </p>
              <ul>
                <li>Continuous availability or uptime</li>
                <li>Error-free operation</li>
                <li>Compatibility with all devices or browsers</li>
                <li>Data backup or recovery</li>
                <li>Third-party service integration</li>
              </ul>

              <h3>7.2 Transaction Processing</h3>
              <p>
                Blockchain transactions are irreversible. The Company cannot:
              </p>
              <ul>
                <li>Reverse completed transactions</li>
                <li>Recover lost private keys or passwords</li>
                <li>Guarantee transaction speed or confirmation times</li>
                <li>Control network fees or gas costs</li>
              </ul>

              <h2>8. Prohibited Activities</h2>
              <p>
                Users may not:
              </p>
              <ul>
                <li>Use the Platform for illegal activities</li>
                <li>Circumvent security measures or access controls</li>
                <li>Create false or misleading participant profiles</li>
                <li>Manipulate token prices or engage in market manipulation</li>
                <li>Use automated tools to exploit the Platform</li>
                <li>Harass, threaten, or harm other users</li>
                <li>Upload malicious code or viruses</li>
                <li>Violate intellectual property rights</li>
                <li>Engage in money laundering or terrorist financing</li>
              </ul>

              <h2>9. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which describes 
                how we collect, use, and protect your information. By using the Platform, 
                you consent to our data practices as described in the Privacy Policy.
              </p>

              <h2>10. Intellectual Property</h2>
              <p>
                The Platform and its content are protected by intellectual property laws. 
                The Company retains all rights to:
              </p>
              <ul>
                <li>Platform software and source code</li>
                <li>Trademarks, logos, and branding</li>
                <li>Documentation and educational materials</li>
                <li>AI algorithms and training models</li>
                <li>Smart contract implementations</li>
              </ul>

              <h2>11. Disclaimer of Warranties</h2>
              <p>
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. 
                THE COMPANY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING:
              </p>
              <ul>
                <li>MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE</li>
                <li>NON-INFRINGEMENT OF THIRD-PARTY RIGHTS</li>
                <li>ACCURACY, COMPLETENESS, OR RELIABILITY OF CONTENT</li>
                <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                <li>SECURITY OF DATA OR TRANSACTIONS</li>
              </ul>

              <h2>12. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE COMPANY SHALL NOT BE LIABLE FOR:
              </p>
              <ul>
                <li>INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES</li>
                <li>LOST PROFITS, DATA, OR BUSINESS OPPORTUNITIES</li>
                <li>TOKEN VALUE FLUCTUATIONS OR INVESTMENT LOSSES</li>
                <li>SMART CONTRACT FAILURES OR VULNERABILITIES</li>
                <li>THIRD-PARTY ACTIONS OR BLOCKCHAIN NETWORK ISSUES</li>
                <li>AI SYSTEM ERRORS OR BIASED OUTPUTS</li>
              </ul>
              <p>
                TOTAL LIABILITY SHALL NOT EXCEED $100 USD OR THE AMOUNT YOU PAID TO USE THE PLATFORM, 
                WHICHEVER IS GREATER.
              </p>

              <h2>13. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless the Company from any claims, damages, 
                or expenses arising from:
              </p>
              <ul>
                <li>Your use of the Platform</li>
                <li>Violation of these Terms</li>
                <li>Infringement of third-party rights</li>
                <li>Your content or data</li>
                <li>Regulatory violations</li>
              </ul>

              <h2>14. Termination</h2>
              <p>
                The Company may terminate or suspend your access to the Platform at any time, 
                with or without cause, including for:
              </p>
              <ul>
                <li>Violation of these Terms</li>
                <li>Suspicious or fraudulent activity</li>
                <li>Legal or regulatory requirements</li>
                <li>Platform discontinuation</li>
              </ul>

              <h2>15. Dispute Resolution</h2>
              <h3>15.1 Governing Law</h3>
              <p>
                These Terms are governed by the laws of British Columbia, Canada, without regard to conflict of law principles.
              </p>

              <h3>15.2 Arbitration</h3>
              <p>
                Any disputes shall be resolved through binding arbitration in accordance with the 
                Arbitration Act of British Columbia. Class action lawsuits are not permitted.
              </p>

              <h2>16. Changes to Terms</h2>
              <p>
                The Company reserves the right to modify these Terms at any time. 
                Material changes will be communicated through:
              </p>
              <ul>
                <li>Platform notifications</li>
                <li>Email to registered users</li>
                <li>Website announcements</li>
              </ul>
              <p>
                Continued use of the Platform after changes constitutes acceptance of modified Terms.
              </p>

              <h2>17. Contact Information</h2>
              <p>
                For questions about these Terms, contact us at:
              </p>
              <ul>
                <li>Email: info@arcanaconcept.com</li>
                <li>Address: SHELTR Technologies by Arcana Concept, Canada</li>
                <li>Website: https://sheltr-ai.web.app</li>
              </ul>

              <h2>18. Severability</h2>
              <p>
                If any provision of these Terms is found to be unenforceable, 
                the remaining provisions shall remain in full force and effect.
              </p>

              <h2>19. Entire Agreement</h2>
              <p>
                These Terms, together with the Privacy Policy, constitute the entire agreement 
                between you and the Company regarding the Platform.
              </p>
            </div>

            {/* Legal Footer */}
            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-4">Legal Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This document was last updated on July 25, 2025. These Terms of Service are subject to change. 
                Users are encouraged to review these terms regularly. For specific legal advice regarding your 
                situation, please consult with a qualified attorney.
              </p>
              <div className="flex gap-4 mt-4">
                <Link href="/privacy">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </Button>
                </Link>
                <a href="mailto:legal@sheltr-ai.com">
                  <Button variant="outline" size="sm">
                    Contact Legal Team
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
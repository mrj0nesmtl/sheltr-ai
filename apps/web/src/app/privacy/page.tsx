'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database, Brain, Lock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Footer from '@/components/Footer';
import ThemeLogo from '@/components/ThemeLogo';

export default function PrivacyPage() {
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
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Eye className="h-12 w-12 text-green-600" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-4xl font-bold">Privacy Policy</h1>
                  <Badge className="bg-green-500 text-white">Privacy</Badge>
                </div>
                <p className="text-lg text-muted-foreground">
                  How SHELTR-AI Protects Your Data and Privacy
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Effective: January 25, 2025</span>
                  <span>•</span>
                  <span>Last Updated: January 25, 2025</span>
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
            {/* Privacy Highlights */}
            <div className="mb-8 grid md:grid-cols-3 gap-4">
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <Shield className="h-5 w-5" />
                    Privacy First
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 dark:text-green-300 text-sm">
                  <p>We collect only necessary data and use privacy-preserving technologies where possible.</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <Brain className="h-5 w-5" />
                    AI Transparency
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700 dark:text-blue-300 text-sm">
                  <p>Clear disclosure of how AI systems use your data and make decisions affecting you.</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-200">
                    <Database className="h-5 w-5" />
                    Blockchain Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700 dark:text-purple-300 text-sm">
                  <p>Transparency through blockchain while protecting personal information through careful design.</p>
                </CardContent>
              </Card>
            </div>

            {/* Privacy Policy Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2>1. Introduction</h2>
              <p>
                SHELTR-AI Technologies Inc. ("Company", "we", "us", or "our") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our blockchain-based charitable giving platform ("Platform").
              </p>
              <p>
                By using the Platform, you consent to the data practices described in this policy. 
                If you do not agree with our data practices, please do not use the Platform.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul>
                <li><strong>Identity Information:</strong> Name, email address, phone number, date of birth</li>
                <li><strong>Financial Information:</strong> Bank account details, payment information, transaction history</li>
                <li><strong>Verification Documents:</strong> Government-issued ID, proof of address, income verification</li>
                <li><strong>Biometric Data:</strong> Facial recognition data for identity verification (with consent)</li>
                <li><strong>Location Data:</strong> GPS coordinates for shelter proximity and service delivery</li>
                <li><strong>Communication Data:</strong> Messages, support tickets, feedback</li>
              </ul>

              <h3>2.2 Blockchain and Wallet Information</h3>
              <ul>
                <li><strong>Wallet Addresses:</strong> Public blockchain addresses associated with your account</li>
                <li><strong>Transaction Data:</strong> On-chain transaction records (publicly visible on blockchain)</li>
                <li><strong>Token Holdings:</strong> SHELTR and SHELTR-S token balances and transaction history</li>
                <li><strong>Smart Contract Interactions:</strong> Records of contract executions and governance participation</li>
              </ul>

              <h3>2.3 Technical and Usage Data</h3>
              <ul>
                <li><strong>Device Information:</strong> Device type, operating system, browser type, unique device identifiers</li>
                <li><strong>Usage Analytics:</strong> Pages visited, features used, time spent on platform, click patterns</li>
                <li><strong>Performance Data:</strong> Error logs, crash reports, system performance metrics</li>
                <li><strong>Cookies and Tracking:</strong> Session data, preferences, authentication tokens</li>
              </ul>

              <h3>2.4 AI and Machine Learning Data</h3>
              <ul>
                <li><strong>Behavioral Patterns:</strong> User interaction patterns for personalization</li>
                <li><strong>Preference Data:</strong> Donation preferences, service interests, communication styles</li>
                <li><strong>Predictive Insights:</strong> Risk assessments, fraud detection indicators</li>
                <li><strong>Training Data:</strong> Anonymized data used to improve AI models</li>
              </ul>

              <h2>3. How We Use Your Information</h2>

              <h3>3.1 Platform Operations</h3>
              <ul>
                <li>Facilitate donations and token transactions</li>
                <li>Verify user identity and prevent fraud</li>
                <li>Process payments and maintain financial records</li>
                <li>Provide customer support and technical assistance</li>
                <li>Maintain platform security and integrity</li>
              </ul>

              <h3>3.2 AI-Powered Services</h3>
              <ul>
                <li><strong>Personalization:</strong> Customize user experience and recommendations</li>
                <li><strong>Matching Algorithms:</strong> Connect donors with appropriate recipients</li>
                <li><strong>Fraud Detection:</strong> Identify suspicious activities and prevent abuse</li>
                <li><strong>Impact Analytics:</strong> Measure and report on charitable impact</li>
                <li><strong>Automated Support:</strong> Provide AI-powered customer assistance</li>
              </ul>

              <h3>3.3 Compliance and Legal</h3>
              <ul>
                <li>Comply with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations</li>
                <li>Meet tax reporting and financial compliance requirements</li>
                <li>Respond to legal requests and court orders</li>
                <li>Enforce Terms of Service and platform policies</li>
              </ul>

              <h2>4. AI System Data Practices</h2>

              <h3>4.1 AI Decision Making</h3>
              <p>Our AI systems make decisions regarding:</p>
              <ul>
                <li><strong>Donor-Recipient Matching:</strong> Algorithms suggest optimal donation targets based on need, location, and donor preferences</li>
                <li><strong>Fraud Detection:</strong> Automated systems flag suspicious transactions for human review</li>
                <li><strong>Risk Assessment:</strong> AI evaluates transaction risk and applies appropriate security measures</li>
                <li><strong>Content Moderation:</strong> Automated systems review user-generated content for policy violations</li>
              </ul>

              <h3>4.2 AI Training and Improvement</h3>
              <ul>
                <li>We use aggregated, anonymized data to train and improve AI models</li>
                <li>Personal data is never used directly in machine learning training without explicit consent</li>
                <li>AI models are regularly audited for bias and fairness</li>
                <li>Users can opt out of AI-based decision making where legally required</li>
              </ul>

              <h3>4.3 AI Transparency Rights</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Understand how AI systems affect your platform experience</li>
                <li>Request human review of AI-driven decisions</li>
                <li>Appeal automated decisions that significantly impact you</li>
                <li>Access information about AI model logic (where technically feasible)</li>
              </ul>

              <h2>5. Blockchain and Transparency</h2>

              <h3>5.1 On-Chain Data</h3>
              <p>
                Certain information is recorded permanently on the blockchain and cannot be deleted:
              </p>
              <ul>
                <li>Transaction amounts and timestamps</li>
                <li>Wallet addresses involved in transactions</li>
                <li>Smart contract execution records</li>
                <li>Token distribution and governance votes</li>
              </ul>

              <h3>5.2 Privacy-Preserving Techniques</h3>
              <ul>
                <li><strong>Pseudonymization:</strong> Personal identifiers are replaced with cryptographic hashes</li>
                <li><strong>Data Minimization:</strong> Only essential data is recorded on-chain</li>
                <li><strong>Zero-Knowledge Proofs:</strong> Verify identity without revealing personal information (planned)</li>
                <li><strong>Encrypted Storage:</strong> Sensitive off-chain data is encrypted at rest and in transit</li>
              </ul>

              <h2>6. Information Sharing and Disclosure</h2>

              <h3>6.1 Service Providers</h3>
              <p>We share information with trusted third-party service providers:</p>
              <ul>
                <li><strong>Cloud Infrastructure:</strong> Google Cloud Platform for hosting and data processing</li>
                <li><strong>Payment Processors:</strong> Visa and other payment networks for transaction processing</li>
                <li><strong>Identity Verification:</strong> KYC/AML service providers for compliance</li>
                <li><strong>Analytics Providers:</strong> Privacy-compliant analytics for platform improvement</li>
              </ul>

              <h3>6.2 Legal Requirements</h3>
              <p>We may disclose information when required by law:</p>
              <ul>
                <li>Court orders and legal subpoenas</li>
                <li>Government investigations and regulatory requests</li>
                <li>Tax reporting and financial compliance</li>
                <li>Emergency situations involving immediate danger</li>
              </ul>

              <h3>6.3 Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of assets, user information may be 
                transferred as part of the business transaction, subject to the same privacy protections.
              </p>

              <h2>7. Data Security</h2>

              <h3>7.1 Technical Safeguards</h3>
              <ul>
                <li><strong>Encryption:</strong> AES-256 encryption for data at rest, TLS 1.3 for data in transit</li>
                <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Network Security:</strong> Firewalls, intrusion detection, and DDoS protection</li>
                <li><strong>Regular Audits:</strong> Security assessments and penetration testing</li>
                <li><strong>Incident Response:</strong> 24/7 monitoring and rapid response procedures</li>
              </ul>

              <h3>7.2 Organizational Safeguards</h3>
              <ul>
                <li>Employee privacy training and background checks</li>
                <li>Principle of least privilege for data access</li>
                <li>Regular security awareness programs</li>
                <li>Vendor security assessments and contracts</li>
              </ul>

              <h2>8. Your Privacy Rights</h2>

              <h3>8.1 Access and Control</h3>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request copies of your personal information</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal and blockchain limitations)</li>
                <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                <li><strong>Restriction:</strong> Limit how we process your information</li>
                <li><strong>Objection:</strong> Object to certain types of data processing</li>
              </ul>

              <h3>8.2 Blockchain Limitations</h3>
              <p>
                Note that data recorded on the blockchain cannot be deleted or modified. 
                We minimize on-chain personal data to preserve your "right to be forgotten" where possible.
              </p>

              <h3>8.3 Exercising Your Rights</h3>
              <p>
                To exercise your privacy rights, contact us at privacy@sheltr-ai.com. 
                We will respond within 30 days and may require identity verification.
              </p>

              <h2>9. International Data Transfers</h2>
              <p>
                The Platform operates globally, and your information may be transferred to and 
                processed in countries other than your residence. We ensure adequate protection through:
              </p>
              <ul>
                <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
                <li>Adequacy decisions where available</li>
                <li>Privacy frameworks like EU-US Data Privacy Framework</li>
                <li>Binding Corporate Rules for internal transfers</li>
              </ul>

              <h2>10. Data Retention</h2>
              <p>
                We retain personal information for as long as necessary to:
              </p>
              <ul>
                <li>Provide platform services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain security and fraud prevention</li>
              </ul>
              <p>
                Specific retention periods:
              </p>
              <ul>
                <li><strong>Account Data:</strong> Until account closure plus 7 years for financial records</li>
                <li><strong>Transaction Data:</strong> Permanently on blockchain, 10 years off-chain</li>
                <li><strong>Communications:</strong> 3 years for support tickets and correspondence</li>
                <li><strong>Analytics Data:</strong> 2 years in anonymized form</li>
              </ul>

              <h2>11. Children's Privacy</h2>
              <p>
                The Platform is not intended for users under 18. We do not knowingly collect 
                personal information from children. If we become aware of such collection, 
                we will take steps to delete the information.
              </p>

              <h2>12. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies for:
              </p>
              <ul>
                <li><strong>Essential Cookies:</strong> Authentication, security, and basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Usage statistics and performance monitoring</li>
                <li><strong>Preference Cookies:</strong> Language, theme, and user settings</li>
                <li><strong>Marketing Cookies:</strong> Personalized content and advertisements (with consent)</li>
              </ul>
              <p>
                You can control cookies through your browser settings, but disabling essential 
                cookies may affect platform functionality.
              </p>

              <h2>13. Privacy by Design</h2>
              <p>
                SHELTR is built with privacy-by-design principles:
              </p>
              <ul>
                <li><strong>Data Minimization:</strong> Collect only necessary information</li>
                <li><strong>Purpose Limitation:</strong> Use data only for stated purposes</li>
                <li><strong>Privacy-Preserving Defaults:</strong> Most privacy-friendly settings by default</li>
                <li><strong>Transparency:</strong> Clear communication about data practices</li>
                <li><strong>User Control:</strong> Meaningful choices and consent mechanisms</li>
              </ul>

              <h2>14. Updates to This Policy</h2>
              <p>
                We may update this Privacy Policy to reflect changes in our practices or applicable laws. 
                Material changes will be communicated through:
              </p>
              <ul>
                <li>Email notifications to registered users</li>
                <li>Platform notifications and announcements</li>
                <li>Website banners and alerts</li>
              </ul>
              <p>
                The "Last Updated" date at the top of this policy indicates when changes were made.
              </p>

              <h2>15. Contact Information</h2>
              <p>
                For privacy-related questions, concerns, or requests, contact us:
              </p>
              <ul>
                <li><strong>Privacy Officer:</strong> privacy@sheltr-ai.com</li>
                <li><strong>Data Protection Officer:</strong> dpo@sheltr-ai.com</li>
                <li><strong>General Inquiries:</strong> hello@sheltr-ai.com</li>
                <li><strong>Address:</strong> SHELTR-AI Technologies Inc., Toronto, Ontario, Canada</li>
              </ul>

              <h2>16. Regulatory Compliance</h2>
              <p>
                This Privacy Policy is designed to comply with:
              </p>
              <ul>
                <li><strong>GDPR:</strong> European Union General Data Protection Regulation</li>
                <li><strong>CCPA:</strong> California Consumer Privacy Act</li>
                <li><strong>PIPEDA:</strong> Personal Information Protection and Electronic Documents Act (Canada)</li>
                <li><strong>SOX:</strong> Sarbanes-Oxley Act financial data requirements</li>
                <li><strong>PCI DSS:</strong> Payment Card Industry Data Security Standard</li>
              </ul>
            </div>

            {/* Privacy Footer */}
            <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-semibold mb-4">Your Privacy Matters</h3>
              <p className="text-sm text-muted-foreground">
                We are committed to protecting your privacy and being transparent about our data practices. 
                If you have any questions or concerns about this Privacy Policy or our data handling practices, 
                please don't hesitate to contact our Privacy Officer.
              </p>
              <div className="flex gap-4 mt-4">
                <Link href="/terms">
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Button>
                </Link>
                <a href="mailto:privacy@sheltr-ai.com">
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Contact Privacy Team
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
# SHELTR Enhanced FAQ Database

> **Last Updated**: November 26, 2025  
> **Status**: Production  
> **Source**: `apps/api/services/faq_service.py` and `apps/api/services/expanded_faqs.py`

## Overview

This document contains all FAQs currently configured in the SHELTR chatbot system. These FAQs provide instant, consistent responses to common questions across different user types and topics.

---

## 📊 FAQ Statistics

- **Total FAQs**: 198
- **Categories**: 8
- **User Roles Covered**: Participants, Donors, Shelters, Government, General Public

---

## 🎯 FAQ Categories

### 1. Platform Overview
General information about SHELTR and how it works.

### 2. Participant Support
Information for homeless individuals seeking assistance.

### 3. Donor Information
Details for people who want to donate or support the cause.

### 4. Shelter Operations
Information for shelter administrators and staff.

### 5. Government & Policy
Information for government officials and policymakers.

### 6. POD Security
Technical details about the Proof of Donation system.

### 7. Business Model
Information about SHELTR's financial model and SmartFund.

### 8. Ecosystem Journey
Information about the participant journey through the SHELTR ecosystem.

---

## 📝 How to Edit FAQs

### Option 1: Edit Code Files (Developers)
1. Open `apps/api/services/faq_service.py` for base FAQs
2. Open `apps/api/services/expanded_faqs.py` for expanded FAQs
3. Make your changes
4. Restart the backend: `./start-dev.sh`
5. Test in the chatbot

### Option 2: Request Changes (Non-Developers)
1. Navigate to `/dashboard/knowledge`
2. Find this document in the knowledge base
3. Click "Request File Update"
4. Describe the FAQ changes needed
5. A developer will implement the changes

---

## 🔍 FAQ Structure

Each FAQ entry contains:
- **ID**: Unique identifier
- **Questions**: Array of question variations
- **Answer**: The response text
- **Category**: Topic classification
- **Agent Suggestion**: Which chatbot agent should handle this
- **Actions**: Optional follow-up actions (links, buttons)
- **Role Detection**: Optional role assignment hints

---

## 📚 Complete FAQ List

### Platform Overview FAQs

#### What is SHELTR?
**Questions:**
- "what is sheltr"
- "what does this platform do"
- "tell me about sheltr"
- "what is this platform"
- "how does sheltr work"

**Answer:**
SHELTR is a platform that helps homeless individuals through technology and transparent donations. We use blockchain to ensure 80% of donations go directly to people in need.

**Category:** platform_overview  
**Agent:** public_information

---

#### Join as Participant
**Questions:**
- "i want to join as a participant"
- "how do i become a participant"
- "i need help"
- "i'm homeless and need assistance"
- "how to get support"

**Answer:**
To join as a participant, visit our guide to learn about the process and then register to get started.

**Category:** participant_support  
**Agent:** participant_support  
**Role Detection:** participant

---

### Donation & SmartFund FAQs

#### How Donations Work
**Questions:**
- "how do donations work"
- "where does my money go"
- "how can i donate"
- "what happens to my donation"

**Answer:**
When you donate to SHELTR, your contribution is split using our SmartFund model: 80% goes directly to participants, 15% supports shelter operations, and 5% maintains the platform. Every transaction is recorded on the blockchain for complete transparency.

**Category:** donor_information  
**Agent:** donor_support

---

#### SmartFund Distribution
**Questions:**
- "what is smartfund"
- "how is money distributed"
- "what is the 80-15-5 split"
- "explain the smartfund model"

**Answer:**
SmartFund is our transparent distribution model:
- **80%** goes directly to participants for their needs
- **15%** supports affiliated shelter operations
- **5%** maintains the SHELTR platform

For shelter-direct donations, the split is 95% to the shelter and 5% to SHELTR.

**Category:** business_model  
**Agent:** business_analyst

---

### Blockchain & Security FAQs

#### Proof of Donation (POD)
**Questions:**
- "what is proof of donation"
- "what is pod"
- "how do i verify my donation"
- "blockchain verification"

**Answer:**
Proof of Donation (POD) is our blockchain-based verification system. Every donation generates a unique transaction hash that proves your contribution. You can view this in your donor dashboard under "My Giving" and download tax receipts with full transaction details.

**Category:** pod_security  
**Agent:** technical_expert

---

#### Is My Donation Secure?
**Questions:**
- "is my donation secure"
- "is this safe"
- "can i trust this platform"
- "how do you protect my data"

**Answer:**
Yes! SHELTR uses enterprise-grade security:
- **Blockchain verification** for all transactions
- **Firebase Authentication** for secure login
- **Encrypted data storage** in Google Cloud
- **PCI-compliant payment processing** via Adyen
- **Role-based access control** to protect sensitive information

**Category:** pod_security  
**Agent:** technical_expert

---

### Participant Journey FAQs

#### Getting Started as a Participant
**Questions:**
- "how do i get started"
- "what's the first step"
- "how do i register as a participant"
- "i'm new here"

**Answer:**
Welcome! Here's how to get started:
1. **Register** at an affiliated shelter
2. **Get your QR code** for receiving donations
3. **Access resources** through your participant dashboard
4. **Track your progress** through the SHELTR ecosystem

Visit /solutions/participants for detailed information.

**Category:** ecosystem_journey  
**Agent:** participant_support

---

#### Participant Benefits
**Questions:**
- "what do i get as a participant"
- "what are the benefits"
- "how does this help me"
- "what services are available"

**Answer:**
As a SHELTR participant, you receive:
- **Direct donations** via your personal QR code
- **Shelter support** and resources
- **Progress tracking** tools
- **Transition assistance** toward stable housing
- **Transparent record** of support received

**Category:** participant_support  
**Agent:** participant_support

---

### Shelter Administration FAQs

#### Register My Shelter
**Questions:**
- "how do i register my shelter"
- "can my shelter join"
- "shelter registration"
- "add my organization"

**Answer:**
To register your shelter with SHELTR:
1. Contact us at partnerships@sheltr.ca
2. Complete the shelter verification process
3. Receive your admin credentials
4. Onboard participants and staff

Visit /solutions/shelters for more information.

**Category:** shelter_operations  
**Agent:** sheltr_support

---

#### Managing Participants
**Questions:**
- "how do i manage participants"
- "add new participants"
- "participant onboarding"
- "shelter dashboard"

**Answer:**
Shelter administrators can:
- **Onboard new participants** with QR code generation
- **Track participant progress** and donations
- **Manage staff access** with role-based permissions
- **View analytics** on shelter impact
- **Generate reports** for funding applications

Access your shelter dashboard at /dashboard/shelter-admin

**Category:** shelter_operations  
**Agent:** sheltr_support

---

### Government & Policy FAQs

#### Government Partnerships
**Questions:**
- "government partnerships"
- "public sector collaboration"
- "how does sheltr work with government"
- "policy integration"

**Answer:**
SHELTR collaborates with government agencies to:
- **Complement existing programs** without duplication
- **Provide transparent reporting** on fund usage
- **Enable data-driven policy** decisions
- **Reduce administrative overhead** for social services

Contact partnerships@sheltr.ca for government inquiries.

**Category:** government_policy  
**Agent:** business_analyst

---

#### Compliance & Reporting
**Questions:**
- "compliance requirements"
- "reporting standards"
- "audit trail"
- "regulatory compliance"

**Answer:**
SHELTR maintains:
- **CRA-compliant** tax receipts for donors
- **Blockchain audit trail** for all transactions
- **Privacy compliance** with Canadian data protection laws
- **Financial transparency** reports
- **Regular third-party audits**

**Category:** government_policy  
**Agent:** business_analyst

---

### Technical FAQs

#### MSB Registration
**Questions:**
- "what is msb"
- "money services business"
- "msb registration"
- "fintrac compliance"

**Answer:**
SHELTR is registered as a Money Services Business (MSB) with FINTRAC, ensuring:
- **Regulatory compliance** for financial transactions
- **Anti-money laundering** (AML) protocols
- **Know Your Customer** (KYC) procedures
- **Transaction monitoring** and reporting

**Category:** technical  
**Agent:** business_analyst

---

#### API Integration
**Questions:**
- "api documentation"
- "integrate with sheltr"
- "developer api"
- "technical integration"

**Answer:**
SHELTR provides APIs for:
- **Donation processing**
- **Participant verification**
- **Transaction lookup**
- **Reporting and analytics**

Visit /docs/api for technical documentation.

**Category:** technical  
**Agent:** technical_expert

---

## 🔄 FAQ Update Process

### Adding New FAQs
1. Identify the question pattern and category
2. Write a clear, concise answer
3. Add to `expanded_faqs.py` or `faq_service.py`
4. Test in development environment
5. Deploy to production
6. Update this documentation

### Modifying Existing FAQs
1. Locate the FAQ by ID or question
2. Update the answer or question variations
3. Test the changes
4. Deploy and monitor

### Removing Outdated FAQs
1. Mark FAQ as deprecated in code
2. Monitor for usage
3. Remove after 30 days if no longer needed
4. Update documentation

---

## 📈 FAQ Performance Metrics

Track FAQ effectiveness:
- **Match Rate**: % of questions that match an FAQ
- **Confidence Threshold**: Minimum 70% similarity required
- **User Satisfaction**: Feedback on FAQ responses
- **Coverage**: % of common questions covered

---

## 🎯 Best Practices

### Writing Good FAQs
1. **Be Concise**: Keep answers under 200 words
2. **Be Specific**: Provide actionable information
3. **Include Links**: Direct users to relevant pages
4. **Use Plain Language**: Avoid jargon
5. **Update Regularly**: Keep information current

### Question Variations
- Include common misspellings
- Add casual phrasings
- Cover different question formats
- Think about how users actually ask

---

## 📞 Support

For FAQ-related questions or updates:
- **Technical Issues**: technical@sheltr.ca
- **Content Updates**: content@sheltr.ca
- **General Inquiries**: support@sheltr.ca

---

## 🔗 Related Documentation

- [Chatbot Architecture](/docs/features/chatbot/architecture.md)
- [Knowledge Base Guide](/docs/features/knowledge-base/knowledge-architecture.md)
- [API Documentation](/docs/api/README.md)
- [User Roles & Permissions](/docs/security/roles-and-permissions.md)

---

**Note**: This is a living document. FAQs are continuously updated based on user feedback and platform evolution. Last sync: November 26, 2025.


/**
 * Tax Receipt PDF Generation Service
 * Generates professional CRA-compliant tax receipts for donations
 */

import { jsPDF } from 'jspdf';

// SHELTR wordmark logo as base64 PNG (from apps/web/public/wordmark.png)
const SHELTR_WORDMARK_BASE64 = 'data:image/png;base64,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';

export interface TaxReceiptData {
  donorName: string;
  donorEmail: string;
  donorAddress?: string;
  year: number;
  totalAmount: number;
  donations: Array<{
    id: string;
    date: string;
    amount: number;
    shelter: string;
    transactionHash?: string;
    ipAddress?: string;
    participantName?: string;
    smartFundDistribution?: {
      direct: number;
      housing: number;
      infrastructure: number;
    };
    stakingAccount?: string;
  }>;
}

/**
 * Generate a professional tax receipt PDF
 */
export async function generateTaxReceiptPDF(data: TaxReceiptData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add text with automatic page breaks
  const addText = (text: string, x: number, y: number, options?: { align?: 'left' | 'center' | 'right' | 'justify' }) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      return 20;
    }
    doc.text(text, x, y, options);
    return y;
  };

  // ==========================================
  // HEADER - SHELTR Wordmark Logo
  // ==========================================
  try {
    // Add SHELTR wordmark (PNG format, centered)
    const logoWidth = 60;
    const logoHeight = (logoWidth / 570) * 59; // Maintain aspect ratio (570x59)
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(SHELTR_WORDMARK_BASE64, 'PNG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 8;
  } catch (error) {
    // Fallback to text if logo fails to load
    console.warn('Logo failed to load, using text fallback:', error);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('SHELTR', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
  }
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText('Better to Solve', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Official Donation Receipt', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 3;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Tax Year ${data.year}`, pageWidth / 2, yPosition, { align: 'center' });
  
  // Horizontal line
  yPosition += 5;
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  // ==========================================
  // DONOR INFORMATION
  // ==========================================
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Donor Information', 20, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Name: ${data.donorName}`, 20, yPosition);
  yPosition += 5;
  yPosition = addText(`Email: ${data.donorEmail}`, 20, yPosition);
  
  if (data.donorAddress) {
    yPosition += 5;
    yPosition = addText(`Address: ${data.donorAddress}`, 20, yPosition);
  }
  
  yPosition += 10;

  // ==========================================
  // DONATION SUMMARY
  // ==========================================
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Donation Summary', 20, yPosition);
  yPosition += 7;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText(`Total Donations: ${data.donations.length}`, 20, yPosition);
  yPosition += 5;
  yPosition = addText(`Total Amount: $${data.totalAmount.toFixed(2)} CAD`, 20, yPosition);
  yPosition += 5;
  yPosition = addText(`100% Tax Deductible: $${data.totalAmount.toFixed(2)} CAD`, 20, yPosition);
  yPosition += 10;

  // ==========================================
  // INDIVIDUAL DONATION DETAILS
  // ==========================================
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Donation Details', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  for (let i = 0; i < data.donations.length; i++) {
    const donation = data.donations[i];
    
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    // Donation header
    doc.setFont('helvetica', 'bold');
    yPosition = addText(`Donation #${i + 1} - ${new Date(donation.date).toLocaleDateString()}`, 20, yPosition);
    yPosition += 5;
    
    doc.setFont('helvetica', 'normal');
    yPosition = addText(`Amount: $${donation.amount.toFixed(2)} CAD`, 25, yPosition);
    yPosition += 4;
    yPosition = addText(`Recipient Shelter: ${donation.shelter}`, 25, yPosition);
    yPosition += 4;

    if (donation.participantName) {
      yPosition = addText(`Participant: ${donation.participantName}`, 25, yPosition);
      yPosition += 4;
    }

    if (donation.transactionHash) {
      yPosition = addText(`Transaction Hash: ${donation.transactionHash.substring(0, 40)}...`, 25, yPosition);
      yPosition += 4;
    }

    if (donation.ipAddress) {
      yPosition = addText(`IP Address: ${donation.ipAddress}`, 25, yPosition);
      yPosition += 4;
    }

    // SmartFund Distribution
    if (donation.smartFundDistribution) {
      yPosition = addText('SmartFund Distribution (80-15-5):', 25, yPosition);
      yPosition += 4;
      yPosition = addText(`  • Direct Support: $${donation.smartFundDistribution.direct.toFixed(2)} (80%)`, 30, yPosition);
      yPosition += 4;
      yPosition = addText(`  • Housing Fund: $${donation.smartFundDistribution.housing.toFixed(2)} (15%)`, 30, yPosition);
      yPosition += 4;
      yPosition = addText(`  • Infrastructure: $${donation.smartFundDistribution.infrastructure.toFixed(2)} (5%)`, 30, yPosition);
      yPosition += 4;
    }

    if (donation.stakingAccount) {
      yPosition = addText(`Staking Account: ${donation.stakingAccount}`, 25, yPosition);
      yPosition += 4;
    }

    yPosition += 6; // Space between donations
  }

  // ==========================================
  // CRA COMPLIANCE BOILERPLATE
  // ==========================================
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  yPosition += 10;
  doc.setLineWidth(0.5);
  doc.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('Official Charitable Receipt', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const boilerplateText = [
    'This official donation receipt is issued by SHELTR for income tax purposes.',
    '',
    'SHELTR is a registered charitable organization committed to ending homelessness through',
    'innovative technology solutions and direct support services.',
    '',
    'All donations are 100% tax-deductible to the full extent allowed by law. Please retain',
    'this receipt for your tax records.',
    '',
    'For questions about this receipt or your donations, please contact:',
    'Email: donations@sheltr-ai.com',
    'Website: https://sheltr-ai.web.app',
    '',
    `Receipt Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
    '',
    'Thank you for your generous support in our mission to end homelessness!'
  ];

  for (const line of boilerplateText) {
    if (line === '') {
      yPosition += 3;
    } else {
      yPosition = addText(line, 20, yPosition);
      yPosition += 4;
    }
  }

  // ==========================================
  // FOOTER
  // ==========================================
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(128, 128, 128);
  doc.text('SHELTR - Hacking Homelessness with Technology', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Return PDF as Blob
  return doc.output('blob');
}

/**
 * Download a tax receipt PDF
 */
export async function downloadTaxReceipt(data: TaxReceiptData, filename?: string): Promise<void> {
  const pdfBlob = await generateTaxReceiptPDF(data);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `SHELTR-Tax-Receipt-${data.year}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


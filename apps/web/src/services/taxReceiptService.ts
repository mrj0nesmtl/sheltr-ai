/**
 * Tax Receipt PDF Generation Service
 * Generates professional CRA-compliant tax receipts for donations
 */

import { jsPDF } from 'jspdf';

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
  const addText = (text: string, x: number, y: number, options?: any) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      return 20;
    }
    doc.text(text, x, y, options);
    return y;
  };

  // ==========================================
  // HEADER - SHELTR Logo and Title
  // ==========================================
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  yPosition = addText('SHELTR', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 5;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  yPosition = addText('Hacking Homelessness with Technology', pageWidth / 2, yPosition, { align: 'center' });
  
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


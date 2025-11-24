/**
 * Tax Receipt PDF Generation Service
 * Generates professional CRA-compliant tax receipts for donations
 */

import { jsPDF } from 'jspdf';

// SHELTR logo as base64 SVG (converted from logo-black.svg)
const SHELTR_LOGO_BASE64 = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDU2NCAxMzIiIHdpZHRoPSI1NjQiIGhlaWdodD0iMTMyIj4KCTx0aXRsZT5zaGVsdHItYWk8L3RpdGxlPgoJPHN0eWxlPgoJCS5zMCB7IGZpbGw6ICMwMDAwMDAgfSAKCTwvc3R5bGU+Cgk8ZyBpZD0iTGF5ZXIgMSI+CgkJPHBhdGggaWQ9IiZsdDtDb21wb3VuZCBQYXRoJmd0OyIgY2xhc3M9InMwIiBkPSJtMjguOCA4Ny40YzAgMTYuNyAxMyAyMy4yIDI3LjggMjMuMiA5LjYgMCAyNC40LTIuOCAyNC40LTE1LjcgMC0xMy41LTE4LjgtMTUuOC0zNy4zLTIwLjctMTguNi01LTM3LjUtMTIuMi0zNy41LTM1LjggMC0yNS42IDI0LjMtMzggNDctMzggMjYuMiAwIDUwLjQgMTEuNSA1MC40IDQwLjVoLTI2LjhjLTAuOS0xNS4xLTExLjYtMTktMjQuOC0xOS04LjggMC0xOSAzLjctMTkgMTQuMyAwIDkuNiA2IDEwLjkgMzcuNSAxOSA5LjEgMi4zIDM3LjMgOC4xIDM3LjMgMzYuNiAwIDIzLTE4LjEgNDAuMy01Mi4zIDQwLjMtMjcuOCAwLTUzLjgtMTMuNy01My41LTQ0Ljd6Ii8+CgkJPHBhdGggaWQ9IiZsdDtDb21wb3VuZCBQYXRoJmd0OyIgY2xhc3M9InMwIiBkPSJtMTExLjYgMy40aDI3LjZ2NDguMmg1MC45di00OC4yaDI3LjZ2MTI1LjdoLTI3LjZ2LTU0LjJoLTUwLjl2NTQuMmgtMjcuNnoiLz4KCQk8cGF0aCBpZD0iJmx0O0NvbXBvdW5kIFBhdGgmZ3Q7IiBjbGFzcz0iczAiIGQ9Im0yMjQuNCAzLjRoOTR2MjMuM2gtNjYuNHYyNi45aDYwLjl2MjEuNWgtNjAuOXYzMC44aDY3Ljh2MjMuMmgtOTUuNHoiLz4KCQk8cGF0aCBpZD0iJmx0O0NvbXBvdW5kIFBhdGgmZ3Q7IiBjbGFzcz0iczAiIGQ9Im0zMjQuNCAzLjRoMjcuNnYxMDIuNWg2MS4zdjIzLjJoLTg4Ljl6Ii8+CgkJPHBhdGggaWQ9IiZsdDtDb21wb3VuZCBQYXRoJmd0OyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGFzcz0iczAiIGQ9Im00NTQuMSAzLjRoNjcuOGMyMi41IDAgMzYuOCAxNS43IDM2LjggMzQuNyAwIDE0LjgtNiAyNS45LTE5LjkgMzEuNXYwLjRjMTMuNSAzLjUgMTcuNCAxNi43IDE4LjMgMjkuMyAwLjUgOCAwLjMgMjIuNyA1LjIgMjkuOGgtMjcuNmMtMy4zLTcuOS0zLTIwLjEtNC40LTMwLjEtMS45LTEzLjItNy0xOS0yMC45LTE5aC0yNy43djQ5LjFoLTI3LjZ6bTI3LjYgNTYuOGgzMC4zYzEyLjMgMCAxOS01LjIgMTktMTcuOSAwLTEyLjItNi43LTE3LjQtMTktMTcuNGgtMzAuM3oiLz4KCQk8cGF0aCBpZD0iJmx0O0NvbXBvdW5kIFBhdGgmZ3Q7IiBjbGFzcz0iczAiIGQ9Im00NDggMTI4LjJoLTI3LjZ2LTEwMi40aC02MS4ydi0yMy4yaDg4Ljh6Ii8+Cgk8L2c+Cjwvc3ZnPiA=';

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
  try {
    // Add SHELTR logo (centered, scaled appropriately)
    const logoWidth = 80;
    const logoHeight = 18.75; // Maintain aspect ratio (564x132 = ~3:1 ratio)
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(SHELTR_LOGO_BASE64, 'SVG', logoX, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 5;
  } catch (error) {
    // Fallback to text if logo fails to load
    console.warn('Logo failed to load, using text fallback:', error);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    yPosition = addText('SHELTR', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;
  }
  
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


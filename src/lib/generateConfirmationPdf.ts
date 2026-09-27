import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { RegistrationResult } from './googleSheet';

export interface PassParticipantDetails {
  college?: string;
  department?: string;
  phone?: string;
  email?: string;
  paymentId?: string;
  techMembers?: string[];
  nonTechMembers?: string[];
}

/**
 * Generates an ultra-premium, high-resolution official PDF Registration Pass for PIXEL-3.O
 */
export async function generateConfirmationPdf(
  result: RegistrationResult,
  extraDetails?: PassParticipantDetails
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210mm x 297mm
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // ─── Generate QR Code as Data URL ───
  let qrDataUrl = '';
  try {
    const qrPayload = JSON.stringify({
      id: result.registrationId,
      name: result.fullName,
      members: result.totalMembers,
      amount: result.totalAmount,
      tech: result.techEvent || 'None',
      nonTech: result.nonTechEvent || 'None',
      status: result.registrationStatus,
    });
    qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 250,
      margin: 1,
      color: { dark: '#171717', light: '#ffffff' },
    });
  } catch (err) {
    console.error('Error generating QR for PDF:', err);
  }

  // ─── 1. Background Canvas & Decorative Border ───
  doc.setFillColor(253, 252, 250); // Warm ivory background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border
  doc.setDrawColor(255, 106, 0); // Phoenix Orange
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4, 'S');

  // Inner Accent Border
  doc.setDrawColor(229, 27, 35); // Phoenix Red
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4, 3, 3, 'S');

  // ─── 2. Top Header Banner ───
  doc.setFillColor(23, 23, 23); // Dark charcoal header block
  doc.roundedRect(margin + 3, margin + 3, contentWidth - 6, 32, 2.5, 2.5, 'F');

  // Top flame line
  doc.setFillColor(255, 106, 0);
  doc.rect(margin + 3, margin + 3, contentWidth - 6, 2, 'F');

  // Institution Title
  doc.setTextColor(255, 184, 0); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('ADHIPARASAKTHI ENGINEERING COLLEGE', pageWidth / 2, margin + 10, { align: 'center' });

  doc.setTextColor(220, 220, 220);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Department of Computer Science and Engineering', pageWidth / 2, margin + 15, { align: 'center' });
  doc.text('In Association with CSI Kanchipuram Chapter', pageWidth / 2, margin + 19.5, { align: 'center' });

  // Symposium Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('PIXEL-3.O · NATIONAL LEVEL TECHNICAL SYMPOSIUM', pageWidth / 2, margin + 26.5, { align: 'center' });

  doc.setTextColor(255, 106, 0);
  doc.setFontSize(8);
  doc.text('OFFICIAL EVENT ADMISSION & REGISTRATION PASS', pageWidth / 2, margin + 31, { align: 'center' });

  let y = margin + 40;

  // ─── 3. Required Highlight Quote Banner ───
  // "Early Registration Helps Us Ensure Smooth Arrangements"
  doc.setFillColor(255, 247, 237); // Light peach/orange fill
  doc.setDrawColor(255, 106, 0);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 5, y, contentWidth - 10, 10, 2, 2, 'FD');

  doc.setTextColor(194, 65, 12); // Deep amber text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('★  "Early Registration Helps Us Ensure Smooth Arrangements"  ★', pageWidth / 2, y + 6.5, { align: 'center' });

  y += 14;

  // ─── 4. Registration ID & Verification Badge ───
  const regBoxWidth = contentWidth - 10;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 5, y, regBoxWidth, 24, 2, 2, 'FD');

  // Left Column: Official Registration ID
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('OFFICIAL REGISTRATION ID', margin + 9, y + 6);

  doc.setTextColor(229, 27, 35); // Crimson
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.text(result.registrationId, margin + 9, y + 14);

  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Recorded: ${result.registeredAt || new Date().toLocaleString('en-IN')}`, margin + 9, y + 19.5);

  // Right Column: Status Badges
  const badgeRight = margin + regBoxWidth + 1;
  doc.setFillColor(236, 253, 245); // Emerald light
  doc.setDrawColor(52, 211, 153);
  doc.roundedRect(badgeRight - 48, y + 4, 44, 7, 1.5, 1.5, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('✓ STATUS: CONFIRMED', badgeRight - 26, y + 8.5, { align: 'center' });

  doc.setFillColor(254, 243, 199); // Amber light
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(badgeRight - 48, y + 13, 44, 7, 1.5, 1.5, 'FD');
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`PAYMENT: ${result.paymentStatus || 'Submitted'}`, badgeRight - 26, y + 17.5, { align: 'center' });

  y += 28;

  // ─── 5. Participant Profile Card ───
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 5, y, contentWidth - 10, 36, 2, 2, 'FD');

  doc.setFillColor(255, 106, 0);
  doc.rect(margin + 5, y, 2.5, 36, 'F'); // Left accent bar

  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PARTICIPANT DETAILS', margin + 11, y + 6);

  doc.setFontSize(8);
  const col1 = margin + 11;
  const col2 = margin + 95;

  // Row 1
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Full Name:', col1, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(result.fullName || '—', col1 + 22, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Phone:', col2, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 23, 23);
  doc.text(extraDetails?.phone || '—', col2 + 15, y + 12);

  // Row 2
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('College:', col1, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 23, 23);
  const collegeText = doc.splitTextToSize(extraDetails?.college || '—', 60);
  doc.text(collegeText, col1 + 22, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Email:', col2, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 23, 23);
  doc.text(extraDetails?.email || '—', col2 + 15, y + 18);

  // Row 3
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Department:', col1, y + 26);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(23, 23, 23);
  doc.text(extraDetails?.department || '—', col1 + 22, y + 26);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('UPI Ref ID:', col2, y + 26);
  doc.setFont('courier', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(extraDetails?.paymentId || 'Submitted', col2 + 18, y + 26);

  y += 40;

  // ─── 6. Events & Team Breakdown ───
  const eventBoxWidth = (contentWidth - 14) / 2;

  // Technical Event Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 106, 0);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin + 5, y, eventBoxWidth, 38, 2, 2, 'FD');

  doc.setFillColor(255, 247, 237);
  doc.roundedRect(margin + 5, y, eventBoxWidth, 7, 2, 2, 'F');
  doc.setTextColor(194, 65, 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('TECHNICAL EVENT', margin + 8, y + 5);

  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(result.techEvent || 'None Selected', margin + 8, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  if (result.techEvent === 'PaperQuest' || result.techEvent === 'PAPERQUEST') {
    doc.text('Team (4 Members):', margin + 8, y + 18);
    const mList = extraDetails?.techMembers && extraDetails.techMembers.length > 0
      ? extraDetails.techMembers
      : [result.fullName, 'Member 2', 'Member 3', 'Member 4'];
    mList.slice(0, 4).forEach((m, idx) => {
      doc.text(`${idx + 1}. ${m}`, margin + 11, y + 22 + idx * 3.8);
    });
  } else if (result.techEvent) {
    doc.text('Solo Participant (1 Member):', margin + 8, y + 18);
    doc.text(`1. ${result.fullName}`, margin + 11, y + 23);
  } else {
    doc.text('No Technical Event Registered', margin + 8, y + 19);
  }

  // Non-Technical Event Card
  const nonTechX = margin + 5 + eventBoxWidth + 4;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(208, 18, 87);
  doc.setLineWidth(0.35);
  doc.roundedRect(nonTechX, y, eventBoxWidth, 38, 2, 2, 'FD');

  doc.setFillColor(253, 242, 248);
  doc.roundedRect(nonTechX, y, eventBoxWidth, 7, 2, 2, 'F');
  doc.setTextColor(190, 24, 93);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('NON-TECHNICAL EVENT', nonTechX + 3, y + 5);

  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(result.nonTechEvent || 'None Selected', nonTechX + 3, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  if (result.nonTechEvent === 'Mine Relay' || result.nonTechEvent === 'MINE RELAY') {
    doc.text('Team (4 Members):', nonTechX + 3, y + 18);
    const mList = extraDetails?.nonTechMembers && extraDetails.nonTechMembers.length > 0
      ? extraDetails.nonTechMembers
      : [result.fullName, 'Member 2', 'Member 3', 'Member 4'];
    mList.slice(0, 4).forEach((m, idx) => {
      doc.text(`${idx + 1}. ${m}`, nonTechX + 6, y + 22 + idx * 3.8);
    });
  } else if (result.nonTechEvent) {
    doc.text('Solo Participant (1 Member):', nonTechX + 3, y + 18);
    doc.text(`1. ${result.fullName}`, nonTechX + 6, y + 23);
  } else {
    doc.text('No Non-Technical Event Registered', nonTechX + 3, y + 19);
  }

  y += 42;

  // ─── 7. Fee & QR Verification Section ───
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 5, y, contentWidth - 10, 36, 2, 2, 'FD');

  // Embed QR Code
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', margin + 8, y + 3, 30, 30);
  }

  // QR info text
  const feeInfoX = margin + 42;
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PAYMENT SUMMARY & VERIFICATION', feeInfoX, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Unique Participants:', feeInfoX, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(`${result.totalMembers} Member${result.totalMembers > 1 ? 's' : ''}`, feeInfoX + 45, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Fee Per Participant:', feeInfoX, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(`₹${result.feePerHead || 129}`, feeInfoX + 45, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Total Amount Recorded:', feeInfoX, y + 24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // Emerald
  doc.setFontSize(11);
  doc.text(`₹${result.totalAmount}`, feeInfoX + 45, y + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(140, 140, 140);
  doc.text('Scan this QR code at the desk for fast-track badge issuance.', feeInfoX, y + 31);

  y += 40;

  // ─── 8. Event Schedule, Reporting & Venue Details ───
  doc.setFillColor(23, 23, 23);
  doc.roundedRect(margin + 5, y, contentWidth - 10, 24, 2, 2, 'F');

  // 3 Grid columns inside black bar
  const third = (contentWidth - 10) / 3;

  // Date
  doc.setTextColor(255, 184, 0); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('DATE OF EVENT', margin + 5 + third * 0.5, y + 6, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('14 OCTOBER 2026', margin + 5 + third * 0.5, y + 12, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(7);
  doc.text('Wednesday', margin + 5 + third * 0.5, y + 17, { align: 'center' });

  // Reporting Time
  doc.setTextColor(255, 184, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('REPORTING TIME', margin + 5 + third * 1.5, y + 6, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('09:00 AM IST', margin + 5 + third * 1.5, y + 12, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(7);
  doc.text('Welcome Desk Registration', margin + 5 + third * 1.5, y + 17, { align: 'center' });

  // Venue
  doc.setTextColor(255, 184, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('VENUE LOCATION', margin + 5 + third * 2.5, y + 6, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('Adhiparasakthi Eng. College', margin + 5 + third * 2.5, y + 11.5, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(6.5);
  doc.text('Melmaruvathur - 603319', margin + 5 + third * 2.5, y + 16.5, { align: 'center' });

  y += 27;

  // ─── 9. Guidelines & Instructions ───
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('IMPORTANT PARTICIPANT INSTRUCTIONS:', margin + 6, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(80, 80, 80);
  doc.text('1. Please show this digital or printed pass along with your valid College ID card at the entry gate.', margin + 6, y + 4);
  doc.text('2. Symposium kit, refreshment, and participation lunch are provided for all registered participants.', margin + 6, y + 7.5);
  doc.text('3. Official Certificates of Participation and Winner Trophies will be awarded at the Valedictory Ceremony.', margin + 6, y + 11);
  doc.text('4. For queries or urgent assistance, reach out to Student / Staff Coordinators or our WhatsApp support.', margin + 6, y + 14.5);

  // ─── 10. Footer Security Stamp & Disclaimer ───
  const footerY = pageHeight - margin - 5;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin + 5, footerY - 4, pageWidth - margin - 5, footerY - 4);

  doc.setTextColor(140, 140, 140);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text(
    'PIXEL-3.O Master System · Automated Verified Pass · Department of CSE, Adhiparasakthi Engineering College',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // ─── Download Document ───
  const filename = `${result.registrationId || 'PIXEL-3.O'}_Pass.pdf`;
  doc.save(filename);
}

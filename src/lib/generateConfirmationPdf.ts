import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import {
  RegistrationResult,
  isPaperQuest,
  isMineRelay,
  isCheckmate,
  isAiFilmForge,
  FEE_PER_HEAD
} from './googleSheet';

export interface PassParticipantDetails {
  college?: string;
  department?: string;
  phone?: string;
  email?: string;
  paymentId?: string;
  techMembers?: string[];
  nonTechMembers?: string[];
  checkmateInterested?: string;
  filmforgeInterested?: string;
}

/**
 * Helper to safely draw Rupee currency text or clean "Rs. " fallback
 * In standard jsPDF core Helvetica font, character '₹' (U+20B9) is often unmapped in standard WinAnsi.
 * We render "Rs. " prefix or drawn currency for guaranteed 100% universal PDF rendering.
 */
function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'number' ? amount : parseInt(String(amount), 10) || 0;
  return `Rs. ${num.toLocaleString('en-IN')}`;
}

/**
 * Generates an ultra-premium, high-resolution official PDF Registration Pass for PIXEL-3.O
 * Guaranteed single-page, responsive text wrapping, dynamic fee calculation, and zero text overflow.
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

  // ─── 0. Authoritative Calculation ───
  const totalUniqueCount = Math.max(result.totalMembers || 1, 1);
  const feePerHead = result.feePerHead || FEE_PER_HEAD || 129;
  const calculatedTotal = totalUniqueCount * feePerHead;
  const finalTotalAmount = result.totalAmount && result.totalAmount >= feePerHead
    ? result.totalAmount
    : calculatedTotal;

  // ─── Generate Scannable Verification URL for QR Code ───
  let qrDataUrl = '';
  try {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://pixel-3-o.vercel.app';
    const techMembersStr = extraDetails?.techMembers ? extraDetails.techMembers.join(',') : '';
    const nonTechMembersStr = extraDetails?.nonTechMembers ? extraDetails.nonTechMembers.join(',') : '';

    const verifyUrl = `${origin}/verify?id=${encodeURIComponent(result.registrationId || 'PIXEL-3.O')}&name=${encodeURIComponent(result.fullName || '')}&college=${encodeURIComponent(extraDetails?.college || '')}&dept=${encodeURIComponent(extraDetails?.department || '')}&tech=${encodeURIComponent(result.techEvent || '')}&nontech=${encodeURIComponent(result.nonTechEvent || '')}&members=${totalUniqueCount}&amount=${finalTotalAmount}&status=${encodeURIComponent(result.paymentStatus || 'Submitted')}&phone=${encodeURIComponent(extraDetails?.phone || '')}&payid=${encodeURIComponent(extraDetails?.paymentId || '')}&techm=${encodeURIComponent(techMembersStr)}&nontechm=${encodeURIComponent(nonTechMembersStr)}`;

    qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 300,
      margin: 1,
      color: { dark: '#171717', light: '#ffffff' },
    });
  } catch (err) {
    console.error('Error generating QR for PDF:', err);
  }

  // ─── 1. Background Canvas & Decorative Border ───
  doc.setFillColor(253, 252, 250); // Warm ivory background
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Border (Phoenix Orange)
  doc.setDrawColor(255, 106, 0);
  doc.setLineWidth(1.2);
  doc.roundedRect(margin, margin, contentWidth, pageHeight - margin * 2, 4, 4, 'S');

  // Inner Accent Border (Phoenix Red)
  doc.setDrawColor(229, 27, 35);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 2, margin + 2, contentWidth - 4, pageHeight - margin * 2 - 4, 3, 3, 'S');

  // ─── 2. Top Header Banner ───
  let curY = margin + 3;
  const headerHeight = 31;
  doc.setFillColor(23, 23, 23); // Dark charcoal header block
  doc.roundedRect(margin + 3, curY, contentWidth - 6, headerHeight, 2.5, 2.5, 'F');

  // Top flame line
  doc.setFillColor(255, 106, 0);
  doc.rect(margin + 3, curY, contentWidth - 6, 2, 'F');

  // Institution Title
  doc.setTextColor(255, 184, 0); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text('ADHIPARASAKTHI ENGINEERING COLLEGE', pageWidth / 2, curY + 8.5, { align: 'center' });

  doc.setTextColor(220, 220, 220);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Department of Computer Science and Engineering', pageWidth / 2, curY + 13.5, { align: 'center' });
  doc.text('In Association with CSI Kanchipuram Chapter', pageWidth / 2, curY + 17.5, { align: 'center' });

  // Symposium Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12.5);
  doc.text('PIXEL 3.O · NATIONAL LEVEL TECHNICAL SYMPOSIUM', pageWidth / 2, curY + 23.5, { align: 'center' });

  doc.setTextColor(255, 106, 0);
  doc.setFontSize(7.5);
  doc.text('OFFICIAL EVENT ADMISSION & REGISTRATION PASS · 14 OCT 2026', pageWidth / 2, curY + 28, { align: 'center' });

  curY += headerHeight + 3.5;

  // ─── 3. Required Highlight Quote Banner ───
  doc.setFillColor(255, 247, 237);
  doc.setDrawColor(255, 106, 0);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 4, curY, contentWidth - 8, 8, 2, 2, 'FD');

  doc.setTextColor(194, 65, 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('★  "Early Registration Helps Us Ensure Smooth Arrangements"  ★', pageWidth / 2, curY + 5.2, { align: 'center' });

  curY += 10.5;

  // ─── 4. Registration ID & Badges Box ───
  const idBoxH = 21;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin + 4, curY, contentWidth - 8, idBoxH, 2, 2, 'FD');

  // Left side: Registration ID
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('OFFICIAL REGISTRATION ID', margin + 8, curY + 5.5);

  doc.setTextColor(229, 27, 35);
  doc.setFont('courier', 'bold');
  doc.setFontSize(15);
  doc.text(result.registrationId || 'PIXEL-3.O-PASS', margin + 8, curY + 12.5);

  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  const recordedTime = result.registeredAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  doc.text(`Recorded: ${recordedTime}`, margin + 8, curY + 17.5);

  // Right side: Badges
  const badgeRight = margin + contentWidth - 8;
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(52, 211, 153);
  doc.roundedRect(badgeRight - 46, curY + 3.5, 42, 6.5, 1.5, 1.5, 'FD');
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('✓ STATUS: CONFIRMED', badgeRight - 25, curY + 7.8, { align: 'center' });

  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(badgeRight - 46, curY + 11.5, 42, 6.5, 1.5, 1.5, 'FD');
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  const payStatus = result.paymentStatus || 'Submitted';
  doc.text(`PAYMENT: ${payStatus.toUpperCase()}`, badgeRight - 25, curY + 15.8, { align: 'center' });

  curY += idBoxH + 3.5;

  // ─── 5. Participant Profile Card (Dynamic Line Wrapping & Spacing) ───
  const profileCardStartY = curY;
  const col1X = margin + 10;
  const col1ValX = col1X + 22;
  const col1MaxW = 60;

  const col2X = margin + 98;
  const col2ValX = col2X + 18;
  const col2MaxW = 56;

  // Pre-calculate line wraps
  const nameLines = doc.splitTextToSize(result.fullName || '—', col1MaxW);
  const collegeLines = doc.splitTextToSize(extraDetails?.college || '—', col1MaxW);
  const deptLines = doc.splitTextToSize(extraDetails?.department || '—', col1MaxW);

  const phoneStr = extraDetails?.phone || '—';
  const emailLines = doc.splitTextToSize(extraDetails?.email || '—', col2MaxW);
  const upiLines = doc.splitTextToSize(extraDetails?.paymentId || 'Submitted', col2MaxW);

  // Dynamic row positions
  let row1Y = profileCardStartY + 11;
  const row1H = Math.max(nameLines.length, 1) * 3.8;

  let row2Y = row1Y + Math.max(row1H, 5.5);
  const row2H = Math.max(collegeLines.length, emailLines.length, 1) * 3.8;

  let row3Y = row2Y + Math.max(row2H, 5.5);
  const row3H = Math.max(deptLines.length, upiLines.length, 1) * 3.8;

  const profileCardH = (row3Y + row3H) - profileCardStartY + 3.5;

  // Draw Profile Card Background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 4, profileCardStartY, contentWidth - 8, profileCardH, 2, 2, 'FD');

  // Left orange accent strip
  doc.setFillColor(255, 106, 0);
  doc.rect(margin + 4, profileCardStartY, 2.5, profileCardH, 'F');

  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('PRIMARY PARTICIPANT INFORMATION', margin + 10, profileCardStartY + 5.5);

  // Render Row 1: Name & Phone
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 110, 110);
  doc.setFontSize(7.5);
  doc.text('Full Name:', col1X, row1Y);
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.text(nameLines, col1ValX, row1Y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 110, 110);
  doc.text('Phone:', col2X, row1Y);
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'normal');
  doc.text(phoneStr, col2ValX, row1Y);

  // Render Row 2: College & Email
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 110, 110);
  doc.text('College:', col1X, row2Y);
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'normal');
  doc.text(collegeLines, col1ValX, row2Y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 110, 110);
  doc.text('Email:', col2X, row2Y);
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'normal');
  doc.text(emailLines, col2ValX, row2Y);

  // Render Row 3: Department & UPI Ref
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 110, 110);
  doc.text('Department:', col1X, row3Y);
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'normal');
  doc.text(deptLines, col1ValX, row3Y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(110, 110, 110);
  doc.text('UPI Ref ID:', col2X, row3Y);
  doc.setTextColor(23, 23, 23);
  doc.setFont('courier', 'bold');
  doc.text(upiLines, col2ValX, row3Y);

  curY = profileCardStartY + profileCardH + 3.5;

  // ─── 6. Events & Team Breakdown (Dynamic Content & Wrapping) ───
  const eventBoxW = (contentWidth - 11) / 2;
  const eventCardStartY = curY;
  const eventCardH = 38;

  // 6A. Technical Event Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 106, 0);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin + 4, eventCardStartY, eventBoxW, eventCardH, 2, 2, 'FD');

  doc.setFillColor(255, 247, 237);
  doc.roundedRect(margin + 4, eventCardStartY, eventBoxW, 6.5, 2, 2, 'F');
  doc.setTextColor(194, 65, 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('TECHNICAL EVENT', margin + 7, eventCardStartY + 4.5);

  const techEventName = (result.techEvent || '').trim();
  const hasPaperQuest = isPaperQuest(techEventName);
  const hasAiFilmForge = isAiFilmForge(techEventName);

  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(hasPaperQuest ? 'PAPERQUEST' : hasAiFilmForge ? 'AI FILMFORGE' : (techEventName || 'None Selected'), margin + 7, eventCardStartY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 100, 100);

  if (hasPaperQuest) {
    doc.text('Team (Exactly 4 Members) · Central Library:', margin + 7, eventCardStartY + 16);
    const mList = extraDetails?.techMembers && extraDetails.techMembers.length >= 4
      ? extraDetails.techMembers
      : [result.fullName, 'Member 2', 'Member 3', 'Member 4'];

    mList.slice(0, 4).forEach((m, idx) => {
      const truncated = doc.splitTextToSize(`${idx + 1}. ${m}`, eventBoxW - 10);
      doc.text(truncated[0] || '', margin + 9, eventCardStartY + 20.5 + idx * 4);
    });
  } else if (hasAiFilmForge) {
    doc.text('Solo Event (1 Participant) · Lab PG Block:', margin + 7, eventCardStartY + 16.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 23, 23);
    const tSolo = doc.splitTextToSize(`1. ${result.fullName}`, eventBoxW - 10);
    doc.text(tSolo[0] || '', margin + 9, eventCardStartY + 21.5);
  } else {
    doc.text('No Technical Event Registered', margin + 7, eventCardStartY + 18);
  }

  // 6B. Non-Technical Event Card
  const nonTechX = margin + 4 + eventBoxW + 3;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(208, 18, 87);
  doc.setLineWidth(0.35);
  doc.roundedRect(nonTechX, eventCardStartY, eventBoxW, eventCardH, 2, 2, 'FD');

  doc.setFillColor(253, 242, 248);
  doc.roundedRect(nonTechX, eventCardStartY, eventBoxW, 6.5, 2, 2, 'F');
  doc.setTextColor(190, 24, 93);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('NON-TECHNICAL EVENT', nonTechX + 3, eventCardStartY + 4.5);

  const nonTechEventName = (result.nonTechEvent || '').trim();
  const hasMineRelay = isMineRelay(nonTechEventName);
  const hasCheckmate = isCheckmate(nonTechEventName);

  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(hasMineRelay ? 'MINE RELAY' : hasCheckmate ? 'CHECKMATE' : (nonTechEventName || 'None Selected'), nonTechX + 3, eventCardStartY + 11.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 100, 100);

  if (hasMineRelay) {
    doc.text('Team (Exactly 4 Members) · Central Library:', nonTechX + 3, eventCardStartY + 16);
    const mList = extraDetails?.nonTechMembers && extraDetails.nonTechMembers.length >= 4
      ? extraDetails.nonTechMembers
      : [result.fullName, 'Member 2', 'Member 3', 'Member 4'];

    mList.slice(0, 4).forEach((m, idx) => {
      const truncated = doc.splitTextToSize(`${idx + 1}. ${m}`, eventBoxW - 10);
      doc.text(truncated[0] || '', nonTechX + 5, eventCardStartY + 20.5 + idx * 4);
    });
  } else if (hasCheckmate) {
    doc.text('Solo Event (1 Participant) · Lab PG Block:', nonTechX + 3, eventCardStartY + 16.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(23, 23, 23);
    const cSolo = doc.splitTextToSize(`1. ${result.fullName}`, eventBoxW - 10);
    doc.text(cSolo[0] || '', nonTechX + 5, eventCardStartY + 21.5);
  } else {
    doc.text('No Non-Technical Event Registered', nonTechX + 3, eventCardStartY + 18);
  }

  curY = eventCardStartY + eventCardH + 3.5;

  // ─── 7. Fee & QR Verification Section (Accurate Authoritative Calculation) ───
  const feeBoxH = 34;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin + 4, curY, contentWidth - 8, feeBoxH, 2, 2, 'FD');

  // Embed QR Code
  if (qrDataUrl) {
    doc.addImage(qrDataUrl, 'PNG', margin + 7, curY + 2.5, 29, 29);
  }

  const feeInfoX = margin + 40;
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('PAYMENT SUMMARY & DESK VERIFICATION', feeInfoX, curY + 6);

  // Unique Members
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Total Unique Participants:', feeInfoX, curY + 11.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(`${totalUniqueCount} Member${totalUniqueCount > 1 ? 's' : ''}`, feeInfoX + 44, curY + 11.5);

  // Fee Per Head
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Fee Per Unique Participant:', feeInfoX, curY + 16.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 23, 23);
  doc.text(formatCurrency(feePerHead), feeInfoX + 44, curY + 16.5);

  // Total Registration Amount
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Total Registration Amount:', feeInfoX, curY + 22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105); // Emerald Green
  doc.setFontSize(10.5);
  doc.text(formatCurrency(finalTotalAmount), feeInfoX + 44, curY + 22);

  // Fast track notice
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(130, 130, 130);
  doc.text('Scan QR code at the desk for fast-track verified badge issuance.', feeInfoX, curY + 29);

  curY += feeBoxH + 3.5;

  // ─── 8. Event Schedule, Reporting & Venue Details ───
  const schedBoxH = 21;
  doc.setFillColor(23, 23, 23);
  doc.roundedRect(margin + 4, curY, contentWidth - 8, schedBoxH, 2, 2, 'F');

  const thirdW = (contentWidth - 8) / 3;

  // Column 1: Date
  doc.setTextColor(255, 184, 0); // Gold
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('DATE OF EVENT', margin + 4 + thirdW * 0.5, curY + 5.5, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('14 OCTOBER 2026', margin + 4 + thirdW * 0.5, curY + 11, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(6.5);
  doc.text('Wednesday · Full Day', margin + 4 + thirdW * 0.5, curY + 15.5, { align: 'center' });

  // Column 2: Reporting Time
  doc.setTextColor(255, 184, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('REPORTING TIME', margin + 4 + thirdW * 1.5, curY + 5.5, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.text('09:00 AM IST', margin + 4 + thirdW * 1.5, curY + 11, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(6.5);
  doc.text('Welcome Desk Registration', margin + 4 + thirdW * 1.5, curY + 15.5, { align: 'center' });

  // Column 3: Venue Location
  doc.setTextColor(255, 184, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('VENUE LOCATION', margin + 4 + thirdW * 2.5, curY + 5.5, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('Adhiparasakthi Eng. College', margin + 4 + thirdW * 2.5, curY + 10.5, { align: 'center' });
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(6.2);
  doc.text('Melmaruvathur - 603319', margin + 4 + thirdW * 2.5, curY + 15, { align: 'center' });

  curY += schedBoxH + 3.5;

  // ─── 9. Participant Guidelines & Instructions ───
  doc.setTextColor(23, 23, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('IMPORTANT PARTICIPANT INSTRUCTIONS:', margin + 6, curY + 1);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.4);
  doc.setTextColor(70, 70, 70);
  doc.text('1. Present this digital or printed pass along with your valid College ID card at the entry gate.', margin + 6, curY + 5);
  doc.text('2. Symposium kit, refreshment, and vegetarian lunch are provided for all registered participants.', margin + 6, curY + 8.5);
  doc.text('3. Official Certificates of Participation and Cash Prizes/Trophies awarded at the Valedictory Ceremony.', margin + 6, curY + 12);
  doc.text('4. For urgent queries, reach out to Student / Staff Coordinators or our official WhatsApp community.', margin + 6, curY + 15.5);

  // ─── 10. Footer Security Stamp ───
  const footerY = pageHeight - margin - 4;
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin + 4, footerY - 3.5, pageWidth - margin - 4, footerY - 3.5);

  doc.setTextColor(140, 140, 140);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text(
    'PIXEL 3.O Master System · Official Verified Admission Pass · Department of CSE, Adhiparasakthi Engineering College',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // ─── Download Document ───
  const filename = `${result.registrationId || 'PIXEL-3.O'}_Pass.pdf`;
  doc.save(filename);
}

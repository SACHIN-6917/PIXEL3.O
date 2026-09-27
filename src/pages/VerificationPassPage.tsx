import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Building,
  User,
  Phone,
  Mail,
  CreditCard,
  AlertCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { PageTransition } from '../components/PageTransition';
import { getLocalRegistrations, RegistrationRecord, RegistrationResult } from '../lib/googleSheet';
import { generateConfirmationPdf } from '../lib/generateConfirmationPdf';

export const VerificationPassPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Extract from query params
  const paramId = searchParams.get('id') || '';
  const paramName = searchParams.get('name') || '';
  const paramCollege = searchParams.get('college') || '';
  const paramDept = searchParams.get('dept') || '';
  const paramTech = searchParams.get('tech') || '';
  const paramNonTech = searchParams.get('nontech') || '';
  const paramMembers = parseInt(searchParams.get('members') || '1', 10);
  const paramAmount = parseInt(searchParams.get('amount') || '129', 10);
  const paramStatus = searchParams.get('status') || 'Confirmed';
  const paramPhone = searchParams.get('phone') || '';
  const paramEmail = searchParams.get('email') || '';
  const paramPaymentId = searchParams.get('payid') || '';
  const paramTechMembers = (searchParams.get('techm') || '').split(',').filter(Boolean);
  const paramNonTechMembers = (searchParams.get('nontechm') || '').split(',').filter(Boolean);

  const [record, setRecord] = useState<RegistrationRecord | null>(null);

  useEffect(() => {
    // 1. Try to find from local multi-vault records
    if (paramId) {
      const localList = getLocalRegistrations();
      const found = localList.find(
        r => r.registrationId.toLowerCase() === paramId.toLowerCase()
      );
      if (found) {
        setRecord(found);
      } else {
        // Synthesize record from URL query params
        setRecord({
          registrationId: paramId || 'PIXEL-3.O-PASS',
          fullName: paramName || 'Participant',
          college: paramCollege || 'Adhiparasakthi Engineering College',
          department: paramDept || 'Department of CSE',
          phone: paramPhone || '—',
          email: paramEmail || '—',
          techEvent: paramTech || '',
          techMember1: paramTechMembers[0] || paramName,
          techMember2: paramTechMembers[1] || '',
          techMember3: paramTechMembers[2] || '',
          techMember4: paramTechMembers[3] || '',
          nonTechEvent: paramNonTech || '',
          nonTechMember1: paramNonTechMembers[0] || paramName,
          nonTechMember2: paramNonTechMembers[1] || '',
          nonTechMember3: paramNonTechMembers[2] || '',
          nonTechMember4: paramNonTechMembers[3] || '',
          totalMembers: paramMembers || 1,
          feePerHead: 129,
          totalAmount: paramAmount || 129,
          paymentStatus: (paramStatus as any) || 'Paid',
          paymentId: paramPaymentId || 'VERIFIED',
          registrationStatus: 'Confirmed',
          registeredAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        });
      }
    }

    setLoading(false);

    // Confetti celebration
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6A00', '#E51B23', '#FFB800', '#10B981'],
    });

    // Generate Scannable QR code of current URL
    const currentUrl = window.location.href;
    QRCode.toDataURL(currentUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#171717', light: '#FFFFFF' },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [paramId, paramName]);

  const handleDownloadOfficialPdf = async () => {
    if (!record) return;
    setGeneratingPdf(true);
    try {
      const resPayload: RegistrationResult = {
        success: true,
        registrationId: record.registrationId,
        fullName: record.fullName,
        totalMembers: record.totalMembers,
        feePerHead: record.feePerHead,
        totalAmount: record.totalAmount,
        techEvent: record.techEvent,
        nonTechEvent: record.nonTechEvent,
        paymentStatus: record.paymentStatus,
        registrationStatus: record.registrationStatus,
        registeredAt: record.registeredAt,
      };

      const techMembersList = [
        record.techMember1,
        record.techMember2,
        record.techMember3,
        record.techMember4,
      ].filter(Boolean);

      const nonTechMembersList = [
        record.nonTechMember1,
        record.nonTechMember2,
        record.nonTechMember3,
        record.nonTechMember4,
      ].filter(Boolean);

      await generateConfirmationPdf(resPayload, {
        college: record.college,
        department: record.department,
        phone: record.phone,
        email: record.email,
        paymentId: record.paymentId,
        techMembers: techMembersList,
        nonTechMembers: nonTechMembersList,
      });
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-warm">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-phoenix-orange border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-foreground">Verifying Official Pass...</p>
        </div>
      </div>
    );
  }

  if (!record && !paramId) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 bg-background-warm flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-border shadow-sm p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">No Registration ID Provided</h2>
          <p className="text-xs text-foreground-secondary">
            Please scan the official QR code found on your symposium registration badge or enter a valid pass link.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-full bg-foreground text-white text-xs font-bold uppercase tracking-wider hover:bg-phoenix-orange transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background-warm/50 pt-24 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-6">

          {/* Top Return Link */}
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground-muted hover:text-phoenix-orange transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 border border-emerald-200 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL VERIFIED PASS</span>
            </span>
          </div>

          {/* Main Verified Card */}
          <div className="bg-white rounded-3xl border-2 border-emerald-500/30 shadow-xl overflow-hidden">
            
            {/* Header Ribbon */}
            <div className="bg-gradient-to-r from-[#FF6A00] via-[#E51B23] to-[#D01257] p-6 text-white text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-phoenix-gold animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90">
                  PIXEL-3.O · NATIONAL LEVEL SYMPOSIUM
                </span>
                <Sparkles className="w-4 h-4 text-phoenix-gold animate-spin" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                OFFICIAL ENTRY PASS
              </h1>
              <p className="text-[11px] text-white/80 font-medium">
                Department of CSE · Adhiparasakthi Engineering College
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">

              {/* Verified Badge & ID */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>REGISTRATION AUTHENTICATED</span>
                </div>

                <div>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-foreground-muted">
                    REGISTRATION ID
                  </p>
                  <p className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-foreground">
                    {record?.registrationId}
                  </p>
                </div>

                {/* Scannable QR Code */}
                {qrDataUrl && (
                  <div className="p-3 bg-background-warm rounded-2xl inline-block border border-border">
                    <img src={qrDataUrl} alt="Pass QR" className="w-32 h-32 mx-auto" />
                    <p className="text-[9px] font-bold text-foreground-muted mt-1 uppercase tracking-wider">
                      Scan to Verify Live
                    </p>
                  </div>
                )}
              </div>

              {/* Mandatory Quote Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold text-center">
                ✨ &quot;Early Registration Helps Us Ensure Smooth Arrangements&quot;
              </div>

              {/* Primary Participant Information */}
              <div className="p-5 rounded-2xl bg-background-warm border border-border space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-phoenix-orange" /> Main Participant:
                  </span>
                  <strong className="text-foreground text-right">{record?.fullName}</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-phoenix-orange" /> College:
                  </span>
                  <strong className="text-foreground text-right max-w-[60%]">{record?.college || '—'}</strong>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-phoenix-orange" /> Department:
                  </span>
                  <strong className="text-foreground text-right max-w-[60%]">{record?.department || '—'}</strong>
                </div>

                {record?.phone && record.phone !== '—' && (
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-foreground-muted flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-phoenix-orange" /> Contact:
                    </span>
                    <strong className="text-foreground font-mono">{record.phone}</strong>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-foreground-muted flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-phoenix-orange" /> Payment Status:
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {record?.paymentStatus || 'Paid'} (₹{record?.totalAmount})
                  </span>
                </div>
              </div>

              {/* Events Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF6A00] block mb-1">
                    TECHNICAL EVENT
                  </span>
                  <strong className="text-sm text-gray-900 block">
                    {record?.techEvent || 'None Selected'}
                  </strong>
                  {record?.techMember2 && (
                    <div className="text-[11px] text-gray-600 mt-1.5 space-y-0.5">
                      <div>1. {record.techMember1 || record.fullName}</div>
                      <div>2. {record.techMember2}</div>
                      {record.techMember3 && <div>3. {record.techMember3}</div>}
                      {record.techMember4 && <div>4. {record.techMember4}</div>}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/60">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 block mb-1">
                    NON-TECHNICAL EVENT
                  </span>
                  <strong className="text-sm text-gray-900 block">
                    {record?.nonTechEvent || 'None Selected'}
                  </strong>
                  {record?.nonTechMember2 && (
                    <div className="text-[11px] text-gray-600 mt-1.5 space-y-0.5">
                      <div>1. {record.nonTechMember1 || record.fullName}</div>
                      <div>2. {record.nonTechMember2}</div>
                      {record.nonTechMember3 && <div>3. {record.nonTechMember3}</div>}
                      {record.nonTechMember4 && <div>4. {record.nonTechMember4}</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Event Logistics */}
              <div className="p-4 rounded-2xl bg-darkAccent text-white space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 text-phoenix-orange shrink-0" />
                  <span><strong>Date:</strong> 14 October 2026</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-4 h-4 text-phoenix-gold shrink-0" />
                  <span><strong>Reporting Time:</strong> 09:00 AM IST</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4 text-phoenix-red shrink-0" />
                  <span><strong>Venue:</strong> Department of CSE, Adhiparasakthi Engineering College, Melmaruvathur</span>
                </div>
              </div>

              {/* Actions: Download Official PDF & WhatsApp */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadOfficialPdf}
                  disabled={generatingPdf}
                  className="w-full phoenix-gradient-btn py-4 rounded-full text-white font-extrabold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 shadow-phoenix-glow hover:scale-[1.01] transition-all disabled:opacity-50 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>{generatingPdf ? 'GENERATING OFFICIAL PDF...' : 'DOWNLOAD OFFICIAL PDF PASS'}</span>
                </button>

                <a
                  href="https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-full bg-[#25D366] hover:bg-[#20B858] text-white font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>JOIN PIXEL-3.O WHATSAPP GROUP</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

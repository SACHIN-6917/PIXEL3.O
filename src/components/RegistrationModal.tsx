import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Download,
  MessageCircle,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  Mail,
  Phone,
  GraduationCap
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  CONFIRMED_EVENTS,
  EVENT_DATE_STRING,
  REPORTING_TIME,
  VENUE_COLLEGE,
  WHATSAPP_GROUP_LINK
} from '../data/pixeloData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedEventId?: string;
  isClosed: boolean;
}

interface ParticipantData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  selectedEvents: string[]; // only from the 4 confirmed events
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  preSelectedEventId,
  isClosed,
}) => {
  const [formData, setFormData] = useState<ParticipantData>({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    selectedEvents: preSelectedEventId ? [preSelectedEventId] : ['paperquest'],
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [copiedId, setCopiedId] = useState(false);

  // Sync preSelectedEventId
  useEffect(() => {
    if (preSelectedEventId) {
      setFormData((prev) => ({
        ...prev,
        selectedEvents: [preSelectedEventId],
      }));
    }
  }, [preSelectedEventId]);

  if (!isOpen) return null;

  const toggleEventSelection = (eventId: string) => {
    setFormData((prev) => {
      const exists = prev.selectedEvents.includes(eventId);
      if (exists) {
        if (prev.selectedEvents.length === 1) return prev; // At least one event required
        return {
          ...prev,
          selectedEvents: prev.selectedEvents.filter((id) => id !== eventId),
        };
      } else {
        return {
          ...prev,
          selectedEvents: [...prev.selectedEvents, eventId],
        };
      }
    });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      errors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10)
      errors.phone = '10-digit mobile number is required';
    if (!formData.college.trim()) errors.college = 'College/University name is required';
    if (formData.selectedEvents.length === 0)
      errors.selectedEvents = 'Select at least one event';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isClosed) return;
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate backend sequence & unique ID generation
    setTimeout(async () => {
      // Get increment counter from localStorage
      const currentCounter = parseInt(localStorage.getItem('pixelo_reg_counter') || '104', 10) + 1;
      localStorage.setItem('pixelo_reg_counter', currentCounter.toString());
      const newId = `PX3O-2026-${String(currentCounter).padStart(4, '0')}`;

      // Save participant to localStorage (acts as resilient client store)
      const participantRecord = {
        id: newId,
        ...formData,
        registeredAt: new Date().toISOString(),
      };
      const existingList = JSON.parse(localStorage.getItem('pixelo_registrations') || '[]');
      existingList.push(participantRecord);
      localStorage.setItem('pixelo_registrations', JSON.stringify(existingList));

      // Generate QR Code
      try {
        const qr = await QRCode.toDataURL(
          JSON.stringify({
            id: newId,
            name: formData.fullName,
            college: formData.college,
            events: formData.selectedEvents,
            symposium: 'PIXEL-3.O',
            date: '14-OCT-2026'
          }),
          { width: 200, margin: 1, color: { dark: '#171717', light: '#FFFFFF' } }
        );
        setQrCodeDataUrl(qr);
      } catch (err) {
        console.error('QR generation error', err);
      }

      setRegistrationId(newId);
      setIsSubmitting(false);
      setRegistrationSuccess(true);

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6A00', '#E51B23', '#FFC21A', '#E0008A', '#6A00FF'],
      });
    }, 800);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(registrationId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-darkAccent/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-border relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-background-secondary text-foreground-secondary hover:text-darkAccent transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isClosed ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-phoenix-red/10 text-phoenix-red flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Registration Closed
            </h3>
            <p className="text-sm text-foreground-secondary max-w-md mx-auto">
              The deadline for PIXEL-3.O (13 October 2026, 10:00 PM) has ended. On-spot registrations may be subject to availability at the registration desk on 14 October 2026.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-darkAccent text-white text-xs font-bold uppercase tracking-wider"
            >
              CLOSE
            </button>
          </div>
        ) : !registrationSuccess ? (
          /* REGISTRATION FORM */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-phoenix-orange uppercase mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OFFICIAL PARTICIPANT REGISTRATION</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                REGISTER FOR PIXEL-3.O
              </h3>
              <p className="text-xs sm:text-sm text-foreground-secondary mt-1">
                Fill in your details and select your events. Unique ID will be generated upon confirmation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Participant Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                    FULL NAME *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-foreground-muted absolute left-3 top-3.5" />
                    <input
                      type="text"
                      placeholder="e.g. Adhithya Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:border-phoenix-orange focus:outline-none focus:ring-1 focus:ring-phoenix-orange"
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11px] text-phoenix-red mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                    PHONE NUMBER *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-foreground-muted absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:border-phoenix-orange focus:outline-none focus:ring-1 focus:ring-phoenix-orange"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] text-phoenix-red mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                  EMAIL ADDRESS *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-foreground-muted absolute left-3 top-3.5" />
                  <input
                    type="email"
                    placeholder="e.g. participant@university.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:border-phoenix-orange focus:outline-none focus:ring-1 focus:ring-phoenix-orange"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-[11px] text-phoenix-red mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                  COLLEGE / INSTITUTION NAME *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-foreground-muted absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="e.g. Adhiparasakthi Engineering College"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:border-phoenix-orange focus:outline-none focus:ring-1 focus:ring-phoenix-orange"
                  />
                </div>
                {formErrors.college && (
                  <p className="text-[11px] text-phoenix-red mt-1">{formErrors.college}</p>
                )}
              </div>

              {/* Department & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                    DEPARTMENT
                  </label>
                  <div className="relative">
                    <GraduationCap className="w-4 h-4 text-foreground-muted absolute left-3 top-3.5" />
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:border-phoenix-orange focus:outline-none bg-white"
                    >
                      <option value="Computer Science and Engineering">Computer Science & Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Electrical & Electronics">Electrical & Electronics</option>
                      <option value="Mechanical / Civil / Other">Mechanical / Civil / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                    YEAR OF STUDY
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border text-sm focus:border-phoenix-orange focus:outline-none bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Postgraduate / Research">Postgraduate / Research</option>
                  </select>
                </div>
              </div>

              {/* Event Selection: STRICTLY ONLY THE 4 CONFIRMED EVENTS */}
              <div className="pt-2">
                <label className="block text-xs font-bold tracking-wider uppercase text-foreground mb-1">
                  SELECT YOUR EVENTS (CHOOSE 1 OR MORE) *
                </label>
                <p className="text-[11px] text-foreground-muted mb-3">
                  Only the 4 official symposium events are active. No other events exist.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CONFIRMED_EVENTS.map((event) => {
                    const isSelected = formData.selectedEvents.includes(event.id);

                    return (
                      <div
                        key={event.id}
                        onClick={() => toggleEventSelection(event.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                          isSelected
                            ? 'bg-background-warm border-phoenix-orange ring-1 ring-phoenix-orange/30'
                            : 'bg-white border-border hover:bg-background-secondary/50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-phoenix-orange text-white'
                              : 'border border-border bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        <div>
                          <div className="text-xs font-bold text-foreground">
                            {event.number} — {event.name}
                          </div>
                          <div className="text-[10px] text-foreground-muted font-medium">
                            {event.category} · {event.venue}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {formErrors.selectedEvents && (
                  <p className="text-[11px] text-phoenix-red mt-1">
                    {formErrors.selectedEvents}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full phoenix-gradient-btn py-3.5 rounded-full text-white text-sm font-bold tracking-wider uppercase shadow-phoenix-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>GENERATING REGISTRATION ID...</span>
                  ) : (
                    <span>CONFIRM & GET REGISTRATION ID</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* SUCCESS SCREEN (Section 28) */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
                REGISTRATION SUCCESSFUL
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                WELCOME TO PIXEL-3.O
              </h3>
              <p className="text-xs text-foreground-secondary mt-1">
                Your pass has been securely confirmed. Show your Registration ID or QR code at the check-in desk.
              </p>
            </div>

            {/* Generated Unique Registration ID Card */}
            <div className="p-6 rounded-2xl bg-background-warm border border-phoenix-orange/40 shadow-sm max-w-md mx-auto text-center relative">
              <div className="text-[11px] font-bold tracking-widest text-foreground-muted uppercase">
                YOUR UNIQUE REGISTRATION ID
              </div>

              <div className="flex items-center justify-center gap-2 my-2">
                <span className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-darkAccent">
                  {registrationId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg bg-white border border-border hover:bg-background-secondary text-foreground-secondary transition-colors"
                  title="Copy Registration ID"
                >
                  {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <div className="mt-4 flex flex-col items-center justify-center">
                  <img
                    src={qrCodeDataUrl}
                    alt="Registration QR Code"
                    className="w-32 h-32 rounded-lg bg-white p-2 border border-border shadow-inner"
                  />
                  <span className="text-[10px] text-foreground-muted mt-1 uppercase font-semibold">
                    SCAN AT ENTRANCE CHECK-IN
                  </span>
                </div>
              )}

              {/* Event Metadata Breakdown */}
              <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-2 text-left text-xs">
                <div>
                  <span className="text-foreground-muted block text-[10px] uppercase font-bold">
                    EVENT DATE
                  </span>
                  <span className="font-semibold text-foreground">{EVENT_DATE_STRING}</span>
                </div>
                <div>
                  <span className="text-foreground-muted block text-[10px] uppercase font-bold">
                    REPORTING TIME
                  </span>
                  <span className="font-semibold text-foreground">{REPORTING_TIME}</span>
                </div>
                <div className="col-span-2 pt-1">
                  <span className="text-foreground-muted block text-[10px] uppercase font-bold">
                    PARTICIPANT
                  </span>
                  <span className="font-semibold text-foreground">
                    {formData.fullName} ({formData.college})
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons: WhatsApp & Download/Print */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={WHATSAPP_GROUP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>JOIN WHATSAPP GROUP</span>
              </a>

              <button
                onClick={handlePrintConfirmation}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-darkAccent hover:bg-black text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD / PRINT CONFIRMATION</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

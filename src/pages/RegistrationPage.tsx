import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Users,
  Cpu,
  Film,
  Swords,
  Zap,
  Download,
  MessageCircle,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  isDeadlinePassed,
  calculateUniqueMembersAndFee,
  buildUpiPaymentUrl,
  submitToGoogleSheet,
  DEFAULT_UPI_ID,
  DEFAULT_UPI_NAME,
  FEE_PER_HEAD,
  TechEvent,
  NonTechEvent,
  RegistrationResult,
} from '../lib/googleSheet';
import { generateConfirmationPdf } from '../lib/generateConfirmationPdf';

// ─── Interfaces ───────────────────────────────────────────────────

interface Step1Data {
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
}

// Per-member interest for cross-event
type Interest = 'interested' | 'not_interested' | '';

interface PaperQuestMember {
  name: string;           // filled from master name fields
  checkmateInterest: Interest;
}

interface MimeRelayMember {
  name: string;
  filmforgeInterest: Interest;
}

interface FormState {
  step1: Step1Data;
  techEvent: TechEvent;
  nonTechEvent: NonTechEvent;
  // PaperQuest: exactly 4 members (member[0] = main participant auto-locked)
  paperQuestMembers: PaperQuestMember[];
  // Mime Relay: exactly 4 members (member[0] = main participant auto-locked)
  mimeRelayMembers: MimeRelayMember[];
  paymentId: string;
}

// ─── Progress Indicator ───────────────────────────────────────────
const PROGRESS_STEPS = [
  '01 PARTICIPANT',
  '02 EVENTS',
  '03 TEAM',
  '04 REVIEW',
  '05 PAYMENT',
  '06 CONFIRMED'
];

const ProgressBar: React.FC<{ current: number }> = ({ current }) => (
  <div className="mb-8">
    <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
      {PROGRESS_STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5 shrink-0 min-w-[70px] sm:min-w-[85px]">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? 'bg-phoenix-orange border-phoenix-orange text-white shadow-phoenix-subtle'
                    : active
                    ? 'bg-white border-phoenix-orange text-phoenix-orange ring-4 ring-phoenix-orange/20 font-black'
                    : 'bg-white border-border text-foreground-muted'
                }`}
              >
                {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[8px] sm:text-[9px] font-bold tracking-wider uppercase text-center ${
                  active
                    ? 'text-phoenix-orange font-black'
                    : done
                    ? 'text-phoenix-orange/70'
                    : 'text-foreground-muted'
                }`}
              >
                {label}
              </span>
            </div>
            {i < PROGRESS_STEPS.length - 1 && (
              <div
                className={`h-[2px] flex-1 min-w-[12px] sm:min-w-[20px] mb-4 transition-all duration-500 ${
                  done ? 'bg-phoenix-orange' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ─── Form Inputs ──────────────────────────────────────────────────
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode; required?: boolean }> = ({
  label,
  error,
  children,
  required
}) => (
  <div>
    <label className="block text-xs font-bold tracking-wider uppercase text-foreground-secondary mb-1.5">
      {label} {required && <span className="text-phoenix-red">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {error}</p>}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }> = ({
  hasError,
  ...props
}) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-foreground bg-background-warm/40 placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-phoenix-orange/30 transition-all ${
      hasError ? 'border-red-400 bg-red-50/20' : 'border-border focus:border-phoenix-orange'
    }`}
  />
);

const EventSelectCard: React.FC<{
  name: string;
  sub: string;
  venue: string;
  icon: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}> = ({ name, sub, venue, icon, selected, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-200 relative ${
      disabled
        ? 'opacity-40 cursor-not-allowed bg-background-secondary border-border'
        : selected
        ? 'border-phoenix-orange bg-phoenix-orange/5 shadow-phoenix-subtle ring-2 ring-phoenix-orange/20'
        : 'border-border bg-white hover:border-phoenix-orange/50'
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'bg-phoenix-orange text-white shadow-phoenix-subtle' : 'bg-background-warm text-foreground'
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">{name}</div>
          {selected && <CheckCircle2 className="w-5 h-5 text-phoenix-orange shrink-0" />}
        </div>
        <div className="text-xs text-foreground-secondary font-semibold mt-0.5">{sub}</div>
        <div className="text-[11px] text-foreground-muted mt-1 font-medium flex items-center gap-1">
          <span>Venue:</span>
          <span className="font-semibold text-foreground/80">{venue}</span>
        </div>
      </div>
    </div>
  </button>
);

const SkipOptionBtn: React.FC<{
  label: string;
  selected: boolean;
  onClick: () => void;
}> = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full py-3 px-4 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-between ${
      selected
        ? 'border-foreground-muted bg-background-secondary text-foreground'
        : 'border-dashed border-border text-foreground-muted hover:border-foreground-muted'
    }`}
  >
    <span>{label}</span>
    {selected && <span className="text-[10px] bg-foreground/10 px-2 py-0.5 rounded font-bold">Selected</span>}
  </button>
);

// ─── Interest Toggle ──────────────────────────────────────────────
const InterestToggle: React.FC<{
  eventName: string;
  value: Interest;
  onChange: (v: Interest) => void;
  color?: 'orange' | 'magenta';
}> = ({ eventName, value, onChange, color = 'orange' }) => {
  const accentClass = color === 'magenta' ? 'text-phoenix-magenta' : 'text-phoenix-orange';
  const borderActive = color === 'magenta' ? 'border-phoenix-magenta bg-phoenix-magenta/8' : 'border-phoenix-orange bg-phoenix-orange/8';
  const ringClass = color === 'magenta' ? 'ring-phoenix-magenta/30' : 'ring-phoenix-orange/30';

  return (
    <div className="mt-2.5">
      <div className={`text-[10px] font-bold tracking-wider uppercase mb-1.5 ${accentClass}`}>
        {eventName}:
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('interested')}
          className={`flex-1 py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
            value === 'interested'
              ? `${borderActive} ring-2 ${ringClass} ${accentClass}`
              : 'border-border text-foreground-muted hover:border-foreground-muted/60'
          }`}
        >
          {value === 'interested' && <CheckCircle2 className="w-3 h-3" />}
          Interested
        </button>
        <button
          type="button"
          onClick={() => onChange('not_interested')}
          className={`flex-1 py-2 px-3 rounded-lg border-2 text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 ${
            value === 'not_interested'
              ? 'border-foreground-muted bg-foreground/5 text-foreground ring-2 ring-foreground/10'
              : 'border-border text-foreground-muted hover:border-foreground-muted/60'
          }`}
        >
          {value === 'not_interested' && <span className="w-3 h-3 inline-flex items-center justify-center text-foreground-muted">✗</span>}
          Not Interested
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STEP 1 — PARTICIPANT DETAILS
// ═══════════════════════════════════════════════════════════════════
const Step1Participant: React.FC<{
  data: Step1Data;
  onChange: (d: Step1Data) => void;
  onNext: () => void;
}> = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState<Partial<Step1Data>>({});

  const validate = () => {
    const e: Partial<Step1Data> = {};
    if (!data.fullName.trim()) e.fullName = 'Full Name is required';
    if (!data.college.trim()) e.college = 'College Name is required';
    if (!data.department.trim()) e.department = 'Department is required';
    if (!/^\d{10}$/.test(data.phone.trim())) e.phone = 'Enter a valid 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = 'Enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-5">
      <div className="mb-5">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">PARTICIPANT DETAILS</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          Enter your personal contact details. You will automatically be registered as Member 1.
        </p>
      </div>

      <Field label="Full Name" error={errors.fullName} required>
        <Input
          placeholder="Enter your full name"
          value={data.fullName}
          onChange={e => onChange({ ...data, fullName: e.target.value })}
          hasError={!!errors.fullName}
        />
      </Field>

      <Field label="College Name" error={errors.college} required>
        <Input
          placeholder="Enter your college / institution name"
          value={data.college}
          onChange={e => onChange({ ...data, college: e.target.value })}
          hasError={!!errors.college}
        />
      </Field>

      <Field label="Department" error={errors.department} required>
        <Input
          placeholder="e.g. Computer Science and Engineering"
          value={data.department}
          onChange={e => onChange({ ...data, department: e.target.value })}
          hasError={!!errors.department}
        />
      </Field>

      <Field label="Phone Number" error={errors.phone} required>
        <Input
          type="tel"
          placeholder="10-digit mobile number"
          value={data.phone}
          maxLength={10}
          onChange={e => onChange({ ...data, phone: e.target.value.replace(/\D/g, '') })}
          hasError={!!errors.phone}
        />
      </Field>

      <Field label="Email ID" error={errors.email} required>
        <Input
          type="email"
          placeholder="your.email@example.com"
          value={data.email}
          onChange={e => onChange({ ...data, email: e.target.value })}
          hasError={!!errors.email}
        />
      </Field>

      <button
        type="button"
        onClick={() => validate() && onNext()}
        className="w-full phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-2 mt-4 hover:shadow-phoenix-glow transition-all"
      >
        NEXT: SELECT EVENTS <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STEP 2 — EVENTS SELECTION
// ═══════════════════════════════════════════════════════════════════
const Step2Events: React.FC<{
  techEvent: TechEvent;
  nonTechEvent: NonTechEvent;
  onTechChange: (e: TechEvent) => void;
  onNonTechChange: (e: NonTechEvent) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ techEvent, nonTechEvent, onTechChange, onNonTechChange, onNext, onBack }) => {
  const [error, setError] = useState('');

  const validate = () => {
    if (!techEvent && !nonTechEvent) {
      setError('Please select at least ONE event (Technical or Non-Technical) to proceed.');
      return false;
    }
    setError('');
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">SELECT YOUR EVENTS</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          You can participate in max 1 Technical and max 1 Non-Technical event. At least one event is required.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* TECHNICAL EVENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-[0.2em] text-phoenix-orange uppercase">
            TECHNICAL EVENT (MAX 1)
          </span>
          {techEvent && (
            <span className="text-[10px] font-bold text-phoenix-orange bg-phoenix-orange/10 px-2 py-0.5 rounded-full">
              Selected: {techEvent}
            </span>
          )}
        </div>

        <EventSelectCard
          name="PAPERQUEST"
          sub="Team of 4 Members"
          venue="Main Auditorium"
          icon={<Cpu className="w-5 h-5" />}
          selected={techEvent === 'PaperQuest'}
          onClick={() => { setError(''); onTechChange('PaperQuest'); }}
        />

        <EventSelectCard
          name="AI FILMFORGE"
          sub="Solo Event (1 Member)"
          venue="Main CSE Lab"
          icon={<Film className="w-5 h-5" />}
          selected={techEvent === 'AI FilmForge'}
          onClick={() => { setError(''); onTechChange('AI FilmForge'); }}
        />

        <SkipOptionBtn
          label="No Technical Event"
          selected={techEvent === null}
          onClick={() => { setError(''); onTechChange(null); }}
        />
      </div>

      <div className="h-[1px] bg-border my-2" />

      {/* NON-TECHNICAL EVENTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-[0.2em] text-phoenix-magenta uppercase">
            NON-TECHNICAL EVENT (MAX 1)
          </span>
          {nonTechEvent && (
            <span className="text-[10px] font-bold text-phoenix-magenta bg-phoenix-magenta/10 px-2 py-0.5 rounded-full">
              Selected: {nonTechEvent}
            </span>
          )}
        </div>

        <EventSelectCard
          name="CHECKMATE"
          sub="Solo Event (1 Member) · Chess"
          venue="Main CSE Lab"
          icon={<Swords className="w-5 h-5" />}
          selected={nonTechEvent === 'Checkmate'}
          onClick={() => { setError(''); onNonTechChange('Checkmate'); }}
        />

        <EventSelectCard
          name="MIME RELAY"
          sub="Team of 4 Members"
          venue="Auditorium"
          icon={<Zap className="w-5 h-5" />}
          selected={nonTechEvent === 'Mime Relay'}
          onClick={() => { setError(''); onNonTechChange('Mime Relay'); }}
        />

        <SkipOptionBtn
          label="No Non-Technical Event"
          selected={nonTechEvent === null}
          onClick={() => { setError(''); onNonTechChange(null); }}
        />
      </div>

      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> BACK
        </button>
        <button
          type="button"
          onClick={() => validate() && onNext()}
          className="flex-1 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          NEXT: TEAM DETAILS <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STEP 3 — TEAM MEMBERS (NEW DESIGN with per-member interest toggles)
// ═══════════════════════════════════════════════════════════════════

// ── PaperQuest: 4 fixed members + per-member Checkmate interest ──
const PaperQuestTeamForm: React.FC<{
  mainParticipantName: string;
  members: PaperQuestMember[];
  onMembersChange: (m: PaperQuestMember[]) => void;
  errors: string[];
  interestErrors: string[];
}> = ({ mainParticipantName, members, onMembersChange, errors, interestErrors }) => {
  const updateName = (idx: number, name: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], name };
    onMembersChange(updated);
  };
  const updateInterest = (idx: number, interest: Interest) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], checkmateInterest: interest };
    onMembersChange(updated);
  };

  const memberLabels = ['Member 1', 'Member 2', 'Member 3', 'Member 4'];

  return (
    <div className="space-y-4">
      {/* Banner + helper text */}
      <div className="space-y-2">
        <div className="p-3.5 rounded-xl bg-phoenix-orange/5 border border-phoenix-orange/20 text-xs text-phoenix-orange font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 shrink-0" />
            <span>PAPERQUEST — Team of 4 Members · Venue: Seminar Hall 1</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-phoenix-orange/10">
            Team of 4
          </span>
        </div>
        <p className="text-xs text-foreground-secondary px-1">
          Main Participant is already <strong>Member 1</strong>. Please enter the remaining 3 team members.
        </p>
      </div>

      {members.map((member, idx) => (
        <div key={idx} className="p-4 rounded-2xl bg-background-warm border border-border space-y-3">
          {/* Member header */}
          {idx === 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-phoenix-orange text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  1
                </div>
                <span className="text-sm font-bold text-foreground tracking-tight">
                  MEMBER 1 — MAIN PARTICIPANT
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-phoenix-orange/10 text-phoenix-orange border border-phoenix-orange/20">
                You
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-foreground text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <span className="text-sm font-bold text-foreground tracking-tight">
                  MEMBER {idx + 1}
                </span>
              </div>
              <span className="text-[10px] font-medium text-foreground-muted">
                Additional Member
              </span>
            </div>
          )}

          {/* Name field / display */}
          {idx === 0 ? (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
                Name
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-white border border-border text-sm font-bold text-foreground flex items-center justify-between shadow-2xs">
                <span>{mainParticipantName || 'Main Participant'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  ✓ Main Participant
                </span>
              </div>
            </div>
          ) : (
            <Field
              label="Name"
              error={errors[idx]}
              required
            >
              <Input
                placeholder={`Enter Member ${idx + 1} Full Name`}
                value={member.name}
                onChange={e => updateName(idx, e.target.value)}
                hasError={!!errors[idx]}
              />
            </Field>
          )}

          {/* Checkmate interest toggle */}
          <div>
            <InterestToggle
              eventName="Checkmate (Chess)"
              value={member.checkmateInterest}
              onChange={v => updateInterest(idx, v)}
              color="magenta"
            />
            {interestErrors[idx] && (
              <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {interestErrors[idx]}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Summary pill */}
      <div className="p-3 rounded-xl bg-white border border-border flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground-secondary">
          TOTAL TEAM MEMBERS = <strong className="text-foreground">4</strong>
        </span>
        <span className="text-[11px] text-emerald-600 font-bold">
          ✓ Main Participant + 3 Additional Members
        </span>
      </div>
    </div>
  );
};

// ── Mime Relay: 4 fixed members + per-member AI FilmForge interest ──
const MimeRelayTeamForm: React.FC<{
  mainParticipantName: string;
  members: MimeRelayMember[];
  onMembersChange: (m: MimeRelayMember[]) => void;
  errors: string[];
  interestErrors: string[];
}> = ({ mainParticipantName, members, onMembersChange, errors, interestErrors }) => {
  const updateName = (idx: number, name: string) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], name };
    onMembersChange(updated);
  };
  const updateInterest = (idx: number, interest: Interest) => {
    const updated = [...members];
    updated[idx] = { ...updated[idx], filmforgeInterest: interest };
    onMembersChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Banner + helper text */}
      <div className="space-y-2">
        <div className="p-3.5 rounded-xl bg-phoenix-magenta/5 border border-phoenix-magenta/20 text-xs text-phoenix-magenta font-semibold flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 shrink-0" />
            <span>MIME RELAY — Team of 4 Members · Venue: Auditorium</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-phoenix-magenta/10">
            Team of 4
          </span>
        </div>
        <p className="text-xs text-foreground-secondary px-1">
          Main Participant is already <strong>Member 1</strong>. Please enter the remaining 3 team members.
        </p>
      </div>

      {members.map((member, idx) => (
        <div key={idx} className="p-4 rounded-2xl bg-background-warm border border-border space-y-3">
          {/* Member header */}
          {idx === 0 ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-phoenix-magenta text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  1
                </div>
                <span className="text-sm font-bold text-foreground tracking-tight">
                  MEMBER 1 — MAIN PARTICIPANT
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-phoenix-magenta/10 text-phoenix-magenta border border-phoenix-magenta/20">
                You
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-foreground text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <span className="text-sm font-bold text-foreground tracking-tight">
                  MEMBER {idx + 1}
                </span>
              </div>
              <span className="text-[10px] font-medium text-foreground-muted">
                Additional Member
              </span>
            </div>
          )}

          {/* Name field / display */}
          {idx === 0 ? (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-foreground-secondary uppercase tracking-wider">
                Name
              </label>
              <div className="w-full px-4 py-3 rounded-xl bg-white border border-border text-sm font-bold text-foreground flex items-center justify-between shadow-2xs">
                <span>{mainParticipantName || 'Main Participant'}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  ✓ Main Participant
                </span>
              </div>
            </div>
          ) : (
            <Field
              label="Name"
              error={errors[idx]}
              required
            >
              <Input
                placeholder={`Enter Member ${idx + 1} Full Name`}
                value={member.name}
                onChange={e => updateName(idx, e.target.value)}
                hasError={!!errors[idx]}
              />
            </Field>
          )}

          {/* AI FilmForge interest toggle */}
          <div>
            <InterestToggle
              eventName="AI FilmForge"
              value={member.filmforgeInterest}
              onChange={v => updateInterest(idx, v)}
              color="orange"
            />
            {interestErrors[idx] && (
              <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {interestErrors[idx]}
              </p>
            )}
          </div>
        </div>
      ))}

      {/* Summary pill */}
      <div className="p-3 rounded-xl bg-white border border-border flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground-secondary">
          TOTAL TEAM MEMBERS = <strong className="text-foreground">4</strong>
        </span>
        <span className="text-[11px] text-emerald-600 font-bold">
          ✓ Main Participant + 3 Additional Members
        </span>
      </div>
    </div>
  );
};

// ── Solo participant display ──
const SoloParticipantCard: React.FC<{ eventName: string; mainName: string; color?: 'orange' | 'magenta'; icon: React.ReactNode }> = ({
  eventName, mainName, color = 'orange', icon
}) => (
  <div className={`p-4 rounded-2xl border ${color === 'magenta' ? 'bg-phoenix-magenta/5 border-phoenix-magenta/20' : 'bg-phoenix-orange/5 border-phoenix-orange/20'} flex items-center gap-3`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color === 'magenta' ? 'bg-phoenix-magenta/10 text-phoenix-magenta' : 'bg-phoenix-orange/10 text-phoenix-orange'}`}>
      {icon}
    </div>
    <div>
      <div className={`text-xs font-bold tracking-wider uppercase ${color === 'magenta' ? 'text-phoenix-magenta' : 'text-phoenix-orange'}`}>{eventName}</div>
      <div className="text-sm font-bold text-foreground mt-0.5">Solo: {mainName}</div>
      <div className="text-[11px] text-foreground-muted">You compete alone — no teammates required.</div>
    </div>
  </div>
);

// ── Main Step 3 Component ──
const Step3Team: React.FC<{
  techEvent: TechEvent;
  nonTechEvent: NonTechEvent;
  step1: Step1Data;
  paperQuestMembers: PaperQuestMember[];
  onPaperQuestChange: (m: PaperQuestMember[]) => void;
  mimeRelayMembers: MimeRelayMember[];
  onMimeRelayChange: (m: MimeRelayMember[]) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({
  techEvent,
  nonTechEvent,
  step1,
  paperQuestMembers,
  onPaperQuestChange,
  mimeRelayMembers,
  onMimeRelayChange,
  onNext,
  onBack,
}) => {
  const [pqNameErrors, setPqNameErrors] = useState<string[]>(['', '', '', '']);
  const [pqInterestErrors, setPqInterestErrors] = useState<string[]>(['', '', '', '']);
  const [mrNameErrors, setMrNameErrors] = useState<string[]>(['', '', '', '']);
  const [mrInterestErrors, setMrInterestErrors] = useState<string[]>(['', '', '', '']);
  const [globalError, setGlobalError] = useState('');

  const mainName = step1.fullName.trim();

  // Both events are solo
  const isBothSolo =
    (techEvent === 'AI FilmForge' || !techEvent) &&
    (nonTechEvent === 'Checkmate' || !nonTechEvent);

  const validate = (): boolean => {
    setGlobalError('');
    let valid = true;

    // Validate PaperQuest members
    if (techEvent === 'PaperQuest') {
      const nameErrs = ['', '', '', ''];
      const intErrs = ['', '', '', ''];
      paperQuestMembers.forEach((m, idx) => {
        const name = idx === 0 ? mainName : m.name.trim();
        if (!name) {
          nameErrs[idx] = `Member ${idx + 1} name is required`;
          valid = false;
        }
        if (!m.checkmateInterest) {
          intErrs[idx] = `Please select Interested or Not Interested for Member ${idx + 1}`;
          valid = false;
        }
      });
      setPqNameErrors(nameErrs);
      setPqInterestErrors(intErrs);
    }

    // Validate Mime Relay members
    if (nonTechEvent === 'Mime Relay') {
      const nameErrs = ['', '', '', ''];
      const intErrs = ['', '', '', ''];
      mimeRelayMembers.forEach((m, idx) => {
        const name = idx === 0 ? mainName : m.name.trim();
        if (!name) {
          nameErrs[idx] = `Member ${idx + 1} name is required`;
          valid = false;
        }
        if (!m.filmforgeInterest) {
          intErrs[idx] = `Please select Interested or Not Interested for Member ${idx + 1}`;
          valid = false;
        }
      });
      setMrNameErrors(nameErrs);
      setMrInterestErrors(intErrs);
    }

    if (!valid) {
      setGlobalError('Please complete all required fields and interest selections above.');
    }

    return valid;
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">TEAM MEMBERS</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          Main Participant is already <strong>Member 1</strong>. Please enter the remaining 3 team members.
        </p>
      </div>

      {globalError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {globalError}
        </div>
      )}

      {/* Both solo */}
      {isBothSolo && (
        <div className="space-y-3">
          {techEvent === 'AI FilmForge' && (
            <SoloParticipantCard
              eventName="AI FilmForge"
              mainName={mainName || 'You'}
              color="orange"
              icon={<Film className="w-5 h-5" />}
            />
          )}
          {nonTechEvent === 'Checkmate' && (
            <SoloParticipantCard
              eventName="Checkmate (Chess)"
              mainName={mainName || 'You'}
              color="magenta"
              icon={<Swords className="w-5 h-5" />}
            />
          )}
          {!techEvent && !nonTechEvent && (
            <div className="p-6 rounded-2xl bg-background-warm border border-border text-center text-foreground-secondary text-sm">
              No team members required.
            </div>
          )}
        </div>
      )}

      {/* PaperQuest team form */}
      {techEvent === 'PaperQuest' && (
        <PaperQuestTeamForm
          mainParticipantName={mainName}
          members={paperQuestMembers}
          onMembersChange={m => { setPqNameErrors(['','','','']); setPqInterestErrors(['','','','']); onPaperQuestChange(m); }}
          errors={pqNameErrors}
          interestErrors={pqInterestErrors}
        />
      )}

      {/* AI FilmForge solo (when only AI FilmForge selected without Mime Relay) */}
      {techEvent === 'AI FilmForge' && !isBothSolo && (
        <SoloParticipantCard
          eventName="AI FilmForge"
          mainName={mainName || 'You'}
          color="orange"
          icon={<Film className="w-5 h-5" />}
        />
      )}

      {/* Mime Relay team form */}
      {nonTechEvent === 'Mime Relay' && (
        <MimeRelayTeamForm
          mainParticipantName={mainName}
          members={mimeRelayMembers}
          onMembersChange={m => { setMrNameErrors(['','','','']); setMrInterestErrors(['','','','']); onMimeRelayChange(m); }}
          errors={mrNameErrors}
          interestErrors={mrInterestErrors}
        />
      )}

      {/* Checkmate solo (when only Checkmate selected without PaperQuest) */}
      {nonTechEvent === 'Checkmate' && !isBothSolo && (
        <SoloParticipantCard
          eventName="Checkmate (Chess)"
          mainName={mainName || 'You'}
          color="magenta"
          icon={<Swords className="w-5 h-5" />}
        />
      )}

      <div className="flex gap-3 pt-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> BACK
        </button>
        <button
          type="button"
          onClick={() => validate() && onNext()}
          className="flex-1 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2"
        >
          REVIEW & BREAKDOWN <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Helper: Derive all names from form for fee calc ──────────────
function deriveNamesForFee(form: FormState) {
  const mainName = form.step1.fullName.trim();

  let techMembersForCalc: string[] = [];
  let nonTechMembersForCalc: string[] = [];

  if (form.techEvent === 'PaperQuest') {
    // Members 2,3,4 (index 1,2,3)
    techMembersForCalc = form.paperQuestMembers.slice(1).map(m => m.name.trim());
  }
  if (form.nonTechEvent === 'Mime Relay') {
    nonTechMembersForCalc = form.mimeRelayMembers.slice(1).map(m => m.name.trim());
  }

  return { mainName, techMembersForCalc, nonTechMembersForCalc };
}

// ═══════════════════════════════════════════════════════════════════
// STEP 4 — REVIEW & UNIQUE FEE BREAKDOWN
// ═══════════════════════════════════════════════════════════════════
const Step4Review: React.FC<{
  form: FormState;
  onNext: () => void;
  onBack: () => void;
}> = ({ form, onNext, onBack }) => {
  const { step1, techEvent, nonTechEvent, paperQuestMembers, mimeRelayMembers } = form;
  const mainName = step1.fullName.trim();

  const { mainName: mn, techMembersForCalc, nonTechMembersForCalc } = deriveNamesForFee(form);

  const calculation = calculateUniqueMembersAndFee(
    mn,
    techEvent,
    techMembersForCalc,
    nonTechEvent,
    nonTechMembersForCalc
  );

  // Build PaperQuest member list for display
  const pqNames: string[] = techEvent === 'PaperQuest'
    ? paperQuestMembers.map((m, i) => (i === 0 ? mainName : m.name.trim())).filter(Boolean)
    : techEvent === 'AI FilmForge' ? [mainName] : [];

  // Build Mime Relay member list for display
  const mrNames: string[] = nonTechEvent === 'Mime Relay'
    ? mimeRelayMembers.map((m, i) => (i === 0 ? mainName : m.name.trim())).filter(Boolean)
    : nonTechEvent === 'Checkmate' ? [mainName] : [];

  // Checkmate interested members (from PaperQuest team)
  const checkmateInterestedNames: string[] = techEvent === 'PaperQuest'
    ? paperQuestMembers
        .map((m, i) => ({ name: i === 0 ? mainName : m.name.trim(), interest: m.checkmateInterest }))
        .filter(x => x.interest === 'interested' && x.name)
        .map(x => x.name)
    : [];

  // AI FilmForge interested members (from Mime Relay team)
  const filmforgeInterestedNames: string[] = nonTechEvent === 'Mime Relay'
    ? mimeRelayMembers
        .map((m, i) => ({ name: i === 0 ? mainName : m.name.trim(), interest: m.filmforgeInterest }))
        .filter(x => x.interest === 'interested' && x.name)
        .map(x => x.name)
    : [];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">REGISTRATION SUMMARY</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          Review your details and dynamic fee breakdown before making payment.
        </p>
      </div>

      {/* Participant info */}
      <div className="p-5 rounded-2xl bg-background-warm border border-border">
        <p className="text-[10px] font-bold tracking-[0.2em] text-phoenix-orange uppercase mb-3">
          PRIMARY PARTICIPANT
        </p>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-foreground-muted">Main Participant</span>
            <span className="font-bold text-foreground">{step1.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">College</span>
            <span className="font-bold text-foreground text-right max-w-[60%]">{step1.college}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Department</span>
            <span className="font-bold text-foreground text-right max-w-[60%]">{step1.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Phone Number</span>
            <span className="font-bold text-foreground">{step1.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-muted">Email ID</span>
            <span className="font-bold text-foreground text-right max-w-[60%] break-all">{step1.email}</span>
          </div>
        </div>
      </div>

      {/* Events Breakdown according to user's exact specification */}
      <div className="space-y-4">
        {/* Technical Event Card */}
        {techEvent === 'PaperQuest' && (
          <div className="p-5 rounded-2xl bg-white border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-phoenix-orange" />
                <span className="text-xs font-bold tracking-wider uppercase text-phoenix-orange">
                  PAPERQUEST — TEAM
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-phoenix-orange/10 text-phoenix-orange">
                Team of 4
              </span>
            </div>

            <div className="space-y-2">
              {paperQuestMembers.map((m, idx) => {
                const name = idx === 0 ? mainName : m.name.trim();
                const isInterested = m.checkmateInterest === 'interested';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-background-warm border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-phoenix-orange text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-foreground">
                        {name}
                        {idx === 0 && (
                          <span className="ml-1.5 text-[10px] font-semibold text-phoenix-orange">
                            — Main Participant
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-7 sm:pl-0 text-[11px]">
                      <span className="text-foreground-muted">Checkmate:</span>
                      {isInterested ? (
                        <span className="px-2 py-0.5 rounded-full bg-phoenix-magenta/10 text-phoenix-magenta font-bold text-[10px]">
                          Interested
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium text-[10px]">
                          Not Interested
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-foreground-muted flex items-center justify-between border-t border-border/60">
              <span>Team Size: <strong className="text-foreground">4 Members</strong></span>
              <span>Checkmate: <strong className="text-phoenix-magenta">{checkmateInterestedNames.length} Individual Participant{checkmateInterestedNames.length === 1 ? '' : 's'}</strong></span>
            </div>
          </div>
        )}

        {techEvent === 'AI FilmForge' && (
          <div className="p-4 rounded-2xl bg-white border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Film className="w-4 h-4 text-phoenix-orange" />
              <span className="text-xs font-bold tracking-wider uppercase text-phoenix-orange">
                AI FILMFORGE — SOLO EVENT
              </span>
            </div>
            <div className="text-xs text-foreground space-y-1">
              <div className="font-bold">1. {mainName} <span className="text-[10px] font-semibold text-phoenix-orange">— Main Participant</span></div>
              <div className="text-foreground-muted text-[11px]">Solo event (1 participant only)</div>
            </div>
          </div>
        )}

        {/* Non-Technical Event Card */}
        {nonTechEvent === 'Mime Relay' && (
          <div className="p-5 rounded-2xl bg-white border border-border space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold tracking-wider uppercase text-purple-600">
                  MIME RELAY — TEAM
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-600">
                Team of 4
              </span>
            </div>

            <div className="space-y-2">
              {mimeRelayMembers.map((m, idx) => {
                const name = idx === 0 ? mainName : m.name.trim();
                const isInterested = m.filmforgeInterest === 'interested';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-background-warm border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-foreground">
                        {name}
                        {idx === 0 && (
                          <span className="ml-1.5 text-[10px] font-semibold text-purple-600">
                            — Main Participant
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 pl-7 sm:pl-0 text-[11px]">
                      <span className="text-foreground-muted">AI FilmForge:</span>
                      {isInterested ? (
                        <span className="px-2 py-0.5 rounded-full bg-phoenix-orange/10 text-phoenix-orange font-bold text-[10px]">
                          Interested
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium text-[10px]">
                          Not Interested
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-foreground-muted flex items-center justify-between border-t border-border/60">
              <span>Team Size: <strong className="text-foreground">4 Members</strong></span>
              <span>AI FilmForge: <strong className="text-phoenix-orange">{filmforgeInterestedNames.length} Individual Participant{filmforgeInterestedNames.length === 1 ? '' : 's'}</strong></span>
            </div>
          </div>
        )}

        {nonTechEvent === 'Checkmate' && (
          <div className="p-4 rounded-2xl bg-white border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Swords className="w-4 h-4 text-phoenix-magenta" />
              <span className="text-xs font-bold tracking-wider uppercase text-phoenix-magenta">
                CHECKMATE — SOLO EVENT (CHESS)
              </span>
            </div>
            <div className="text-xs text-foreground space-y-1">
              <div className="font-bold">1. {mainName} <span className="text-[10px] font-semibold text-phoenix-magenta">— Main Participant</span></div>
              <div className="text-foreground-muted text-[11px]">Solo event (1 participant only)</div>
            </div>
          </div>
        )}
      </div>

      {/* UNIQUE MEMBERS PILL LIST */}
      <div className="p-4 rounded-2xl bg-background-warm border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-foreground-secondary uppercase">
            UNIQUE PARTICIPANTS ({calculation.totalMembers})
          </span>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            Deduplicated
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {calculation.uniqueMembers.map((m, idx) => (
            <span
              key={idx}
              className="text-xs bg-white border border-border px-2.5 py-1 rounded-lg font-semibold text-foreground flex items-center gap-1.5 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-phoenix-orange" />
              {m}
            </span>
          ))}
        </div>
      </div>

      {/* PROMINENT PRICING CARD */}
      <div className="p-6 rounded-3xl bg-darkAccent text-white relative overflow-hidden shadow-phoenix-glow">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,106,0,0.25) 0%, rgba(229,27,35,0.15) 50%, transparent 80%)',
          }}
        />
        <div className="relative z-10 space-y-4">
          <div className="flex justify-between items-center text-xs tracking-wider text-white/70">
            <span>TOTAL UNIQUE MEMBERS</span>
            <span className="text-base font-bold text-white tabular-nums">{calculation.totalMembers} Person{calculation.totalMembers > 1 ? 's' : ''}</span>
          </div>

          <div className="flex justify-between items-center text-xs tracking-wider text-white/70">
            <span>FEE PER HEAD</span>
            <span className="text-sm font-semibold text-white tabular-nums">₹{calculation.feePerHead}</span>
          </div>

          <div className="h-[1px] bg-white/15" />

          <div className="flex justify-between items-end">
            <div>
              <div className="text-[10px] font-bold tracking-[0.25em] text-phoenix-orange uppercase">
                TOTAL REGISTRATION FEE
              </div>
              <div className="text-xs text-white/60">Includes all events & certificates</div>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-phoenix-gold via-phoenix-orange to-phoenix-red tabular-nums">
              ₹{calculation.totalAmount}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> EDIT DETAILS
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 shadow-phoenix-subtle"
        >
          PROCEED TO PAYMENT (₹{calculation.totalAmount}) <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STEP 5 — PAYMENT & DYNAMIC UPI QR
// ═══════════════════════════════════════════════════════════════════
const Step5Payment: React.FC<{
  form: FormState;
  onPaymentIdChange: (val: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}> = ({ form, onPaymentIdChange, onSubmit, onBack, loading, error }) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [upiError, setUpiError] = useState('');

  const { mainName, techMembersForCalc, nonTechMembersForCalc } = deriveNamesForFee(form);

  const calculation = calculateUniqueMembersAndFee(
    mainName,
    form.techEvent,
    techMembersForCalc,
    form.nonTechEvent,
    nonTechMembersForCalc
  );

  const upiId = DEFAULT_UPI_ID;
  const totalAmount = calculation.totalAmount;
  const upiUrl = buildUpiPaymentUrl(totalAmount, upiId, DEFAULT_UPI_NAME);

  useEffect(() => {
    QRCode.toDataURL(upiUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#171717', light: '#ffffff' },
    })
      .then(setQrDataUrl)
      .catch(err => console.error('Error generating UPI QR code:', err));
  }, [upiUrl]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayViaApp = () => { window.location.href = upiUrl; };

  const handleSubmitCheck = () => {
    if (!form.paymentId.trim()) {
      setUpiError('Payment ID / UPI Reference Number is required to confirm your registration.');
      return;
    }
    if (form.paymentId.trim().length < 4) {
      setUpiError('Please enter a valid UPI Transaction ID / Reference Number.');
      return;
    }
    setUpiError('');
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">SCAN & PAY</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          Scan the dynamic QR code with any UPI app. The exact amount is pre-filled.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* DYNAMIC QR BOX */}
      <div className="p-6 rounded-3xl bg-background-warm border-2 border-phoenix-orange/30 text-center space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-phoenix-orange/10 text-phoenix-orange text-[10px] font-bold tracking-widest uppercase">
          DYNAMIC UPI PAYMENT
        </div>

        <div className="text-4xl font-extrabold text-foreground tabular-nums">
          ₹{totalAmount}
        </div>
        <p className="text-xs text-foreground-muted">
          For {calculation.totalMembers} Unique Participant{calculation.totalMembers > 1 ? 's' : ''} (₹{FEE_PER_HEAD} per head)
        </p>

        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-border inline-block mx-auto">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="PIXEL-3.O Dynamic UPI QR"
              className="w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center text-xs text-foreground-muted">
              Generating dynamic QR...
            </div>
          )}
        </div>

        <div className="space-y-2 max-w-sm mx-auto">
          <div className="p-2.5 rounded-xl bg-white border border-border flex items-center justify-between text-xs">
            <div className="text-left truncate mr-2">
              <span className="text-[10px] text-foreground-muted block">UPI ID:</span>
              <span className="font-bold text-foreground">{upiId}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="px-2.5 py-1.5 rounded-lg bg-background-warm hover:bg-background-secondary text-foreground text-xs font-bold flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>

          <button
            type="button"
            onClick={handlePayViaApp}
            className="w-full py-2.5 px-4 rounded-xl border border-phoenix-orange/40 hover:bg-phoenix-orange/5 text-phoenix-orange text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors sm:hidden"
          >
            <ExternalLink className="w-3.5 h-3.5" /> PAY VIA ANY UPI APP
          </button>

          <div className="pt-4 text-center">
            <div className="text-[11px] font-semibold text-foreground-muted mb-2 uppercase tracking-wider">
              Scan Official QR Code (Fallback)
            </div>
            <div className="p-3 bg-white rounded-2xl border border-border inline-block shadow-sm">
              <img
                src="/Payment-Qr.jpeg"
                alt="Organizer Reference UPI QR"
                className="w-44 h-44 object-contain mx-auto rounded-lg"
              />
              <p className="text-[10px] text-foreground-muted mt-2 max-w-[200px] mx-auto leading-tight">
                Scan this QR if the dynamic QR above fails. Ensure the UPI ID is <strong>{upiId}</strong> and enter the exact amount.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-border space-y-2 text-xs text-foreground-secondary">
        <p className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> HOW TO COMPLETE REGISTRATION:
        </p>
        <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] sm:text-xs">
          <li>Open GPay, PhonePe, Paytm, or any UPI app.</li>
          <li>Scan the QR code above or pay to <strong className="text-foreground">gokulkumar1406@okaxis</strong>.</li>
          <li>Verify the payee and confirm the exact registration amount.</li>
          <li>After payment, copy the UPI Reference / Transaction ID and enter it below.</li>
        </ol>
      </div>

      <Field label="Payment ID / UPI (Transaction Reference Number)" error={upiError} required>
        <Input
          placeholder="e.g. 12-digit UPI Reference / Transaction ID from GPay / PhonePe / Paytm"
          value={form.paymentId}
          disabled={loading}
          onChange={e => { setUpiError(''); onPaymentIdChange(e.target.value); }}
          hasError={!!upiError}
        />
        <p className="text-[11px] text-foreground-muted mt-1.5">
          * Your payment status will be recorded as <strong>Submitted</strong> pending administrative verification.
        </p>
      </Field>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" /> BACK
        </button>
        <button
          type="button"
          onClick={handleSubmitCheck}
          disabled={loading}
          className="flex-2 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-phoenix-subtle"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              RECORDING REGISTRATION...
            </span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" /> SUBMIT REGISTRATION
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// STEP 6 — SUCCESS & CONFIRMATION
// ═══════════════════════════════════════════════════════════════════
const Step6Confirmed: React.FC<{
  result: RegistrationResult;
  form: FormState;
  onClose: () => void;
}> = ({ result, form, onClose }) => {
  const [badgeQr, setBadgeQr] = useState<string>('');
  const [generatingPdf, setGeneratingPdf] = useState<boolean>(false);

  const mainName = form.step1.fullName.trim();

  // Build tech members array for PDF/QR
  const techMembersForDisplay: string[] = form.techEvent === 'PaperQuest'
    ? form.paperQuestMembers.map((m, i) => (i === 0 ? mainName : m.name.trim())).filter(Boolean)
    : form.techEvent === 'AI FilmForge' ? [mainName] : [];

  const nonTechMembersForDisplay: string[] = form.nonTechEvent === 'Mime Relay'
    ? form.mimeRelayMembers.map((m, i) => (i === 0 ? mainName : m.name.trim())).filter(Boolean)
    : form.nonTechEvent === 'Checkmate' ? [mainName] : [];

  useEffect(() => {
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF6A00', '#E51B23', '#D01257', '#9333EA', '#FFB800'],
    });

    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://pixel3-o.vercel.app';
    const techStr = techMembersForDisplay.join(',');
    const nonTechStr = nonTechMembersForDisplay.join(',');

    const verifyUrl = `${origin}/verify?id=${encodeURIComponent(result.registrationId)}&name=${encodeURIComponent(result.fullName)}&college=${encodeURIComponent(form.step1.college || '')}&dept=${encodeURIComponent(form.step1.department || '')}&tech=${encodeURIComponent(result.techEvent || '')}&nontech=${encodeURIComponent(result.nonTechEvent || '')}&members=${result.totalMembers}&amount=${result.totalAmount}&status=${encodeURIComponent(result.paymentStatus || 'Paid')}&phone=${encodeURIComponent(form.step1.phone || '')}&payid=${encodeURIComponent(form.paymentId || '')}&techm=${encodeURIComponent(techStr)}&nontechm=${encodeURIComponent(nonTechStr)}`;

    QRCode.toDataURL(verifyUrl, {
      width: 180,
      margin: 1,
      color: { dark: '#171717', light: '#ffffff' },
    })
      .then(setBadgeQr)
      .catch(console.error);
  }, [result.registrationId, form]);

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    try {
      await generateConfirmationPdf(result, {
        college: form.step1.college,
        department: form.step1.department,
        phone: form.step1.phone,
        email: form.step1.email,
        paymentId: form.paymentId,
        techMembers: techMembersForDisplay,
        nonTechMembers: nonTechMembersForDisplay,
      });
    } catch (err) {
      console.error('Failed to generate PDF pass:', err);
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleDownloadTextPass = () => {
    const text = `=========================================
PIXEL-3.O — OFFICIAL REGISTRATION PASS
National Level Technical Symposium
Department of Computer Science and Engineering
Adhiparasakthi Engineering College
In Association with CSI Kanchipuram Chapter
=========================================

REGISTRATION ID   : ${result.registrationId}
PARTICIPANT NAME  : ${result.fullName}
COLLEGE           : ${form.step1.college || '—'}
DEPARTMENT        : ${form.step1.department || '—'}
TOTAL MEMBERS     : ${result.totalMembers}
FEE PAID          : ₹${result.totalAmount}
PAYMENT STATUS    : ${result.paymentStatus}
UPI TRANSACTION ID: ${form.paymentId || '—'}
REGISTRATION STATUS: ${result.registrationStatus}

TECHNICAL EVENT   : ${result.techEvent || 'None'}
NON-TECHNICAL EVENT: ${result.nonTechEvent || 'None'}

DATE OF SYMPOSIUM : 14 October 2026
REPORTING TIME    : 09:00 AM IST
VENUE             : Adhiparasakthi Engineering College, Melmaruvathur

"Early Registration Helps Us Ensure Smooth Arrangements"

Please display this Pass or Registration ID at the Welcome Desk.
=========================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${result.registrationId}_Pass.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center space-y-6">
      <div className="text-5xl animate-bounce">🔥</div>

      <div>
        <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-widest uppercase mb-2">
          REGISTRATION CONFIRMED
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          REGISTRATION SUCCESSFUL
        </h3>
        <p className="text-xs sm:text-sm text-foreground-secondary mt-1">
          Welcome to PIXEL-3.O, <strong>{result.fullName}</strong>! Your registration is recorded in our system.
        </p>
      </div>

      {/* Required Quote Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold shadow-2xs">
        ✨ &quot;Early Registration Helps Us Ensure Smooth Arrangements&quot;
      </div>

      <div className="p-6 rounded-3xl bg-darkAccent text-white text-center space-y-3 relative overflow-hidden shadow-phoenix-glow">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 50% 100%, rgba(255,106,0,0.3) 0%, rgba(229,27,35,0.15) 50%, transparent 80%)',
          }}
        />

        <div className="relative z-10 space-y-3">
          <p className="text-[10px] font-bold tracking-[0.3em] text-phoenix-orange uppercase">
            OFFICIAL REGISTRATION ID
          </p>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            {result.registrationId}
          </p>

          {badgeQr && (
            <div className="bg-white p-2.5 rounded-2xl inline-block mx-auto border-2 border-white/20">
              <img src={badgeQr} alt="Registration QR Code" className="w-24 h-24 sm:w-28 sm:h-28 mx-auto" />
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] text-white/50 uppercase block">MEMBERS</span>
              <span className="font-bold text-white text-sm">{result.totalMembers}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] text-white/50 uppercase block">FEE</span>
              <span className="font-bold text-phoenix-gold text-sm">₹{result.totalAmount}</span>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[9px] text-white/50 uppercase block">PAYMENT</span>
              <span className="font-bold text-emerald-400 text-sm">{result.paymentStatus}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-phoenix-orange/10 border border-phoenix-orange/20 text-center">
          <p className="text-[9px] font-bold tracking-widest text-phoenix-orange uppercase mb-0.5">TECHNICAL</p>
          <p className="font-bold text-foreground">{result.techEvent || 'Not Selected'}</p>
        </div>
        <div className="p-3.5 rounded-xl bg-phoenix-magenta/10 border border-phoenix-magenta/20 text-center">
          <p className="text-[9px] font-bold tracking-widest text-phoenix-magenta uppercase mb-0.5">NON-TECHNICAL</p>
          <p className="font-bold text-foreground">{result.nonTechEvent || 'Not Selected'}</p>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-background-warm border border-border text-xs text-foreground-secondary">
        📍 <strong>Adhiparasakthi Engineering College</strong> · 14 October 2026 · Reporting: 09:00 AM
      </div>

      <a
        href="https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v"
        target="_blank"
        rel="noreferrer"
        className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20B858] text-white font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
      >
        <MessageCircle className="w-5 h-5" /> JOIN PIXEL-3.O WHATSAPP GROUP
      </a>

      {/* PDF Download Primary Button */}
      <button
        type="button"
        onClick={handleDownloadPdf}
        disabled={generatingPdf}
        className="w-full phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-phoenix-subtle hover:scale-[1.01] cursor-pointer disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        <span>{generatingPdf ? 'GENERATING OFFICIAL PDF...' : 'DOWNLOAD OFFICIAL PDF PASS'}</span>
      </button>

      <button
        type="button"
        onClick={handleDownloadTextPass}
        className="w-full py-3 rounded-full border border-border hover:border-phoenix-orange text-foreground-secondary hover:text-phoenix-orange font-semibold tracking-wider uppercase text-[11px] flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Download Text Pass (.txt)
      </button>

      <div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-foreground-muted hover:text-phoenix-orange underline underline-offset-2 transition-colors"
        >
          Return to Home Page
        </button>
      </div>
    </div>
  );
};

// ─── Helper: build default PaperQuest members ────────────────────
function defaultPaperQuestMembers(mainName: string): PaperQuestMember[] {
  return [
    { name: mainName, checkmateInterest: '' },
    { name: '', checkmateInterest: '' },
    { name: '', checkmateInterest: '' },
    { name: '', checkmateInterest: '' },
  ];
}

function defaultMimeRelayMembers(mainName: string): MimeRelayMember[] {
  return [
    { name: mainName, filmforgeInterest: '' },
    { name: '', filmforgeInterest: '' },
    { name: '', filmforgeInterest: '' },
    { name: '', filmforgeInterest: '' },
  ];
}

// ═══════════════════════════════════════════════════════════════════
// MAIN REGISTRATION PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState<RegistrationResult | null>(null);

  const [form, setForm] = useState<FormState>({
    step1: { fullName: '', college: '', department: '', phone: '', email: '' },
    techEvent: null,
    nonTechEvent: null,
    paperQuestMembers: defaultPaperQuestMembers(''),
    mimeRelayMembers: defaultMimeRelayMembers(''),
    paymentId: '',
  });

  const deadlinePassed = isDeadlinePassed();

  // Keep member[0].name in sync with step1.fullName for both team events
  useEffect(() => {
    const mainName = form.step1.fullName;
    setForm(f => ({
      ...f,
      paperQuestMembers: f.paperQuestMembers.map((m, i) =>
        i === 0 ? { ...m, name: mainName } : m
      ),
      mimeRelayMembers: f.mimeRelayMembers.map((m, i) =>
        i === 0 ? { ...m, name: mainName } : m
      ),
    }));
  }, [form.step1.fullName]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // When tech event changes
  const handleTechEventChange = (e: TechEvent) => {
    setForm(f => {
      // Reset PaperQuest members when switching away from PaperQuest
      const pqMembers = e === 'PaperQuest'
        ? defaultPaperQuestMembers(f.step1.fullName)
        : f.paperQuestMembers;
      return { ...f, techEvent: e, paperQuestMembers: pqMembers };
    });
  };

  // When non-tech event changes
  const handleNonTechEventChange = (e: NonTechEvent) => {
    setForm(f => {
      const mrMembers = e === 'Mime Relay'
        ? defaultMimeRelayMembers(f.step1.fullName)
        : f.mimeRelayMembers;
      return { ...f, nonTechEvent: e, mimeRelayMembers: mrMembers };
    });
  };

  // Final submission
  const handleFinalSubmit = async () => {
    if (deadlinePassed) {
      setError('Registration is closed (Deadline: 13 October 2026, 10:00 PM IST).');
      return;
    }

    if (!form.techEvent && !form.nonTechEvent) {
      setError('Please select at least one event.');
      return;
    }

    if (!form.paymentId.trim()) {
      setError('Payment ID / UPI Reference Number is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const mainName = form.step1.fullName.trim();

      // Build PaperQuest member names
      let techM1 = '', techM2 = '', techM3 = '', techM4 = '';
      if (form.techEvent === 'PaperQuest') {
        techM1 = mainName;
        techM2 = form.paperQuestMembers[1]?.name.trim() || '';
        techM3 = form.paperQuestMembers[2]?.name.trim() || '';
        techM4 = form.paperQuestMembers[3]?.name.trim() || '';
      } else if (form.techEvent === 'AI FilmForge') {
        techM1 = mainName;
      }

      // Build Mime Relay member names
      let nonTechM1 = '', nonTechM2 = '', nonTechM3 = '', nonTechM4 = '';
      if (form.nonTechEvent === 'Mime Relay') {
        nonTechM1 = mainName;
        nonTechM2 = form.mimeRelayMembers[1]?.name.trim() || '';
        nonTechM3 = form.mimeRelayMembers[2]?.name.trim() || '';
        nonTechM4 = form.mimeRelayMembers[3]?.name.trim() || '';
      } else if (form.nonTechEvent === 'Checkmate') {
        nonTechM1 = mainName;
      }

      // Build Checkmate interested member numbers (1-indexed, comma-separated)
      const checkmateInterested = form.techEvent === 'PaperQuest'
        ? form.paperQuestMembers
            .map((m, i) => ({ idx: i + 1, interest: m.checkmateInterest }))
            .filter(x => x.interest === 'interested')
            .map(x => String(x.idx))
            .join(',')
        : '';

      // Build AI FilmForge interested member numbers (1-indexed, comma-separated)
      const filmforgeInterested = form.nonTechEvent === 'Mime Relay'
        ? form.mimeRelayMembers
            .map((m, i) => ({ idx: i + 1, interest: m.filmforgeInterest }))
            .filter(x => x.interest === 'interested')
            .map(x => String(x.idx))
            .join(',')
        : '';

      const payload = {
        fullName: mainName,
        college: form.step1.college.trim(),
        department: form.step1.department.trim(),
        phone: form.step1.phone.trim(),
        email: form.step1.email.trim(),
        technicalEvent: form.techEvent === 'PaperQuest' ? 'PAPERQUEST' : form.techEvent === 'AI FilmForge' ? 'AI FILMFORGE' : '',
        technicalMember1: techM1,
        technicalMember2: techM2,
        technicalMember3: techM3,
        technicalMember4: techM4,
        nonTechnicalEvent: form.nonTechEvent === 'Mime Relay' ? 'MIME RELAY' : form.nonTechEvent === 'Checkmate' ? 'CHECKMATE' : '',
        nonTechnicalMember1: nonTechM1,
        nonTechnicalMember2: nonTechM2,
        nonTechnicalMember3: nonTechM3,
        nonTechnicalMember4: nonTechM4,
        paymentId: form.paymentId.trim(),
        checkmateInterested,
        filmforgeInterested,
      };

      const result = await submitToGoogleSheet(payload);
      setSuccessResult(result);

      // Play success sound
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioContext();
        const playTone = (freq: number, startTime: number, duration: number) => {
          const osc = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + startTime + 0.03);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          osc.start(audioCtx.currentTime + startTime);
          osc.stop(audioCtx.currentTime + startTime + duration);
        };
        playTone(523.25, 0, 0.15);
        playTone(1046.50, 0.12, 0.4);
      } catch(e) {}

      setStep(5); // 06 CONFIRMED
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed to save. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background-warm/40 pt-24 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8">
            <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-2">
              PIXEL-3.O · NATIONAL LEVEL SYMPOSIUM
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              {successResult ? 'REGISTRATION CONFIRMED' : 'SYMPOSIUM REGISTRATION'}
            </h1>
            {!successResult && (
              <p className="text-xs sm:text-sm text-foreground-secondary">
                14 October 2026 · Department of CSE · Adhiparasakthi Engineering College
              </p>
            )}
          </div>

          {deadlinePassed ? (
            <div className="bg-white rounded-3xl border border-red-200 shadow-sm p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">REGISTRATION CLOSED</h2>
              <p className="text-sm text-foreground-secondary max-w-md mx-auto">
                The registration deadline for PIXEL-3.O passed on <strong>13 October 2026 at 10:00 PM IST</strong>.
                New registrations and payments are no longer accepted.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground hover:bg-background-warm transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-8">
              <ProgressBar current={step} />

              {step === 0 && (
                <Step1Participant
                  data={form.step1}
                  onChange={d => setForm(f => ({ ...f, step1: d }))}
                  onNext={() => setStep(1)}
                />
              )}

              {step === 1 && (
                <Step2Events
                  techEvent={form.techEvent}
                  nonTechEvent={form.nonTechEvent}
                  onTechChange={handleTechEventChange}
                  onNonTechChange={handleNonTechEventChange}
                  onNext={() => setStep(2)}
                  onBack={() => setStep(0)}
                />
              )}

              {step === 2 && (
                <Step3Team
                  techEvent={form.techEvent}
                  nonTechEvent={form.nonTechEvent}
                  step1={form.step1}
                  paperQuestMembers={form.paperQuestMembers}
                  onPaperQuestChange={m => setForm(f => ({ ...f, paperQuestMembers: m }))}
                  mimeRelayMembers={form.mimeRelayMembers}
                  onMimeRelayChange={m => setForm(f => ({ ...f, mimeRelayMembers: m }))}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}

              {step === 3 && (
                <Step4Review
                  form={form}
                  onNext={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}

              {step === 4 && (
                <Step5Payment
                  form={form}
                  onPaymentIdChange={id => setForm(f => ({ ...f, paymentId: id }))}
                  onSubmit={handleFinalSubmit}
                  onBack={() => setStep(3)}
                  loading={loading}
                  error={error}
                />
              )}

              {step === 5 && successResult && (
                <Step6Confirmed
                  result={successResult}
                  form={form}
                  onClose={() => navigate('/')}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

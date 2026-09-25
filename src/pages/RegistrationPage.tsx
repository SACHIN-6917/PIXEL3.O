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
  QrCode,
  ShieldCheck,
  Sparkles,
  Plus,
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

// ─── Interfaces ───────────────────────────────────────────────────
interface Step1Data {
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
}

/**
 * NEW: Unified master participant list.
 * masterParticipants[0] = main participant (auto, locked = step1.fullName)
 * masterParticipants[1..n] = additional unique members entered by the user
 *
 * techAssignment   = indices into masterParticipants for the tech event
 * nonTechAssignment = indices into masterParticipants for the non-tech event
 *
 * PaperQuest   → exactly 4 indices
 * AI FilmForge → exactly 1 index
 * Checkmate    → exactly 1 index
 * Mine Relay   → exactly 4 indices
 */
interface FormState {
  step1: Step1Data;
  techEvent: TechEvent;
  nonTechEvent: NonTechEvent;
  masterParticipants: string[];   // ['Main Name', 'M2', 'M3', …]
  techAssignment: number[];       // indices for tech event participants
  nonTechAssignment: number[];    // indices for non-tech event participants
  paymentId: string;
}

// ─── helpers ──────────────────────────────────────────────────────

/** returns names (strings) for each event from the master list */
function resolveNames(master: string[], indices: number[]): string[] {
  return indices.map(i => (master[i] ?? '').trim()).filter(Boolean);
}

/** Build a fresh set of default assignments given the current events & master list */
function defaultAssignments(
  techEvent: TechEvent,
  nonTechEvent: NonTechEvent,
  master: string[]
): { techAssignment: number[]; nonTechAssignment: number[] } {
  const validIndices = master.map((_, i) => i).filter(i => master[i]?.trim());

  let techAssignment: number[] = [];
  if (techEvent === 'PaperQuest') {
    techAssignment = validIndices.slice(0, 4);
  } else if (techEvent === 'AI FilmForge') {
    techAssignment = [0];
  }

  let nonTechAssignment: number[] = [];
  if (nonTechEvent === 'Mine Relay') {
    nonTechAssignment = validIndices.slice(0, 4);
  } else if (nonTechEvent === 'Checkmate') {
    nonTechAssignment = [0];
  }

  return { techAssignment, nonTechAssignment };
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
          name="MINE RELAY"
          sub="Team of 4 Members"
          venue="Auditorium"
          icon={<Zap className="w-5 h-5" />}
          selected={nonTechEvent === 'Mine Relay'}
          onClick={() => { setError(''); onNonTechChange('Mine Relay'); }}
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
// STEP 3 — MASTER PARTICIPANT LIST + EVENT ASSIGNMENTS
// ═══════════════════════════════════════════════════════════════════
const Step3Team: React.FC<{
  techEvent: TechEvent;
  nonTechEvent: NonTechEvent;
  masterParticipants: string[];
  onMasterChange: (m: string[]) => void;
  techAssignment: number[];
  onTechAssignment: (a: number[]) => void;
  nonTechAssignment: number[];
  onNonTechAssignment: (a: number[]) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({
  techEvent,
  nonTechEvent,
  masterParticipants,
  onMasterChange,
  techAssignment,
  onTechAssignment,
  nonTechAssignment,
  onNonTechAssignment,
  onNext,
  onBack,
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [assignError, setAssignError] = useState('');

  const mainName = masterParticipants[0] || 'Main Participant';

  // How many ADDITIONAL member inputs to show (beyond main participant)
  const techNeedsTeam = techEvent === 'PaperQuest';
  const nonTechNeedsTeam = nonTechEvent === 'Mine Relay';
  const needsTeam = techNeedsTeam || nonTechNeedsTeam;

  // Minimum additional slots needed
  const minAdditional = needsTeam ? 3 : 0;
  // Current additional slots (at least minAdditional, or however many the user has)
  const currentAdditional = masterParticipants.length - 1;
  const slotsToShow = Math.max(minAdditional, currentAdditional);

  // Filled (valid) participants in master list
  const validMaster = masterParticipants.filter(m => m.trim());
  const validIndices = masterParticipants
    .map((m, i) => ({ m, i }))
    .filter(({ m }) => m.trim())
    .map(({ i }) => i);

  // Both team events selected — need checkboxes for assignment
  const bothTeamEvents = techNeedsTeam && nonTechNeedsTeam;

  // Solo event has multiple pool members → show radio selection
  const soloTechNeedsRadio = techEvent === 'AI FilmForge' && validMaster.length > 1;
  const soloNonTechNeedsRadio = nonTechEvent === 'Checkmate' && validMaster.length > 1;
  const isBothSolo =
    (techEvent === 'AI FilmForge' || !techEvent) &&
    (nonTechEvent === 'Checkmate' || !nonTechEvent);

  const validate = (): boolean => {
    setAssignError('');
    const newErrors: string[] = [];

    // Team event member validation
    if (needsTeam) {
      for (let i = 0; i < minAdditional; i++) {
        const val = masterParticipants[i + 1] ?? '';
        if (!val.trim()) {
          newErrors[i] = `Member ${i + 2} name is required`;
        } else {
          newErrors[i] = '';
        }
      }
      setErrors(newErrors);
      if (newErrors.some(Boolean)) return false;
    }

    // Validate team assignments
    if (techNeedsTeam && techAssignment.length !== 4) {
      setAssignError('Please select exactly 4 participants for PAPERQUEST.');
      return false;
    }
    if (nonTechNeedsTeam && nonTechAssignment.length !== 4) {
      setAssignError('Please select exactly 4 participants for MINE RELAY.');
      return false;
    }

    return true;
  };

  // Update an additional participant slot
  const updateMember = (slotIndex: number, value: string) => {
    const arr = [...masterParticipants];
    arr[slotIndex + 1] = value;
    onMasterChange(arr);

    // Auto-update assignments after filling members
    const updatedValid = arr.map((m, i) => ({ m, i })).filter(({ m }) => m.trim()).map(({ i }) => i);

    if (techNeedsTeam && !bothTeamEvents) {
      onTechAssignment(updatedValid.slice(0, 4));
    }
    if (nonTechNeedsTeam && !bothTeamEvents) {
      onNonTechAssignment(updatedValid.slice(0, 4));
    }
    if (bothTeamEvents) {
      // Both events auto-assign all available (user can change via checkboxes)
      onTechAssignment(updatedValid.slice(0, Math.min(4, updatedValid.length)));
      onNonTechAssignment(updatedValid.slice(0, Math.min(4, updatedValid.length)));
    }
  };

  // Toggle checkbox for team events
  const toggleTeamAssignment = (
    idx: number,
    current: number[],
    onChange: (a: number[]) => void
  ) => {
    setAssignError('');
    if (current.includes(idx)) {
      onChange(current.filter(x => x !== idx));
    } else if (current.length < 4) {
      onChange([...current, idx]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">TEAM MEMBERS</h3>
        <p className="text-xs sm:text-sm text-foreground-secondary">
          Add all participants <strong>once</strong>. The same names will be reused across both selected events — no duplicate entry.
        </p>
      </div>

      {/* ── Both solo events ── */}
      {isBothSolo && (
        <div className="p-6 rounded-2xl bg-phoenix-orange/5 border border-phoenix-orange/20 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-phoenix-orange/10 text-phoenix-orange flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-foreground">Solo Participation</h4>
          <p className="text-xs text-foreground-secondary max-w-md mx-auto">
            You have selected solo competitions ({[techEvent, nonTechEvent].filter(Boolean).join(' + ')}).
            No extra team members are required — you compete alone.
          </p>
          <div className="pt-1 p-3 rounded-xl bg-white border border-border text-xs sm:text-sm flex items-center justify-between max-w-sm mx-auto">
            <span className="font-semibold text-foreground">Member 1: {mainName}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-phoenix-orange/10 text-phoenix-orange">
              You
            </span>
          </div>
        </div>
      )}

      {/* ── MASTER PARTICIPANT POOL (when team events are selected) ── */}
      {needsTeam && (
        <div className="p-5 rounded-2xl bg-background-warm border border-border space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-phoenix-orange">
              PARTICIPANT POOL — ADD MEMBERS ONCE
            </span>
            <span className="text-[10px] font-bold text-foreground-muted">
              {validMaster.length} / {needsTeam ? '4+' : '1'} filled
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-border flex items-center justify-between text-xs sm:text-sm">
            <span className="font-semibold text-foreground">Member 1: {mainName}</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-phoenix-orange/10 text-phoenix-orange">
              Main Participant
            </span>
          </div>

          {Array.from({ length: slotsToShow }).map((_, i) => (
            <Field key={i} label={`Member ${i + 2} Name`} error={errors[i]} required={i < minAdditional}>
              <Input
                placeholder={`Enter Member ${i + 2} Full Name`}
                value={masterParticipants[i + 1] || ''}
                hasError={!!errors[i]}
                onChange={e => updateMember(i, e.target.value)}
              />
            </Field>
          ))}

          {/* Add more participants button (only for PQ + MR where teams might differ) */}
          {bothTeamEvents && slotsToShow >= 3 && (
            <button
              type="button"
              onClick={() => onMasterChange([...masterParticipants, ''])}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-border hover:border-phoenix-orange text-xs font-bold text-foreground-muted hover:text-phoenix-orange tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> ADD MORE PARTICIPANTS (for different Mine Relay team)
            </button>
          )}
        </div>
      )}

      {/* ── Notification for PQ + MR unique fee ── */}
      {techEvent === 'PaperQuest' && nonTechEvent === 'Mine Relay' && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Unique Participant Fee Notice:</strong> Fee is{' '}
            <strong>₹129 per unique participant</strong>. If both events share the same 4 members,
            total = ₹516. Each participant is counted only once.
          </div>
        </div>
      )}

      {/* ── PAPERQUEST ASSIGNMENT (when >4 in pool) ── */}
      {techNeedsTeam && validMaster.length > 4 && (
        <div className="p-5 rounded-2xl bg-background-warm border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-phoenix-orange">
              PAPERQUEST — Select Your 4 Members
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${techAssignment.length === 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {techAssignment.length}/4 selected
            </span>
          </div>
          <div className="space-y-2">
            {validIndices.map(idx => (
              <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border hover:border-phoenix-orange cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={techAssignment.includes(idx)}
                  onChange={() => toggleTeamAssignment(idx, techAssignment, onTechAssignment)}
                  className="w-4 h-4 accent-phoenix-orange"
                />
                <span className="text-sm font-semibold text-foreground group-hover:text-darkAccent">
                  {idx === 0 ? `${masterParticipants[idx]} (You)` : masterParticipants[idx]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── MINE RELAY ASSIGNMENT ── */}
      {nonTechNeedsTeam && validMaster.length > 4 && (
        <div className="p-5 rounded-2xl bg-background-warm border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold tracking-wider uppercase text-phoenix-magenta">
              MINE RELAY — Select Your 4 Members
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${nonTechAssignment.length === 4 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {nonTechAssignment.length}/4 selected
            </span>
          </div>
          <div className="space-y-2">
            {validIndices.map(idx => (
              <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border hover:border-phoenix-magenta cursor-pointer transition-colors group">
                <input
                  type="checkbox"
                  checked={nonTechAssignment.includes(idx)}
                  onChange={() => toggleTeamAssignment(idx, nonTechAssignment, onNonTechAssignment)}
                  className="w-4 h-4 accent-phoenix-orange"
                />
                <span className="text-sm font-semibold text-foreground group-hover:text-darkAccent">
                  {idx === 0 ? `${masterParticipants[idx]} (You)` : masterParticipants[idx]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── AI FILMFORGE — solo, select 1 from pool ── */}
      {soloTechNeedsRadio && (
        <div className="p-5 rounded-2xl bg-background-warm border border-border space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-phoenix-orange">
            AI FILMFORGE — Solo Participant (Select 1)
          </span>
          <div className="space-y-2">
            {validIndices.map(idx => (
              <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border hover:border-phoenix-orange cursor-pointer transition-colors group">
                <input
                  type="radio"
                  name="filmforge-participant"
                  checked={techAssignment[0] === idx}
                  onChange={() => onTechAssignment([idx])}
                  className="w-4 h-4 accent-phoenix-orange"
                />
                <span className="text-sm font-semibold text-foreground group-hover:text-darkAccent">
                  {idx === 0 ? `${masterParticipants[idx]} (You)` : masterParticipants[idx]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ── CHECKMATE — solo, select 1 from pool ── */}
      {soloNonTechNeedsRadio && (
        <div className="p-5 rounded-2xl bg-background-warm border border-border space-y-3">
          <span className="text-xs font-bold tracking-wider uppercase text-phoenix-magenta">
            CHECKMATE — Solo Participant (Select 1)
          </span>
          <div className="space-y-2">
            {validIndices.map(idx => (
              <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border hover:border-phoenix-magenta cursor-pointer transition-colors group">
                <input
                  type="radio"
                  name="checkmate-participant"
                  checked={nonTechAssignment[0] === idx}
                  onChange={() => onNonTechAssignment([idx])}
                  className="w-4 h-4 accent-phoenix-orange"
                />
                <span className="text-sm font-semibold text-foreground group-hover:text-darkAccent">
                  {idx === 0 ? `${masterParticipants[idx]} (You)` : masterParticipants[idx]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {assignError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5" /> {assignError}
        </div>
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

// ═══════════════════════════════════════════════════════════════════
// STEP 4 — REVIEW & UNIQUE FEE BREAKDOWN
// ═══════════════════════════════════════════════════════════════════
const Step4Review: React.FC<{
  form: FormState;
  onNext: () => void;
  onBack: () => void;
}> = ({ form, onNext, onBack }) => {
  const { step1, techEvent, nonTechEvent, masterParticipants, techAssignment, nonTechAssignment } = form;

  // Resolve participant names from master list + assignments
  const techNames = techEvent ? resolveNames(masterParticipants, techAssignment) : [];
  const nonTechNames = nonTechEvent ? resolveNames(masterParticipants, nonTechAssignment) : [];

  // Derive member arrays for fee calculation (same interface as before)
  // techMembers = all names for tech event except the first (main participant)
  const techMembersForCalc = techNames.slice(1);
  const nonTechMembersForCalc = nonTechNames.slice(1);

  const calculation = calculateUniqueMembersAndFee(
    step1.fullName,
    techEvent,
    techMembersForCalc,
    nonTechEvent,
    nonTechMembersForCalc
  );

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

      {/* Events Summary — event-wise participant list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tech */}
        <div className="p-4 rounded-2xl bg-white border border-border">
          <span className="text-[10px] font-bold tracking-wider uppercase text-phoenix-orange block mb-1">
            TECHNICAL EVENT
          </span>
          <div className="text-sm font-bold text-foreground">
            {techEvent ? (
              <div>
                <div>{techEvent}</div>
                <div className="text-[11px] text-foreground-muted font-normal mt-1 space-y-0.5">
                  {techNames.map((n, i) => (
                    <div key={i}>{i + 1}. {n}</div>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-foreground-muted font-normal italic">None Selected</span>
            )}
          </div>
        </div>

        {/* Non-Tech */}
        <div className="p-4 rounded-2xl bg-white border border-border">
          <span className="text-[10px] font-bold tracking-wider uppercase text-phoenix-magenta block mb-1">
            NON-TECHNICAL EVENT
          </span>
          <div className="text-sm font-bold text-foreground">
            {nonTechEvent ? (
              <div>
                <div>{nonTechEvent}</div>
                <div className="text-[11px] text-foreground-muted font-normal mt-1 space-y-0.5">
                  {nonTechNames.map((n, i) => (
                    <div key={i}>{i + 1}. {n}</div>
                  ))}
                </div>
              </div>
            ) : (
              <span className="text-foreground-muted font-normal italic">None Selected</span>
            )}
          </div>
        </div>
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
  const [utrError, setUtrError] = useState('');

  const { step1, techEvent, nonTechEvent, masterParticipants, techAssignment, nonTechAssignment } = form;

  const techNames = techEvent ? resolveNames(masterParticipants, techAssignment) : [];
  const nonTechNames = nonTechEvent ? resolveNames(masterParticipants, nonTechAssignment) : [];

  const calculation = calculateUniqueMembersAndFee(
    step1.fullName,
    techEvent,
    techNames.slice(1),
    nonTechEvent,
    nonTechNames.slice(1)
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
      setUtrError('Payment ID / UTR is required to confirm your registration.');
      return;
    }
    if (form.paymentId.trim().length < 4) {
      setUtrError('Please enter a valid Transaction ID / UTR.');
      return;
    }
    setUtrError('');
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
              alt="PIXELO 3.O Dynamic UPI QR"
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

          <div className="pt-2 text-center">
            <details className="cursor-pointer group">
              <summary className="text-[11px] font-semibold text-foreground-muted hover:text-phoenix-orange transition-colors list-none flex items-center justify-center gap-1">
                <span>View Static Organizer QR (Reference)</span>
                <span className="text-[9px] bg-background-warm border border-border px-1.5 py-0.5 rounded">Fallback</span>
              </summary>
              <div className="mt-3 p-3 bg-white rounded-2xl border border-border inline-block shadow-sm">
                <img
                  src="/Payment-Qr.jpeg"
                  alt="Organizer Reference UPI QR"
                  className="w-44 h-44 object-contain mx-auto rounded-lg"
                />
                <p className="text-[10px] text-foreground-muted mt-2 max-w-[200px] mx-auto leading-tight">
                  Reference organizer QR for UPI ID <strong>{upiId}</strong>. Use dynamic QR above for pre-filled amount.
                </p>
              </div>
            </details>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-border space-y-2 text-xs text-foreground-secondary">
        <p className="font-bold text-foreground text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" /> HOW TO COMPLETE REGISTRATION:
        </p>
        <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] sm:text-xs">
          <li>Open GPay, PhonePe, Paytm, or any UPI app.</li>
          <li>Scan the QR code above or pay to <strong className="text-foreground">{upiId}</strong>.</li>
          <li>Verify payee is <strong>{DEFAULT_UPI_NAME}</strong> and amount is <strong>₹{totalAmount}</strong>.</li>
          <li>After payment, copy the <strong>12-digit UTR / Transaction ID</strong> and paste below.</li>
        </ol>
      </div>

      <Field label="Payment ID / UTR (Transaction Reference Number)" error={utrError} required>
        <Input
          placeholder="e.g. 12-digit UTR from GPay / PhonePe / Paytm"
          value={form.paymentId}
          disabled={loading}
          onChange={e => { setUtrError(''); onPaymentIdChange(e.target.value); }}
          hasError={!!utrError}
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
  onClose: () => void;
}> = ({ result, onClose }) => {
  const [badgeQr, setBadgeQr] = useState<string>('');

  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6A00', '#E51B23', '#D01257', '#9333EA', '#FFB800'],
    });

    QRCode.toDataURL(result.registrationId, {
      width: 180,
      margin: 1,
      color: { dark: '#171717', light: '#ffffff' },
    })
      .then(setBadgeQr)
      .catch(console.error);
  }, [result.registrationId]);

  const handleDownloadConfirmation = () => {
    const text = `=========================================
PIXELO 3.O — OFFICIAL REGISTRATION PASS
National Level Technical Symposium
Department of Computer Science and Engineering
Adhiparasakthi Engineering College
In Association with CSI Kanchipuram Chapter
=========================================

REGISTRATION ID   : ${result.registrationId}
PARTICIPANT NAME  : ${result.fullName}
TOTAL MEMBERS     : ${result.totalMembers}
FEE PAID          : ₹${result.totalAmount}
PAYMENT STATUS    : ${result.paymentStatus}
REGISTRATION STATUS: ${result.registrationStatus}

TECHNICAL EVENT   : ${result.techEvent || 'None'}
NON-TECHNICAL EVENT: ${result.nonTechEvent || 'None'}

DATE OF SYMPOSIUM : 14 October 2026
REPORTING TIME    : 09:00 AM IST
VENUE             : Adhiparasakthi Engineering College, Melmaruvathur

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
          Welcome to PIXELO 3.O, <strong>{result.fullName}</strong>! Your registration is recorded in our system.
        </p>
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
        <MessageCircle className="w-5 h-5" /> JOIN PIXELO 3.O WHATSAPP GROUP
      </a>

      <button
        type="button"
        onClick={handleDownloadConfirmation}
        className="w-full py-3.5 rounded-full border border-border hover:border-phoenix-orange text-foreground-secondary hover:text-phoenix-orange font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 transition-colors"
      >
        <Download className="w-4 h-4" /> DOWNLOAD CONFIRMATION PASS
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
    masterParticipants: [''], // index 0 = main participant (synced from step1.fullName)
    techAssignment: [0],
    nonTechAssignment: [0],
    paymentId: '',
  });

  const deadlinePassed = isDeadlinePassed();

  // Keep masterParticipants[0] in sync with step1.fullName
  useEffect(() => {
    setForm(f => {
      const arr = [...f.masterParticipants];
      arr[0] = f.step1.fullName;
      return { ...f, masterParticipants: arr };
    });
  }, [form.step1.fullName]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // When events change, recalculate default assignments
  const handleTechEventChange = (e: TechEvent) => {
    setForm(f => {
      const newMaster = e === 'PaperQuest'
        ? [f.masterParticipants[0], '', '', '']
        : [f.masterParticipants[0]];
      const { techAssignment, nonTechAssignment } = defaultAssignments(e, f.nonTechEvent, newMaster);
      return { ...f, techEvent: e, masterParticipants: newMaster, techAssignment, nonTechAssignment };
    });
  };

  const handleNonTechEventChange = (e: NonTechEvent) => {
    setForm(f => {
      // If non-tech needs a team and there's no team event, ensure master has 4 slots
      let newMaster = [...f.masterParticipants];
      if (e === 'Mine Relay' && f.techEvent !== 'PaperQuest' && newMaster.length < 4) {
        while (newMaster.length < 4) newMaster.push('');
      } else if (e !== 'Mine Relay' && f.techEvent !== 'PaperQuest' && newMaster.length > 1) {
        newMaster = [newMaster[0]];
      }
      const { techAssignment, nonTechAssignment } = defaultAssignments(f.techEvent, e, newMaster);
      return { ...f, nonTechEvent: e, masterParticipants: newMaster, techAssignment, nonTechAssignment };
    });
  };

  // Final submission to Google Apps Script Backend
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
      setError('Payment ID / UTR is required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { techEvent, nonTechEvent, masterParticipants, techAssignment, nonTechAssignment } = form;

      const techNames = techEvent ? resolveNames(masterParticipants, techAssignment) : [];
      const nonTechNames = nonTechEvent ? resolveNames(masterParticipants, nonTechAssignment) : [];

      const payload = {
        fullName: form.step1.fullName.trim(),
        college: form.step1.college.trim(),
        department: form.step1.department.trim(),
        phone: form.step1.phone.trim(),
        email: form.step1.email.trim(),
        technicalEvent: techEvent === 'PaperQuest' ? 'PAPERQUEST' : techEvent === 'AI FilmForge' ? 'AI FILMFORGE' : '',
        technicalMember1: techNames[0] || '',
        technicalMember2: techNames[1] || '',
        technicalMember3: techNames[2] || '',
        technicalMember4: techNames[3] || '',
        nonTechnicalEvent: nonTechEvent === 'Mine Relay' ? 'MINE RELAY' : nonTechEvent === 'Checkmate' ? 'CHECKMATE' : '',
        nonTechnicalMember1: nonTechNames[0] || '',
        nonTechnicalMember2: nonTechNames[1] || '',
        nonTechnicalMember3: nonTechNames[2] || '',
        nonTechnicalMember4: nonTechNames[3] || '',
        paymentId: form.paymentId.trim(),
      };

      const result = await submitToGoogleSheet(payload);
      setSuccessResult(result);
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
              PIXELO 3.O · NATIONAL LEVEL SYMPOSIUM
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
                The registration deadline for PIXELO 3.O passed on <strong>13 October 2026 at 10:00 PM IST</strong>.
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
                  masterParticipants={form.masterParticipants}
                  onMasterChange={m => setForm(f => ({ ...f, masterParticipants: m }))}
                  techAssignment={form.techAssignment}
                  onTechAssignment={a => setForm(f => ({ ...f, techAssignment: a }))}
                  nonTechAssignment={form.nonTechAssignment}
                  onNonTechAssignment={a => setForm(f => ({ ...f, nonTechAssignment: a }))}
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

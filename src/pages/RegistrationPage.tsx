import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { CheckCircle2, ChevronRight, ChevronLeft, Users, Cpu, Film, Swords, Zap, Download, MessageCircle, X } from 'lucide-react';
import { checkDuplicateRegistration, submitRegistration } from '../lib/supabase';
import QRCode from 'qrcode';

// ─── Types ──────────────────────────────────────────────────────
type TechEvent = 'PaperQuest' | 'AI FilmForge' | null;
type NonTechEvent = 'Checkmate' | 'Mine Relay' | null;

interface Step1Data { fullName: string; college: string; department: string; phone: string; email: string; }
interface FormState {
  step1: Step1Data;
  techEvent: TechEvent;
  techMembers: string[];   // [member2, member3] — member1 is step1.fullName
  nonTechEvent: NonTechEvent;
  nonTechMembers: string[]; // [member2, member3, member4]
}

interface SuccessData { registrationCode: string; fullName: string; techEvent: TechEvent; nonTechEvent: NonTechEvent; }

// ─── Progress Bar ────────────────────────────────────────────────
const STEPS = ['01 DETAILS', '02 TECHNICAL', '03 NON-TECHNICAL', '04 CONFIRM'];

const ProgressBar: React.FC<{ current: number }> = ({ current }) => (
  <div className="flex items-center gap-0 mb-10">
    {STEPS.map((label, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1.5 flex-1">
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${done ? 'bg-phoenix-orange border-phoenix-orange text-white' : active ? 'bg-white border-phoenix-orange text-phoenix-orange' : 'bg-white border-border text-foreground-muted'}`}>
              {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-center ${active ? 'text-phoenix-orange' : done ? 'text-phoenix-orange/70' : 'text-foreground-muted'}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-[2px] flex-1 mb-5 transition-all duration-500 ${done ? 'bg-phoenix-orange' : 'bg-border'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ─── Field ───────────────────────────────────────────────────────
const Field: React.FC<{ label: string; error?: string; children: React.ReactNode }> = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-bold tracking-wider uppercase text-foreground-secondary mb-1.5">{label}</label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }> = ({ hasError, ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-3 rounded-xl border text-sm font-medium text-foreground bg-background-warm/40 placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-phoenix-orange/30 transition-all ${hasError ? 'border-red-400' : 'border-border focus:border-phoenix-orange'}`}
  />
);

// ─── Event Card ───────────────────────────────────────────────────
const EventCard: React.FC<{ name: string; sub: string; icon: React.ReactNode; selected: boolean; disabled?: boolean; onClick: () => void; }> =
  ({ name, sub, icon, selected, disabled, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 relative ${
        disabled ? 'opacity-40 cursor-not-allowed bg-background-secondary border-border' :
        selected ? 'border-phoenix-orange bg-phoenix-orange/5 shadow-phoenix-subtle' :
        'border-border bg-white hover:border-phoenix-orange/50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? 'bg-phoenix-orange text-white' : 'bg-background-warm text-foreground'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold tracking-tight text-foreground">{name}</div>
          <div className="text-xs text-foreground-muted font-medium">{sub}</div>
        </div>
        {selected && <CheckCircle2 className="w-5 h-5 text-phoenix-orange shrink-0" />}
      </div>
    </button>
  );

// ─── Skip Button ──────────────────────────────────────────────────
const SkipBtn: React.FC<{ label: string; selected: boolean; onClick: () => void }> = ({ label, selected, onClick }) => (
  <button type="button" onClick={onClick}
    className={`w-full py-3 rounded-xl border text-xs font-bold tracking-wider uppercase transition-all ${selected ? 'border-foreground-muted bg-background-secondary text-foreground' : 'border-dashed border-border text-foreground-muted hover:border-foreground-muted'}`}>
    {label}
  </button>
);

// ─── Step 1 — Basic Details ───────────────────────────────────────
const Step1: React.FC<{ data: Step1Data; onChange: (d: Step1Data) => void; onNext: () => void }> = ({ data, onChange, onNext }) => {
  const [errors, setErrors] = useState<Partial<Step1Data>>({});

  const validate = () => {
    const e: Partial<Step1Data> = {};
    if (!data.fullName.trim())           e.fullName = 'Name is required';
    if (!data.college.trim())            e.college = 'College is required';
    if (!data.department.trim())         e.department = 'Department is required';
    if (!/^\d{10}$/.test(data.phone))    e.phone = 'Enter a valid 10-digit number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Enter a valid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-5">
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">PARTICIPANT DETAILS</h3>
        <p className="text-sm text-foreground-secondary">Enter your personal information to get started.</p>
      </div>
      <Field label="Full Name" error={errors.fullName}>
        <Input placeholder="Enter your full name" value={data.fullName} onChange={e => onChange({ ...data, fullName: e.target.value })} hasError={!!errors.fullName} />
      </Field>
      <Field label="College Name" error={errors.college}>
        <Input placeholder="Enter your college name" value={data.college} onChange={e => onChange({ ...data, college: e.target.value })} hasError={!!errors.college} />
      </Field>
      <Field label="Department" error={errors.department}>
        <Input placeholder="e.g. Computer Science and Engineering" value={data.department} onChange={e => onChange({ ...data, department: e.target.value })} hasError={!!errors.department} />
      </Field>
      <Field label="Phone Number" error={errors.phone}>
        <Input placeholder="10-digit mobile number" value={data.phone} onChange={e => onChange({ ...data, phone: e.target.value })} maxLength={10} hasError={!!errors.phone} />
      </Field>
      <Field label="Email ID" error={errors.email}>
        <Input type="email" placeholder="your@email.com" value={data.email} onChange={e => onChange({ ...data, email: e.target.value })} hasError={!!errors.email} />
      </Field>
      <button onClick={() => validate() && onNext()} className="w-full phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-2 mt-2">
        NEXT <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ─── Step 2 — Technical Event ─────────────────────────────────────
const Step2: React.FC<{
  techEvent: TechEvent; techMembers: string[]; name: string;
  onEventChange: (e: TechEvent) => void; onMembersChange: (m: string[]) => void;
  onNext: () => void; onBack: () => void;
}> = ({ techEvent, techMembers, name, onEventChange, onMembersChange, onNext, onBack }) => {

  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    if (!techEvent) return true; // skip is valid
    if (techEvent === 'PaperQuest') {
      const e = techMembers.map((m, i) => (!m.trim() ? `Member ${i + 2} name required` : ''));
      setErrors(e);
      return e.every(x => !x);
    }
    return true;
  };

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">TECHNICAL EVENT</h3>
        <p className="text-sm text-foreground-secondary">Choose ONE technical event or skip.</p>
      </div>

      <div className="space-y-3">
        <EventCard name="PAPERQUEST" sub="Team of 4 Members" icon={<Cpu className="w-5 h-5" />}
          selected={techEvent === 'PaperQuest'} disabled={techEvent === 'AI FilmForge'}
          onClick={() => { onEventChange('PaperQuest'); onMembersChange(['', '', '']); }} />
        <EventCard name="AI FILMFORGE" sub="Solo Event" icon={<Film className="w-5 h-5" />}
          selected={techEvent === 'AI FilmForge'} disabled={techEvent === 'PaperQuest'}
          onClick={() => { onEventChange('AI FilmForge'); onMembersChange([]); }} />
        <SkipBtn label="SKIP TECHNICAL EVENT" selected={techEvent === null} onClick={() => { onEventChange(null); onMembersChange([]); }} />
      </div>

      {/* PaperQuest team members */}
      {techEvent === 'PaperQuest' && (
        <div className="mt-2 p-4 rounded-2xl bg-background-warm border border-border space-y-3">
          <p className="text-xs font-bold tracking-wider uppercase text-foreground-secondary mb-2">TEAM MEMBERS — PAPERQUEST</p>
          <div className="px-4 py-3 rounded-xl bg-phoenix-orange/10 border border-phoenix-orange/20 text-sm font-semibold text-foreground">
            Member 1 — {name || 'You (Participant)'}
          </div>
          {(['Member 2', 'Member 3', 'Member 4'] as const).map((label, i) => (
            <div key={label}>
              <Input placeholder={`${label} name`} value={techMembers[i] || ''} hasError={!!errors[i]}
                onChange={e => { const m = [...techMembers]; m[i] = e.target.value; onMembersChange(m); }} />
              {errors[i] && <p className="text-xs text-red-500 mt-1">{errors[i]}</p>}
            </div>
          ))}
        </div>
      )}

      {/* AI FilmForge confirmation */}
      {techEvent === 'AI FilmForge' && (
        <div className="mt-2 p-4 rounded-2xl bg-background-warm border border-border">
          <p className="text-xs font-bold tracking-wider uppercase text-foreground-secondary mb-2">AI FILMFORGE — SOLO</p>
          <div className="px-4 py-3 rounded-xl bg-phoenix-orange/10 border border-phoenix-orange/20 text-sm font-semibold text-foreground">
            Solo Participant — {name || 'You'}
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="w-4 h-4" /> BACK
        </button>
        <button onClick={() => validate() && onNext()} className="flex-1 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2">
          NEXT <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Step 3 — Non-Technical Event ─────────────────────────────────
const Step3: React.FC<{
  nonTechEvent: NonTechEvent; nonTechMembers: string[]; name: string;
  onEventChange: (e: NonTechEvent) => void; onMembersChange: (m: string[]) => void;
  onNext: () => void; onBack: () => void;
}> = ({ nonTechEvent, nonTechMembers, name, onEventChange, onMembersChange, onNext, onBack }) => {
  const [errors, setErrors] = useState<string[]>([]);

  const validate = () => {
    if (!nonTechEvent) return true;
    if (nonTechEvent === 'Mine Relay') {
      const e = nonTechMembers.map((m, i) => (!m.trim() ? `Member ${i + 2} name required` : ''));
      setErrors(e);
      return e.every(x => !x);
    }
    return true;
  };

  return (
    <div className="space-y-5">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">NON-TECHNICAL EVENT</h3>
        <p className="text-sm text-foreground-secondary">Choose ONE non-technical event or skip.</p>
      </div>

      <div className="space-y-3">
        <EventCard name="CHECKMATE" sub="Solo Event" icon={<Swords className="w-5 h-5" />}
          selected={nonTechEvent === 'Checkmate'} disabled={nonTechEvent === 'Mine Relay'}
          onClick={() => { onEventChange('Checkmate'); onMembersChange([]); }} />
        <EventCard name="MINE RELAY" sub="Team of 4 Members" icon={<Zap className="w-5 h-5" />}
          selected={nonTechEvent === 'Mine Relay'} disabled={nonTechEvent === 'Checkmate'}
          onClick={() => { onEventChange('Mine Relay'); onMembersChange(['', '', '']); }} />
        <SkipBtn label="SKIP NON-TECHNICAL EVENT" selected={nonTechEvent === null} onClick={() => { onEventChange(null); onMembersChange([]); }} />
      </div>

      {/* Checkmate */}
      {nonTechEvent === 'Checkmate' && (
        <div className="mt-2 p-4 rounded-2xl bg-background-warm border border-border">
          <p className="text-xs font-bold tracking-wider uppercase text-foreground-secondary mb-2">CHECKMATE — SOLO</p>
          <div className="px-4 py-3 rounded-xl bg-phoenix-orange/10 border border-phoenix-orange/20 text-sm font-semibold text-foreground">
            Solo Participant — {name || 'You'}
          </div>
        </div>
      )}

      {/* Mine Relay team */}
      {nonTechEvent === 'Mine Relay' && (
        <div className="mt-2 p-4 rounded-2xl bg-background-warm border border-border space-y-3">
          <p className="text-xs font-bold tracking-wider uppercase text-foreground-secondary mb-2">TEAM MEMBERS — MINE RELAY</p>
          <div className="px-4 py-3 rounded-xl bg-phoenix-orange/10 border border-phoenix-orange/20 text-sm font-semibold text-foreground">
            Member 1 — {name || 'You (Participant)'}
          </div>
          {(['Member 2', 'Member 3', 'Member 4'] as const).map((label, i) => (
            <div key={label}>
              <Input placeholder={`${label} name`} value={nonTechMembers[i] || ''} hasError={!!errors[i]}
                onChange={e => { const m = [...nonTechMembers]; m[i] = e.target.value; onMembersChange(m); }} />
              {errors[i] && <p className="text-xs text-red-500 mt-1">{errors[i]}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="w-4 h-4" /> BACK
        </button>
        <button onClick={() => validate() && onNext()} className="flex-1 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2">
          REVIEW <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Step 4 — Review & Confirm ────────────────────────────────────
const Step4: React.FC<{
  form: FormState;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
  error: string;
}> = ({ form, onBack, onConfirm, loading, error }) => {
  const { step1, techEvent, techMembers, nonTechEvent, nonTechMembers } = form;
  const techTeam = techEvent ? [step1.fullName, ...techMembers].filter(Boolean) : [];
  const nonTechTeam = nonTechEvent ? [step1.fullName, ...nonTechMembers].filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-1">REVIEW YOUR REGISTRATION</h3>
        <p className="text-sm text-foreground-secondary">Verify all details before confirming.</p>
      </div>

      {/* Participant */}
      <div className="p-5 rounded-2xl bg-background-warm border border-border">
        <p className="text-[10px] font-bold tracking-[0.2em] text-phoenix-orange uppercase mb-3">PARTICIPANT</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-foreground-muted font-medium">Name</span><span className="font-bold text-foreground">{step1.fullName}</span></div>
          <div className="flex justify-between"><span className="text-foreground-muted font-medium">College</span><span className="font-bold text-foreground text-right max-w-[60%]">{step1.college}</span></div>
          <div className="flex justify-between"><span className="text-foreground-muted font-medium">Department</span><span className="font-bold text-foreground">{step1.department}</span></div>
          <div className="flex justify-between"><span className="text-foreground-muted font-medium">Phone</span><span className="font-bold text-foreground">{step1.phone}</span></div>
          <div className="flex justify-between"><span className="text-foreground-muted font-medium">Email</span><span className="font-bold text-foreground text-right max-w-[60%] break-all">{step1.email}</span></div>
        </div>
      </div>

      {/* Tech event */}
      {techEvent ? (
        <div className="p-5 rounded-2xl bg-background-warm border border-phoenix-orange/30">
          <p className="text-[10px] font-bold tracking-[0.2em] text-phoenix-orange uppercase mb-3">TECHNICAL EVENT</p>
          <p className="font-bold text-foreground text-base mb-2">{techEvent}</p>
          {techTeam.length > 1 && (
            <ul className="space-y-1">
              {techTeam.map((m, i) => (
                <li key={i} className="text-sm text-foreground-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-phoenix-orange" /> Member {i + 1}: <span className="font-semibold text-foreground">{m}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-background-secondary border border-border text-sm text-foreground-muted font-medium">No Technical Event Selected</div>
      )}

      {/* Non-tech event */}
      {nonTechEvent ? (
        <div className="p-5 rounded-2xl bg-background-warm border border-phoenix-magenta/30">
          <p className="text-[10px] font-bold tracking-[0.2em] text-phoenix-magenta uppercase mb-3">NON-TECHNICAL EVENT</p>
          <p className="font-bold text-foreground text-base mb-2">{nonTechEvent}</p>
          {nonTechTeam.length > 1 && (
            <ul className="space-y-1">
              {nonTechTeam.map((m, i) => (
                <li key={i} className="text-sm text-foreground-secondary flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-phoenix-magenta" /> Member {i + 1}: <span className="font-semibold text-foreground">{m}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-background-secondary border border-border text-sm text-foreground-muted font-medium">No Non-Technical Event Selected</div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 font-medium">{error}</div>
      )}

      <div className="flex gap-3 pt-2">
        <button onClick={onBack} disabled={loading} className="flex-1 py-4 rounded-full border border-border text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:border-foreground-muted transition-colors flex items-center justify-center gap-2">
          <ChevronLeft className="w-4 h-4" /> EDIT
        </button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 phoenix-gradient-btn py-4 rounded-full text-white font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2">
          {loading ? (
            <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> REGISTERING...</span>
          ) : (
            <><CheckCircle2 className="w-4 h-4" /> CONFIRM REGISTRATION</>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── Success Screen ───────────────────────────────────────────────
const SuccessScreen: React.FC<{ data: SuccessData; onClose: () => void }> = ({ data, onClose }) => {
  const [qrUrl, setQrUrl] = React.useState('');

  React.useEffect(() => {
    QRCode.toDataURL(data.registrationCode, { width: 160, margin: 1, color: { dark: '#171717', light: '#ffffff' } })
      .then(setQrUrl).catch(() => {});
  }, [data.registrationCode]);

  const downloadCard = () => {
    const content = `PIXELO 3.O — REGISTRATION CONFIRMED\n\nRegistration ID: ${data.registrationCode}\nParticipant: ${data.fullName}\nTechnical Event: ${data.techEvent || 'None'}\nNon-Technical Event: ${data.nonTechEvent || 'None'}\nEvent Date: 14 October 2026\nReporting Time: 09:00 AM\nVenue: Adhiparasakthi Engineering College`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${data.registrationCode}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-center space-y-6">
      {/* Fire emoji */}
      <div className="text-6xl animate-bounce">🎉</div>

      <div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-1">REGISTRATION SUCCESSFUL!</h3>
        <p className="text-sm text-foreground-secondary">Welcome to PIXELO 3.O, {data.fullName}!</p>
      </div>

      {/* ID Badge */}
      <div className="p-6 rounded-2xl bg-darkAccent text-white text-center space-y-2 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,106,0,0.2) 0%, transparent 70%)' }} />
        <p className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase relative z-10">YOUR PIXELO 3.O ID</p>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white relative z-10">{data.registrationCode}</p>
        {qrUrl && <img src={qrUrl} alt="QR Code" className="w-24 h-24 mx-auto rounded-xl border-2 border-white/20 relative z-10" />}
      </div>

      {/* Events */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-phoenix-orange/10 border border-phoenix-orange/20 text-center">
          <p className="text-[10px] font-bold tracking-widest text-phoenix-orange uppercase mb-1">TECHNICAL</p>
          <p className="text-sm font-bold text-foreground">{data.techEvent || 'Not Selected'}</p>
        </div>
        <div className="p-4 rounded-xl bg-phoenix-magenta/10 border border-phoenix-magenta/20 text-center">
          <p className="text-[10px] font-bold tracking-widest text-phoenix-magenta uppercase mb-1">NON-TECHNICAL</p>
          <p className="text-sm font-bold text-foreground">{data.nonTechEvent || 'Not Selected'}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-background-warm border border-border text-sm text-foreground-secondary">
        <strong className="text-foreground">14 October 2026</strong> · 09:00 AM Reporting · Adhiparasakthi Engineering College
      </div>

      {/* WhatsApp */}
      <a
        href="https://chat.whatsapp.com/YOUR_WHATSAPP_INVITE_LINK"
        target="_blank"
        rel="noreferrer"
        className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20B858] text-white font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        JOIN WHATSAPP GROUP
      </a>

      {/* Download */}
      <button onClick={downloadCard} className="w-full py-3.5 rounded-full border border-border hover:border-phoenix-orange text-foreground-secondary hover:text-phoenix-orange font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 transition-colors">
        <Download className="w-4 h-4" />
        DOWNLOAD CONFIRMATION
      </button>

      <button onClick={onClose} className="text-xs text-foreground-muted hover:text-phoenix-orange transition-colors underline underline-offset-2">
        Back to Home
      </button>
    </div>
  );
};

// ─── Main Registration Page ───────────────────────────────────────
export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<SuccessData | null>(null);

  const [form, setForm] = useState<FormState>({
    step1: { fullName: '', college: '', department: '', phone: '', email: '' },
    techEvent: null,
    techMembers: [],
    nonTechEvent: null,
    nonTechMembers: [],
  });

  // Submit
  const handleConfirm = async () => {
    if (!form.techEvent && !form.nonTechEvent) {
      setError('Please select at least one event (Technical or Non-Technical).');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Check duplicate
      const dup = await checkDuplicateRegistration(form.step1.phone, form.step1.email);
      if (dup) {
        setError(`You are already registered! Your ID is ${dup.registration_code}. Contact the organizers if this is a mistake.`);
        setLoading(false);
        return;
      }

      // Build member arrays (member1 = step1.fullName already, we store extra members)
      const techExtraMembers = form.techEvent === 'PaperQuest' ? form.techMembers : [];
      const nonTechExtraMembers = form.nonTechEvent === 'Mine Relay' ? form.nonTechMembers : [];
      const allTechMembers   = form.techEvent    ? [form.step1.fullName, ...techExtraMembers]    : [];
      const allNonTechMembers= form.nonTechEvent ? [form.step1.fullName, ...nonTechExtraMembers] : [];

      const result = await submitRegistration(
        {
          full_name: form.step1.fullName,
          college_name: form.step1.college,
          department: form.step1.department,
          phone: form.step1.phone,
          email: form.step1.email,
          technical_event: form.techEvent,
          non_technical_event: form.nonTechEvent,
        },
        allTechMembers,
        allNonTechMembers
      );

      setSuccess({
        registrationCode: result.registration_code!,
        fullName: form.step1.fullName,
        techEvent: form.techEvent,
        nonTechEvent: form.nonTechEvent,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background-warm/40 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Page Header */}
          <div className="text-center mb-10">
            <div className="text-xs font-bold tracking-[0.3em] text-phoenix-orange uppercase mb-3">PIXELO 3.O · 2026</div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-2">
              {success ? 'REGISTRATION COMPLETE' : 'REGISTER NOW'}
            </h1>
            {!success && <p className="text-sm text-foreground-secondary">14 October 2026 · Adhiparasakthi Engineering College</p>}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-8">
            {success ? (
              <SuccessScreen data={success} onClose={() => navigate('/')} />
            ) : (
              <>
                <ProgressBar current={step} />

                {step === 0 && (
                  <Step1
                    data={form.step1}
                    onChange={d => setForm(f => ({ ...f, step1: d }))}
                    onNext={() => setStep(1)}
                  />
                )}
                {step === 1 && (
                  <Step2
                    techEvent={form.techEvent}
                    techMembers={form.techMembers}
                    name={form.step1.fullName}
                    onEventChange={e => setForm(f => ({ ...f, techEvent: e }))}
                    onMembersChange={m => setForm(f => ({ ...f, techMembers: m }))}
                    onNext={() => setStep(2)}
                    onBack={() => setStep(0)}
                  />
                )}
                {step === 2 && (
                  <Step3
                    nonTechEvent={form.nonTechEvent}
                    nonTechMembers={form.nonTechMembers}
                    name={form.step1.fullName}
                    onEventChange={e => setForm(f => ({ ...f, nonTechEvent: e }))}
                    onMembersChange={m => setForm(f => ({ ...f, nonTechMembers: m }))}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <Step4
                    form={form}
                    onBack={() => setStep(2)}
                    onConfirm={handleConfirm}
                    loading={loading}
                    error={error}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

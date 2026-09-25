/// <reference types="vite/client" />

export const REGISTRATION_DEADLINE = new Date('2026-10-13T22:00:00+05:30').getTime();
export const FEE_PER_HEAD = 129;
export const DEFAULT_UPI_ID = import.meta.env.VITE_UPI_ID || 'sachinvelu6925-2@oksbi';
export const DEFAULT_UPI_NAME = 'PIXEL-3.O';
export const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v';
export const STATIC_QR_PATH = '/Payment-Qr.jpeg';

export function isDeadlinePassed(): boolean {
  return Date.now() > REGISTRATION_DEADLINE;
}

export type TechEvent = 'PaperQuest' | 'AI FilmForge' | null;
export type NonTechEvent = 'Checkmate' | 'Mine Relay' | null;

export interface RegistrationPayload {
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
  technicalEvent: string; // 'PAPERQUEST' | 'AI FILMFORGE' | ''
  technicalMember1: string;
  technicalMember2: string;
  technicalMember3: string;
  technicalMember4: string;
  nonTechnicalEvent: string; // 'CHECKMATE' | 'MINE RELAY' | ''
  nonTechnicalMember1: string;
  nonTechnicalMember2: string;
  nonTechnicalMember3: string;
  nonTechnicalMember4: string;
  paymentId: string;
}

export interface RegistrationRecord {
  registrationId: string;
  fullName: string;
  college: string;
  department: string;
  phone: string;
  email: string;
  techEvent: string;
  techMember1: string;
  techMember2: string;
  techMember3: string;
  techMember4: string;
  nonTechEvent: string;
  nonTechMember1: string;
  nonTechMember2: string;
  nonTechMember3: string;
  nonTechMember4: string;
  totalMembers: number;
  feePerHead: number;
  totalAmount: number;
  paymentStatus: 'Submitted' | 'Paid' | 'Pending' | 'Failed';
  paymentId: string;
  registrationStatus: 'Confirmed' | 'Pending' | 'Cancelled';
  registeredAt: string;
}

export interface RegistrationResult {
  success: boolean;
  registrationId: string;
  fullName: string;
  totalMembers: number;
  feePerHead: number;
  totalAmount: number;
  techEvent: string;
  nonTechEvent: string;
  paymentStatus: string;
  registrationStatus: string;
  registeredAt?: string;
  duplicate?: boolean;
  message?: string;
  error?: string;
}

/**
 * Calculates unique participants and total fee:
 * ₹129 per unique participant.
 * If the same person participates in both selected events, count that person only once.
 */
export function calculateUniqueMembersAndFee(
  mainParticipant: string,
  techEvent: TechEvent,
  techMembers: string[], // [member2, member3, member4] for PaperQuest
  nonTechEvent: NonTechEvent,
  nonTechMembers: string[] // [member2, member3, member4] for Mine Relay
) {
  const pName = mainParticipant.trim();
  const allNames: string[] = [];

  if (techEvent) {
    if (pName) allNames.push(pName);
    if (techEvent === 'PaperQuest') {
      techMembers.forEach(m => {
        if (m && m.trim()) allNames.push(m.trim());
      });
    }
  }

  if (nonTechEvent) {
    if (pName) allNames.push(pName);
    if (nonTechEvent === 'Mine Relay') {
      nonTechMembers.forEach(m => {
        if (m && m.trim()) allNames.push(m.trim());
      });
    }
  }

  // Deduplicate case-insensitively
  const uniqueMap = new Map<string, string>();
  for (const n of allNames) {
    const key = n.trim().toLowerCase();
    if (key && !uniqueMap.has(key)) {
      uniqueMap.set(key, n.trim());
    }
  }

  const uniqueMembers = Array.from(uniqueMap.values());
  const totalMembers = Math.max(uniqueMembers.length, 1);
  const totalAmount = totalMembers * FEE_PER_HEAD;

  return {
    uniqueMembers,
    totalMembers,
    feePerHead: FEE_PER_HEAD,
    totalAmount,
  };
}

/**
 * Builds dynamic UPI payment link with exact calculated amount
 * Example: upi://pay?pa=sachinvelu6925-2@oksbi&pn=PIXEL-3.O&am=516&cu=INR&tn=PIXEL-3.O
 */
export function buildUpiPaymentUrl(
  amount: number,
  upiId: string = DEFAULT_UPI_ID,
  name: string = DEFAULT_UPI_NAME,
  transNote: string = 'PIXEL-3.O'
): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: String(amount),
    cu: 'INR',
    tn: transNote,
  });
  return `upi://pay?${params.toString()}`;
}

const LOCAL_STORAGE_KEY = 'PIXEL_REGISTRATIONS_STORE';

// Helper to get local mock registrations
export function getLocalRegistrations(): RegistrationRecord[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY) || localStorage.getItem('PIXELO_REGISTRATIONS_STORE');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read local registrations store', e);
  }
  return [];
}

// Helper to save local mock registrations
export function saveLocalRegistration(record: RegistrationRecord) {
  try {
    const list = getLocalRegistrations();
    // Prepend or update
    const idx = list.findIndex(r => r.registrationId === record.registrationId);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save to local store', e);
  }
}

export function getGoogleAppsScriptUrl(): string {
  return (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SCRIPT_URL)?.trim() || '';
}

/**
 * Submits the registration to the Google Apps Script Web App
 */
export async function submitToGoogleSheet(payload: RegistrationPayload): Promise<RegistrationResult> {
  if (isDeadlinePassed()) {
    throw new Error('Registration closed on 13 October 2026 at 10:00 PM IST.');
  }

  const scriptUrl = getGoogleAppsScriptUrl();

  // If script URL is not configured yet or has placeholder, save to local store so system works
  if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    const calc = calculateUniqueMembersAndFee(
      payload.fullName,
      payload.technicalEvent === 'PAPERQUEST' ? 'PaperQuest' : payload.technicalEvent === 'AI FILMFORGE' ? 'AI FilmForge' : null,
      [payload.technicalMember2, payload.technicalMember3, payload.technicalMember4],
      payload.nonTechnicalEvent === 'MINE RELAY' ? 'Mine Relay' : payload.nonTechnicalEvent === 'CHECKMATE' ? 'Checkmate' : null,
      [payload.nonTechnicalMember2, payload.nonTechnicalMember3, payload.nonTechnicalMember4]
    );

    const existingList = getLocalRegistrations();
    const nextNum = existingList.length + 1;
    const regId = `PIXEL-3.O-${String(nextNum).padStart(3, '0')}`;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const newRecord: RegistrationRecord = {
      registrationId: regId,
      fullName: payload.fullName,
      college: payload.college,
      department: payload.department,
      phone: payload.phone,
      email: payload.email,
      techEvent: payload.technicalEvent,
      techMember1: payload.technicalMember1,
      techMember2: payload.technicalMember2,
      techMember3: payload.technicalMember3,
      techMember4: payload.technicalMember4,
      nonTechEvent: payload.nonTechnicalEvent,
      nonTechMember1: payload.nonTechnicalMember1,
      nonTechMember2: payload.nonTechnicalMember2,
      nonTechMember3: payload.nonTechnicalMember3,
      nonTechMember4: payload.nonTechnicalMember4,
      totalMembers: calc.totalMembers,
      feePerHead: FEE_PER_HEAD,
      totalAmount: calc.totalAmount,
      paymentStatus: 'Submitted',
      paymentId: payload.paymentId,
      registrationStatus: 'Confirmed',
      registeredAt: timestamp,
    };

    saveLocalRegistration(newRecord);

    return {
      success: true,
      registrationId: regId,
      fullName: payload.fullName,
      totalMembers: calc.totalMembers,
      feePerHead: FEE_PER_HEAD,
      totalAmount: calc.totalAmount,
      techEvent: payload.technicalEvent,
      nonTechEvent: payload.nonTechnicalEvent,
      paymentStatus: 'Submitted',
      registrationStatus: 'Confirmed',
      registeredAt: timestamp,
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Apps Script returned HTTP ${response.status}`);
    }

    const data: RegistrationResult = await response.json();

    if (!data.success) {
      throw new Error(data.message || data.error || 'Registration failed to save in Google Sheet.');
    }

    // Also mirror to local store for offline cache
    saveLocalRegistration({
      registrationId: data.registrationId,
      fullName: data.fullName,
      college: payload.college,
      department: payload.department,
      phone: payload.phone,
      email: payload.email,
      techEvent: payload.technicalEvent,
      techMember1: payload.technicalMember1,
      techMember2: payload.technicalMember2,
      techMember3: payload.technicalMember3,
      techMember4: payload.technicalMember4,
      nonTechEvent: payload.nonTechnicalEvent,
      nonTechMember1: payload.nonTechnicalMember1,
      nonTechMember2: payload.nonTechnicalMember2,
      nonTechMember3: payload.nonTechnicalMember3,
      nonTechMember4: payload.nonTechnicalMember4,
      totalMembers: data.totalMembers,
      feePerHead: data.feePerHead,
      totalAmount: data.totalAmount,
      paymentStatus: data.paymentStatus as any,
      paymentId: payload.paymentId,
      registrationStatus: data.registrationStatus as any,
      registeredAt: data.registeredAt || new Date().toLocaleString(),
    });

    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error('Connection timed out while saving to Google Sheet. Please check your internet connection.');
      }
      throw err;
    }
    throw new Error('Failed to submit registration. Please try again.');
  }
}

/**
 * Fetch all registrations for Admin Panel
 */
export async function fetchAllRegistrations(token: string): Promise<RegistrationRecord[]> {
  const scriptUrl = getGoogleAppsScriptUrl();

  if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    // Return local cache records
    return getLocalRegistrations();
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify({
        action: 'get_registrations',
        token: token,
      }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
    });

    if (!response.ok) {
      return getLocalRegistrations();
    }

    const data = await response.json();
    if (data.success && Array.isArray(data.registrations)) {
      return data.registrations;
    }
  } catch (err) {
    console.warn('Could not fetch from remote Google Sheet, using local cache:', err);
  }

  return getLocalRegistrations();
}

/**
 * Admin action: Update Payment Status
 */
export async function updatePaymentStatus(
  token: string,
  registrationId: string,
  status: 'Paid' | 'Pending' | 'Failed' | 'Submitted'
): Promise<boolean> {
  const scriptUrl = getGoogleAppsScriptUrl();

  // Update local store first
  const list = getLocalRegistrations();
  const rec = list.find(r => r.registrationId === registrationId);
  if (rec) {
    rec.paymentStatus = status;
    saveLocalRegistration(rec);
  }

  if (scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'update_payment_status',
          token: token,
          registrationId: registrationId,
          paymentStatus: status,
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
      });
    } catch (err) {
      console.error('Remote status update error:', err);
    }
  }

  return true;
}

/**
 * Admin action: Update Registration Status
 */
export async function updateRegistrationStatus(
  token: string,
  registrationId: string,
  status: 'Confirmed' | 'Pending' | 'Cancelled'
): Promise<boolean> {
  const scriptUrl = getGoogleAppsScriptUrl();

  // Update local store first
  const list = getLocalRegistrations();
  const rec = list.find(r => r.registrationId === registrationId);
  if (rec) {
    rec.registrationStatus = status;
    saveLocalRegistration(rec);
  }

  if (scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    try {
      await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify({
          action: 'update_registration_status',
          token: token,
          registrationId: registrationId,
          registrationStatus: status,
        }),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        redirect: 'follow',
      });
    } catch (err) {
      console.error('Remote status update error:', err);
    }
  }

  return true;
}

/// <reference types="vite/client" />

export const REGISTRATION_DEADLINE = new Date('2026-10-13T22:00:00+05:30').getTime();
export const FEE_PER_HEAD = 129;
export const DEFAULT_UPI_ID = import.meta.env.VITE_UPI_ID || 'sachin6917@oksbi';
export const DEFAULT_UPI_NAME = 'PIXELO 3.O';

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
  techMembers: string[], // [member2, member3] for PaperQuest
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
 */
export function buildUpiPaymentUrl(amount: number, upiId: string = DEFAULT_UPI_ID, name: string = DEFAULT_UPI_NAME): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name,
    am: String(amount),
    cu: 'INR',
    tn: 'PIXELO 3.O Registration Fee',
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Submits the registration to the Google Apps Script Web App
 */
export async function submitToGoogleSheet(payload: RegistrationPayload): Promise<RegistrationResult> {
  if (isDeadlinePassed()) {
    throw new Error('Registration closed on 13 October 2026 at 10:00 PM IST.');
  }

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL?.trim();

  // If script URL is not configured yet, notify user with clean instruction
  if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    // In local dev without Google Apps Script configured yet, throw clear error
    // or provide fallback for local testing
    console.warn('VITE_GOOGLE_SCRIPT_URL not configured. Please follow GOOGLE_SHEET_SETUP.md');
    
    // Simulate server processing for development test if strictly running offline
    if (import.meta.env.DEV) {
      await new Promise(r => setTimeout(r, 1200));
      const calc = calculateUniqueMembersAndFee(
        payload.fullName,
        payload.technicalEvent === 'PAPERQUEST' ? 'PaperQuest' : payload.technicalEvent === 'AI FILMFORGE' ? 'AI FilmForge' : null,
        [payload.technicalMember2, payload.technicalMember3],
        payload.nonTechnicalEvent === 'MINE RELAY' ? 'Mine Relay' : payload.nonTechnicalEvent === 'CHECKMATE' ? 'Checkmate' : null,
        [payload.nonTechnicalMember2, payload.nonTechnicalMember3, payload.nonTechnicalMember4]
      );
      
      const mockCounter = Math.floor(1 + Math.random() * 99);
      const mockId = `PIXELO3.O-${String(mockCounter).padStart(3, '0')}`;
      return {
        success: true,
        registrationId: mockId,
        fullName: payload.fullName,
        totalMembers: calc.totalMembers,
        feePerHead: FEE_PER_HEAD,
        totalAmount: calc.totalAmount,
        techEvent: payload.technicalEvent,
        nonTechEvent: payload.nonTechnicalEvent,
        paymentStatus: 'Submitted',
        registrationStatus: 'Confirmed',
        registeredAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };
    }

    throw new Error('Google Apps Script Web App URL is not configured in environment variables.');
  }

  // Use POST with text/plain to avoid CORS preflight, with timeout
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

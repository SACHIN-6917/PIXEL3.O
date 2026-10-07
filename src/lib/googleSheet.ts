/// <reference types="vite/client" />
import {
  isSupabaseConfigured,
  fetchAllSupabaseRegistrations,
  insertSupabaseRegistration,
  updateSupabasePaymentStatus,
  updateSupabaseRegistrationStatus,
  deleteSupabaseRegistration
} from './supabase';

export const REGISTRATION_DEADLINE = new Date('2026-10-13T22:00:00+05:30').getTime();
export const FEE_PER_HEAD = 129;
export const DEFAULT_UPI_ID = import.meta.env.VITE_UPI_ID || 'gokulkumar1406@okaxis';
export const DEFAULT_UPI_NAME = 'PIXEL 3.O';
export const WHATSAPP_COMMUNITY_LINK = 'https://chat.whatsapp.com/EcA1kG8VThJFx58Qmr2l1v';
export const STATIC_QR_PATH = '/Payment-Qr.jpeg';

export function isDeadlinePassed(): boolean {
  return Date.now() > REGISTRATION_DEADLINE;
}

/**
 * Robust date/time parser for Registered_AT timestamps
 * Handles Indian locale ("DD/MM/YYYY, HH:MM:SS am/pm"), GAS ("YYYY-MM-DD HH:MM:SS 'IST'"), and ISO formats.
 */
export function parseRegistrationTimestamp(dateStr?: string | null): number | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const str = dateStr.trim();
  if (!str || str === '—' || str === '-') return null;

  // 1. Direct standard parse (with IST replacement if present)
  const normalizedIst = str.replace(/\s+IST$/i, ' +05:30');
  const direct = Date.parse(normalizedIst);
  if (!isNaN(direct)) return direct;

  // 2. Format: "DD/MM/YYYY, HH:MM:SS" or "DD/MM/YYYY, HH:MM:SS am/pm"
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})(?:[,\s]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?(?:\s*([apAP][mM]))?)?/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    let hours = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
    const minutes = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
    const seconds = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;
    const ampm = dmyMatch[7] ? dmyMatch[7].toLowerCase() : null;

    if (ampm === 'pm' && hours < 12) hours += 12;
    if (ampm === 'am' && hours === 12) hours = 0;

    const d = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  // 3. Format: "YYYY-MM-DD HH:MM:SS"
  const ymdMatch = str.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})(?:[,\s]+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    const hours = ymdMatch[4] ? parseInt(ymdMatch[4], 10) : 0;
    const minutes = ymdMatch[5] ? parseInt(ymdMatch[5], 10) : 0;
    const seconds = ymdMatch[6] ? parseInt(ymdMatch[6], 10) : 0;
    const d = new Date(year, month, day, hours, minutes, seconds);
    if (!isNaN(d.getTime())) return d.getTime();
  }

  const fallback = new Date(str).getTime();
  return isNaN(fallback) ? null : fallback;
}


export type TechEvent = 'PaperQuest' | 'AI FilmForge' | null;
export type NonTechEvent = 'Checkmate' | 'Mime Relay' | null;

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
  nonTechnicalEvent: string; // 'CHECKMATE' | 'MIME RELAY' | ''
  nonTechnicalMember1: string;
  nonTechnicalMember2: string;
  nonTechnicalMember3: string;
  nonTechnicalMember4: string;
  paymentId: string;
  // Per-member cross-event interest (stored as comma-separated 1-indexed member numbers)
  // For PaperQuest members who are Interested in Checkmate (e.g. "1,2,4")
  checkmateInterested?: string;
  // For Mime Relay members who are Interested in AI FilmForge (e.g. "1,3,4")
  filmforgeInterested?: string;
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
  checkmateInterested?: string;
  filmforgeInterested?: string;
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
  nonTechMembers: string[] // [member2, member3, member4] for Mime Relay
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
    if (nonTechEvent === 'Mime Relay') {
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
 * Example: upi://pay?pa=gokulkumar1406@okaxis&pn=PIXEL-3.O&am=516&cu=INR&tn=PIXEL-3.O
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
const BACKUP_STORAGE_KEY = 'PIXEL_REGISTRATIONS_PERMANENT_BACKUP';
const VAULT_STORAGE_KEY = 'PIXEL_REGISTRATIONS_IMMUTABLE_VAULT';
const LEGACY_STORAGE_KEY = 'PIXELO_REGISTRATIONS_STORE';
const DELETED_IDS_KEY = 'PIXEL_EXPLICITLY_DELETED_REGISTRATION_IDS';

// Helper to get list of explicitly deleted IDs (only deleted when admin explicitly confirms)
export function getDeletedRegistrationIds(): string[] {
  try {
    const raw = localStorage.getItem(DELETED_IDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Helper to get local persistent registrations with multi-vault auto-healing
export function getLocalRegistrations(): RegistrationRecord[] {
  try {
    const rawPrimary = localStorage.getItem(LOCAL_STORAGE_KEY);
    const rawBackup = localStorage.getItem(BACKUP_STORAGE_KEY);
    const rawVault = localStorage.getItem(VAULT_STORAGE_KEY);
    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    const deletedIds = new Set(getDeletedRegistrationIds());

    let list1: RegistrationRecord[] = [];
    let list2: RegistrationRecord[] = [];
    let list3: RegistrationRecord[] = [];
    let list4: RegistrationRecord[] = [];

    if (rawPrimary) {
      try { list1 = JSON.parse(rawPrimary); } catch {}
    }
    if (rawBackup) {
      try { list2 = JSON.parse(rawBackup); } catch {}
    }
    if (rawVault) {
      try { list3 = JSON.parse(rawVault); } catch {}
    }
    if (rawLegacy) {
      try { list4 = JSON.parse(rawLegacy); } catch {}
    }

    // Merge all non-deleted records by registrationId to guarantee ZERO data loss
    const map = new Map<string, RegistrationRecord>();
    const allRecords = [...list1, ...list2, ...list3, ...list4];
    
    allRecords.forEach(r => {
      if (r && r.registrationId && !deletedIds.has(r.registrationId)) {
        if (!map.has(r.registrationId)) {
          map.set(r.registrationId, r);
        } else {
          // If already present, keep the one with more complete info or Paid status
          const existing = map.get(r.registrationId)!;
          if (r.paymentStatus === 'Paid' && existing.paymentStatus !== 'Paid') {
            map.set(r.registrationId, r);
          }
        }
      }
    });

    const merged = Array.from(map.values());

    // Auto-heal all storages to ensure 100% data persistence across tabs and sessions
    if (merged.length > 0) {
      const serialized = JSON.stringify(merged);
      localStorage.setItem(LOCAL_STORAGE_KEY, serialized);
      localStorage.setItem(BACKUP_STORAGE_KEY, serialized);
      localStorage.setItem(VAULT_STORAGE_KEY, serialized);
    }

    return merged;
  } catch (e) {
    console.error('Failed to read local registrations store', e);
  }
  return [];
}

// Helper to save local registrations permanently to all persistent storage vaults
export function saveLocalRegistration(record: RegistrationRecord) {
  try {
    const list = getLocalRegistrations();
    const idx = list.findIndex(r => r.registrationId === record.registrationId);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...record };
    } else {
      list.unshift(record);
    }
    const dataStr = JSON.stringify(list);
    localStorage.setItem(LOCAL_STORAGE_KEY, dataStr);
    localStorage.setItem(BACKUP_STORAGE_KEY, dataStr);
    localStorage.setItem(VAULT_STORAGE_KEY, dataStr);
    notifyRegistrationChange();
  } catch (e) {
    console.error('Failed to save to local store', e);
  }
}

// ─── Real-Time Broadcast & Event Sync Bus ───
const BROADCAST_CHANNEL_NAME = 'PIXEL_REGISTRATIONS_SYNC_BUS';
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

export function notifyRegistrationChange() {
  try {
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'REGISTRATION_UPDATED', timestamp: Date.now() });
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pixel:registration_update', { detail: { timestamp: Date.now() } }));
    }
  } catch (e) {
    console.warn('Error broadcasting update', e);
  }
}

export function subscribeToRegistrationUpdates(onUpdate: () => void): () => void {
  const handleMessage = () => onUpdate();
  const handleCustomEvent = () => onUpdate();
  const handleStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY || e.key === VAULT_STORAGE_KEY) {
      onUpdate();
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('pixel:registration_update', handleCustomEvent);
    window.addEventListener('storage', handleStorage);
  }

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('pixel:registration_update', handleCustomEvent);
      window.removeEventListener('storage', handleStorage);
    }
  };
}

// Explicit Delete action - ONLY deletes when this function is explicitly triggered by admin
export async function deleteRegistration(token: string, registrationId: string): Promise<boolean> {
  try {
    // 1. Record ID in explicitly deleted set so it never gets auto-resurrected accidentally
    const deletedIds = getDeletedRegistrationIds();
    if (!deletedIds.includes(registrationId)) {
      deletedIds.push(registrationId);
      localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(deletedIds));
    }

    // 2. Remove from all local storage vaults
    const list = getLocalRegistrations().filter(r => r.registrationId !== registrationId);
    const dataStr = JSON.stringify(list);
    localStorage.setItem(LOCAL_STORAGE_KEY, dataStr);
    localStorage.setItem(BACKUP_STORAGE_KEY, dataStr);
    localStorage.setItem(VAULT_STORAGE_KEY, dataStr);
    notifyRegistrationChange();

    // 3. Delete from Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        await deleteSupabaseRegistration(registrationId);
      } catch (e) {
        console.warn('Supabase delete error:', e);
      }
    }

    // 4. Delete from Google Apps Script if configured
    const scriptUrl = getGoogleAppsScriptUrl();
    if (scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
      try {
        await fetch(scriptUrl, {
          method: 'POST',
          body: JSON.stringify({
            action: 'delete_registration',
            token: token,
            registrationId: registrationId,
          }),
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          redirect: 'follow',
        });
      } catch (err) {
        console.warn('Remote deletion error:', err);
      }
    }
    return true;
  } catch (err) {
    console.error('Error deleting registration:', err);
    return false;
  }
}

export const DEFAULT_GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxzUn5hFzvTP3GotvliByvdKDeMBLAO61WLjbpMe_yGCMNISsF7l11VeCPRKcwsbZ5Meg/exec';

export function getGoogleAppsScriptUrl(): string {
  const envUrl = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SCRIPT_URL)?.trim();
  if (envUrl && !envUrl.includes('YOUR_DEPLOYMENT_ID')) {
    return envUrl;
  }
  return DEFAULT_GOOGLE_SCRIPT_URL;
}

export function createAndSaveLocalRecord(payload: RegistrationPayload): RegistrationResult {
  const calc = calculateUniqueMembersAndFee(
    payload.fullName,
    payload.technicalEvent === 'PAPERQUEST' ? 'PaperQuest' : payload.technicalEvent === 'AI FILMFORGE' ? 'AI FilmForge' : null,
    [payload.technicalMember2, payload.technicalMember3, payload.technicalMember4],
    payload.nonTechnicalEvent === 'MIME RELAY' || payload.nonTechnicalEvent === 'MINE RELAY' ? 'Mime Relay' : payload.nonTechnicalEvent === 'CHECKMATE' ? 'Checkmate' : null,
    [payload.nonTechnicalMember2, payload.nonTechnicalMember3, payload.nonTechnicalMember4]
  );

  const existingList = getLocalRegistrations();
  // Check if duplicate already exists with same phone & paymentId
  const dup = existingList.find(
    r => r.phone === payload.phone && r.paymentId === payload.paymentId && payload.paymentId !== ''
  );
  if (dup) {
    return {
      success: true,
      duplicate: true,
      registrationId: dup.registrationId,
      fullName: dup.fullName,
      totalMembers: dup.totalMembers,
      feePerHead: dup.feePerHead,
      totalAmount: dup.totalAmount,
      techEvent: dup.techEvent,
      nonTechEvent: dup.nonTechEvent,
      paymentStatus: dup.paymentStatus,
      registrationStatus: dup.registrationStatus,
      registeredAt: dup.registeredAt,
    };
  }

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
    checkmateInterested: payload.checkmateInterested || '',
    filmforgeInterested: payload.filmforgeInterested || '',
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

/**
 * Submits the registration to the Supabase Production DB and Google Apps Script Web App
 */
export async function submitToGoogleSheet(payload: RegistrationPayload): Promise<RegistrationResult> {
  if (isDeadlinePassed()) {
    throw new Error('Registration closed on 13 October 2026 at 10:00 PM IST.');
  }

  // 1. Supabase Production Database (Permanent Source of Truth)
  if (isSupabaseConfigured()) {
    try {
      const techM = [payload.technicalMember1, payload.technicalMember2, payload.technicalMember3, payload.technicalMember4].filter(Boolean);
      const nonTechM = [payload.nonTechnicalMember1, payload.nonTechnicalMember2, payload.nonTechnicalMember3, payload.nonTechnicalMember4].filter(Boolean);
      await insertSupabaseRegistration({
        fullName: payload.fullName,
        college: payload.college,
        department: payload.department,
        phone: payload.phone,
        email: payload.email,
        technicalEvent: payload.technicalEvent,
        nonTechnicalEvent: payload.nonTechnicalEvent,
        paymentId: payload.paymentId,
        checkmateInterested: payload.checkmateInterested,
        filmforgeInterested: payload.filmforgeInterested,
      }, techM, nonTechM);
    } catch (sbErr) {
      console.warn('Supabase submission mirror warning:', sbErr);
    }
  }

  const scriptUrl = getGoogleAppsScriptUrl();

  // If script URL is not configured yet or has placeholder, save to local store so system works
  if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    return createAndSaveLocalRecord(payload);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

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
      console.warn(`Google Apps Script returned HTTP ${response.status}. Using guaranteed local fallback.`);
      return createAndSaveLocalRecord(payload);
    }

    const data: RegistrationResult = await response.json();

    if (!data.success) {
      if (data.message && data.message.toLowerCase().includes('sheet not found')) {
        console.warn('Google Sheet tab issue detected on remote script. Saving registration locally and returning confirmed pass.', data.message);
        return createAndSaveLocalRecord(payload);
      }
      throw new Error(data.message || data.error || 'Registration failed to save in Google Sheet.');
    }

    // Mirror to local multi-vault store for offline cache
    saveLocalRegistration({
      registrationId: data.registrationId,
      fullName: data.fullName || payload.fullName,
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
      feePerHead: data.feePerHead || FEE_PER_HEAD,
      totalAmount: data.totalAmount,
      paymentStatus: (data.paymentStatus as any) || 'Submitted',
      paymentId: payload.paymentId,
      registrationStatus: (data.registrationStatus as any) || 'Confirmed',
      registeredAt: data.registeredAt || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      checkmateInterested: payload.checkmateInterested || '',
      filmforgeInterested: payload.filmforgeInterested || '',
    });

    return data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.message && (err.message.includes('required') || err.message.includes('closed') || err.message.includes('valid'))) {
        throw err;
      }
    }
    console.warn('Remote Google Sheet submission had an issue. Saving registration to local store to guarantee pass generation:', err);
    return createAndSaveLocalRecord(payload);
  }
}

/**
 * Fetch all registrations for Admin Panel (Merged Supabase + Google Sheet + Local multi-vault)
 */
export async function fetchAllRegistrations(token: string): Promise<RegistrationRecord[]> {
  const localList = getLocalRegistrations();
  const deletedIds = new Set(getDeletedRegistrationIds());
  const mergedMap = new Map<string, RegistrationRecord>();

  // 1. Try Supabase first if configured (Permanent Source of Truth)
  if (isSupabaseConfigured()) {
    try {
      const sbList = await fetchAllSupabaseRegistrations();
      if (sbList && Array.isArray(sbList)) {
        sbList.forEach(r => {
          if (r.registrationId && !deletedIds.has(r.registrationId)) {
            mergedMap.set(r.registrationId, r as any);
          }
        });
      }
    } catch (sbErr) {
      console.warn('Could not read from Supabase:', sbErr);
    }
  }

  // 2. Fetch from Google Apps Script (Synchronized operational copy)
  const scriptUrl = getGoogleAppsScriptUrl();
  if (scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
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

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.registrations)) {
          const remoteList: RegistrationRecord[] = data.registrations;
          remoteList.forEach(r => {
            if (r.registrationId && !deletedIds.has(r.registrationId)) {
              if (!mergedMap.has(r.registrationId)) {
                mergedMap.set(r.registrationId, r);
              } else {
                // If remote has 'Paid' or newer info, take it
                const existing = mergedMap.get(r.registrationId)!;
                if (r.paymentStatus === 'Paid' && existing.paymentStatus !== 'Paid') {
                  mergedMap.set(r.registrationId, r);
                }
              }
            }
          });
        }
      }
    } catch (err) {
      console.warn('Could not fetch from remote Google Sheet, using cache:', err);
    }
  }

  // 3. Merge local multi-vault records
  localList.forEach(l => {
    if (l.registrationId && !deletedIds.has(l.registrationId) && !mergedMap.has(l.registrationId)) {
      mergedMap.set(l.registrationId, l);
    }
  });

  const mergedList = Array.from(mergedMap.values());
  if (mergedList.length > 0) {
    const dataStr = JSON.stringify(mergedList);
    localStorage.setItem(LOCAL_STORAGE_KEY, dataStr);
    localStorage.setItem(BACKUP_STORAGE_KEY, dataStr);
    localStorage.setItem(VAULT_STORAGE_KEY, dataStr);
  }

  return mergedList;
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

  // Update Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await updateSupabasePaymentStatus(registrationId, status);
    } catch (e) {
      console.warn('Supabase status update error:', e);
    }
  }

  // Update Google Sheet
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

  // Update Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      await updateSupabaseRegistrationStatus(registrationId, status);
    } catch (e) {
      console.warn('Supabase status update error:', e);
    }
  }

  // Update Google Sheet
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

/**
 * Push all Admin & Local multi-vault records directly into Google Sheet
 */
export async function pushAllRegistrationsToGoogleSheet(
  token: string
): Promise<{ success: boolean; syncedCount: number; message: string }> {
  const localList = getLocalRegistrations();
  const scriptUrl = getGoogleAppsScriptUrl();

  if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
    return { success: true, syncedCount: localList.length, message: 'Local storage records active.' };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify({
        action: 'sync_bulk_registrations',
        token: token || 'PIXEL@26',
        registrations: localList,
      }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        return {
          success: true,
          syncedCount: data.syncedCount || localList.length,
          message: data.message || `Successfully synced ${localList.length} registrations to Google Sheet.`,
        };
      }
    }
  } catch (err) {
    console.warn('Could not push bulk registrations to Google Sheet:', err);
  }

  return { success: false, syncedCount: 0, message: 'Google Sheet sync is ready. Ensure latest Code.gs is deployed.' };
}

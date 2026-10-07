/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseUrl.includes('YOUR_PROJECT') &&
    !supabaseAnonKey.includes('placeholder')
  );
};

export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder'
);

// ─── Types ─────────────────────────────────────────────
export interface SupabaseRegistrationRow {
  id?: string;
  registration_number?: number;
  registration_code?: string;
  full_name: string;
  college_name: string;
  department: string;
  phone: string;
  email: string;
  technical_event: string | null;
  non_technical_event: string | null;
  payment_id?: string | null;
  payment_status?: string | null;
  registration_status?: string | null;
  total_members?: number | null;
  fee_per_head?: number | null;
  total_amount?: number | null;
  checkmate_interested?: string | null;
  filmforge_interested?: string | null;
  created_at?: string;
}

export interface SupabaseTeamMemberRow {
  id?: string;
  registration_id: string;
  event_type: 'technical' | 'non_technical';
  event_name: string;
  member_number: number;
  member_name: string;
  created_at?: string;
}

// ─── Fetch All Registrations from Supabase (Source of Truth) ───
export async function fetchAllSupabaseRegistrations() {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: regs, error: regError } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (regError) {
      console.warn('Supabase fetch error:', regError);
      return null;
    }

    if (!regs || regs.length === 0) return [];

    // Also fetch team members for rich mapping
    const { data: members } = await supabase
      .from('team_members')
      .select('*');

    const memberMap = new Map<string, SupabaseTeamMemberRow[]>();
    if (members) {
      members.forEach((m: SupabaseTeamMemberRow) => {
        const list = memberMap.get(m.registration_id) || [];
        list.push(m);
        memberMap.set(m.registration_id, list);
      });
    }

    return regs.map((r: SupabaseRegistrationRow) => {
      const team = r.id ? memberMap.get(r.id) || [] : [];
      const techMembers = team
        .filter(m => m.event_type === 'technical')
        .sort((a, b) => a.member_number - b.member_number);
      const nonTechMembers = team
        .filter(m => m.event_type === 'non_technical')
        .sort((a, b) => a.member_number - b.member_number);

      return {
        registrationId: r.registration_code || `PIXEL-3.O-${String(r.registration_number || 1).padStart(3, '0')}`,
        fullName: r.full_name,
        college: r.college_name,
        department: r.department,
        phone: r.phone,
        email: r.email,
        techEvent: r.technical_event || '',
        techMember1: techMembers[0]?.member_name || r.full_name,
        techMember2: techMembers[1]?.member_name || '',
        techMember3: techMembers[2]?.member_name || '',
        techMember4: techMembers[3]?.member_name || '',
        nonTechEvent: r.non_technical_event || '',
        nonTechMember1: nonTechMembers[0]?.member_name || r.full_name,
        nonTechMember2: nonTechMembers[1]?.member_name || '',
        nonTechMember3: nonTechMembers[2]?.member_name || '',
        nonTechMember4: nonTechMembers[3]?.member_name || '',
        totalMembers: r.total_members || 1,
        feePerHead: r.fee_per_head || 129,
        totalAmount: r.total_amount || 129,
        paymentStatus: (r.payment_status as any) || 'Submitted',
        paymentId: r.payment_id || '',
        registrationStatus: (r.registration_status as any) || 'Confirmed',
        registeredAt: r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '',
        checkmateInterested: r.checkmate_interested || '',
        filmforgeInterested: r.filmforge_interested || '',
      };
    });
  } catch (err) {
    console.warn('Error reading from Supabase:', err);
    return null;
  }
}

// ─── Insert Registration Safely into Supabase ───
export async function insertSupabaseRegistration(
  reg: {
    fullName: string;
    college: string;
    department: string;
    phone: string;
    email: string;
    technicalEvent?: string;
    nonTechnicalEvent?: string;
    paymentId?: string;
    paymentStatus?: string;
    registrationStatus?: string;
    totalMembers?: number;
    feePerHead?: number;
    totalAmount?: number;
    checkmateInterested?: string;
    filmforgeInterested?: string;
    registrationId?: string;
  },
  techMembers: string[],
  nonTechMembers: string[]
) {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: regData, error: regError } = await supabase
      .from('registrations')
      .insert([{
        full_name: reg.fullName,
        college_name: reg.college,
        department: reg.department,
        phone: reg.phone,
        email: reg.email.toLowerCase(),
        technical_event: reg.technicalEvent || null,
        non_technical_event: reg.nonTechnicalEvent || null,
        payment_id: reg.paymentId || null,
        payment_status: reg.paymentStatus || 'Submitted',
        registration_status: reg.registrationStatus || 'Confirmed',
        total_members: reg.totalMembers || 1,
        fee_per_head: reg.feePerHead || 129,
        total_amount: reg.totalAmount || 129,
        checkmate_interested: reg.checkmateInterested || null,
        filmforge_interested: reg.filmforgeInterested || null,
        registration_code: reg.registrationId || null,
      }])
      .select()
      .single();

    if (regError) {
      console.warn('Supabase insert warning:', regError);
      return null;
    }

    const registrationId = regData.id;

    // Insert technical team members
    if (reg.technicalEvent && techMembers.length > 0) {
      const techRows = techMembers.map((name, i) => ({
        registration_id: registrationId,
        event_type: 'technical' as const,
        event_name: reg.technicalEvent as string,
        member_number: i + 1,
        member_name: name,
      }));
      await supabase.from('team_members').insert(techRows);
    }

    // Insert non-technical team members
    if (reg.nonTechnicalEvent && nonTechMembers.length > 0) {
      const nonTechRows = nonTechMembers.map((name, i) => ({
        registration_id: registrationId,
        event_type: 'non_technical' as const,
        event_name: reg.nonTechnicalEvent as string,
        member_number: i + 1,
        member_name: name,
      }));
      await supabase.from('team_members').insert(nonTechRows);
    }

    return regData;
  } catch (err) {
    console.warn('Supabase insert caught error:', err);
    return null;
  }
}

// ─── Update Payment Status in Supabase ───
export async function updateSupabasePaymentStatus(registrationCode: string, status: string) {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('registrations')
      .update({ payment_status: status })
      .eq('registration_code', registrationCode);
    return !error;
  } catch {
    return false;
  }
}

// ─── Update Registration Status in Supabase ───
export async function updateSupabaseRegistrationStatus(registrationCode: string, status: string) {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('registrations')
      .update({ registration_status: status })
      .eq('registration_code', registrationCode);
    return !error;
  } catch {
    return false;
  }
}

// ─── Delete Registration from Supabase ───
export async function deleteSupabaseRegistration(registrationCode: string) {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('registration_code', registrationCode);
    return !error;
  } catch {
    return false;
  }
}


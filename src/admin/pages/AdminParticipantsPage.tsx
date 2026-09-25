import React, { useEffect, useState, useMemo } from 'react';
import {
  UserCheck,
  Search,
  Download,
  RefreshCw,
  Building,
  Phone,
  Mail,
  ShieldCheck,
  Award
} from 'lucide-react';
import { fetchAllRegistrations, RegistrationRecord } from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';
import { exportToCsv } from '../csvExport';

interface UniqueParticipant {
  name: string;
  college: string;
  department: string;
  phone: string;
  email: string;
  techEvent: string;
  nonTechEvent: string;
  registrationId: string;
  paymentStatus: string;
  role: 'Leader (Main Participant)' | 'Team Member';
}

export const AdminParticipantsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRegistrations(token || '');
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Extract and Deduplicate Unique Participants across all events & registrations
  const uniqueParticipantsList = useMemo(() => {
    const map = new Map<string, UniqueParticipant>();

    registrations.forEach(r => {
      // 1. Main Participant
      const pName = r.fullName.trim();
      if (pName) {
        const key = pName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: pName,
            college: r.college,
            department: r.department,
            phone: r.phone,
            email: r.email,
            techEvent: r.techEvent || '—',
            nonTechEvent: r.nonTechEvent || '—',
            registrationId: r.registrationId,
            paymentStatus: r.paymentStatus,
            role: 'Leader (Main Participant)',
          });
        } else {
          // If already encountered, merge event details
          const existing = map.get(key)!;
          if (r.techEvent && existing.techEvent === '—') existing.techEvent = r.techEvent;
          if (r.nonTechEvent && existing.nonTechEvent === '—') existing.nonTechEvent = r.nonTechEvent;
        }
      }

      // Helper for teammates
      const addTeammate = (mName: string, eventName: string, isTech: boolean) => {
        const cleanName = (mName || '').trim();
        if (!cleanName) return;
        const key = cleanName.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: cleanName,
            college: r.college,
            department: r.department,
            phone: r.phone ? `${r.phone} (c/o ${r.fullName})` : '—',
            email: '—',
            techEvent: isTech ? eventName : '—',
            nonTechEvent: !isTech ? eventName : '—',
            registrationId: r.registrationId,
            paymentStatus: r.paymentStatus,
            role: 'Team Member',
          });
        } else {
          const existing = map.get(key)!;
          if (isTech && (existing.techEvent === '—' || !existing.techEvent)) {
            existing.techEvent = eventName;
          }
          if (!isTech && (existing.nonTechEvent === '—' || !existing.nonTechEvent)) {
            existing.nonTechEvent = eventName;
          }
        }
      };

      // Technical teammates
      if (r.techEvent === 'PAPERQUEST') {
        addTeammate(r.techMember2, 'PAPERQUEST', true);
        addTeammate(r.techMember3, 'PAPERQUEST', true);
        addTeammate(r.techMember4, 'PAPERQUEST', true);
      }

      // Non-technical teammates
      if (r.nonTechEvent === 'MINE RELAY') {
        addTeammate(r.nonTechMember2, 'MINE RELAY', false);
        addTeammate(r.nonTechMember3, 'MINE RELAY', false);
        addTeammate(r.nonTechMember4, 'MINE RELAY', false);
      }
    });

    return Array.from(map.values());
  }, [registrations]);

  // Search filtering
  const filteredParticipants = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return uniqueParticipantsList;

    return uniqueParticipantsList.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.college.toLowerCase().includes(q) ||
        p.registrationId.toLowerCase().includes(q)
    );
  }, [uniqueParticipantsList, search]);

  // CSV Export
  const handleExportCsv = () => {
    const headers = [
      'Participant_Name',
      'Role',
      'College',
      'Department',
      'Phone',
      'Email',
      'Technical_Event',
      'Non_Technical_Event',
      'Registration_ID',
      'Payment_Status',
    ];

    const rows = filteredParticipants.map(p => [
      p.name,
      p.role,
      p.college,
      p.department,
      p.phone,
      p.email,
      p.techEvent,
      p.nonTechEvent,
      p.registrationId,
      p.paymentStatus,
    ]);

    exportToCsv('PIXELO_3.0_Unique_Participants', headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            UNIQUE PARTICIPANTS DIRECTORY
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Deduplicated roster of all individual students registered for PIXELO 3.O
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#FF6A00]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-orange-500/10 to-amber-500/10 border border-purple-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-gray-900 text-sm">
              {filteredParticipants.length} Total Unique Participants
            </div>
            <div className="text-gray-500 text-[11px]">
              Every student appearing in one or multiple events is deduplicated and counted once.
            </div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search unique participants by Name, Phone, Email, College..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200/80 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Participant Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Technical Event</th>
                <th className="px-4 py-3">Non-Tech Event</th>
                <th className="px-4 py-3">Reg ID</th>
                <th className="px-4 py-3">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                    Loading unique participants...
                  </td>
                </tr>
              ) : filteredParticipants.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                    No participants found.
                  </td>
                </tr>
              ) : (
                filteredParticipants.map((p, idx) => (
                  <tr key={`${p.name}-${p.registrationId}-${idx}`} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                      {p.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.role === 'Leader (Main Participant)'
                            ? 'bg-orange-50 text-[#FF6A00] border border-orange-200'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {p.role === 'Leader (Main Participant)' ? 'Main Participant' : 'Team Member'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={p.college}>
                      {p.college}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate" title={p.department}>
                      {p.department}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {p.phone}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={p.email}>
                      {p.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {p.techEvent}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {p.nonTechEvent}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-[#FF6A00] whitespace-nowrap">
                      {p.registrationId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : p.paymentStatus === 'Submitted'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

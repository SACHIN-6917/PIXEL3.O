import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Eye,
  Building,
  Phone,
  Mail
} from 'lucide-react';
import { fetchAllRegistrations, RegistrationRecord } from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { token } = useAdminAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRegistrations(token || '');
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Compute metrics
  const totalRegistrations = registrations.length;

  // Deduplicate unique participants across all records
  const uniqueNamesSet = new Set<string>();
  registrations.forEach(r => {
    if (r.fullName) uniqueNamesSet.add(r.fullName.trim().toLowerCase());
    if (r.techMember1) uniqueNamesSet.add(r.techMember1.trim().toLowerCase());
    if (r.techMember2) uniqueNamesSet.add(r.techMember2.trim().toLowerCase());
    if (r.techMember3) uniqueNamesSet.add(r.techMember3.trim().toLowerCase());
    if (r.techMember4) uniqueNamesSet.add(r.techMember4.trim().toLowerCase());
    if (r.nonTechMember1) uniqueNamesSet.add(r.nonTechMember1.trim().toLowerCase());
    if (r.nonTechMember2) uniqueNamesSet.add(r.nonTechMember2.trim().toLowerCase());
    if (r.nonTechMember3) uniqueNamesSet.add(r.nonTechMember3.trim().toLowerCase());
    if (r.nonTechMember4) uniqueNamesSet.add(r.nonTechMember4.trim().toLowerCase());
  });
  const totalUniqueParticipants = uniqueNamesSet.size;

  const totalRevenue = registrations.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const pendingPayments = registrations.filter(r => r.paymentStatus === 'Pending').length;
  const submittedPayments = registrations.filter(r => r.paymentStatus === 'Submitted').length;
  const paidPayments = registrations.filter(r => r.paymentStatus === 'Paid').length;
  const cancelledRegistrations = registrations.filter(r => r.registrationStatus === 'Cancelled').length;

  const recentRegistrations = [...registrations].slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">ADMIN DASHBOARD</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Real-time overview of PIXELO 3.O symposium registrations & revenue
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ─── 7 METRIC CARDS ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Registrations */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Registrations
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            {loading ? '—' : totalRegistrations}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">All recorded forms</div>
        </div>

        {/* Total Unique Participants */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Unique Participants
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700 mt-2">
            {loading ? '—' : totalUniqueParticipants}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">Deduplicated attendees</div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            ₹{loading ? '—' : totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">₹129 per unique participant</div>
        </div>

        {/* Paid Payments */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Paid Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {loading ? '—' : paidPayments}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">Admin verified</div>
        </div>

        {/* Submitted Payments */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Submitted (UTR)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
            {loading ? '—' : submittedPayments}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">Awaiting verification</div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Pending Payments
            </span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 mt-2">
            {loading ? '—' : pendingPayments}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">Incomplete payments</div>
        </div>

        {/* Cancelled Registrations */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/80 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">
              Cancelled
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-2">
            {loading ? '—' : cancelledRegistrations}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">Cancelled registrations</div>
        </div>
      </div>

      {/* ─── RECENT REGISTRATIONS TABLE ─── */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 tracking-tight">RECENT REGISTRATIONS</h2>
            <p className="text-xs text-gray-500 font-medium">Latest participant submissions (Click any row for full details)</p>
          </div>
          <button
            onClick={() => navigate('/admin/registrations')}
            className="text-xs font-bold text-[#FF6A00] hover:text-[#E51B23] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200/80 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Registration ID</th>
                <th className="px-4 py-3">Participant Name</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Technical Event</th>
                <th className="px-4 py-3">Non-Tech Event</th>
                <th className="px-4 py-3 text-center">Members</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Reg Status</th>
                <th className="px-4 py-3">Registered At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                    Loading registrations data...
                  </td>
                </tr>
              ) : recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                    No registrations recorded yet.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map(r => (
                  <tr
                    key={r.registrationId}
                    onClick={() => setSelectedReg(r)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#FF6A00] whitespace-nowrap">
                      {r.registrationId}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                      {r.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate" title={r.college}>
                      {r.college}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {r.techEvent || <span className="text-gray-400 italic">None</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                      {r.nonTechEvent || <span className="text-gray-400 italic">None</span>}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-800">
                      {r.totalMembers}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-gray-900 whitespace-nowrap">
                      ₹{r.totalAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : r.paymentStatus === 'Submitted'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.registrationStatus === 'Confirmed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {r.registrationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-[11px]">
                      {r.registeredAt || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── REGISTRATION DETAIL MODAL ─── */}
      {selectedReg && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#FF6A00] tracking-widest uppercase">
                  REGISTRATION DETAILS
                </span>
                <h3 className="text-xl font-mono font-extrabold text-gray-900 mt-0.5">
                  {selectedReg.registrationId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Participant Contact Info */}
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Participant Info
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Full Name</span>
                <span className="font-bold text-gray-900">{selectedReg.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">College</span>
                <span className="font-bold text-gray-900 text-right">{selectedReg.college}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="font-bold text-gray-900 text-right">{selectedReg.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-bold text-gray-900">{selectedReg.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-bold text-gray-900">{selectedReg.email}</span>
              </div>
            </div>

            {/* Events Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/30">
                <span className="text-[10px] font-bold text-[#FF6A00] uppercase tracking-wider block mb-1">
                  Technical Event
                </span>
                <div className="font-bold text-gray-900 text-sm">{selectedReg.techEvent || 'None'}</div>
                {selectedReg.techEvent === 'PAPERQUEST' && (
                  <div className="mt-2 space-y-1 text-gray-600 text-[11px]">
                    <div>1. {selectedReg.techMember1 || selectedReg.fullName}</div>
                    <div>2. {selectedReg.techMember2 || '—'}</div>
                    <div>3. {selectedReg.techMember3 || '—'}</div>
                    <div>4. {selectedReg.techMember4 || '—'}</div>
                  </div>
                )}
                {selectedReg.techEvent === 'AI FILMFORGE' && (
                  <div className="mt-1 text-[11px] text-gray-500">Solo: {selectedReg.fullName}</div>
                )}
              </div>

              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/30">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block mb-1">
                  Non-Technical Event
                </span>
                <div className="font-bold text-gray-900 text-sm">{selectedReg.nonTechEvent || 'None'}</div>
                {selectedReg.nonTechEvent === 'MINE RELAY' && (
                  <div className="mt-2 space-y-1 text-gray-600 text-[11px]">
                    <div>1. {selectedReg.nonTechMember1 || selectedReg.fullName}</div>
                    <div>2. {selectedReg.nonTechMember2 || '—'}</div>
                    <div>3. {selectedReg.nonTechMember3 || '—'}</div>
                    <div>4. {selectedReg.nonTechMember4 || '—'}</div>
                  </div>
                )}
                {selectedReg.nonTechEvent === 'CHECKMATE' && (
                  <div className="mt-1 text-[11px] text-gray-500">Solo: {selectedReg.fullName}</div>
                )}
              </div>
            </div>

            {/* Payment & Status */}
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Payment & Verification
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Unique Members</span>
                <span className="font-bold text-gray-900">{selectedReg.totalMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Fee Per Head</span>
                <span className="font-bold text-gray-900">₹{selectedReg.feePerHead}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Calculated Amount</span>
                <span className="font-extrabold text-emerald-600 text-sm">₹{selectedReg.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID / UTR</span>
                <span className="font-mono font-bold text-gray-900">{selectedReg.paymentId || '—'}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-gray-500">Payment Status</span>
                <span className="font-bold text-gray-900">{selectedReg.paymentStatus}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Registration Status</span>
                <span className="font-bold text-gray-900">{selectedReg.registrationStatus}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

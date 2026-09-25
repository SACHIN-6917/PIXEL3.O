import React, { useEffect, useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
  User,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';
import {
  fetchAllRegistrations,
  updatePaymentStatus,
  updateRegistrationStatus,
  RegistrationRecord
} from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';
import { exportToCsv } from '../csvExport';

export const AdminRegistrationsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('ALL');
  const [nonTechFilter, setNonTechFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');
  const [regStatusFilter, setRegStatusFilter] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

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

  // Filtering
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter(r => {
      // Search matches
      const matchesSearch =
        !q ||
        r.registrationId.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.college.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.techMember2 && r.techMember2.toLowerCase().includes(q)) ||
        (r.techMember3 && r.techMember3.toLowerCase().includes(q)) ||
        (r.techMember4 && r.techMember4.toLowerCase().includes(q)) ||
        (r.nonTechMember2 && r.nonTechMember2.toLowerCase().includes(q)) ||
        (r.nonTechMember3 && r.nonTechMember3.toLowerCase().includes(q)) ||
        (r.nonTechMember4 && r.nonTechMember4.toLowerCase().includes(q));

      // Filter matches
      const matchesTech =
        techFilter === 'ALL' ||
        (techFilter === 'NONE' && !r.techEvent) ||
        (r.techEvent && r.techEvent.toUpperCase() === techFilter.toUpperCase());

      const matchesNonTech =
        nonTechFilter === 'ALL' ||
        (nonTechFilter === 'NONE' && !r.nonTechEvent) ||
        (r.nonTechEvent && r.nonTechEvent.toUpperCase() === nonTechFilter.toUpperCase());

      const matchesPayment =
        paymentFilter === 'ALL' || r.paymentStatus === paymentFilter;

      const matchesRegStatus =
        regStatusFilter === 'ALL' || r.registrationStatus === regStatusFilter;

      return matchesSearch && matchesTech && matchesNonTech && matchesPayment && matchesRegStatus;
    });
  }, [registrations, search, techFilter, nonTechFilter, paymentFilter, regStatusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Registration_ID',
      'Full_Name',
      'College',
      'Department',
      'Phone_Number',
      'Email_ID',
      'Technical_Event',
      'Technical_Member1',
      'Technical_Member2',
      'Technical_Member3',
      'Technical_Member4',
      'Non_Technical_Event',
      'Non_Technical_Member1',
      'Non_Technical_Member2',
      'Non_Technical_Member3',
      'Non_Technical_Member4',
      'Total_Members',
      'Fee_Per_Head',
      'Total_Amount',
      'Payment_Status',
      'Payment_ID',
      'Registration_Status',
      'Registered_AT',
    ];

    const rows = filteredData.map(r => [
      r.registrationId,
      r.fullName,
      r.college,
      r.department,
      r.phone,
      r.email,
      r.techEvent || '',
      r.techMember1 || '',
      r.techMember2 || '',
      r.techMember3 || '',
      r.techMember4 || '',
      r.nonTechEvent || '',
      r.nonTechMember1 || '',
      r.nonTechMember2 || '',
      r.nonTechMember3 || '',
      r.nonTechMember4 || '',
      r.totalMembers,
      r.feePerHead,
      r.totalAmount,
      r.paymentStatus,
      r.paymentId,
      r.registrationStatus,
      r.registeredAt,
    ]);

    exportToCsv('PIXELO_3.0_Registrations', headers, rows);
  };

  // Status Actions
  const handleVerifyPayment = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      await updatePaymentStatus(token || '', selectedReg.registrationId, 'Paid');
      selectedReg.paymentStatus = 'Paid';
      setRegistrations([...registrations]);
      setActionMessage('Payment verified and marked as Paid.');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaymentPending = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      await updatePaymentStatus(token || '', selectedReg.registrationId, 'Pending');
      selectedReg.paymentStatus = 'Pending';
      setRegistrations([...registrations]);
      setActionMessage('Payment marked as Pending.');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!selectedReg) return;
    if (!confirm(`Are you sure you want to cancel registration ${selectedReg.registrationId}?`)) return;
    setActionLoading(true);
    try {
      await updateRegistrationStatus(token || '', selectedReg.registrationId, 'Cancelled');
      selectedReg.registrationStatus = 'Cancelled';
      setRegistrations([...registrations]);
      setActionMessage('Registration marked as Cancelled.');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">REGISTRATIONS MANAGEMENT</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            View, search, filter, verify payments, and manage symposium participants
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

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Registration ID, Participant Name, College, Phone, Email, Team Member..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00]"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Tech Event
            </label>
            <select
              value={techFilter}
              onChange={e => {
                setTechFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="ALL">All Technical</option>
              <option value="PAPERQUEST">PaperQuest</option>
              <option value="AI FILMFORGE">AI FilmForge</option>
              <option value="NONE">None</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Non-Tech Event
            </label>
            <select
              value={nonTechFilter}
              onChange={e => {
                setNonTechFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="ALL">All Non-Technical</option>
              <option value="CHECKMATE">Checkmate</option>
              <option value="MINE RELAY">Mine Relay</option>
              <option value="NONE">None</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={e => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="ALL">All Payments</option>
              <option value="Paid">Paid</option>
              <option value="Submitted">Submitted</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
              Registration Status
            </label>
            <select
              value={regStatusFilter}
              onChange={e => {
                setRegStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white font-medium text-gray-700 focus:outline-none focus:border-[#FF6A00]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200/80 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Reg ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">College</th>
                <th className="px-4 py-3">Tech Event</th>
                <th className="px-4 py-3">Non-Tech Event</th>
                <th className="px-4 py-3 text-center">Members</th>
                <th className="px-4 py-3 text-right">Fee</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">UTR / ID</th>
                <th className="px-4 py-3">Reg Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                    Loading registrations...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400">
                    No registrations found matching the current search/filters.
                  </td>
                </tr>
              ) : (
                paginatedData.map(r => (
                  <tr
                    key={r.registrationId}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-[#FF6A00] whitespace-nowrap">
                      {r.registrationId}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                      {r.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate" title={r.college}>
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
                    <td className="px-4 py-3 font-mono text-gray-600 max-w-[100px] truncate" title={r.paymentId}>
                      {r.paymentId || '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.registrationStatus === 'Confirmed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : r.registrationStatus === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                      >
                        {r.registrationStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div>
            Showing <strong className="text-gray-900">{filteredData.length ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
            <strong className="text-gray-900">{Math.min(currentPage * itemsPerPage, filteredData.length)}</strong> of{' '}
            <strong className="text-gray-900">{filteredData.length}</strong> records
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── REGISTRATION DETAILS & ACTIONS MODAL ─── */}
      {selectedReg && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#FF6A00] tracking-widest uppercase">
                  MANAGE REGISTRATION
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

            {actionMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {actionMessage}
              </div>
            )}

            {/* Participant info */}
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Participant Details
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Name</span>
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

            {/* Events */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/20">
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

              <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50/20">
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

            {/* Payment Summary */}
            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                Payment & Timestamp
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
                <span className="text-gray-500">Total Fee</span>
                <span className="font-extrabold text-emerald-600 text-sm">₹{selectedReg.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">UTR / Payment ID</span>
                <span className="font-mono font-bold text-gray-900">{selectedReg.paymentId || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Payment Status</span>
                <span className="font-bold text-gray-900">{selectedReg.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Registered At</span>
                <span className="font-medium text-gray-700">{selectedReg.registeredAt || '—'}</span>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleVerifyPayment}
                  disabled={actionLoading || selectedReg.paymentStatus === 'Paid'}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> VERIFY PAYMENT
                </button>

                <button
                  onClick={handleMarkPaymentPending}
                  disabled={actionLoading || selectedReg.paymentStatus === 'Pending'}
                  className="px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Clock className="w-3.5 h-3.5" /> MARK PENDING
                </button>

                <button
                  onClick={handleCancelRegistration}
                  disabled={actionLoading || selectedReg.registrationStatus === 'Cancelled'}
                  className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> CANCEL REGISTRATION
                </button>
              </div>

              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
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

import React, { useEffect, useState, useMemo } from 'react';
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  Search,
  Eye,
  Check
} from 'lucide-react';
import { fetchAllRegistrations, updatePaymentStatus, RegistrationRecord } from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';
import { exportToCsv } from '../csvExport';

export const AdminPaymentsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
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

  // Metrics
  const totalRevenue = registrations.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const paidCount = registrations.filter(r => r.paymentStatus === 'Paid').length;
  const paidRevenue = registrations
    .filter(r => r.paymentStatus === 'Paid')
    .reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);
  const submittedCount = registrations.filter(r => r.paymentStatus === 'Submitted').length;
  const pendingCount = registrations.filter(r => r.paymentStatus === 'Pending').length;

  // Filter
  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return registrations.filter(r => {
      const matchesSearch =
        !q ||
        r.registrationId.toLowerCase().includes(q) ||
        r.fullName.toLowerCase().includes(q) ||
        r.paymentId.toLowerCase().includes(q) ||
        r.phone.includes(q);

      const matchesStatus = statusFilter === 'ALL' || r.paymentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [registrations, search, statusFilter]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Registration_ID',
      'Name',
      'Total_Members',
      'Fee_Per_Head',
      'Total_Amount',
      'Payment_Status',
      'Payment_ID_UTR',
      'Registered_At',
    ];

    const rows = filteredPayments.map(r => [
      r.registrationId,
      r.fullName,
      r.totalMembers,
      r.feePerHead,
      r.totalAmount,
      r.paymentStatus,
      r.paymentId,
      r.registeredAt,
    ]);

    exportToCsv('PIXEL_3.O_Payments', headers, rows);
  };

  // Payment Verification Action
  const handleVerifyPayment = async () => {
    if (!selectedReg) return;
    setActionLoading(true);
    try {
      await updatePaymentStatus(token || '', selectedReg.registrationId, 'Paid');
      selectedReg.paymentStatus = 'Paid';
      setRegistrations([...registrations]);
      setActionMessage('Payment verified and updated to Paid.');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">PAYMENTS MANAGEMENT</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Audit UTR transactions, verify dynamic UPI payments, and reconcile accounts
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

      {/* ─── 4 SUMMARY CARDS ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* TOTAL REVENUE */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Revenue
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">
            ₹{loading ? '—' : totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">All registered submissions</div>
        </div>

        {/* PAID */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Paid (Verified)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-2">
            {loading ? '—' : paidCount}
          </div>
          <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
            ₹{paidRevenue.toLocaleString('en-IN')} collected
          </div>
        </div>

        {/* SUBMITTED */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Submitted (Pending UTR Check)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2">
            {loading ? '—' : submittedCount}
          </div>
          <div className="text-[10px] text-amber-700 mt-1 font-medium">Needs bank / UPI check</div>
        </div>

        {/* PENDING */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Pending / Unpaid
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-2">
            {loading ? '—' : pendingCount}
          </div>
          <div className="text-[10px] text-gray-400 mt-1 font-medium">Incomplete payments</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search payments by Reg ID, Name, UTR / Payment ID, Phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-900 placeholder:text-gray-400 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00]"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 bg-white font-medium text-xs text-gray-700 focus:outline-none focus:border-[#FF6A00]"
          >
            <option value="ALL">All Payments</option>
            <option value="Submitted">Submitted</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/75 border-b border-gray-200/80 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Registration ID</th>
                <th className="px-4 py-3">Participant Name</th>
                <th className="px-4 py-3 text-center">Total Members</th>
                <th className="px-4 py-3 text-right">Fee / Head</th>
                <th className="px-4 py-3 text-right">Total Amount</th>
                <th className="px-4 py-3">Payment Status</th>
                <th className="px-4 py-3">Payment ID / UTR</th>
                <th className="px-4 py-3">Registered At</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    Loading payments...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                    No payment records found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(r => (
                  <tr key={r.registrationId} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#FF6A00] whitespace-nowrap">
                      {r.registrationId}
                    </td>
                    <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">
                      {r.fullName}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-gray-800">
                      {r.totalMembers}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      ₹{r.feePerHead}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-emerald-600 whitespace-nowrap">
                      ₹{r.totalAmount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <td className="px-4 py-3 font-mono font-bold text-gray-800 max-w-[150px] truncate" title={r.paymentId}>
                      {r.paymentId || '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-[11px]">
                      {r.registeredAt || '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedReg(r)}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── PAYMENT VERIFICATION MODAL ─── */}
      {selectedReg && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedReg(null)}
        >
          <div
            className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-[#FF6A00] tracking-widest uppercase">
                  VERIFY PAYMENT
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

            <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Participant</span>
                <span className="font-bold text-gray-900">{selectedReg.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-bold text-gray-900">{selectedReg.phone}</span>
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
                <span className="text-gray-500">Payable Amount</span>
                <span className="font-extrabold text-emerald-600 text-base">₹{selectedReg.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment ID / UTR</span>
                <span className="font-mono font-extrabold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                  {selectedReg.paymentId || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Status</span>
                <span className="font-bold text-gray-900">{selectedReg.paymentStatus}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              <button
                onClick={handleVerifyPayment}
                disabled={actionLoading || selectedReg.paymentStatus === 'Paid'}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" />
                {actionLoading ? 'UPDATING...' : selectedReg.paymentStatus === 'Paid' ? 'ALREADY PAID' : 'VERIFY & MARK PAID'}
              </button>

              <button
                onClick={() => setSelectedReg(null)}
                className="px-4 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
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

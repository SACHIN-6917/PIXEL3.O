import React, { useEffect, useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Users,
  IndianRupee,
  Building,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { fetchAllRegistrations, RegistrationRecord } from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminAnalyticsPage: React.FC = () => {
  const { token } = useAdminAuth();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Overall metrics
  const totalRegistrations = registrations.length;
  const totalRevenue = registrations.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

  // Deduplicate unique participants
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

  // Event breakdowns
  const eventCounts = useMemo(() => {
    const counts = {
      PaperQuest: 0,
      AIFilmForge: 0,
      Checkmate: 0,
      MineRelay: 0,
    };
    registrations.forEach(r => {
      if (r.techEvent === 'PAPERQUEST') counts.PaperQuest++;
      if (r.techEvent === 'AI FILMFORGE') counts.AIFilmForge++;
      if (r.nonTechEvent === 'CHECKMATE') counts.Checkmate++;
      if (r.nonTechEvent === 'MINE RELAY') counts.MineRelay++;
    });
    return counts;
  }, [registrations]);

  // Technical vs Non-Technical
  const techTotal = eventCounts.PaperQuest + eventCounts.AIFilmForge;
  const nonTechTotal = eventCounts.Checkmate + eventCounts.MineRelay;
  const combinedTotal = techTotal + nonTechTotal || 1;
  const techPercent = Math.round((techTotal / combinedTotal) * 100);
  const nonTechPercent = 100 - techPercent;

  // Payment status
  const paidCount = registrations.filter(r => r.paymentStatus === 'Paid').length;
  const submittedCount = registrations.filter(r => r.paymentStatus === 'Submitted').length;
  const pendingCount = registrations.filter(r => r.paymentStatus === 'Pending').length;

  // College-wise aggregation
  const collegeBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    registrations.forEach(r => {
      const col = (r.college || 'Other').trim();
      counts[col] = (counts[col] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [registrations]);

  // Department-wise aggregation
  const deptBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    registrations.forEach(r => {
      const dept = (r.department || 'Other').trim();
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [registrations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">SYMPOSIUM ANALYTICS</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Key performance indicators, event distribution, college metrics, and revenue trends
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Top 3 KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total Unique Participants
          </div>
          <div className="text-3xl font-extrabold text-[#FF6A00]">
            {loading ? '—' : totalUniqueParticipants}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Cross-event deduplicated attendees</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total Registered Volume
          </div>
          <div className="text-3xl font-extrabold text-purple-700">
            {loading ? '—' : totalRegistrations}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Submissions across 4 events</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Total Financial Turnover
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            ₹{loading ? '—' : totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">₹129 per unique participant formula</div>
        </div>
      </div>

      {/* Two Columns: Event Breakdown & Tech vs Non-Tech */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Event Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">EVENT PARTICIPATION</h3>
              <p className="text-xs text-gray-500 font-medium">Registrations per authorized event</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3.5 pt-2">
            {/* PaperQuest */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-700">PaperQuest (Technical, Team of 4)</span>
                <span className="text-[#FF6A00]">{eventCounts.PaperQuest} Teams</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FF6A00] transition-all duration-500"
                  style={{ width: `${Math.min(100, (eventCounts.PaperQuest / (totalRegistrations || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* AI FilmForge */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-700">AI FilmForge (Technical, Solo)</span>
                <span className="text-blue-600">{eventCounts.AIFilmForge} Solos</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (eventCounts.AIFilmForge / (totalRegistrations || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Checkmate */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-700">Checkmate (Non-Technical, Solo)</span>
                <span className="text-emerald-600">{eventCounts.Checkmate} Solos</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (eventCounts.Checkmate / (totalRegistrations || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Mine Relay */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-gray-700">Mine Relay (Non-Technical, Team of 4)</span>
                <span className="text-purple-600">{eventCounts.MineRelay} Teams</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{ width: `${Math.min(100, (eventCounts.MineRelay / (totalRegistrations || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Technical vs Non-Technical & Payment Status */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-5">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 tracking-tight">CATEGORY & PAYMENT RATIO</h3>
            <p className="text-xs text-gray-500 font-medium">Domain preference and payment statuses</p>
          </div>

          {/* Ratio bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-[#FF6A00]">Technical: {techPercent}% ({techTotal})</span>
              <span className="text-purple-700">Non-Technical: {nonTechPercent}% ({nonTechTotal})</span>
            </div>
            <div className="w-full h-4 rounded-full bg-gray-100 flex overflow-hidden">
              <div className="bg-gradient-to-r from-[#FF6A00] to-[#E51B23]" style={{ width: `${techPercent}%` }} />
              <div className="bg-purple-600" style={{ width: `${nonTechPercent}%` }} />
            </div>
          </div>

          {/* Payment Status cards */}
          <div className="pt-2 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80">
              <span className="text-[10px] font-bold uppercase text-emerald-600 block">Verified Paid</span>
              <span className="text-lg font-extrabold text-emerald-700 mt-1 block">{paidCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80">
              <span className="text-[10px] font-bold uppercase text-amber-600 block">Submitted UTR</span>
              <span className="text-lg font-extrabold text-amber-700 mt-1 block">{submittedCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-red-50 border border-red-200/80">
              <span className="text-[10px] font-bold uppercase text-red-600 block">Pending</span>
              <span className="text-lg font-extrabold text-red-700 mt-1 block">{pendingCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* College and Department Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Colleges */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">COLLEGE PARTICIPATION</h3>
              <p className="text-xs text-gray-500 font-medium">Top participating engineering colleges</p>
            </div>
            <Building className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3 pt-2">
            {collegeBreakdown.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No college registration data yet.</p>
            ) : (
              collegeBreakdown.map(([col, cnt], i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-gray-800 truncate" title={col}>{col}</span>
                  </div>
                  <span className="font-extrabold text-[#FF6A00] whitespace-nowrap">{cnt} registrations</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Departments */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 tracking-tight">DEPARTMENT DISTRIBUTION</h3>
              <p className="text-xs text-gray-500 font-medium">Departmental representation</p>
            </div>
            <GraduationCap className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3 pt-2">
            {deptBreakdown.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No department registration data yet.</p>
            ) : (
              deptBreakdown.map(([dept, cnt], i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-bold text-gray-800 truncate" title={dept}>{dept}</span>
                  </div>
                  <span className="font-extrabold text-purple-700 whitespace-nowrap">{cnt} registrations</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

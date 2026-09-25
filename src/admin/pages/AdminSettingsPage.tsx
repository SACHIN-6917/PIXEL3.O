import React, { useState } from 'react';
import {
  Settings,
  Database,
  FileSpreadsheet,
  QrCode,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import {
  REGISTRATION_DEADLINE,
  FEE_PER_HEAD,
  DEFAULT_UPI_ID,
  DEFAULT_UPI_NAME,
  WHATSAPP_COMMUNITY_LINK,
  STATIC_QR_PATH,
  isDeadlinePassed
} from '../../lib/googleSheet';
import { useAdminAuth } from '../AdminAuthContext';

export const AdminSettingsPage: React.FC = () => {
  const { adminUser } = useAdminAuth();
  const [cleared, setCleared] = useState(false);

  const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || import.meta.env.VITE_GOOGLE_SCRIPT_URL || '';
  const isScriptConfigured = scriptUrl && !scriptUrl.includes('YOUR_DEPLOYMENT_ID');
  const deadlinePassed = isDeadlinePassed();

  const handleClearLocalCache = () => {
    if (confirm('Clear local registrations cache? Real Google Sheet data will not be affected.')) {
      localStorage.removeItem('PIXELO_REGISTRATIONS_STORE');
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">SYSTEM SETTINGS & DIAGNOSTICS</h1>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          Backend configurations, Google Sheets sync, UPI params, and security parameters
        </p>
      </div>

      {cleared && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Local storage registrations cache cleared successfully.</span>
        </div>
      )}

      {/* Grid of config panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Google Apps Script & Sheet Config */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Google Spreadsheet Integration</h3>
              <p className="text-xs text-gray-500">Target spreadsheet and 23-column master sheet</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-2">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Target Spreadsheet:</span>
              <strong className="text-gray-900">PIXELO 3.O – Event Registrations 2026</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Target Tab Name:</span>
              <strong className="text-gray-900">Registrations (Single Tab)</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Columns Schema:</span>
              <strong className="text-gray-900">23 Columns Exact (1 Row / Registration)</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 items-center">
              <span className="text-gray-400">Web App URL:</span>
              <span
                className={`font-mono text-[10px] px-2 py-0.5 rounded font-bold ${
                  isScriptConfigured
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {isScriptConfigured ? 'Configured' : 'Local Fallback Active'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed">
            All registration data is synced directly to the single Google Sheet tab without duplicate columns.
          </p>
        </div>

        {/* UPI & Payment Configuration */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6A00] flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">UPI Payment Parameters</h3>
              <p className="text-xs text-gray-500">Dynamic QR parameters & ₹129/head calculation</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-2">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Payee UPI ID:</span>
              <strong className="font-mono text-gray-900">{DEFAULT_UPI_ID}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Payee Name:</span>
              <strong className="text-gray-900">{DEFAULT_UPI_NAME}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Registration Fee:</span>
              <strong className="text-gray-900">₹{FEE_PER_HEAD} per UNIQUE participant</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Static Reference QR:</span>
              <strong className="font-mono text-gray-900">{STATIC_QR_PATH}</strong>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-orange-50/50 border border-orange-200/60 text-[11px] text-[#FF6A00]">
            Dynamic UPI QR generates on-the-fly with the exact deduplicated amount encoded.
          </div>
        </div>

        {/* Registration Deadline & WhatsApp */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Deadline & Community</h3>
              <p className="text-xs text-gray-500">Hard cutoff and communication links</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-2">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Symposium Date:</span>
              <strong className="text-gray-900">14 October 2026</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Registration Deadline:</span>
              <strong className="text-gray-900">13 October 2026, 10:00 PM IST</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 items-center">
              <span className="text-gray-400">Deadline Status:</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  deadlinePassed
                    ? 'bg-red-50 text-red-700'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {deadlinePassed ? 'CLOSED' : 'OPEN & ACCEPTING'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100 items-center">
              <span className="text-gray-400">Official WhatsApp:</span>
              <a
                href={WHATSAPP_COMMUNITY_LINK}
                target="_blank"
                rel="noreferrer"
                className="text-[#FF6A00] font-bold flex items-center gap-1 hover:underline text-[11px]"
              >
                <span>Group Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Security & Maintenance */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Security & Maintenance</h3>
              <p className="text-xs text-gray-500">Session isolation & local cache purge</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600 pt-2">
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Active Admin:</span>
              <strong className="text-gray-900">{adminUser?.username || 'Admin'}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Role:</span>
              <strong className="text-gray-900">{adminUser?.role || 'Super Admin'}</strong>
            </div>
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-400">Credentials Exposure:</span>
              <strong className="text-emerald-600">Zero (No credentials in code)</strong>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleClearLocalCache}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-700 hover:text-red-600 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Local Cache (Re-fetch Sheet)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

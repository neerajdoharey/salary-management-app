import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsApi } from '../api/client';
import {
  Users,
  DollarSign,
  TrendingUp,
  Building2,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.getSummary();
      setData(res);
    } catch (err) {
      console.warn('Analytics API error:', err);
      setError('Unable to reach Analytics endpoint. Rails backend may be offline or initializing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = data?.summary || {
    total_payroll: 0,
    average_salary: 0,
    total_employees: 0,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-slate-500">• Multi-Tenant Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome, <span className="text-indigo-600">{user?.email}</span>
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              You are signed in as an administrator for{' '}
              <strong className="text-slate-900 font-bold underline decoration-indigo-500 decoration-2 underline-offset-4">
                {user?.organization?.name || 'Organization'}
              </strong>
              . Manage compensation, benchmark salaries, and export reports with real-time Rails 8 performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Employees */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Headcount</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? (
                <span className="text-slate-400 animate-pulse">Loading...</span>
              ) : (
                summary.total_employees?.toLocaleString() || '0'
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Indexed in PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Card 2: Annual Payroll */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Payroll Run</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? (
                <span className="text-slate-400 animate-pulse">Loading...</span>
              ) : (
                `$${Number(summary.total_payroll || 0).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Gross annual compensation</span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Salary */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Mean Salary</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {loading ? (
                <span className="text-slate-400 animate-pulse">Loading...</span>
              ) : (
                `$${Number(summary.average_salary || 0).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600">
              <span>Per employee avg</span>
            </div>
          </div>
        </div>

        {/* Card 4: Tenant Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Tenancy Isolation</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              {user?.organization?.name || 'Standard Org'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-mono font-medium">
              <span>Role: {user?.role || 'admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Headcount & Payroll</h3>
              <p className="text-xs text-slate-500">Grouped aggregates from Rails API</p>
            </div>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 uppercase border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Department</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Count</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Avg Salary</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Total Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.by_department && data.by_department.length > 0 ? (
                  data.by_department.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{row.department || 'General'}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{Number(row.count).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        ${Number(row.avg_salary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600">
                        ${Number(row.total_payroll || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      {loading ? 'Fetching department metrics...' : 'No department data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic / Country Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Geographic Distribution</h3>
              <p className="text-xs text-slate-500">Compensation breakdown across countries</p>
            </div>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-500 uppercase border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Country</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Employees</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Avg Salary</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Total Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.by_country && data.by_country.length > 0 ? (
                  data.by_country.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{row.country || 'Global'}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">{Number(row.count).toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        ${Number(row.avg_salary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600">
                        ${Number(row.total_payroll || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      {loading ? 'Fetching country metrics...' : 'No country distribution data'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-6">
      {/* Top Welcome / Status Card */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-xs transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                Enterprise Workspace
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">• Rails 8 PostgreSQL Isolated</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-indigo-600 dark:text-indigo-400">{user?.email}</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Organization: <strong className="text-gray-900 dark:text-white">{user?.organization?.name || 'ACME Corp'}</strong>. Full multi-tenant compensation controls, batch CSV streaming, and executive salary distributions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 transition shadow-xs active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition active:scale-95"
            >
              <span>API Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Headcount */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Headcount</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? (
                <span className="text-gray-400 animate-pulse text-xl">Loading...</span>
              ) : (
                summary.total_employees?.toLocaleString() || '0'
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Seeded in PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* Card 2: Annual Payroll */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Payroll Run</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? (
                <span className="text-gray-400 animate-pulse text-xl">Loading...</span>
              ) : (
                `$${Number(summary.total_payroll || 0).toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}`
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Gross annual compensation</span>
            </div>
          </div>
        </div>

        {/* Card 3: Average Salary */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Mean Salary</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {loading ? (
                <span className="text-gray-400 animate-pulse text-xl">Loading...</span>
              ) : (
                `$${Number(summary.average_salary || 0).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}`
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <span>Per employee avg</span>
            </div>
          </div>
        </div>

        {/* Card 4: Tenant Status */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Tenancy Status</span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {user?.organization?.name || 'Standard Org'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              <span>Role: {user?.role || 'admin'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Breakdown Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Department Headcount & Payroll
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Grouped aggregates from Rails API</p>
            </div>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Department</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Count</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Avg Salary</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Total Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data?.by_department && data.by_department.length > 0 ? (
                  data.by_department.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-200">
                        {row.department || 'General'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-300">
                        {Number(row.count).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-300">
                        ${Number(row.avg_salary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        ${Number(row.total_payroll || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 dark:text-gray-500">
                      {loading ? 'Fetching department metrics...' : 'No department data available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Geographic / Country Breakdown */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Geographic Distribution
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Compensation breakdown across countries</p>
            </div>
            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-500 dark:text-gray-400 uppercase border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Country</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Employees</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Avg Salary</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Total Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {data?.by_country && data.by_country.length > 0 ? (
                  data.by_country.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-gray-800 dark:text-gray-200">
                        {row.country || 'Global'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-300">
                        {Number(row.count).toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-600 dark:text-gray-300">
                        ${Number(row.avg_salary || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        ${Number(row.total_payroll || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400 dark:text-gray-500">
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

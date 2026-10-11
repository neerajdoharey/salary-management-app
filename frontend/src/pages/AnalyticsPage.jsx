import React, { useState, useEffect, useMemo } from 'react';
import { analyticsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  DollarSign,
  Users,
  TrendingUp,
  Building2,
  Globe,
  PieChart as PieChartIcon,
  RefreshCw,
  Layers,
  ArrowUpRight,
  Download,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Table as TableIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Area,
  Line,
} from 'recharts';

const DEPARTMENT_COLORS = [
  '#6366F1', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#14B8A6', // Teal
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // View state controls
  const [secondaryMetric, setSecondaryMetric] = useState('count'); // 'count' | 'avg_salary'
  const [useMillions, setUseMillions] = useState(true);
  const [activeDepartmentIndex, setActiveDepartmentIndex] = useState(null);

  // Detect theme for SVG charts
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await analyticsApi.getSummary();
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(
        err.response?.data?.error ||
        'Unable to load compensation analytics. Please check that the Rails API is online.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Formatters
  const formatCurrency = (val, inMillions = false) => {
    const num = Number(val || 0);
    if (inMillions && Math.abs(num) >= 1_000_000) {
      return `$${(num / 1_000_000).toFixed(1)}M`;
    }
    return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const formatRawCurrency = (val) => {
    return `$${Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Aggregated data calculations
  const summary = useMemo(() => {
    return (
      data?.summary || {
        total_payroll: 0,
        average_salary: 0,
        total_employees: 0,
      }
    );
  }, [data]);

  const departmentData = useMemo(() => {
    if (!data?.by_department) return [];
    const total = Number(summary.total_payroll) || 1;
    return data.by_department.map((dept, index) => {
      const payroll = Number(dept.total_payroll);
      const count = Number(dept.count);
      const avg = Number(dept.avg_salary);
      const percent = ((payroll / total) * 100).toFixed(1);
      return {
        name: dept.department,
        total_payroll: payroll,
        count: count,
        avg_salary: Math.round(avg),
        percent: Number(percent),
        color: DEPARTMENT_COLORS[index % DEPARTMENT_COLORS.length],
      };
    });
  }, [data, summary]);

  const countryData = useMemo(() => {
    if (!data?.by_country) return [];
    return data.by_country.map((c) => ({
      country: c.country,
      total_payroll: Number(c.total_payroll),
      count: Number(c.count),
      avg_salary: Math.round(Number(c.avg_salary)),
      payroll_millions: Number((Number(c.total_payroll) / 1_000_000).toFixed(1)),
    }));
  }, [data]);

  // Export summary report as CSV
  const handleExportCSV = () => {
    if (!data) return;
    const rows = [
      ['Salary Analytics BI Summary Report'],
      ['Organization', user?.organization?.name || 'ACME Corp'],
      ['Generated On', new Date().toISOString()],
      ['Total Payroll', summary.total_payroll],
      ['Average Salary', summary.average_salary],
      ['Total Headcount', summary.total_employees],
      [],
      ['Department Breakdown'],
      ['Department', 'Headcount', 'Avg Salary', 'Total Payroll', 'Share %'],
      ...departmentData.map((d) => [
        d.name,
        d.count,
        d.avg_salary,
        d.total_payroll,
        `${d.percent}%`,
      ]),
      [],
      ['Country Breakdown'],
      ['Country', 'Headcount', 'Avg Salary', 'Total Payroll'],
      ...countryData.map((c) => [c.country, c.count, c.avg_salary, c.total_payroll]),
    ];

    const csvContent = rows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salary_analytics_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Recharts styling tokens based on dark/light mode
  const gridStroke = isDarkMode ? '#374151' : '#E5E7EB';
  const axisColor = isDarkMode ? '#9CA3AF' : '#6B7280';
  const tooltipBg = isDarkMode ? '#1F2937' : '#FFFFFF';
  const tooltipBorder = isDarkMode ? '#374151' : '#E5E7EB';
  const tooltipTextColor = isDarkMode ? '#FFFFFF' : '#111827';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner Toolbar */}
      <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 shadow-sm transition-colors duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Executive BI Intelligence
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">• Real-Time Payroll Aggregations</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <span>Salary & Compensation Analytics</span>
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-2xl">
            Live departmental distribution, geographical payroll allocation, and executive compensation metrics for{' '}
            <strong className="text-gray-900 dark:text-white font-semibold">
              {user?.organization?.name || 'ACME Corp'}
            </strong>.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setUseMillions(!useMillions)}
            className="px-3 py-2 rounded-lg text-xs font-semibold border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-2xs"
            title="Toggle between millions and full dollar amount"
          >
            {useMillions ? 'Display: Millions ($M)' : 'Display: Full ($)'}
          </button>

          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={isLoading || !data}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
            title="Export CSV report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Error:</span>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Payroll Run */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Company Payroll</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isLoading ? (
                <span className="text-gray-400 animate-pulse text-lg">Loading...</span>
              ) : (
                formatCurrency(summary.total_payroll, useMillions)
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Full commitment annual run</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Mean Employee Salary */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Average Annual Salary</span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isLoading ? (
                <span className="text-gray-400 animate-pulse text-lg">Loading...</span>
              ) : (
                formatCurrency(summary.average_salary, false)
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <span>Per employee mean compensation</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Total Headcount */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Global Headcount</span>
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {isLoading ? (
                <span className="text-gray-400 animate-pulse text-lg">Loading...</span>
              ) : (
                Number(summary.total_employees).toLocaleString()
              )}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span>Active team members</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Top Department */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">
            <span>Highest Budget Dept</span>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {isLoading || departmentData.length === 0
                ? 'Loading...'
                : departmentData[0]?.name || 'N/A'}
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
              <span>
                {departmentData[0] ? `${formatCurrency(departmentData[0].total_payroll, true)} (${departmentData[0].percent}%)` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Charts (Donut Budget Allocation + Country Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Department Budget Donut Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Department Budget Allocation</span>
              </h3>
              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Share %</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Percentage of total company payroll allocated across departments.
            </p>
          </div>

          {/* Donut Chart Container */}
          <div className="h-64 sm:h-72 w-full flex items-center justify-center relative">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs">Loading chart data...</span>
              </div>
            ) : departmentData.length === 0 ? (
              <div className="text-xs text-gray-400">No department data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              color: tooltipTextColor,
                            }}
                            className="p-3 rounded-lg shadow-xl border text-xs"
                          >
                            <div className="font-bold flex items-center gap-1.5 mb-1" style={{ color: item.color }}>
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <span>{item.name}</span>
                            </div>
                            <div className="space-y-0.5 text-gray-600 dark:text-gray-300">
                              <p>
                                Total Budget:{' '}
                                <strong className="text-gray-900 dark:text-white">
                                  {formatCurrency(item.total_payroll, false)}
                                </strong>
                              </p>
                              <p>
                                Budget Share:{' '}
                                <strong className="text-indigo-600 dark:text-indigo-400">
                                  {item.percent}%
                                </strong>
                              </p>
                              <p>
                                Headcount:{' '}
                                <strong className="text-gray-900 dark:text-white">
                                  {item.count.toLocaleString()}
                                </strong>
                              </p>
                              <p>
                                Mean Salary:{' '}
                                <strong className="text-gray-900 dark:text-white">
                                  ${item.avg_salary.toLocaleString()}
                                </strong>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="total_payroll"
                    onMouseEnter={(_, index) => setActiveDepartmentIndex(index)}
                    onMouseLeave={() => setActiveDepartmentIndex(null)}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={isDarkMode ? '#1F2937' : '#FFFFFF'}
                        strokeWidth={activeDepartmentIndex === index ? 3 : 1}
                        style={{
                          filter:
                            activeDepartmentIndex === index
                              ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                              : 'none',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}

            {/* Centered Donut Label */}
            {!isLoading && departmentData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Total Budget
                </span>
                <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                  {formatCurrency(summary.total_payroll, true)}
                </span>
              </div>
            )}
          </div>

          {/* Department Legend Grid */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 dark:border-gray-700/60 mt-3 text-xs">
            {departmentData.map((d, i) => (
              <div
                key={d.name}
                onMouseEnter={() => setActiveDepartmentIndex(i)}
                onMouseLeave={() => setActiveDepartmentIndex(null)}
                className={`flex items-center justify-between p-1 rounded-md transition-colors cursor-pointer ${
                  activeDepartmentIndex === i ? 'bg-gray-100 dark:bg-gray-700/60' : ''
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="truncate text-gray-700 dark:text-gray-300 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-[11px] ml-1">{d.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Country Payroll & Workforce Dual Y-Axis Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xs transition-colors flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Geographic Compensation Breakdown</span>
                </h3>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  Dual Y-Axis Analytics
                </span>
              </div>

              {/* Secondary Metric Switcher (Right Y-Axis) */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium hidden sm:inline">
                  Right Axis:
                </span>
                <div className="inline-flex rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700 text-xs">
                  <button
                    onClick={() => setSecondaryMetric('count')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      secondaryMetric === 'count'
                        ? 'bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 shadow-2xs'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Headcount
                  </button>
                  <button
                    onClick={() => setSecondaryMetric('avg_salary')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition ${
                      secondaryMetric === 'avg_salary'
                        ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-2xs'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Avg Salary
                  </button>
                </div>
              </div>
            </div>

            {/* Description & Dual Axis Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Correlating total regional payroll commitment with {secondaryMetric === 'count' ? 'workforce size' : 'average employee compensation'}.
              </p>
              <div className="flex items-center gap-3 text-[11px] font-semibold shrink-0">
                <span className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600 dark:bg-indigo-500" />
                  <span>Left: Payroll ($M)</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 ${
                    secondaryMetric === 'count'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      secondaryMetric === 'count' ? 'bg-emerald-500' : 'bg-purple-500'
                    }`}
                  />
                  <span>Right: {secondaryMetric === 'count' ? 'Headcount' : 'Avg Salary ($)'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Dual Y-Axis Chart Container */}
          <div className="h-80 w-full">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs">Loading country metrics...</span>
              </div>
            ) : countryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                No country metrics available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={countryData}
                  margin={{ top: 15, right: 20, left: 10, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="country"
                    stroke={axisColor}
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                  />

                  {/* Left Y-Axis for Total Payroll ($M) */}
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#6366F1"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#6366F1', strokeWidth: 1.5 }}
                    tickFormatter={(val) => `$${(val / 1_000_000).toFixed(0)}M`}
                  />

                  {/* Right Y-Axis for Headcount or Average Salary */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke={secondaryMetric === 'avg_salary' ? '#8B5CF6' : '#10B981'}
                    fontSize={11}
                    tickLine={false}
                    axisLine={{
                      stroke: secondaryMetric === 'avg_salary' ? '#8B5CF6' : '#10B981',
                      strokeWidth: 1.5,
                    }}
                    tickFormatter={(val) =>
                      secondaryMetric === 'avg_salary'
                        ? `$${(val / 1_000).toFixed(0)}k`
                        : val.toLocaleString()
                    }
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div
                            style={{
                              backgroundColor: tooltipBg,
                              borderColor: tooltipBorder,
                              color: tooltipTextColor,
                            }}
                            className="p-3 rounded-lg shadow-xl border text-xs min-w-48"
                          >
                            <p className="font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-1.5 pb-1.5 border-b border-gray-100 dark:border-gray-700/60">
                              <Globe className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{label}</span>
                            </p>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-3 text-indigo-600 dark:text-indigo-400">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-xs bg-indigo-600 dark:bg-indigo-400" />
                                  <span>Total Payroll (Left):</span>
                                </span>
                                <strong className="font-mono text-gray-900 dark:text-white">
                                  {formatCurrency(item.total_payroll, false)}
                                </strong>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-emerald-600 dark:text-emerald-400">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span>Headcount (Right):</span>
                                </span>
                                <strong className="font-mono text-gray-900 dark:text-white">
                                  {item.count.toLocaleString()} employees
                                </strong>
                              </div>

                              <div className="flex items-center justify-between gap-3 text-purple-600 dark:text-purple-400">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                                  <span>Mean Compensation:</span>
                                </span>
                                <strong className="font-mono text-gray-900 dark:text-white">
                                  ${item.avg_salary.toLocaleString()}
                                </strong>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  {/* Left Axis: Total Payroll Bar */}
                  <Bar
                    yAxisId="left"
                    dataKey="total_payroll"
                    name="Total Payroll ($)"
                    fill="#6366F1"
                    radius={[6, 6, 0, 0]}
                    barSize={20}
                  />

                  {/* Right Axis: Headcount or Average Salary Line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={secondaryMetric}
                    name={
                      secondaryMetric === 'avg_salary'
                        ? 'Average Salary ($)'
                        : 'Workforce Headcount'
                    }
                    stroke={secondaryMetric === 'avg_salary' ? '#8B5CF6' : '#10B981'}
                    strokeWidth={3}
                    dot={{
                      r: 4.5,
                      fill: secondaryMetric === 'avg_salary' ? '#8B5CF6' : '#10B981',
                      strokeWidth: 2,
                      stroke: isDarkMode ? '#1F2937' : '#FFFFFF',
                    }}
                    activeDot={{ r: 7, strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Comprehensive Department Comparison Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Departmental Headcount & Compensation Matrix</span>
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Comparative breakdown ranking department headcount, mean salary, total spend, and budget share.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {departmentData.length} Operational Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-right">Headcount</th>
                <th className="py-3 px-4 text-right">Mean Salary</th>
                <th className="py-3 px-4 text-right">Total Payroll</th>
                <th className="py-3 px-4 text-right">Budget Share</th>
                <th className="py-3 px-4">Allocation Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 text-gray-700 dark:text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-1 text-indigo-600" />
                    <span>Loading comparison table...</span>
                  </td>
                </tr>
              ) : departmentData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No department data available
                  </td>
                </tr>
              ) : (
                departmentData.map((dept) => (
                  <tr
                    key={dept.name}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
                      <span>{dept.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {dept.count.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium">
                      ${dept.avg_salary.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white font-mono">
                      {formatCurrency(dept.total_payroll, false)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-indigo-600 dark:text-indigo-400">
                      {dept.percent}%
                    </td>
                    <td className="py-3.5 px-4 w-48">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(dept.percent * 3.5, 100)}%`,
                            backgroundColor: dept.color,
                          }}
                        />
                      </div>
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
}

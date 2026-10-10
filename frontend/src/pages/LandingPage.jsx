import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  BarChart3,
  Users,
  Sparkles,
  ArrowRight,
  UploadCloud,
  FileCode2,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                Salary<span className="text-indigo-600">Pulse</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Enterprise
                </span>
              </span>
            </div>
          </Link>

          {/* Navigation & Action Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <FileCode2 className="w-4 h-4 text-slate-400" />
              <span>Swagger API</span>
            </a>

            <Link
              to="/login"
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-16 sm:py-24 relative z-10 text-center max-w-5xl mx-auto">
        {/* Top Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-700 mb-8 animate-in fade-in duration-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Next-Gen Workforce Compensation Intelligence</span>
        </div>

        {/* Primary Hero Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.15]">
          Manage enterprise payroll with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800">
            total precision
          </span>
          .
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-600 text-base sm:text-xl leading-relaxed max-w-3xl mt-6">
          Streamline multi-tenant employee compensation, batch CSV imports, executive BI analytics, and role-based access control with Rails 8 speed.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Sign In to Admin Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <span>Register New Organization</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>

        {/* Benchmark Trust Indicators */}
        <div className="mt-14 pt-10 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-4xl text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">10,000+</div>
            <div className="text-xs text-slate-500 mt-1">Seeded Benchmark Records</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">&lt;50ms</div>
            <div className="text-xs text-slate-500 mt-1">Sub-second BI Aggregates</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">100%</div>
            <div className="text-xs text-slate-500 mt-1">Multi-Tenant Isolation</div>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">Rails 8</div>
            <div className="text-xs text-slate-500 mt-1">Modern API Backend</div>
          </div>
        </div>

        {/* Core Pillars Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Executive BI Analytics</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Real-time department salary distributions, country compensation benchmarks, and percentile aggregates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4">
              <UploadCloud className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">High-Scale Batch Import</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Stream thousands of employee records via fast CSV ingestion with row-level validation and rollback protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Role-Based Multi-Tenancy</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Tenant-scoped isolation with strict RBAC tiers for Organization Admins, HR Managers, and Employees.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-8 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-800">SalaryPulse Enterprise</span>
            <span>•</span>
            <span>© 2026 All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-900 transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="hover:text-slate-900 transition-colors">
              Sign Up
            </Link>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              Swagger API Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

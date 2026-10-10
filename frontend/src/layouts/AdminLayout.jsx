import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  LayoutDashboard,
  Users,
  UploadCloud,
  UserCheck,
  BarChart3,
  FileCode2,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Executive Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Employee Directory', path: '/admin/employees', icon: Users },
    { label: 'Bulk CSV Import', path: '/admin/import', icon: UploadCloud },
    { label: 'Team & RBAC Users', path: '/admin/users', icon: UserCheck },
    { label: 'Salary Analytics BI', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex overflow-hidden">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-700 flex items-center justify-center shadow-md">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  Salary<span className="text-indigo-400">Pulse</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">
                  Admin Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Tenant / Organization Pill */}
          <div className="px-4 py-3 mx-4 my-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium">Tenant Organization</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                ACTIVE
              </span>
            </div>
            <div className="text-sm font-semibold text-white truncate">
              {user?.organization?.name || 'Enterprise Workspace'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              slug: {user?.organization?.slug || 'default'}
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Management & Operations
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}

            <div className="pt-4 px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              Developer Resources
            </div>
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-indigo-300 hover:bg-slate-800/70 transition-all group"
            >
              <FileCode2 className="w-4 h-4 flex-shrink-0 text-slate-400 group-hover:text-indigo-400" />
              <span className="flex-1">Interactive API Docs</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </a>
          </nav>
        </div>

        {/* Sidebar Footer: User Details & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-800/50 mb-3 border border-slate-700/60">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200 truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {user?.role || 'admin'}
                </span>
                <span className="text-[10px] text-slate-400">• Authenticated</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header in Light Theme */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span>Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-800 font-semibold">{user?.organization?.name || 'Workspace'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Rails Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-700">Rails 8 API: <strong className="text-emerald-700">Connected</strong></span>
            </div>

            {/* Role indicator */}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Role: {user?.role?.toUpperCase() || 'ADMIN'}
            </span>

            {/* Sign Out Button in top bar */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

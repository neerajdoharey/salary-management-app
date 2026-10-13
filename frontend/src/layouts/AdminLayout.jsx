import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UploadCloud,
  UserCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Bell,
  Sun,
  Moon,
  User,
  Settings,
  HelpCircle,
  Building2,
  CheckCircle2,
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sidebar collapse & mobile state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Profile & Notifications dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Light / Dark Theme state
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Nav menu items matching RBAC permissions:
  // Admin can access all modules; HR Manager can access all modules except user CRUD operations.
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Employee Directory', path: '/admin/employees', icon: Users },
    { label: 'Bulk CSV Import', path: '/admin/import', icon: UploadCloud },
    ...(user?.role === 'admin'
      ? [{ label: 'Team & RBAC Users', path: '/admin/users', icon: UserCheck }]
      : []),
    { label: 'Salary Analytics BI', path: '/admin/analytics', icon: BarChart3 },
  ];

  // Dynamic breadcrumb matching empty_new.html:
  // Home > Section
  // Heading
  const getBreadcrumbInfo = (pathname) => {
    if (pathname.includes('/employees/new')) {
      return {
        parent: { label: 'Employees', path: '/admin/employees' },
        section: 'Add New Employee',
        heading: 'Add New Employee',
      };
    }
    if (pathname.includes('/employees')) {
      return { section: 'Employees', heading: 'Employee Directory' };
    }
    if (pathname.includes('/import')) {
      return { section: 'Import', heading: 'Bulk CSV Data Import' };
    }
    if (pathname.includes('/users')) {
      return { section: 'Team', heading: 'Organization Team & RBAC' };
    }
    if (pathname.includes('/analytics')) {
      return { section: 'Analytics', heading: 'Salary Analytics BI' };
    }
    return { section: 'Dashboard', heading: 'Executive Compensation Dashboard' };
  };

  const { parent, section, heading } = getBreadcrumbInfo(location.pathname);

  return (
    <div className="font-outfit min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar matching empty_new.html */}
      <aside
        id="sidebar"
        className={`fixed left-0 top-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col justify-between ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
          } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        <div>
          {/* Logo Bar */}
          <div className="flex h-16 items-center justify-between px-5 border-b border-gray-200 dark:border-gray-700">
            <Link to="/admin" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm flex-shrink-0 shadow-xs">
                SP
              </div>
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight truncate transition-opacity duration-300">
                  Salary<span className="text-indigo-600">Pulse</span>
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Label */}
          <div className={`px-4 pt-4 pb-2 ${isSidebarCollapsed ? 'text-center' : ''}`}>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider transition-opacity duration-300">
              {isSidebarCollapsed ? '•••' : 'MENU'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={() => setIsMobileMenuOpen(false)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-3'
                  } ${isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${isSidebarCollapsed ? 'mx-auto' : 'mr-3'
                    }`}
                />
                {!isSidebarCollapsed && (
                  <span className="truncate transition-opacity duration-300">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: Active Tenant Badge */}
        {!isSidebarCollapsed && (
          <div className="p-4 m-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.organization?.name || 'ACME Corp'}
            </div>
            <div className="text-[11px] text-gray-400 font-mono mt-0.5 truncate">
              role: {user?.role || 'admin'}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div
        id="main-content"
        className={`transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
          }`}
      >
        {/* Top Navigation matching empty_new.html */}
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-xs transition-colors duration-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            {/* Left Side: Sidebar Toggle & Search Bar */}
            <div className="flex items-center space-x-4">
              {/* Sidebar Toggle for Desktop and Mobile */}
              <button
                id="sidebar-toggle"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  } else {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }
                }}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
                title="Toggle Sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Right Side: Theme Toggle, Notifications, Profile Dropdown */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Theme Toggle Button matching empty_new.html */}
              <button
                id="theme-toggle"
                onClick={toggleTheme}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Notifications Toggle */}
              <div className="relative" ref={notificationsRef}>
                <button
                  id="notifications-toggle"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600" />
                </button>

                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in duration-150">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full font-medium">
                        Live System
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 text-xs">
                      <div className="p-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          10,000 Employees Seeded
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          PostgreSQL indexes optimized for executive BI analytics.
                        </p>
                      </div>
                      <div className="p-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                        <p className="font-semibold text-gray-800 dark:text-gray-200">
                          Multi-Tenant RBAC Active
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                          Organization-scoped isolation verified on Rails 8.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button
                        onClick={() => setIsNotificationsOpen(false)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        Close Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Dropdown matching empty_new.html */}
              <div className="relative" ref={profileDropdownRef}>
                <button
                  id="profile-toggle"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2.5 rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:inline-block text-sm font-medium text-gray-900 dark:text-white">
                    {user?.email?.split('@')[0] || 'Administrator'}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in duration-150">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                        {user?.email?.split('@')[0] || 'Administrator'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800">
                          {user?.role || 'admin'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.organization?.name || 'ACME Corp'}
                        </span>
                      </div>
                    </div>
                    <div className="py-2 text-sm">
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        <span>User Profile</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin/users"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400" />
                          <span>Team & RBAC Users</span>
                        </Link>
                      )}
                      <a
                        href="http://localhost:3000/api-docs"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                        <span>API Documentation</span>
                      </a>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content with Breadcrumb matching empty_new.html */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Breadcrumb section matching empty_new.html */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Link to="/admin" className="hover:text-gray-700 dark:hover:text-gray-300">
                Home
              </Link>
              {parent && (
                <>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <Link to={parent.path} className="hover:text-gray-700 dark:hover:text-gray-300">
                    {parent.label}
                  </Link>
                </>
              )}
              <ChevronRight className="h-4 w-4 text-gray-400" />
              <span className="text-gray-900 dark:text-white capitalize font-medium">
                {section}
              </span>
            </nav>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {heading}
            </h1>
          </div>

          {/* Child Pages Content */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

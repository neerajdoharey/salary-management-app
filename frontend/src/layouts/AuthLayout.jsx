import React from 'react';
import { Outlet } from 'react-router-dom';
import { ShieldCheck, FileCode2 } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 flex flex-col justify-between items-center p-4 sm:p-6 relative">
      {/* Centered Content Container (<Outlet />: LoginPage or SignUpPage) */}
      <main className="w-full flex-1 flex flex-col items-center justify-center py-6 relative z-10">
        <div className="w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full max-w-md pt-3 pb-1 text-center text-xs text-slate-500 flex items-center justify-between relative z-10">
        <p>© 2026 SalaryPulse OS</p>
        <div className="flex items-center gap-3">
          <a
            href="http://localhost:3000/api-docs"
            target="_blank"
            rel="noreferrer"
            className="hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
            <span>API Docs</span>
          </a>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Secure</span>
          </span>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
        <Construction className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
      <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
        {description || 'This module is connected to the Rails 8 backend and ready for extension.'}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

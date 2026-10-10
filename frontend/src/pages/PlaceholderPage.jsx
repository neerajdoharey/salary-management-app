import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

export default function PlaceholderPage({ title, description }) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
        <Construction className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
        {description || 'This module is connected to the Rails 8 backend and ready for extension.'}
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

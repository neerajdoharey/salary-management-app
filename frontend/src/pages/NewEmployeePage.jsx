import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeesApi } from '../api/client';
import {
  User,
  Mail,
  Briefcase,
  Building2,
  Globe,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Sales',
  'Marketing',
  'Finance',
  'Human Resources',
  'Operations',
  'Legal',
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'India',
  'Brazil',
  'Singapore',
];

export default function NewEmployeePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    job_title: '',
    department: 'Engineering',
    country: 'United States',
    salary: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user types
    if (errorMessages.length > 0) {
      setErrorMessages([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessages([]);

    // Client-side quick validation
    const errors = [];
    if (!formData.first_name.trim()) errors.push('First name is required');
    if (!formData.last_name.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.push('Email format is invalid');
    }
    if (!formData.job_title.trim()) errors.push('Job title is required');
    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) < 0) {
      errors.push('Salary must be a positive number');
    }

    if (errors.length > 0) {
      setErrorMessages(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        job_title: formData.job_title.trim(),
        department: formData.department,
        country: formData.country,
        salary: parseFloat(formData.salary),
      };

      const created = await employeesApi.create(payload);

      // Successfully created, redirect back to employees page with success notification
      navigate('/admin/employees', {
        state: {
          successMessage: `Employee ${created.first_name} ${created.last_name} created successfully!`,
        },
      });
    } catch (err) {
      console.error('Failed to create employee:', err);
      const apiErrors = err.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        setErrorMessages(apiErrors);
      } else if (err.response?.data?.error) {
        setErrorMessages([err.response.data.error]);
      } else {
        setErrorMessages(['An unexpected error occurred while creating employee. Please try again.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Form Card matching user_form.html */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
        <div className="mb-6 border-b border-gray-100 dark:border-gray-700/60 pb-5">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Add New Employee
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the personal and compensation details to register a new employee record.
          </p>
        </div>

        {/* Server / Validation Error Alert */}
        {errorMessages.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Please fix the following errors:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  {errorMessages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                First Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Last Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="e.g. Connor"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email & Job Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Work Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sarah.connor@acme.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="job_title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Job Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  id="job_title"
                  name="job_title"
                  value={formData.job_title}
                  onChange={handleChange}
                  placeholder="e.g. Senior Software Engineer"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Department & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Building2 className="h-4 w-4" />
                </div>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Country <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Globe className="h-4 w-4" />
                </div>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                >
                  {COUNTRIES.map((ctry) => (
                    <option key={ctry} value={ctry}>
                      {ctry}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Annual Salary */}
          <div>
            <label
              htmlFor="salary"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Annual Salary (USD) <span className="text-rose-500">*</span>
            </label>
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <DollarSign className="h-4 w-4" />
              </div>
              <input
                type="number"
                id="salary"
                name="salary"
                min="0"
                step="1000"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 125000"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Enter base annual compensation in USD.
            </p>
          </div>

          {/* Actions Bar */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/employees')}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 shadow-xs transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Employee...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Create Employee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

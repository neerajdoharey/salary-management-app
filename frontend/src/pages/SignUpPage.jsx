import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { organizationApi } from '../api/client';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Edit2,
} from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Wizard Step: 1 = Organization Name, 2 = Admin Credentials
  const [step, setStep] = useState(1);

  // Form Fields
  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Error handling
  const [isCheckingOrg, setIsCheckingOrg] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle Step 1 Next: Check Organization Name
  const handleCheckOrganization = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = organizationName.trim();
    if (!trimmedName) {
      setError('Please enter your organization name.');
      return;
    }

    setIsCheckingOrg(true);
    try {
      const res = await organizationApi.validate(trimmedName);
      if (res.exists) {
        // Organization already exists -> Show validation error and stay on Step 1
        setError(
          res.message ||
          `An organization named "${trimmedName}" already exists. Please choose a unique name.`
        );
      } else {
        // Organization is available -> Proceed to Step 2
        setError('');
        setStep(2);
      }
    } catch (err) {
      console.error('Organization validation error:', err);
      setError(
        err.response?.data?.error ||
        'Unable to check organization availability. Please ensure Rails backend is running.'
      );
    } finally {
      setIsCheckingOrg(false);
    }
  };

  // Handle Step 2 Submit: Create Organization & Admin User
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please provide your work email address.');
      return;
    }
    if (!password) {
      setError('Please provide a password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        organization_name: organizationName.trim(),
        email: trimmedEmail,
        password,
        password_confirmation: passwordConfirmation,
        role: 'admin',
      });
      navigate('/admin');
    } catch (err) {
      console.error('Sign up error:', err);
      const errors = err.response?.data?.errors;
      const message = Array.isArray(errors)
        ? errors.join(', ')
        : err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to complete registration.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Top Gradient Banner matching Font1/register.html */}
      <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-800 text-white text-center py-6 px-4">
        <div className="flex items-center justify-center space-x-2 text-xl font-bold tracking-tight">
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-indigo-600" />
          </div>
          <span>SalaryPulse</span>
        </div>
      </div>

      {/* Form Container */}
      <div className="p-6 sm:p-8">
        {/* Step Progress Pill */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Step {step} of 2: {step === 1 ? 'Organization Name' : 'Admin Credentials'}
          </span>
          <div className="flex items-center space-x-1.5">
            <span
              className={`h-2 w-6 rounded-full transition-colors ${step === 1 ? 'bg-indigo-600' : 'bg-indigo-200'
                }`}
            />
            <span
              className={`h-2 w-6 rounded-full transition-colors ${step === 2 ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
            />
          </div>
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {step === 1 ? 'Create Organization' : 'Admin Account'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1
              ? 'Enter your organization name to check availability.'
              : 'Set up your administrator credentials to access the console.'}
          </p>
        </div>

        {/* Validation / Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm leading-relaxed">{error}</div>
          </div>
        )}

        {/* STEP 1: ORGANIZATION NAME FORM */}
        {step === 1 && (
          <form onSubmit={handleCheckOrganization}>
            <div className="mb-6">
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Organization / Company Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="organizationName"
                  required
                  autoFocus
                  value={organizationName}
                  onChange={(e) => {
                    setOrganizationName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Acme Corporation or Stark Industries"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-400 text-sm transition"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                We will verify that this organization name is not already registered.
              </p>
            </div>

            {/* Next Button */}
            <button
              type="submit"
              disabled={isCheckingOrg || !organizationName.trim()}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {isCheckingOrg ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking availability...</span>
                </>
              ) : (
                <>
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: ADMIN CREDENTIALS FORM */}
        {step === 2 && (
          <form onSubmit={handleCreateAccount}>
            {/* Validated Organization Badge with Edit Option */}
            <div className="mb-5 p-3 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs text-emerald-700 font-medium block">
                    Organization Available
                  </span>
                  <span className="text-sm font-semibold text-gray-900 truncate block">
                    {organizationName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 hover:underline ml-2"
                title="Change organization name"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {/* Work Email Address */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Work Email
              </label>
              <input
                type="email"
                id="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcompany.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-400 text-sm transition"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent bg-white">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-4 py-2 rounded-l-md focus:outline-none text-gray-900 bg-white placeholder-gray-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent bg-white">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Re-type password"
                  className="w-full px-4 py-2 rounded-l-md focus:outline-none text-gray-900 bg-white placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Action Buttons: Back & Complete Sign Up */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setError('');
                }}
                className="w-1/3 py-2.5 px-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-md text-sm font-medium transition flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-indigo-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-gray-500 text-sm">Already have an account? </span>
          <Link to="/login" className="text-indigo-600 hover:underline text-sm font-medium">
            Sign In
          </Link>
        </div>
      </div>

      {/* Card Bottom Footer */}
      <div className="text-center text-gray-400 text-xs py-3.5 border-t border-gray-100 bg-gray-50/60">
        2026 © SalaryPulse - Enterprise Admin
      </div>
    </div>
  );
}

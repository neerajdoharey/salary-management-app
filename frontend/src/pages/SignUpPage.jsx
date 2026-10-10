import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { organizationApi } from '../api/client';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [organizationName, setOrganizationName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [orgCheckStatus, setOrgCheckStatus] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!organizationName.trim()) {
      setOrgCheckStatus(null);
      return;
    }

    const timer = setTimeout(async () => {
      setOrgCheckStatus({ loading: true });
      try {
        const res = await organizationApi.validate(organizationName.trim());
        setOrgCheckStatus({
          loading: false,
          exists: res.exists,
          details: res.organization,
        });
      } catch (err) {
        console.warn('Org check error:', err);
        setOrgCheckStatus(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [organizationName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!organizationName.trim()) {
      setError('Please provide an organization name.');
      return;
    }
    if (!email || !password) {
      setError('Please provide all required fields.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);
    try {
      await signUp({
        organization_name: organizationName.trim(),
        email: email.trim(),
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
        : err.response?.data?.error || err.response?.data?.message || 'Failed to complete registration.';
      setError(message);
    } finally {
      setIsLoading(false);
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
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Sign Up</h2>
          <p className="text-gray-500 text-sm mt-1">
            Create your account to get started
            <br />
            with admin panel.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">{error}</div>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit}>
          {/* Organization Name Field */}
          <div className="mb-4">
            <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              id="organizationName"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder-gray-400 text-sm transition"
            />
            {orgCheckStatus && (
              <div className="mt-1.5 text-xs">
                {orgCheckStatus.loading ? (
                  <span className="text-gray-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Checking availability...
                  </span>
                ) : orgCheckStatus.exists ? (
                  <span className="text-amber-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                    Existing tenant: <strong>{orgCheckStatus.details?.name}</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    New organization will be initialized
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Email Address */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
                placeholder="Enter password (min 8 chars)"
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent bg-white">
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2 rounded-l-md focus:outline-none text-gray-900 bg-white placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

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

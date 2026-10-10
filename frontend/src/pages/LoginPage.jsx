import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Authentication failed. Please verify your email and password.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Top Gradient Banner matching Font1/login.html */}
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
          <h2 className="text-2xl font-semibold text-gray-800">Sign In</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your email address and password
            <br />
            to access admin panel.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Address */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
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
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <a
                href="#forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  alert('For password resets, contact your organization admin.');
                }}
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <div className="flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent bg-white mb-5">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-l-md focus:outline-none text-gray-900 bg-white placeholder-gray-400 text-sm"
              />
              <button
                type="button"
                id="togglePassword"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 transition shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <span className="text-gray-500 text-sm">Don't have an account? </span>
          <Link to="/signup" className="text-indigo-600 hover:underline text-sm font-medium">
            Sign Up
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

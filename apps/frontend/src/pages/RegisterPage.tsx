import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { registerSchema, UserRole } from '@animation-co/shared-types';

export function RegisterPage(): React.JSX.Element {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Hooks
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Handle form submssion
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setError('Password do not match');
      return;
    }

    // Client-side Zod validation
    const validation = registerSchema.safeParse({ email, password });

    if (!validation.success) {
      // Extract first error message from Zod
      setError(validation.error.issues[0]?.message ?? 'Validation failed');
      return; // Stop submission
    }

    try {
      setIsLoading(true);
      setError(null);

      await register({ email, password });

      // Success - show message and redirect
      setSuccess(true);
      setTimeout(() => {
        void navigate('/login');
      }, 2000); // Wait 2 seconds before redirect
    } catch (err) {
      // Check if it's an axios error with response data
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response: { data: { error?: string } } };
        setError(axiosError.response.data.error ?? 'Registration failed');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Only redirect non-admin users
  // Admins need access to register new users
  if (isAuthenticated && user?.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" replace />;
  }

  // Succes message screen
  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center">
            <div className="mb-4 text-green-500 text-5xl">✓</div>
            <h1 className="text-2xl font-bold mb-2">
              Registration Successful!
            </h1>
            <p className="text-gray-600">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
              disabled={isLoading}
              minLength={8}
            />
            <p className="text-xs text-grey-500 mt-1">
              At least 8 characters with uppercase, lowercase, and number
            </p>
          </div>

          {/* Confirm Password input */}
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => {
                setConfirmPassword(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        {/* Link to login */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

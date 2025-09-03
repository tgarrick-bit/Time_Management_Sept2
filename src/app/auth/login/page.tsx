'use client';

// src/app/auth/login/page.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get employee role and redirect
        const { data: employee } = await supabase
          .from('employees')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (employee) {
          redirectBasedOnRole(employee.role);
        }
      }
    };
    checkAuth();
  }, []);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${info}`]);
    console.log(info);
  };

  const redirectBasedOnRole = (role: UserRole) => {
    addDebugInfo(`Redirecting user with role: ${role}`);
    
    switch (role.toLowerCase()) {
      case 'admin':
        router.push('/admin');
        break;
      case 'manager':
        router.push('/manager');
        break;
      case 'employee':
      default:
        router.push('/dashboard');
        break;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setDebugInfo([]);

    try {
      addDebugInfo(`Attempting login for: ${email}`);

      // Sign in with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (authError) {
        addDebugInfo(`Auth error: ${authError.message}`);
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        addDebugInfo('No user returned from auth');
        setError('Authentication failed - no user data returned');
        setLoading(false);
        return;
      }

      addDebugInfo(`Auth successful for user ID: ${authData.user.id}`);
      addDebugInfo(`User email: ${authData.user.email}`);

      // Fetch employee data to get role
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (employeeError) {
        addDebugInfo(`Employee fetch error: ${employeeError.message}`);
        
        // Try fetching by email as fallback
        addDebugInfo('Trying to fetch employee by email...');
        const { data: employeeByEmail, error: emailError } = await supabase
          .from('employees')
          .select('*')
          .eq('email', email.trim())
          .single();

        if (emailError || !employeeByEmail) {
          addDebugInfo(`Email fetch error: ${emailError?.message || 'No employee found'}`);
          setError('Employee profile not found. Please contact your administrator.');
          
          // Sign out the user since they don't have an employee profile
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        addDebugInfo(`Employee found by email: ${employeeByEmail.first_name} ${employeeByEmail.last_name}, Role: ${employeeByEmail.role}`);
        
        // Check if employee is active
        if (!employeeByEmail.is_active) {
          addDebugInfo('Employee account is inactive');
          setError('Your account is inactive. Please contact your administrator.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        // Redirect based on role
        redirectBasedOnRole(employeeByEmail.role as UserRole);
        return;
      }

      if (!employee) {
        addDebugInfo('No employee data returned');
        setError('Employee profile not found');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      addDebugInfo(`Employee found: ${employee.first_name} ${employee.last_name}, Role: ${employee.role}`);

      // Check if employee is active
      if (!employee.is_active) {
        addDebugInfo('Employee account is inactive');
        setError('Your account is inactive. Please contact your administrator.');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Redirect based on role
      redirectBasedOnRole(employee.role as UserRole);

    } catch (err) {
      console.error('Unexpected error:', err);
      addDebugInfo(`Unexpected error: ${err}`);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#05202E' }}>
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Timesheet & Expense Management System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/auth/forgot-password"
                className="font-medium hover:text-pink-500"
                style={{ color: '#e31c79' }}
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: loading ? '#9CA3AF' : '#e31c79' }}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {/* Test account info */}
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 font-semibold mb-2">Test Accounts:</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Employee: test.employee@westend-test.com</p>
              <p>Manager: sarah.johnson@westend-test.com</p>
              <p>Admin: test.admin@westend-test.com</p>
            </div>
          </div>

          {/* Debug info (remove in production) */}
          {debugInfo.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-xs text-gray-600 font-semibold mb-2">Debug Info:</p>
              <div className="text-xs text-gray-500 space-y-1 max-h-40 overflow-y-auto">
                {debugInfo.map((info, index) => (
                  <p key={index}>{info}</p>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
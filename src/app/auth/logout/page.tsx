'use client';

// src/app/auth/logout/page.tsx

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';
import { LogOut, CheckCircle, Loader2 } from 'lucide-react';

export default function LogoutPage() {
  const [status, setStatus] = useState<'logging-out' | 'success' | 'error'>('logging-out');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    handleLogout();
  }, []);

  const handleLogout = async () => {
    try {
      setStatus('logging-out');
      
      // Clear any local storage items (if you have any)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('currentProject');
        // Add any other items you need to clear
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        setErrorMessage(error.message);
        setStatus('error');
        
        // Even if there's an error, try to redirect after a delay
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setStatus('success');
        
        // Redirect to login page after a brief success message
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      }
    } catch (err) {
      console.error('Unexpected logout error:', err);
      setStatus('error');
      setErrorMessage('An unexpected error occurred during logout');
      
      // Redirect anyway after delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#05202E' }}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            {status === 'logging-out' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Logging Out
                </h2>
                <p className="text-gray-600">
                  Please wait while we securely log you out...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Successfully Logged Out
                </h2>
                <p className="text-gray-600">
                  You have been securely logged out of your account.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Redirecting to login page...
                </p>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <LogOut className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Logout Error
                </h2>
                <p className="text-gray-600 mb-2">
                  There was an issue logging out, but you will be redirected to the login page.
                </p>
                {errorMessage && (
                  <p className="text-sm text-red-600 bg-red-50 rounded p-2">
                    {errorMessage}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Redirecting to login page...
                </p>
              </>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              style={{ backgroundColor: '#e31c79' }}
            >
              Return to Login
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            West End Workforce • Timesheet & Expense Management
          </p>
        </div>
      </div>
    </div>
  );
}
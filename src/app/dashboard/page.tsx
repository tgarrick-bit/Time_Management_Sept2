'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Clock, DollarSign, CheckCircle, ArrowRight, Building2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [apiTestResult, setApiTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const testAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/manager/approvals?employee=emp1&type=timesheet');
      const data = await response.json();
      setApiTestResult(`✅ API Working! Found ${data.count} timesheets for ${data.employee.name}`);
    } catch (error) {
      setApiTestResult('❌ API Error: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin', 'manager', 'employee']}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/WE logo FC Mar2024.png" 
                alt="West End Workforce Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">West End Workforce</h1>
                <p className="text-sm text-gray-600">Time Tracking & Workforce Management</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/login"
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/manager"
                className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
              >
                Manager Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Workforce Management
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your timesheet approvals, expense management, and team coordination 
            with our comprehensive workforce management platform.
          </p>
          
          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
            <Link 
              href="/manager"
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Manager Dashboard</h3>
              <p className="text-gray-600">Review timesheets, approve expenses, and manage your team efficiently.</p>
            </Link>

            <Link 
              href="/employee"
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Employee Portal</h3>
              <p className="text-gray-600">Submit timesheets, track expenses, and manage your work schedule.</p>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Tracking</h3>
            <p className="text-gray-600">Accurate timesheet management with easy approval workflows</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expense Management</h3>
            <p className="text-gray-600">Streamlined expense reporting and approval process</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Approvals</h3>
            <p className="text-gray-600">Instant notifications and approval status updates</p>
          </div>
        </div>

        {/* API Test Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Status Check</h3>
          <p className="text-gray-600 mb-4">Test the backend API connectivity:</p>
          
          <button
            onClick={testAPI}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-600 text-white hover:bg-pink-700'
            }`}
          >
            {isLoading ? 'Testing API...' : 'Test API Connection'}
          </button>
          
          {apiTestResult && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-mono text-gray-700">{apiTestResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 West End Workforce. Professional timesheet and expense management platform.
          </p>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}



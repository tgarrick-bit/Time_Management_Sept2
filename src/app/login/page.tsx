'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Lock, Mail, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Role-based routing
        switch (result.user?.role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'manager':
            router.push('/manager');
            break;
          case 'employee':
            router.push('/employee');
            break;
          default:
            router.push('/employee');
        }
      } else {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickLoginOptions = [
    {
      role: 'Employee',
      email: 'employee@westendworkforce.com',
      password: 'employee123',
      description: 'Access timesheet and expense submission',
      color: 'from-pink-500 to-pink-600'
    },
    {
      role: 'Manager',
      email: 'manager@westendworkforce.com',
      password: 'manager123',
      description: 'Review and approve team submissions',
      color: 'from-blue-500 to-blue-600'
    },
    {
      role: 'Admin',
      email: 'admin@westendworkforce.com',
      password: 'admin123',
      description: 'Full system administration access',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleQuickLogin = (option: any) => {
    setEmail(option.email);
    setPassword(option.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/WE logo FC Mar2024.png" 
              alt="West End Workforce Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">West End Workforce</h1>
          <p className="text-gray-600">Timesheet & Expense Management System</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700'
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Quick Login Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Demo Access</h3>
            <p className="text-gray-600 mb-6">Quick login options for testing different user roles:</p>
            
            <div className="space-y-4">
              {quickLoginOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickLogin(option)}
                  className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-semibold text-sm">
                        {option.role[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 group-hover:text-pink-600">
                        {option.role}
                      </h4>
                      <p className="text-sm text-gray-500">{option.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{option.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Click any option above to auto-fill credentials, then click "Sign In" to access that role's dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-2">
            © 2025 West End Workforce. Professional timesheet and expense management.
          </p>
          <Link 
            href="/dashboard"
            className="text-sm text-pink-600 hover:text-pink-700 underline"
          >
            View Platform Features
          </Link>
        </div>
      </div>
    </div>
  );
}
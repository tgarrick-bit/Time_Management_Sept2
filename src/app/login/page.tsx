'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const quickLoginOptions = [
    {
      role: 'Employee',
      icon: 'E',
      color: 'from-pink-500 to-pink-600',
      description: 'Access timesheet and expense submission',
      email: 'employee@westendworkforce.com',
      password: 'employee123'
    },
    {
      role: 'Manager',
      icon: 'M',
      color: 'from-blue-500 to-blue-600',
      description: 'Review and approve team submissions',
      email: 'manager@westendworkforce.com',
      password: 'manager123'
    },
    {
      role: 'Admin',
      icon: 'A',
      color: 'from-purple-500 to-purple-600',
      description: 'Full system administration access',
      email: 'admin@westendworkforce.com',
      password: 'admin123'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success && result.user) {
      // Redirect based on user role
      switch (result.user.role) {
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
          router.push('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (option: any) => {
    setEmail(option.email);
    setPassword(option.password);
    setIsLoading(true);
    setError('');

    const result = await login(option.email, option.password);
    
    if (result.success && result.user) {
      switch (result.user.role) {
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
          router.push('/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <img 
              src="/WE-logo-SEPT2024v3.png" 
              alt="West End Workforce Logo" 
              className="h-20 w-auto mx-auto lg:mx-0 mb-6"
            />
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              West End Workforce
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Timesheet & Expense Management System
            </p>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-gray-700">Digital timesheet management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Expense tracking & approval</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Real-time reporting dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Client & contractor management</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Forms */}
        <div className="space-y-8">
          
          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Access your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isLoading}
                  className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-pink-300 hover:shadow-md transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
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
        <div className="lg:col-span-2 text-center mt-8">
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

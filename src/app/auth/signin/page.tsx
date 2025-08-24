'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const result = await signIn(email, password)
    
    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    }
    // Remove hardcoded redirect - AuthContext will handle routing based on role
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#2d4a6b] to-[#e31c79] flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <div className="w-24 h-24 flex items-center justify-center">
          <img 
            src="/WE-logo-SEPT2024v3-WHT.png" 
            alt="West End Workforce Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl text-white mb-2" style={{fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>
          Welcome
        </h1>
        <p className="text-white/80 text-lg">West End Workforce</p>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e31c79] rounded-lg focus:outline-none focus:ring-0 focus:border-[#e31c79] transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-0 focus:border-[#e31c79] transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="text-left">
              <a href="#" className="text-[#e31c79] text-sm font-medium hover:text-[#d1186a]">
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e31c79] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#d1186a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <span className="text-[#e31c79] font-medium hover:text-[#d1186a] cursor-pointer">
              Contact your administrator
            </span>
          </p>
        </div>
      </div>

      <p className="text-center mt-8 text-sm text-white/60">
        © 2024 West End Workforce. All rights reserved.
      </p>
    </div>
  )
}


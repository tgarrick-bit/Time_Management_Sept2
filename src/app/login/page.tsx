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

  const quickLoginOptions = [
    {
      role: 'Employee',
      description: 'Access timesheets, expenses, and profile',
      email: 'employee@westendworkforce.com',
      password: 'employee123',
      gradient: 'linear-gradient(135deg, #e31c79, #c41866)'
    },
    {
      role: 'Manager',
      description: 'Review and approve team submissions',
      email: 'manager@westendworkforce.com',
      password: 'manager123',
      gradient: 'linear-gradient(135deg, #05202e, #0a2f42)'
    },
    {
      role: 'Admin',
      description: 'Full system administration access',
      email: 'admin@westendworkforce.com',
      password: 'admin123',
      gradient: 'linear-gradient(135deg, #232020, #05202e)'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
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

  const handleQuickLogin = (option: any) => {
    setEmail(option.email);
    setPassword(option.password);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        display: 'grid',
        gridTemplateColumns: 'minmax(400px, 1fr) minmax(450px, 600px)',
        gap: '3rem',
        alignItems: 'center'
      }}>
        
        {/* Login Form */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #f1f5f9',
          borderRadius: '1.5rem',
          padding: '3rem',
          maxWidth: '480px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginBottom: '1rem'
            }}>
              <Building2 style={{ width: '2rem', height: '2rem', color: '#e31c79' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#232020', margin: 0 }}>
                West End Workforce
              </h1>
            </div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#232020', marginBottom: '0.5rem' }}>
              Welcome back
            </h2>
            <p style={{ color: '#6b7280' }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#232020', display: 'block', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  zIndex: 1
                }}>
                  <Mail style={{ width: '1.25rem', height: '1.25rem' }} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  style={{
                    width: '100%',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e31c79';
                    e.target.style.boxShadow = '0 0 0 3px rgba(227, 28, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#232020', display: 'block', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  zIndex: 1
                }}>
                  <Lock style={{ width: '1.25rem', height: '1.25rem' }} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    paddingLeft: '3rem',
                    paddingRight: '3rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e31c79';
                    e.target.style.boxShadow = '0 0 0 3px rgba(227, 28, 121, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    zIndex: 1
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                padding: '0.75rem'
              }}>
                <p style={{ fontSize: '0.875rem', color: '#dc2626' }}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                paddingTop: '0.75rem',
                paddingBottom: '0.75rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                borderRadius: '0.5rem',
                fontWeight: '500',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                background: isLoading ? '#d1d5db' : 'linear-gradient(to right, #e31c79, #c41866)',
                color: isLoading ? '#6b7280' : '#ffffff',
                fontSize: '1rem',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #c41866, #b01558)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  (e.target as HTMLButtonElement).style.background = 'linear-gradient(to right, #e31c79, #c41866)';
                }
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Quick Login Options */}
        <div style={{
          background: '#05202e',
          borderRadius: '1.5rem',
          padding: '3rem',
          maxWidth: '500px',
          width: '100%'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff', marginBottom: '0.5rem' }}>
            Demo Access
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '2rem' }}>
            Quick login with pre-filled credentials
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quickLoginOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => handleQuickLogin(option)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1.25rem',
                  border: 'none',
                  borderRadius: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.25)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                  (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '1.125rem' }}>
                      {option.role[0]}
                    </span>
                  </div>
                  <div style={{ flex: '1', minWidth: 0 }}>
                    <h4 style={{ fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem', fontSize: '1.125rem' }}>
                      {option.role}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '0.25rem' }}>
                      {option.description}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {option.email}
                    </p>
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            backdropFilter: 'blur(10px)'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#ffffff', marginBottom: '0.5rem' }}>
              Demo Features
            </h4>
            <ul style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)', listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.25rem' }}>• Full access to all system features</li>
              <li style={{ marginBottom: '0.25rem' }}>• Sample data and workflows</li>
              <li style={{ marginBottom: '0.25rem' }}>• No risk to production data</li>
              <li>• Perfect for training and demos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

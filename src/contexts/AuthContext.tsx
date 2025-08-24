'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  appUser: User | null; // Alias for backward compatibility
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; user?: User; error?: string }>; // Alias for backward compatibility
  logout: () => void;
  signOut: () => void; // Alias for backward compatibility
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user database
const demoUsers = {
  'admin@westendworkforce.com': {
    id: 'admin-demo',
    email: 'admin@westendworkforce.com',
    first_name: 'Tracy',
    last_name: 'Admin',
    role: 'admin' as const,
    manager_id: undefined,
    client_id: undefined,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  'manager@westendworkforce.com': {
    id: 'manager-demo',
    email: 'manager@westendworkforce.com',
    first_name: 'Jane',
    last_name: 'Doe',
    role: 'manager' as const,
    manager_id: undefined,
    client_id: undefined,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  'employee@westendworkforce.com': {
    id: 'employee-demo',
    email: 'employee@westendworkforce.com',
    first_name: 'John',
    last_name: 'Employee',
    role: 'employee' as const,
    manager_id: 'manager-demo',
    client_id: undefined,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

const demoPasswords = {
  'admin@westendworkforce.com': 'admin123',
  'manager@westendworkforce.com': 'manager123',
  'employee@westendworkforce.com': 'employee123'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Check demo users first
      const demoUser = demoUsers[email as keyof typeof demoUsers];
      const demoPassword = demoPasswords[email as keyof typeof demoPasswords];
      
      if (demoUser && password === demoPassword) {
        setUser(demoUser);
        localStorage.setItem('auth_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true, user: demoUser };
      }
      
      // Add Supabase authentication here if needed
      // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      setIsLoading(false);
      return { success: false, error: 'Invalid email or password' };
      
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    router.push('/login');
  };

  const value = {
    user,
    appUser: user, // Alias for backward compatibility
    login,
    signIn: login, // Alias for backward compatibility
    logout,
    signOut: logout, // Alias for backward compatibility
    isLoading,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



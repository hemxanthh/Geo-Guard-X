import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Demo users for authentication
const DEMO_USERS = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@vehicleguard.com',
    phone: '+1234567890',
    role: 'admin' as const,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    username: 'demo',
    password: 'demo123',
    email: 'demo@vehicleguard.com',
    phone: '+0987654321',
    role: 'user' as const,
    createdAt: new Date('2024-01-15'),
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('vehicleGuardUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('vehicleGuardUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Raw input - Username:', `"${username}"`, 'Password:', `"${password}"`);
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Trim whitespace from inputs
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    console.log('Trimmed input - Username:', `"${trimmedUsername}"`, 'Password:', `"${trimmedPassword}"`);
    console.log('Available users:', DEMO_USERS.map(u => ({ username: u.username, password: u.password })));
    
    const foundUser = DEMO_USERS.find(u => u.username === trimmedUsername && u.password === trimmedPassword);
    console.log('Found user:', foundUser);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      console.log('Login successful, setting user:', userWithoutPassword);
      setUser(userWithoutPassword);
      localStorage.setItem('vehicleGuardUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return { success: true };
    } else {
      console.error('LOGIN FAILED');
      console.error('Attempted username:', `"${trimmedUsername}"`);
      console.error('Attempted password:', `"${trimmedPassword}"`);
      console.error('Available usernames:', DEMO_USERS.map(u => `"${u.username}"`));
      setIsLoading(false);
      return { success: false, error: 'Invalid username or password' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vehicleGuardUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('vehicleGuardUser', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
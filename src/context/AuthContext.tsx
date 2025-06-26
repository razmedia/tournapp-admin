import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, User } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin user - Harry Potter
const defaultAdminUser: User = {
  id: 'ADMIN001',
  email: 'harry.potter@tournapp.com',
  password: 'admin123',
  firstName: 'Harry',
  lastName: 'Potter',
  role: 'Super Admin',
  status: 'active',
  lastLogin: new Date().toISOString().split('T')[0],
  gender: 'Male',
  dob: '1980-07-31',
  phone1: '+44 20 7946 0958',
  country: 'UK',
  organizations: ['Tournapp System'],
  clubs: ['Admin Club'],
  profilePicture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state and ensure admin user exists
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if admin user exists in storage, if not create it
        const existingUsers = JSON.parse(localStorage.getItem('tournapp-users') || '[]');
        const adminExists = existingUsers.find((u: User) => u.id === 'ADMIN001');
        
        if (!adminExists) {
          // Add default admin user to storage
          const updatedUsers = [...existingUsers, defaultAdminUser];
          localStorage.setItem('tournapp-users', JSON.stringify(updatedUsers));
        }

        // Check for existing session
        const savedUser = localStorage.getItem('tournapp-auth-user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        localStorage.removeItem('tournapp-auth-user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (emailOrId: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get users from localStorage
      const users: User[] = JSON.parse(localStorage.getItem('tournapp-users') || '[]');
      
      // Find user by email or ID
      const foundUser = users.find(u => 
        u.email.toLowerCase() === emailOrId.toLowerCase() || 
        u.id.toLowerCase() === emailOrId.toLowerCase()
      );

      if (!foundUser) {
        return false;
      }

      // Check password
      if (foundUser.password !== password) {
        return false;
      }

      // Update last login
      const updatedUsers = users.map(u => 
        u.id === foundUser.id 
          ? { ...u, lastLogin: new Date().toISOString().split('T')[0] }
          : u
      );
      localStorage.setItem('tournapp-users', JSON.stringify(updatedUsers));

      // Create auth user object (without password)
      const authUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        role: foundUser.role,
        profilePicture: foundUser.profilePicture
      };

      // Save to localStorage and state
      localStorage.setItem('tournapp-auth-user', JSON.stringify(authUser));
      setUser(authUser);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('tournapp-auth-user');
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
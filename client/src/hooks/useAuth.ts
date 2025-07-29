import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'leadership' | 'member';
  profileImageUrl?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser: any) => {
      if (firebaseUser) {
        // Convert Firebase user to our User interface
        const userData: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0] || '',
          lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
          role: 'member', // Default role, can be updated from database
          profileImageUrl: firebaseUser.photoURL || undefined,
        };
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        // For development, check if we should show mock user or no user
        const shouldShowMockUser = localStorage.getItem('showMockUser') === 'true';
        
        if (shouldShowMockUser) {
          const mockUser: User = {
            id: 'mock-user-1',
            email: 'pravin.patil@bjp.org',
            firstName: 'Pravin',
            lastName: 'Patil',
            role: 'admin',
            profileImageUrl: undefined,
          };
          setUser(mockUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('showMockUser');
    } catch (error) {
      throw error;
    }
  };

  const enableMockUser = () => {
    localStorage.setItem('showMockUser', 'true');
    const mockUser: User = {
      id: 'mock-user-1',
      email: 'pravin.patil@bjp.org',
      firstName: 'Pravin',
      lastName: 'Patil',
      role: 'admin',
      profileImageUrl: undefined,
    };
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  const disableMockUser = () => {
    localStorage.removeItem('showMockUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    enableMockUser,
    disableMockUser,
  };
};

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored authentication on mount
    const storedAuth = localStorage.getItem('fppm_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
      } catch (error) {
        localStorage.removeItem('fppm_auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call with demo credentials
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials for testing
      const validCredentials = [
        { email: 'admin@fppm.com.br', password: 'admin123', role: 'admin' as const },
        { email: 'moderator@fppm.com.br', password: 'mod123', role: 'moderator' as const }
      ];
      
      const credential = validCredentials.find(
        cred => cred.email === email && cred.password === password
      );
      
      if (credential) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          email: credential.email,
          name: credential.role === 'admin' ? 'Administrador FPPM' : 'Moderador FPPM',
          role: credential.role
        };
        
        setUser(userData);
        localStorage.setItem('fppm_auth', JSON.stringify({ user: userData }));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fppm_auth');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

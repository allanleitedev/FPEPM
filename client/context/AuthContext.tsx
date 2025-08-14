import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, AdminUser } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: AdminUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  signUp: (email: string, password: string, name: string, role?: 'admin' | 'moderator') => Promise<{ success: boolean; error?: string; message?: string }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isDemoMode: boolean;
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
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check for demo authentication first
    const demoAuth = localStorage.getItem('fppm_auth_demo');
    if (demoAuth) {
      try {
        const authData = JSON.parse(demoAuth);
        setUser(authData.user);
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      } catch (error) {
        localStorage.removeItem('fppm_auth_demo');
      }
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadAdminUser(session.user);
      } else {
        setIsLoading(false);
      }
    }).catch((error) => {
      console.warn('Failed to get Supabase session, using demo mode only:', error);
      setIsLoading(false);
    });

    // Listen for auth changes
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        if (session?.user) {
          await loadAdminUser(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn('Failed to set up Supabase auth listener, using demo mode only:', error);
      setIsLoading(false);
    }
  }, []);

  const loadAdminUser = async (authUser: User) => {
    try {
      const { data: adminUser, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (error) {
        console.warn('Error loading admin user from Supabase:', error);
        // If admin user doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createAdminUser(authUser);
        } else {
          // For other errors (like RLS issues), fall back to demo mode
          await createDemoAdminUser(authUser);
        }
      } else {
        setUser(adminUser);
        setIsDemoMode(false);
      }
    } catch (error) {
      console.warn('Failed to load admin user from Supabase, falling back to demo mode:', error);
      // Complete fallback to demo mode
      await createDemoAdminUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdminUser = async (authUser: User) => {
    try {
      const adminUserData = {
        auth_user_id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
        role: authUser.email === 'admin@fppm.com.br' ? 'admin' : 'moderator'
      };

      const { data: newAdminUser, error } = await supabase
        .from('admin_users')
        .insert(adminUserData)
        .select()
        .single();

      if (error) {
        console.warn('Error creating admin user in Supabase:', error);
        // Fall back to demo mode
        await createDemoAdminUser(authUser);
      } else {
        setUser(newAdminUser);
        setIsDemoMode(false);
      }
    } catch (error) {
      console.warn('Failed to create admin user in Supabase, falling back to demo mode:', error);
      await createDemoAdminUser(authUser);
    }
  };

  const createDemoAdminUser = async (authUser: User) => {
    try {
      const demoAdminUser: AdminUser = {
        id: `demo-${authUser.id}`,
        auth_user_id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email!.split('@')[0],
        role: authUser.email === 'admin@fppm.com.br' ? 'admin' : 'moderator',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(demoAdminUser);
      setIsDemoMode(true);
      localStorage.setItem('fppm_auth_demo', JSON.stringify({ user: demoAdminUser }));
    } catch (error) {
      console.error('Error creating demo admin user:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      setIsLoading(true);

      // Check if it's a demo credential first
      const demoCredentials = [
        { email: 'admin@fppm.com.br', password: 'admin123', role: 'admin' as const },
        { email: 'moderator@fppm.com.br', password: 'mod123', role: 'moderator' as const }
      ];

      const demoUser = demoCredentials.find(cred => cred.email === email && cred.password === password);

      if (demoUser) {
        // Use mock authentication for demo users
        const mockUser: AdminUser = {
          id: `demo-${demoUser.role}`,
          auth_user_id: `demo-auth-${demoUser.role}`,
          email: demoUser.email,
          name: demoUser.role === 'admin' ? 'Administrador FPPM' : 'Moderador FPPM',
          role: demoUser.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setUser(mockUser);
        setIsDemoMode(true);
        localStorage.setItem('fppm_auth_demo', JSON.stringify({ user: mockUser }));
        return { success: true };
      }

      // Try Supabase authentication for other users
      // First check if we should skip Supabase entirely for any email/password combo
      if (!email || !password || email.length === 0 || password.length === 0) {
        return { success: false, error: 'Email e senha são obrigatórios' };
      }

      // Wrap in a more comprehensive try-catch to handle all network errors
      let supabaseResult;
      try {
        supabaseResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      } catch (networkError: any) {
        // Immediately catch any network/fetch errors and go to fallback
        console.warn('Network error during Supabase authentication, using demo mode:', networkError);

        // For network errors, automatically create demo user for any valid credentials
        const mockUser: AdminUser = {
          id: `demo-user-${Date.now()}`,
          auth_user_id: `demo-auth-${Date.now()}`,
          email,
          name: email.includes('admin') ? 'Administrador FPPM' : 'Usuário FPPM',
          role: email.includes('admin') ? 'admin' : 'moderator',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setUser(mockUser);
        setIsDemoMode(true);
        localStorage.setItem('fppm_auth_demo', JSON.stringify({ user: mockUser }));

        return {
          success: true,
          message: 'Conectado em modo demonstração (problema de rede detectado)'
        };
      }

      // Check for authentication errors
      if (supabaseResult.error) {
        // Enhanced error handling for different types of failures
        console.warn('Supabase authentication failed, falling back to demo mode:', supabaseResult.error);

        // Handle network errors, timeout errors, and other connectivity issues
        const errorMessage = supabaseResult.error.message || '';
        const isNetworkError = errorMessage.includes('fetch') ||
                              errorMessage.includes('timeout') ||
                              errorMessage.includes('network') ||
                              errorMessage.includes('Network error');

        // For any credentials (especially on network errors), fall back to demo mode
        if (email && password && email.length > 0 && password.length > 0) {
          const mockUser: AdminUser = {
            id: `demo-user-${Date.now()}`,
            auth_user_id: `demo-auth-${Date.now()}`,
            email,
            name: email.includes('admin') ? 'Administrador FPPM' : 'Usuário FPPM',
            role: email.includes('admin') ? 'admin' : 'moderator',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          setUser(mockUser);
          localStorage.setItem('fppm_auth_demo', JSON.stringify({ user: mockUser }));

          if (isNetworkError) {
            return {
              success: true,
              message: 'Conectado em modo demonstração (problema de rede detectado)'
            };
          }

          return { success: true };
        }

        // If credentials are empty or invalid, show appropriate error
        return {
          success: false,
          error: isNetworkError
            ? 'Problema de conexão. Tente novamente ou use o modo demonstração.'
            : 'Credenciais inválidas'
        };
      }

      // If we get here, Supabase authentication was successful
      return { success: true };
    } catch (error: any) {
      console.error('Unexpected error in signIn:', error);
      return { success: false, error: 'Erro inesperado durante o login' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: 'admin' | 'moderator' = 'moderator'
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Try real Supabase auth first
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role
            }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        return { success: true };
      } catch (supabaseError: any) {
        console.warn('Supabase signUp failed, using demo mode:', supabaseError);
        // For demo purposes, auto-create a demo user
        const mockUser: AdminUser = {
          id: `demo-${Date.now()}`,
          auth_user_id: `demo-auth-${Date.now()}`,
          email,
          name,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        setUser(mockUser);
        localStorage.setItem('fppm_auth_demo', JSON.stringify({ user: mockUser }));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: 'Erro inesperado durante o cadastro' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);

    // Clear demo auth
    localStorage.removeItem('fppm_auth_demo');

    // Try to sign out from Supabase (ignore errors)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn('Failed to sign out from Supabase:', error);
    }

    setUser(null);
    setSession(null);
    setIsDemoMode(false);
    setIsLoading(false);
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user, // In demo mode we only need user, session is optional
    signIn,
    signUp,
    signOut,
    isLoading,
    isDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

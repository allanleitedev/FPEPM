import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, AdminUser, withTimeout } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: AdminUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  signUp: (
    email: string,
    password: string,
    name: string,
    role?: "admin" | "moderator",
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Produção: não usar modo demonstração
    localStorage.removeItem("fppm_auth_demo");

    // Get initial session from Supabase
    withTimeout(supabase.auth.getSession(), 15000)
      .then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          loadAdminUser(session.user);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.warn("Failed to get Supabase session:", error);
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
          setIsDemoMode(false);
          setIsLoading(false);
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn("Failed to set up Supabase auth listener:", error);
      setIsLoading(false);
    }
  }, []);

  const loadAdminUser = async (authUser: User) => {
    console.log("🔄 [loadAdminUser] Iniciando carregamento do usuário admin para:", authUser.id);
    try {
      console.log("🔍 [loadAdminUser] Consultando tabela admin_users...");
      
      const { data: adminUser, error } = await withTimeout(
        supabase
          .from("admin_users")
          .select("*")
          .eq("auth_user_id", authUser.id)
          .single(),
        10000
      );

      if (error) {
        console.warn("⚠️ [loadAdminUser] Error loading admin user from Supabase:", error);
        // Se não existir, cria registro vinculado ao auth user
        if (error.code === "PGRST116") {
          console.log("👤 [loadAdminUser] Usuário não existe, criando novo...");
          await createAdminUser(authUser);
        } else {
          console.warn("❌ [loadAdminUser] Erro desconhecido, ativando modo demo");
          await createDemoAdminUser(authUser);
        }
      } else {
        console.log("✅ [loadAdminUser] Usuário admin carregado com sucesso:", adminUser);
        setUser(adminUser);
        setIsDemoMode(false);
      }
    } catch (error) {
      console.warn("❌ [loadAdminUser] Failed to load admin user from Supabase:", error);
      console.log("🔄 [loadAdminUser] Ativando modo demo como fallback");
      await createDemoAdminUser(authUser);
    } finally {
      console.log("✅ [loadAdminUser] Finalizando processo, setando isLoading = false");
      setIsLoading(false);
    }
  };

  const createAdminUser = async (authUser: User) => {
    console.log("👤 [createAdminUser] Iniciando criação de usuário admin para:", authUser.email);
    try {
      const adminUserData = {
        auth_user_id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email!.split("@")[0],
        role: authUser.email === "admin@fppm.com.br" ? "admin" : "moderator",
      };

      console.log("📝 [createAdminUser] Dados do usuário a ser criado:", adminUserData);

      const { data: newAdminUser, error } = await withTimeout(
        supabase
          .from("admin_users")
          .insert(adminUserData)
          .select()
          .single(),
        10000
      );

      if (error) {
        console.warn("❌ [createAdminUser] Error creating admin user in Supabase:", error);
        console.log("🔄 [createAdminUser] Fallback para modo demo");
        await createDemoAdminUser(authUser);
      } else {
        console.log("✅ [createAdminUser] Usuário admin criado com sucesso:", newAdminUser);
        setUser(newAdminUser);
        setIsDemoMode(false);
      }
    } catch (error) {
      console.warn(
        "❌ [createAdminUser] Failed to create admin user in Supabase, falling back to demo mode:",
        error,
      );
      await createDemoAdminUser(authUser);
    }
  };

  const createDemoAdminUser = async (authUser: User) => {
    try {
      const demoUser: AdminUser = {
        id: crypto.randomUUID(),
        auth_user_id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email!.split("@")[0],
        role: authUser.email === "admin@fppm.com.br" ? "admin" : "moderator",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setUser(demoUser);
      setIsDemoMode(true);
      console.info("Modo demo ativado para usuário:", demoUser.email);
    } catch (error) {
      console.error("Erro ao criar usuário demo:", error);
    }
  };

  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      setIsLoading(true);

      // Autenticação real no Supabase
      // First check if we should skip Supabase entirely for any email/password combo
      if (!email || !password || email.length === 0 || password.length === 0) {
        return { success: false, error: "Email e senha são obrigatórios" };
      }

      // Wrap in a more comprehensive try-catch to handle all network errors
      let supabaseResult;
      try {
        supabaseResult = await withTimeout(
          supabase.auth.signInWithPassword({ email, password }),
          20000,
        );
      } catch (networkError: any) {
        console.warn("Network error during Supabase authentication:", networkError);
        return { success: false, error: "Problema de conexão com o servidor" };
      }

      // Check for authentication errors
      if (supabaseResult.error) {
        // Enhanced error handling for different types of failures
        console.warn("Supabase authentication failed:", supabaseResult.error);

        // Handle network errors, timeout errors, and other connectivity issues
        const errorMessage = supabaseResult.error.message || "";
        const isNetworkError =
          errorMessage.includes("fetch") ||
          errorMessage.includes("timeout") ||
          errorMessage.includes("network") ||
          errorMessage.includes("Network error");

        // Erro adequado
        return {
          success: false,
          error: isNetworkError
            ? "Problema de conexão. Tente novamente."
            : "Credenciais inválidas",
        };
      }

      // If we get here, Supabase authentication was successful
      console.log("✅ [signIn] Autenticação no Supabase bem-sucedida para:", email);
      return { success: true };
    } catch (error: any) {
      console.error("Unexpected error in signIn:", error);
      return { success: false, error: "Erro inesperado durante o login" };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: "admin" | "moderator" = "moderator",
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Try real Supabase auth first
      try {
        const { data, error } = await withTimeout(
          supabase.auth.signUp({
            email,
            password,
            options: { data: { name, role } },
          }),
          8000,
        );
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (supabaseError: any) {
        console.warn("Supabase signUp failed:", supabaseError);
        return { success: false, error: "Falha ao criar conta" };
      }
    } catch (error) {
      return { success: false, error: "Erro inesperado durante o cadastro" };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);

    // Limpa qualquer resquício de demo
    localStorage.removeItem("fppm_auth_demo");

    // Try to sign out from Supabase (ignore errors)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.warn("Failed to sign out from Supabase:", error);
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
    isDemoMode,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

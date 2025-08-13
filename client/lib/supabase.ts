import { createClient } from '@supabase/supabase-js';

// Supabase configuration - Update these with your project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwlmduvnndbsahzpmevq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bG1kdXZubmRic2FoenBtZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjExODcsImV4cCI6MjA1MzAzNzE4N30.4Nm5WztZDCeY7Z8u6WrGJO7EIJ3WjUhzKJRKlpCdUh8';

// Export for debugging
export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  hasEnvUrl: !!import.meta.env.VITE_SUPABASE_URL,
  hasEnvKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface AdminUser {
  id: string;
  auth_user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  category: 'gestao' | 'processos' | 'estatuto' | 'compras' | 'documentos' | 'ouvidoria';
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  tags: string[];
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  admin_users?: AdminUser;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  category?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  budget?: number;
  participants_expected?: number;
  technical_details?: any;
  impact_assessment?: string;
  image_url?: string;
  image_path?: string;
  created_by: string;
  approved_by?: string;
  created_at: string;
  updated_at: string;
  admin_users?: AdminUser;
}

// Helper functions
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (type: string): string => {
  if (type.includes('pdf')) return '📄';
  if (type.includes('word')) return '📝';
  if (type.includes('sheet') || type.includes('excel')) return '📊';
  if (type.includes('image')) return '🖼️';
  return '📁';
};

export const CATEGORIES = [
  { value: 'gestao', label: 'Gestão' },
  { value: 'processos', label: 'Processos Eleitorais' },
  { value: 'estatuto', label: 'Estatuto' },
  { value: 'compras', label: 'Manual de Compras' },
  { value: 'documentos', label: 'Documentos Gerais' },
  { value: 'ouvidoria', label: 'Ouvidoria' }
] as const;

export const EVENT_STATUSES = [
  { value: 'draft', label: 'Rascunho', color: 'gray' },
  { value: 'pending', label: 'Pendente', color: 'yellow' },
  { value: 'approved', label: 'Aprovado', color: 'green' },
  { value: 'rejected', label: 'Rejeitado', color: 'red' },
  { value: 'published', label: 'Publicado', color: 'blue' }
] as const;

// Test Supabase connection with detailed diagnostics
export const testSupabaseConnection = async (): Promise<{
  connected: boolean;
  error?: string;
  details?: string[]
}> => {
  const details: string[] = [];

  try {
    details.push('🔍 Testando conexão com Supabase...');

    // Test 1: Basic URL connectivity
    try {
      const response = await fetch(supabaseUrl + '/rest/v1/', {
        method: 'HEAD',
        headers: {
          'apikey': supabaseAnonKey,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        details.push('✅ URL do Supabase está acessível');
      } else {
        details.push(`❌ URL do Supabase retornou: ${response.status}`);
        return { connected: false, error: `HTTP ${response.status}`, details };
      }
    } catch (urlError: any) {
      details.push('❌ Falha ao conectar na URL do Supabase');
      return { connected: false, error: urlError.message, details };
    }

    // Test 2: Auth status
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        details.push(`⚠️ Erro na sessão: ${sessionError.message}`);
      } else {
        details.push(`ℹ️ Sessão: ${session ? 'Logado' : 'Anônimo'}`);
      }
    } catch (authError: any) {
      details.push(`❌ Erro no auth: ${authError.message}`);
    }

    // Test 3: Check if tables exist
    const tables = ['admin_users', 'documents', 'events'];

    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1);

        if (error) {
          details.push(`❌ Tabela '${table}': ${error.message}`);
          if (error.message.includes('permission denied') || error.message.includes('RLS')) {
            details.push(`   💡 Problema de RLS/Permissões na tabela ${table}`);
          }
        } else {
          details.push(`✅ Tabela '${table}': OK`);
        }
      } catch (tableError: any) {
        details.push(`❌ Erro na tabela '${table}': ${tableError.message}`);
      }
    }

    // Test 4: Try to insert a test admin user (if authenticated)
    try {
      const testUser = {
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin'
      };

      const { error: insertError } = await supabase
        .from('admin_users')
        .insert(testUser)
        .select()
        .single();

      if (insertError) {
        details.push(`⚠️ Insert test falhou: ${insertError.message}`);
        if (insertError.message.includes('permission') || insertError.message.includes('RLS')) {
          details.push('   💡 Políticas RLS muito restritivas');
        }
      } else {
        details.push('✅ Insert test: OK');
        // Clean up test data
        await supabase.from('admin_users').delete().eq('email', 'test@example.com');
      }
    } catch (insertError: any) {
      details.push(`⚠️ Insert test erro: ${insertError.message}`);
    }

    // Check if any major errors occurred
    const hasErrors = details.some(detail => detail.includes('❌'));
    const hasRLSIssues = details.some(detail => detail.includes('RLS') || detail.includes('permission'));

    if (hasErrors) {
      return {
        connected: false,
        error: hasRLSIssues ? 'Problemas com pol��ticas RLS' : 'Problemas de conectividade',
        details
      };
    }

    details.push('🎉 Conexão com Supabase funcionando!');
    return { connected: true, details };

  } catch (error: any) {
    details.push(`❌ Erro geral: ${error.message}`);
    return { connected: false, error: error.message || 'Connection failed', details };
  }
};

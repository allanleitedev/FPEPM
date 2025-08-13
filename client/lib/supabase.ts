import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bwlmduvnndbsahzpmevq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3bG1kdXZubmRic2FoenBtZXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc0NjExODcsImV4cCI6MjA1MzAzNzE4N30.4Nm5WztZDCeY7Z8u6WrGJO7EIJ3WjUhzKJRKlpCdUh8';

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

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  try {
    // Try to get the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      return { connected: false, error: sessionError.message };
    }

    // Try a simple query to test database connection
    const { error: queryError } = await supabase
      .from('admin_users')
      .select('count')
      .limit(1);

    if (queryError) {
      return { connected: false, error: queryError.message };
    }

    return { connected: true };
  } catch (error: any) {
    return { connected: false, error: error.message || 'Connection failed' };
  }
};

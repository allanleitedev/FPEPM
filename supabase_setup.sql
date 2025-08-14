-- FPPM Supabase Database Setup
-- Execute this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('gestao', 'processos', 'estatuto', 'compras', 'documentos', 'ouvidoria')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE,
  location TEXT,
  category TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published')),
  budget DECIMAL(10,2),
  participants_expected INTEGER,
  technical_details JSONB,
  impact_assessment TEXT,
  image_url TEXT,
  image_path TEXT,
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doc_categories table (dynamic categories for documents)
CREATE TABLE IF NOT EXISTS doc_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: settings key/value store
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Allow authenticated users to read admin_users" 
ON admin_users FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert admin_users" 
ON admin_users FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update admin_users" 
ON admin_users FOR UPDATE 
USING (true);

-- Create policies for documents
CREATE POLICY "Allow public read access to documents" 
ON documents FOR SELECT 
USING (true);

CREATE POLICY "Allow authenticated users to insert documents" 
ON documents FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow document owners to update their documents" 
ON documents FOR UPDATE 
USING (uploaded_by IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Allow document owners to delete their documents" 
ON documents FOR DELETE 
USING (uploaded_by IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid()));

-- Create policies for events
CREATE POLICY "Allow public read access to published events" 
ON events FOR SELECT 
USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to insert events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow event creators to update their events" 
ON events FOR UPDATE 
USING (created_by IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid()) 
       OR approved_by IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid()));

CREATE POLICY "Allow event creators to delete their events" 
ON events FOR DELETE 
USING (created_by IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid()));

-- Categories policies
CREATE POLICY "Public read visible categories" 
ON doc_categories FOR SELECT 
USING (visible = TRUE OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated manage categories" 
ON doc_categories FOR ALL 
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Settings policies (only authenticated can read/write)
CREATE POLICY "Authenticated read settings" 
ON app_settings FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated upsert settings" 
ON app_settings FOR ALL 
USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at 
BEFORE UPDATE ON admin_users 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at 
BEFORE UPDATE ON documents 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
BEFORE UPDATE ON events 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doc_categories_updated_at 
BEFORE UPDATE ON doc_categories 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('documents', 'documents', true),
  ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Public Access to Documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Document owners can update documents" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Document owners can delete documents" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Public Access to Event Images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'event-images');

CREATE POLICY "Authenticated users can upload event images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'event-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Event image owners can update images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'event-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Event image owners can delete images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'event-images' AND auth.uid() IS NOT NULL);

-- Insert sample data
-- First, you need to create admin users via the app's signup process
-- Then update these sample records with real user IDs

-- Sample admin user (create this via the app's authentication)
-- Email: admin@fppm.com.br
-- Password: admin123
-- Name: Administrador FPPM
-- Role: admin

-- After creating the admin user, you can insert sample documents and events
-- Get the admin user ID and replace the placeholder below

-- Sample documents (uncomment and update user IDs after creating admin users)
/*
INSERT INTO documents (
  title,
  description,
  category,
  file_name,
  file_path,
  file_size,
  file_type,
  tags,
  uploaded_by
) VALUES 
(
  'Estatuto Social FPPM 2024',
  'Estatuto social vigente da Federação Pernambucana de Pentatlo Moderno',
  'estatuto',
  'estatuto-fppm-2024.pdf',
  'estatuto/demo-estatuto.pdf',
  2048000,
  'application/pdf',
  ARRAY['estatuto', 'social', 'fppm'],
  (SELECT id FROM admin_users WHERE email = 'admin@fppm.com.br' LIMIT 1)
),
(
  'Regimento Interno',
  'Regimento interno da federação com normas e procedimentos',
  'gestao',
  'regimento-interno.pdf',
  'gestao/demo-regimento.pdf',
  1536000,
  'application/pdf',
  ARRAY['regimento', 'interno', 'normas'],
  (SELECT id FROM admin_users WHERE email = 'admin@fppm.com.br' LIMIT 1)
);
*/

-- Sample events (uncomment and update user IDs after creating admin users)
/*
INSERT INTO events (
  title,
  description,
  event_date,
  location,
  category,
  status,
  budget,
  participants_expected,
  technical_details,
  impact_assessment,
  created_by
) VALUES 
(
  'Copa Pernambucana de Pentatlo Moderno 2025',
  'Competição estadual de pentatlo moderno para atletas de todas as categorias',
  '2025-06-15',
  'Recife, PE',
  'Campeonato Estadual',
  'published',
  25000.00,
  80,
  '{"equipment": "Pistolas laser, piscina 25m, pista de corrida, equipamentos de esgrima", "venue": "Centro Esportivo de Recife"}',
  'Evento promoverá o desenvolvimento do pentatlo moderno em Pernambuco e revelará novos talentos para competições nacionais',
  (SELECT id FROM admin_users WHERE email = 'admin@fppm.com.br' LIMIT 1)
);
*/

-- To check if everything was created correctly:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT id, email, name, role FROM admin_users;
-- SELECT count(*) FROM documents;
-- SELECT count(*) FROM events;

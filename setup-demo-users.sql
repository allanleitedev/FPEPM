-- Setup demo admin users for FPPM system
-- Run this script in your Supabase SQL editor after applying the migrations

-- Insert demo users into auth.users (this would normally be done via Supabase Auth)
-- Note: In a real setup, users would register via the authentication flow

-- For demonstration purposes, you can create these users via Supabase Dashboard -> Authentication -> Users
-- Or use the signup functionality in the app

-- Demo admin user data to be created via auth signup:
-- Email: admin@fppm.com.br
-- Password: admin123
-- Role: admin

-- Demo moderator user data to be created via auth signup:
-- Email: moderator@fppm.com.br  
-- Password: mod123
-- Role: moderator

-- The admin_users table will be automatically populated when users sign up
-- due to the trigger in the AuthContext that creates admin_users records

-- Sample documents and events can be created via the admin interface
-- after authentication

-- Create some sample document categories if needed
INSERT INTO public.documents (
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
  -- This will need to be updated with actual admin user ID after user creation
  '00000000-0000-0000-0000-000000000000'
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
  '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT DO NOTHING;

-- Note: The uploaded_by field will need to be updated with real admin user IDs
-- after the admin users are created through the authentication flow

-- To update the uploaded_by field after creating admin users:
-- UPDATE public.documents 
-- SET uploaded_by = (SELECT id FROM admin_users WHERE email = 'admin@fppm.com.br' LIMIT 1)
-- WHERE uploaded_by = '00000000-0000-0000-0000-000000000000';

-- Sample events
INSERT INTO public.events (
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
  'pending',
  25000.00,
  80,
  '{"equipment": "Pistolas laser, piscina 25m, pista de corrida, equipamentos de esgrima", "venue": "Centro Esportivo de Recife"}',
  'Evento promoverá o desenvolvimento do pentatlo moderno em Pernambuco e revelará novos talentos para competições nacionais',
  '00000000-0000-0000-0000-000000000000'
),
(
  'Workshop de Arbitragem',
  'Curso de formação e atualização para árbitros de pentatlo moderno',
  '2025-04-20',
  'Recife, PE',
  'Capacitação',
  'draft',
  8000.00,
  25,
  '{"materials": "Material didático, certificados", "duration": "2 dias"}',
  'Capacitação de árbitros locais para melhorar a qualidade das competições',
  '00000000-0000-0000-0000-000000000000'
)
ON CONFLICT DO NOTHING;

-- Instructions for setup:
-- 1. Run the migrations first (create_admin_schema.sql and setup_rls_policies.sql)
-- 2. Create admin users via the signup interface in the app
-- 3. Update the sample data with real user IDs
-- 4. Test the system functionality

-- To find admin user IDs after creation:
-- SELECT id, email, name, role FROM admin_users;

-- To update sample data with real user IDs:
-- UPDATE documents SET uploaded_by = 'REAL_ADMIN_USER_ID' WHERE uploaded_by = '00000000-0000-0000-0000-000000000000';
-- UPDATE events SET created_by = 'REAL_ADMIN_USER_ID' WHERE created_by = '00000000-0000-0000-0000-000000000000';

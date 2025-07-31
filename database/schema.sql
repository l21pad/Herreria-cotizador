-- Cotizador Herrería PRO - Database Schema
-- Ejecutar este script en Supabase SQL Editor

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de perfiles de herrería
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  business_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  address TEXT NOT NULL,
  state VARCHAR(100) NOT NULL,
  rfc VARCHAR(13) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  fiscal_regime VARCHAR(100),
  cfdi_use VARCHAR(100),
  payment_method VARCHAR(100),
  is_pro BOOLEAN DEFAULT FALSE,
  pro_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de materiales
CREATE TABLE materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  stock INTEGER,
  min_stock INTEGER,
  category VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  rfc VARCHAR(13),
  fiscal_regime VARCHAR(100),
  cfdi_use VARCHAR(100),
  payment_method VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de cotizaciones
CREATE TABLE quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'expired')),
  requires_invoice BOOLEAN DEFAULT FALSE,
  subtotal DECIMAL(12,2) DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) DEFAULT 0,
  advance_payment DECIMAL(12,2) DEFAULT 0,
  remaining_payment DECIMAL(12,2) DEFAULT 0,
  discount_percentage DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  profit_percentage DECIMAL(5,2) DEFAULT 0,
  notes TEXT,
  valid_until DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de trabajos (múltiples por cotización)
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  width DECIMAL(8,2),
  height DECIMAL(8,2),
  depth DECIMAL(8,2),
  quantity INTEGER DEFAULT 1,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  additional_costs DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de materiales por trabajo
CREATE TABLE job_materials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  material_id UUID REFERENCES materials(id) NOT NULL,
  quantity DECIMAL(10,3) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) NOT NULL
);

-- Tabla de galería
CREATE TABLE gallery (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de colaboradores
CREATE TABLE collaborators (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invited_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive')),
  invited_at TIMESTAMP DEFAULT NOW(),
  joined_at TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_materials_profile_id ON materials(profile_id);
CREATE INDEX idx_clients_profile_id ON clients(profile_id);
CREATE INDEX idx_quotes_profile_id ON quotes(profile_id);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at);
CREATE INDEX idx_jobs_quote_id ON jobs(quote_id);
CREATE INDEX idx_job_materials_job_id ON job_materials(job_id);
CREATE INDEX idx_job_materials_material_id ON job_materials(material_id);
CREATE INDEX idx_gallery_profile_id ON gallery(profile_id);
CREATE INDEX idx_gallery_category ON gallery(category);
CREATE INDEX idx_collaborators_profile_id ON collaborators(profile_id);
CREATE INDEX idx_collaborators_user_id ON collaborators(user_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);

-- Función para obtener profile_id del usuario actual
CREATE OR REPLACE FUNCTION get_user_profile_id()
RETURNS UUID AS $$
  SELECT id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Función para verificar si el usuario es colaborador de un perfil
CREATE OR REPLACE FUNCTION is_collaborator(profile_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM collaborators 
    WHERE profile_id = profile_uuid 
    AND user_id = auth.uid() 
    AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Políticas RLS para materials
CREATE POLICY "Users can view materials of own profile or as collaborator" ON materials 
  FOR SELECT USING (
    profile_id = get_user_profile_id() OR 
    is_collaborator(profile_id)
  );

CREATE POLICY "Users can manage materials of own profile" ON materials 
  FOR ALL USING (profile_id = get_user_profile_id());

-- Políticas RLS para clients
CREATE POLICY "Users can view clients of own profile or as collaborator" ON clients 
  FOR SELECT USING (
    profile_id = get_user_profile_id() OR 
    is_collaborator(profile_id)
  );

CREATE POLICY "Users can manage clients of own profile or as collaborator" ON clients 
  FOR ALL USING (
    profile_id = get_user_profile_id() OR 
    is_collaborator(profile_id)
  );

-- Políticas RLS para quotes
CREATE POLICY "Users can view quotes of own profile or as collaborator" ON quotes 
  FOR SELECT USING (
    profile_id = get_user_profile_id() OR 
    is_collaborator(profile_id)
  );

CREATE POLICY "Users can manage quotes of own profile or as collaborator" ON quotes 
  FOR ALL USING (
    profile_id = get_user_profile_id() OR 
    is_collaborator(profile_id)
  );

-- Políticas RLS para jobs
CREATE POLICY "Users can view jobs through quotes" ON jobs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quotes 
      WHERE quotes.id = jobs.quote_id 
      AND (
        quotes.profile_id = get_user_profile_id() OR 
        is_collaborator(quotes.profile_id)
      )
    )
  );

CREATE POLICY "Users can manage jobs through quotes" ON jobs 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM quotes 
      WHERE quotes.id = jobs.quote_id 
      AND (
        quotes.profile_id = get_user_profile_id() OR 
        is_collaborator(quotes.profile_id)
      )
    )
  );

-- Políticas RLS para job_materials
CREATE POLICY "Users can view job_materials through jobs" ON job_materials 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs 
      JOIN quotes ON quotes.id = jobs.quote_id
      WHERE jobs.id = job_materials.job_id 
      AND (
        quotes.profile_id = get_user_profile_id() OR 
        is_collaborator(quotes.profile_id)
      )
    )
  );

CREATE POLICY "Users can manage job_materials through jobs" ON job_materials 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM jobs 
      JOIN quotes ON quotes.id = jobs.quote_id
      WHERE jobs.id = job_materials.job_id 
      AND (
        quotes.profile_id = get_user_profile_id() OR 
        is_collaborator(quotes.profile_id)
      )
    )
  );

-- Políticas RLS para gallery
CREATE POLICY "Users can view gallery of own profile or as collaborator" ON gallery 
  FOR SELECT USING (
    profile_id = get_user_profile_id() OR 
    is_collaborator(profile_id)
  );

CREATE POLICY "Users can manage gallery of own profile" ON gallery 
  FOR ALL USING (profile_id = get_user_profile_id());

-- Políticas RLS para collaborators
CREATE POLICY "Users can view collaborators of own profile" ON collaborators 
  FOR SELECT USING (profile_id = get_user_profile_id());

CREATE POLICY "Users can manage collaborators of own profile" ON collaborators 
  FOR ALL USING (profile_id = get_user_profile_id());

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('logos', 'logos', true),
  ('gallery', 'gallery', true),
  ('job-images', 'job-images', true);

-- Storage policies
CREATE POLICY "Users can upload logos to own folder" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'logos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all logos" ON storage.objects 
  FOR SELECT USING (bucket_id = 'logos');

CREATE POLICY "Users can upload gallery images to own folder" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'gallery' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all gallery images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Users can upload job images to own folder" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'job-images' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view all job images" ON storage.objects 
  FOR SELECT USING (bucket_id = 'job-images');

-- Función para generar número de cotización único
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT AS $$
DECLARE
  quote_num TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    quote_num := 'COT-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(counter::TEXT, 3, '0');
    
    IF NOT EXISTS (SELECT 1 FROM quotes WHERE quote_number = quote_num) THEN
      RETURN quote_num;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Portafolio Dinámico - Esquema de Base de Datos Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- ============================================
-- TABLA: global_config
-- Configuración global del Portafolio
-- ============================================
CREATE TABLE IF NOT EXISTS global_config (
  id SERIAL PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'Full Stack Developer',
  headline TEXT NOT NULL DEFAULT 'Construyendo experiencias web excepcionales',
  about_me_content TEXT,
  cv_url TEXT,
  hero_bg_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuración inicial
INSERT INTO global_config (role, headline, about_me_content)
VALUES (
  'Full Stack Developer',
  'Construyendo experiencias web excepcionales',
  'Soy un desarrollador apasionado por la tecnología y la creación de soluciones innovadoras.'
);

-- ============================================
-- TABLA: projects
-- Proyectos del Portafolio
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] DEFAULT '{}',
  repo_url TEXT,
  live_url TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: project_images
-- Imágenes asociadas a proyectos
-- ============================================
CREATE TABLE IF NOT EXISTS project_images (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_main BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

-- ============================================
-- TABLA: education
-- Formación académica y cursos
-- ============================================
CREATE TABLE IF NOT EXISTS education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree_or_course TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  certificate_url TEXT,
  display_order INTEGER DEFAULT 0
);

-- ============================================
-- TABLA: experience
-- Experiencia laboral
-- ============================================
CREATE TABLE IF NOT EXISTS experience (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  description TEXT,
  display_order INTEGER DEFAULT 0
);

-- ============================================
-- TABLA: contact_links
-- Enlaces de redes sociales y contacto
-- ============================================
CREATE TABLE IF NOT EXISTS contact_links (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Insertar enlaces de ejemplo
INSERT INTO contact_links (platform, url, icon_name, display_order)
VALUES 
  ('GitHub', 'https://github.com/tuusuario', 'github', 1),
  ('LinkedIn', 'https://linkedin.com/in/tuusuario', 'linkedin', 2),
  ('Email', 'mailto:tu@email.com', 'mail', 3);

-- ============================================
-- TABLA: contact_messages
-- Mensajes recibidos del formulario de contacto
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- ============================================
-- ÍNDICES para mejorar el rendimiento
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON education(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_display_order ON experience(display_order);
CREATE INDEX IF NOT EXISTS idx_contact_links_display_order ON contact_links(display_order);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE global_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (cualquiera puede leer)
CREATE POLICY "Public read access" ON global_config FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public read access" ON education FOR SELECT USING (true);
CREATE POLICY "Public read access" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_links FOR SELECT USING (true);

-- Política para insertar mensajes de contacto (público)
CREATE POLICY "Public insert access" ON contact_messages FOR INSERT WITH CHECK (true);

-- Políticas para usuarios autenticados (admin)
-- Solo usuarios autenticados pueden modificar datos
CREATE POLICY "Authenticated users can modify" ON global_config 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify" ON projects 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify" ON project_images 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify" ON education 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify" ON experience 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can modify" ON contact_links 
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read messages" ON contact_messages 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update messages" ON contact_messages 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete messages" ON contact_messages 
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para global_config
CREATE TRIGGER update_global_config_updated_at
  BEFORE UPDATE ON global_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Nota: Esto debe configurarse manualmente en Supabase Dashboard
-- 1. Ir a Storage
-- 2. Crear un bucket llamado "portafolio-assets"
-- 3. Hacerlo público
-- 4. Crear las siguientes carpetas:
--    - certificates/
--    - projects/
--    - cv/
--    - hero/

-- ============================================
-- DATOS DE EJEMPLO (Opcional)
-- ============================================

-- Proyecto de ejemplo
INSERT INTO projects (name, description, tech_stack, display_order)
VALUES (
  'Portafolio Personal',
  'Portafolio dinámico construido con Next.js y Supabase',
  ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
  1
);

-- Educación de ejemplo
INSERT INTO education (institution, degree_or_course, start_date, display_order)
VALUES (
  'Universidad Ejemplo',
  'Ingeniería en Sistemas',
  '2018-01-01',
  1
);

-- Experiencia de ejemplo
INSERT INTO experience (company, position, start_date, display_order)
VALUES (
  'Tech Company',
  'Full Stack Developer',
  '2020-01-01',
  1
);

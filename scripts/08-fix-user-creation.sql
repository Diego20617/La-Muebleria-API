-- Arreglar la creación de usuarios y triggers

-- 1. Primero, eliminar el trigger existente si causa problemas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 2. Verificar que la tabla perfiles tenga la estructura correcta
-- Agregar columnas faltantes si no existen
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100),
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS codigo_postal VARCHAR(20),
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);

-- 3. Crear una función más simple y robusta para manejar nuevos usuarios
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar perfil básico para el nuevo usuario
  INSERT INTO public.perfiles (id, nombre, apellido, rol, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    'cliente',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Si hay error, log pero no fallar
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear el trigger nuevamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Asegurar que el usuario admin existe
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Buscar el usuario admin
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@muebleriasanbernardo.cl';
  
  -- Si existe, asegurar que tenga perfil de admin
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO perfiles (id, nombre, apellido, rol, created_at, updated_at)
    VALUES (admin_user_id, 'Administrador', 'Sistema', 'admin', NOW(), NOW())
    ON CONFLICT (id) 
    DO UPDATE SET 
      rol = 'admin',
      nombre = COALESCE(perfiles.nombre, 'Administrador'),
      apellido = COALESCE(perfiles.apellido, 'Sistema'),
      updated_at = NOW();
      
    RAISE NOTICE 'Usuario admin configurado correctamente';
  ELSE
    RAISE NOTICE 'Usuario admin no encontrado. Créalo manualmente en Supabase Auth primero.';
  END IF;
END $$;

-- 6. Verificar la configuración
SELECT 
  'Usuarios en auth.users' as tabla,
  count(*) as total
FROM auth.users
UNION ALL
SELECT 
  'Perfiles creados' as tabla,
  count(*) as total
FROM perfiles;

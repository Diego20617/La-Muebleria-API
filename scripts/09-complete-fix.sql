-- Arreglar completamente la base de datos y configuración

-- 1. Deshabilitar RLS temporalmente para desarrollo
ALTER TABLE perfiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE carrito DISABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_pedido DISABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE resenas DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar trigger problemático y recrearlo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- 3. Asegurar que la tabla perfiles tenga todas las columnas
ALTER TABLE perfiles 
ADD COLUMN IF NOT EXISTS direccion TEXT,
ADD COLUMN IF NOT EXISTS ciudad VARCHAR(100),
ADD COLUMN IF NOT EXISTS region VARCHAR(100),
ADD COLUMN IF NOT EXISTS codigo_postal VARCHAR(20),
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20);

-- 4. Crear función robusta para nuevos usuarios
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    RAISE WARNING 'Error creating user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Funciones para gestión de stock
CREATE OR REPLACE FUNCTION actualizar_stock(p_producto_id INTEGER, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos 
  SET stock = GREATEST(0, stock - p_cantidad)
  WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restaurar_stock(p_producto_id INTEGER, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos 
  SET stock = stock + p_cantidad
  WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- 7. Crear usuario admin si existe en auth.users
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@muebleriasanbernardo.cl';
  
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
    RAISE NOTICE 'Usuario admin no encontrado en auth.users';
  END IF;
END $$;

-- 8. Verificar configuración
SELECT 
  'Configuración completada' as status,
  (SELECT count(*) FROM auth.users) as usuarios_auth,
  (SELECT count(*) FROM perfiles) as perfiles_creados,
  (SELECT count(*) FROM perfiles WHERE rol = 'admin') as admins;

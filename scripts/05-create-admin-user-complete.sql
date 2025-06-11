-- Script completo para crear usuario administrador

-- Primero, crear la función para promover usuario a admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
  result_text TEXT;
BEGIN
  -- Buscar el usuario por email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'ERROR: Usuario con email ' || user_email || ' no encontrado en auth.users';
  END IF;
  
  -- Insertar o actualizar el perfil
  INSERT INTO perfiles (id, nombre, apellido, rol)
  VALUES (user_id, 'Administrador', 'Sistema', 'admin')
  ON CONFLICT (id) 
  DO UPDATE SET 
    rol = 'admin',
    nombre = COALESCE(perfiles.nombre, 'Administrador'),
    apellido = COALESCE(perfiles.apellido, 'Sistema'),
    updated_at = CURRENT_TIMESTAMP;
  
  result_text := 'SUCCESS: Usuario ' || user_email || ' promovido a administrador exitosamente';
  RAISE NOTICE '%', result_text;
  RETURN result_text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger para usuarios nuevos si no existe
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfiles (id, nombre, apellido, rol)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    'cliente'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar trigger existente si existe y crear uno nuevo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Funciones para gestión de stock
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

-- Instrucciones:
-- 1. Primero registra manualmente un usuario en Supabase Auth con:
--    Email: admin@muebleriasanbernardo.cl
--    Password: admin123456
-- 2. Luego ejecuta esta función para promoverlo a administrador:

SELECT promote_to_admin('admin@muebleriasanbernardo.cl');

-- Verificar que el usuario fue creado correctamente
SELECT 
  p.id,
  p.nombre,
  p.apellido,
  p.rol,
  u.email,
  u.created_at
FROM perfiles p
JOIN auth.users u ON p.id = u.id
WHERE p.rol = 'admin';

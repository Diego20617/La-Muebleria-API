-- Crear función para crear usuario administrador
-- Nota: Este script debe ejecutarse después de crear manualmente el usuario en Supabase Auth

-- Función para promover un usuario a administrador
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
DECLARE
  user_id UUID;
BEGIN
  -- Buscar el ID del usuario por email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario con email % no encontrado', user_email;
  END IF;
  
  -- Actualizar o insertar perfil como administrador
  INSERT INTO perfiles (id, nombre, apellido, rol)
  VALUES (user_id, 'Administrador', 'Sistema', 'admin')
  ON CONFLICT (id) 
  DO UPDATE SET rol = 'admin';
  
  RAISE NOTICE 'Usuario % promovido a administrador exitosamente', user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear stock de productos (para uso administrativo)
CREATE OR REPLACE FUNCTION actualizar_stock(p_producto_id INTEGER, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos 
  SET stock = GREATEST(0, stock - p_cantidad)
  WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- Función para restaurar stock (cuando se cancela un pedido)
CREATE OR REPLACE FUNCTION restaurar_stock(p_producto_id INTEGER, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos 
  SET stock = stock + p_cantidad
  WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para crear perfil automáticamente cuando se registra un usuario
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

-- Crear trigger que se ejecuta cuando se inserta un nuevo usuario en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Instrucciones para crear el usuario administrador:
-- 1. Primero, registra manualmente un usuario en Supabase Auth con email: admin@muebleriasanbernardo.cl
-- 2. Luego ejecuta esta función para promoverlo a administrador:
-- SELECT promote_to_admin('admin@muebleriasanbernardo.cl');

-- Ejemplo de cómo usar la función (descomenta la línea siguiente después de crear el usuario):
-- SELECT promote_to_admin('admin@muebleriasanbernardo.cl');

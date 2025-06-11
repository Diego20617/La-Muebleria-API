-- Script simplificado para crear usuario administrador

-- Función simple para promover usuario a admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF user_id IS NULL THEN
    RETURN 'Usuario no encontrado';
  END IF;
  
  INSERT INTO perfiles (id, nombre, apellido, rol)
  VALUES (user_id, 'Admin', 'Sistema', 'admin')
  ON CONFLICT (id) 
  DO UPDATE SET rol = 'admin';
  
  RETURN 'Usuario promovido a admin exitosamente';
END;
$$ LANGUAGE plpgsql;

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

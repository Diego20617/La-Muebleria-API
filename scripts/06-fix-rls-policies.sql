-- Corregir políticas RLS para la tabla perfiles

-- 1. Primero, eliminar las políticas existentes que están causando recursión infinita
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON perfiles;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON perfiles;
DROP POLICY IF EXISTS "Los admins pueden ver todos los perfiles" ON perfiles;

-- 2. Crear nuevas políticas sin recursión
-- Política para permitir a cualquier usuario autenticado ver su propio perfil
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON perfiles
  FOR SELECT USING (auth.uid() = id);

-- Política para permitir a cualquier usuario autenticado actualizar su propio perfil
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir a los administradores ver todos los perfiles
-- Esta política usa una función para evitar recursión
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Consulta directa sin usar políticas
  SELECT rol INTO user_role FROM perfiles WHERE id = user_id;
  RETURN user_role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear política para administradores usando la función
CREATE POLICY "Los admins pueden ver todos los perfiles" ON perfiles
  FOR SELECT USING (is_admin(auth.uid()));

-- 3. Crear política para permitir la inserción de perfiles
CREATE POLICY "Permitir inserción de perfiles" ON perfiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Crear política para permitir a los administradores actualizar cualquier perfil
CREATE POLICY "Los admins pueden actualizar cualquier perfil" ON perfiles
  FOR UPDATE USING (is_admin(auth.uid()));

-- 5. Crear política para permitir a los administradores eliminar perfiles
CREATE POLICY "Los admins pueden eliminar perfiles" ON perfiles
  FOR DELETE USING (is_admin(auth.uid()));

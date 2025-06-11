-- Create a function to safely create or update profiles
CREATE OR REPLACE FUNCTION create_or_update_profile(
  user_id UUID,
  user_nombre TEXT DEFAULT '',
  user_apellido TEXT DEFAULT '',
  user_rol TEXT DEFAULT 'cliente'
)
RETURNS TABLE(id UUID, nombre TEXT, apellido TEXT, rol TEXT, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO perfiles (id, nombre, apellido, rol)
  VALUES (user_id, user_nombre, user_apellido, user_rol)
  ON CONFLICT (id) 
  DO UPDATE SET 
    nombre = COALESCE(EXCLUDED.nombre, perfiles.nombre),
    apellido = COALESCE(EXCLUDED.apellido, perfiles.apellido),
    updated_at = NOW()
  RETURNING perfiles.id, perfiles.nombre, perfiles.apellido, perfiles.rol, perfiles.created_at, perfiles.updated_at;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_or_update_profile TO authenticated;

-- Update the trigger function to be more robust
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use the new function to safely create profile
  PERFORM create_or_update_profile(
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellido', ''),
    'cliente'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

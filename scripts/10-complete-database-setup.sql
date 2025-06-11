-- Configuración completa de la base de datos

-- 1. Deshabilitar RLS para desarrollo
ALTER TABLE IF EXISTS perfiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS carrito DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS detalles_pedido DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resenas DISABLE ROW LEVEL SECURITY;

-- 2. Recrear todas las funciones necesarias
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS actualizar_stock(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS restaurar_stock(INTEGER, INTEGER);

-- Función para manejar nuevos usuarios
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

-- Trigger para nuevos usuarios
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Funciones para gestión de stock
CREATE OR REPLACE FUNCTION actualizar_stock(p_producto_id INTEGER, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos 
  SET stock = GREATEST(0, stock - p_cantidad),
      updated_at = NOW()
  WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION restaurar_stock(p_producto_id INTEGER, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE productos 
  SET stock = stock + p_cantidad,
      updated_at = NOW()
  WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Asegurar que todas las tablas existen con estructura completa
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio INTEGER NOT NULL,
  precio_anterior INTEGER,
  descuento INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  categoria_id INTEGER REFERENCES categorias(id),
  imagen_url TEXT NOT NULL,
  imagenes_adicionales TEXT[],
  destacado BOOLEAN DEFAULT FALSE,
  nuevo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre VARCHAR(100),
  apellido VARCHAR(100),
  direccion TEXT,
  ciudad VARCHAR(100),
  region VARCHAR(100),
  codigo_postal VARCHAR(20),
  telefono VARCHAR(20),
  rol VARCHAR(20) NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS carrito (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id),
  estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  total INTEGER NOT NULL,
  direccion_envio TEXT NOT NULL,
  ciudad_envio VARCHAR(100) NOT NULL,
  region_envio VARCHAR(100) NOT NULL,
  codigo_postal_envio VARCHAR(20) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  fecha_pedido TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  fecha_envio TIMESTAMP WITH TIME ZONE,
  fecha_entrega TIMESTAMP WITH TIME ZONE,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detalles_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, producto_id)
);

CREATE TABLE IF NOT EXISTS resenas (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES perfiles(id),
  calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Insertar datos de prueba si no existen
INSERT INTO categorias (nombre, slug, descripcion, imagen_url)
VALUES 
  ('Sofás', 'sofas', 'Sofás y sillones para tu sala de estar', '/images/categorias/sofas.jpg'),
  ('Mesas', 'mesas', 'Mesas de comedor, centro y auxiliares', '/images/categorias/mesas.jpg'),
  ('Dormitorio', 'dormitorio', 'Camas, veladores y accesorios para dormitorio', '/images/categorias/dormitorio.jpg'),
  ('Sillas', 'sillas', 'Sillas de comedor, oficina y decorativas', '/images/categorias/sillas.jpg'),
  ('Almacenamiento', 'almacenamiento', 'Estanterías, cómodas y organizadores', '/images/categorias/almacenamiento.jpg')
ON CONFLICT (slug) DO NOTHING;

-- 5. Configurar usuario admin si existe
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
      updated_at = NOW();
  END IF;
END $$;

-- 6. Verificar configuración
SELECT 'Base de datos configurada correctamente' as status;

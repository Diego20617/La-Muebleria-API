-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  imagen_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
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

-- Crear índice para búsqueda de productos
CREATE INDEX IF NOT EXISTS idx_productos_nombre ON productos USING GIN (to_tsvector('spanish', nombre));
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);

-- Crear tabla de perfiles de usuario extendiendo la tabla auth.users de Supabase
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

-- Crear tabla de pedidos
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

-- Crear tabla de detalles de pedido
CREATE TABLE IF NOT EXISTS detalles_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio_unitario INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de reseñas
CREATE TABLE IF NOT EXISTS resenas (
  id SERIAL PRIMARY KEY,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES perfiles(id),
  calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  fecha TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear vista para calcular el rating promedio de los productos
CREATE OR REPLACE VIEW productos_rating AS
SELECT 
  p.id,
  p.nombre,
  COALESCE(AVG(r.calificacion), 0) as rating,
  COUNT(r.id) as total_resenas
FROM 
  productos p
LEFT JOIN 
  resenas r ON p.id = r.producto_id
GROUP BY 
  p.id, p.nombre;

-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, producto_id)
);

-- Crear tabla para el carrito de compras
CREATE TABLE IF NOT EXISTS carrito (
  id SERIAL PRIMARY KEY,
  usuario_id UUID REFERENCES perfiles(id) ON DELETE CASCADE,
  producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, producto_id)
);

-- Crear políticas RLS (Row Level Security)
-- Habilitar RLS en todas las tablas
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE resenas ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carrito ENABLE ROW LEVEL SECURITY;

-- Políticas para categorías
CREATE POLICY "Cualquiera puede ver categorías" ON categorias
  FOR SELECT USING (true);
  
CREATE POLICY "Solo admins pueden modificar categorías" ON categorias
  FOR ALL USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));

-- Políticas para productos
CREATE POLICY "Cualquiera puede ver productos" ON productos
  FOR SELECT USING (true);
  
CREATE POLICY "Solo admins pueden modificar productos" ON productos
  FOR ALL USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));

-- Políticas para perfiles
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON perfiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id);
  
CREATE POLICY "Los admins pueden ver todos los perfiles" ON perfiles
  FOR SELECT USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));

-- Políticas para pedidos
CREATE POLICY "Los usuarios pueden ver sus propios pedidos" ON pedidos
  FOR SELECT USING (auth.uid() = usuario_id);
  
CREATE POLICY "Los usuarios pueden crear sus propios pedidos" ON pedidos
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);
  
CREATE POLICY "Los admins pueden ver todos los pedidos" ON pedidos
  FOR SELECT USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));
  
CREATE POLICY "Los admins pueden actualizar pedidos" ON pedidos
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));

-- Políticas para detalles de pedido
CREATE POLICY "Los usuarios pueden ver detalles de sus propios pedidos" ON detalles_pedido
  FOR SELECT USING (pedido_id IN (SELECT id FROM pedidos WHERE usuario_id = auth.uid()));
  
CREATE POLICY "Los admins pueden ver todos los detalles de pedidos" ON detalles_pedido
  FOR SELECT USING (auth.uid() IN (SELECT id FROM perfiles WHERE rol = 'admin'));

-- Políticas para reseñas
CREATE POLICY "Cualquiera puede ver reseñas" ON resenas
  FOR SELECT USING (true);
  
CREATE POLICY "Los usuarios pueden crear sus propias reseñas" ON resenas
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);
  
CREATE POLICY "Los usuarios pueden actualizar sus propias reseñas" ON resenas
  FOR UPDATE USING (auth.uid() = usuario_id);
  
CREATE POLICY "Los usuarios pueden eliminar sus propias reseñas" ON resenas
  FOR DELETE USING (auth.uid() = usuario_id);

-- Políticas para favoritos
CREATE POLICY "Los usuarios pueden ver sus propios favoritos" ON favoritos
  FOR SELECT USING (auth.uid() = usuario_id);
  
CREATE POLICY "Los usuarios pueden gestionar sus propios favoritos" ON favoritos
  FOR ALL USING (auth.uid() = usuario_id);

-- Políticas para carrito
CREATE POLICY "Los usuarios pueden ver su propio carrito" ON carrito
  FOR SELECT USING (auth.uid() = usuario_id);
  
CREATE POLICY "Los usuarios pueden gestionar su propio carrito" ON carrito
  FOR ALL USING (auth.uid() = usuario_id);

-- Trigger para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a todas las tablas con updated_at
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_categorias_updated_at
  BEFORE UPDATE ON categorias
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_perfiles_updated_at
  BEFORE UPDATE ON perfiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_carrito_updated_at
  BEFORE UPDATE ON carrito
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

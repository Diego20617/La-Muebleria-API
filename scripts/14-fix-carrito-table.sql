-- Verificar si la tabla carrito existe
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'carrito'
);

-- Si no existe, crear la tabla carrito con la estructura correcta
CREATE TABLE IF NOT EXISTS public.carrito (
    id SERIAL PRIMARY KEY,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, producto_id)
);

-- Verificar si hay políticas RLS en la tabla carrito
SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'carrito';

-- Habilitar RLS en la tabla carrito si no está habilitado
ALTER TABLE public.carrito ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para la tabla carrito
-- Política para SELECT: un usuario puede ver solo sus propios items del carrito
DROP POLICY IF EXISTS "Usuarios pueden ver su propio carrito" ON public.carrito;
CREATE POLICY "Usuarios pueden ver su propio carrito" ON public.carrito
    FOR SELECT USING (auth.uid() = usuario_id);

-- Política para INSERT: un usuario puede agregar items a su propio carrito
DROP POLICY IF EXISTS "Usuarios pueden agregar a su propio carrito" ON public.carrito;
CREATE POLICY "Usuarios pueden agregar a su propio carrito" ON public.carrito
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Política para UPDATE: un usuario puede actualizar solo sus propios items del carrito
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio carrito" ON public.carrito;
CREATE POLICY "Usuarios pueden actualizar su propio carrito" ON public.carrito
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Política para DELETE: un usuario puede eliminar solo sus propios items del carrito
DROP POLICY IF EXISTS "Usuarios pueden eliminar de su propio carrito" ON public.carrito;
CREATE POLICY "Usuarios pueden eliminar de su propio carrito" ON public.carrito
    FOR DELETE USING (auth.uid() = usuario_id);

-- Verificar si hay índices en la tabla carrito
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'carrito';

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_carrito_usuario_id ON public.carrito(usuario_id);
CREATE INDEX IF NOT EXISTS idx_carrito_producto_id ON public.carrito(producto_id);

-- Verificar si hay triggers para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_carrito_updated_at ON public.carrito;
CREATE TRIGGER update_carrito_updated_at
BEFORE UPDATE ON public.carrito
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Mostrar la estructura final de la tabla
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'carrito';

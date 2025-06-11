-- Crear tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id TEXT PRIMARY KEY,
    usuario_id UUID REFERENCES auth.users(id),
    total DECIMAL(10,2) NOT NULL,
    estado TEXT NOT NULL DEFAULT 'pendiente',
    metodo_pago TEXT NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    direccion_envio TEXT,
    ciudad_envio TEXT,
    region_envio TEXT,
    codigo_postal_envio TEXT,
    notas TEXT,
    detalles_pago JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de detalles de pedido
CREATE TABLE IF NOT EXISTS detalles_pedido (
    id BIGSERIAL PRIMARY KEY,
    pedido_id TEXT REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id BIGINT REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear tabla de ventas del mes
CREATE TABLE IF NOT EXISTS ventas_mes (
    id BIGSERIAL PRIMARY KEY,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    pedido_id TEXT REFERENCES pedidos(id),
    detalles JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear función para actualizar el stock
CREATE OR REPLACE FUNCTION actualizar_stock(p_producto_id BIGINT, p_cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE productos
    SET stock = stock - p_cantidad
    WHERE id = p_producto_id;
END;
$$ LANGUAGE plpgsql;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario_id ON pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_detalles_pedido_pedido_id ON detalles_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_ventas_mes_fecha ON ventas_mes(fecha);

-- Crear políticas de seguridad RLS
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_pedido ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas_mes ENABLE ROW LEVEL SECURITY;

-- Políticas para pedidos
CREATE POLICY "Usuarios pueden ver sus propios pedidos"
    ON pedidos FOR SELECT
    USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden crear sus propios pedidos"
    ON pedidos FOR INSERT
    WITH CHECK (auth.uid() = usuario_id);

-- Políticas para detalles de pedido
CREATE POLICY "Usuarios pueden ver detalles de sus pedidos"
    ON detalles_pedido FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM pedidos
        WHERE pedidos.id = detalles_pedido.pedido_id
        AND pedidos.usuario_id = auth.uid()
    ));

-- Políticas para ventas del mes (solo administradores)
CREATE POLICY "Solo administradores pueden ver ventas"
    ON ventas_mes FOR SELECT
    USING (auth.uid() IN (
        SELECT id FROM auth.users
        WHERE raw_user_meta_data->>'role' = 'admin'
    )); 
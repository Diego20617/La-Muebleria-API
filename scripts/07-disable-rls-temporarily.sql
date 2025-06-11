-- Deshabilitar RLS temporalmente para que funcione todo
-- Esto es para desarrollo, en producción se debe configurar correctamente

-- Deshabilitar RLS en todas las tablas
ALTER TABLE perfiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE carrito DISABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos DISABLE ROW LEVEL SECURITY;
ALTER TABLE detalles_pedido DISABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos DISABLE ROW LEVEL SECURITY;
ALTER TABLE resenas DISABLE ROW LEVEL SECURITY;

-- Crear usuario admin directamente si no existe
INSERT INTO perfiles (id, nombre, apellido, rol)
SELECT 
  u.id,
  'Administrador',
  'Sistema',
  'admin'
FROM auth.users u
WHERE u.email = 'admin@muebleriasanbernardo.cl'
ON CONFLICT (id) DO UPDATE SET rol = 'admin';

-- Verificar que el admin fue creado
SELECT 
  p.id,
  p.nombre,
  p.apellido,
  p.rol,
  u.email
FROM perfiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'admin@muebleriasanbernardo.cl';

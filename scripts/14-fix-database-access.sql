-- Verificar y corregir políticas RLS para productos
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;

-- Verificar y corregir políticas RLS para categorías
ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;

-- Verificar y corregir políticas RLS para carrito
ALTER TABLE carrito DISABLE ROW LEVEL SECURITY;

-- Crear política para que cualquiera pueda ver productos
CREATE POLICY IF NOT EXISTS "Cualquiera puede ver productos" ON productos
  FOR SELECT USING (true);

-- Crear política para que cualquiera pueda ver categorías
CREATE POLICY IF NOT EXISTS "Cualquiera puede ver categorías" ON categorias
  FOR SELECT USING (true);

-- Habilitar RLS nuevamente con las políticas correctas
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;

-- Insertar categorías
INSERT INTO categorias (nombre, slug, descripcion, imagen_url)
VALUES 
  ('Sofás', 'sofas', 'Sofás y sillones para tu sala de estar', '/images/categorias/sofas.jpg'),
  ('Mesas', 'mesas', 'Mesas de comedor, centro y auxiliares', '/images/categorias/mesas.jpg'),
  ('Dormitorio', 'dormitorio', 'Camas, veladores y accesorios para dormitorio', '/images/categorias/dormitorio.jpg'),
  ('Sillas', 'sillas', 'Sillas de comedor, oficina y decorativas', '/images/categorias/sillas.jpg'),
  ('Almacenamiento', 'almacenamiento', 'Estanterías, cómodas y organizadores', '/images/categorias/almacenamiento.jpg')
ON CONFLICT (slug) DO NOTHING;

-- Insertar productos
INSERT INTO productos (nombre, descripcion, precio, precio_anterior, descuento, stock, categoria_id, imagen_url, imagenes_adicionales, destacado, nuevo)
VALUES
  (
    'Sofá Moderno Gris', 
    'Sofá de 3 cuerpos con tapizado de alta calidad y estructura de madera maciza. Ideal para espacios contemporáneos.', 
    899000, 
    1200000, 
    25, 
    15, 
    (SELECT id FROM categorias WHERE slug = 'sofas'), 
    '/images/productos/sofa-moderno-gris.jpg',
    ARRAY['/images/productos/sofa-moderno-gris-1.jpg', '/images/productos/sofa-moderno-gris-2.jpg'],
    TRUE,
    FALSE
  ),
  (
    'Mesa de Comedor Roble', 
    'Mesa de comedor fabricada en madera de roble macizo con acabado natural. Capacidad para 6 personas.', 
    650000, 
    NULL, 
    NULL, 
    8, 
    (SELECT id FROM categorias WHERE slug = 'mesas'), 
    '/images/productos/mesa-comedor-roble.jpg',
    ARRAY['/images/productos/mesa-comedor-roble-1.jpg', '/images/productos/mesa-comedor-roble-2.jpg'],
    TRUE,
    TRUE
  ),
  (
    'Cama King Size', 
    'Cama king size con cabecero acolchado y estructura de madera. Incluye base y no incluye colchón.', 
    1200000, 
    1500000, 
    20, 
    5, 
    (SELECT id FROM categorias WHERE slug = 'dormitorio'), 
    '/images/productos/cama-king-size.jpg',
    ARRAY['/images/productos/cama-king-size-1.jpg', '/images/productos/cama-king-size-2.jpg'],
    TRUE,
    FALSE
  ),
  (
    'Silla Ergonómica', 
    'Silla de oficina ergonómica con soporte lumbar ajustable y reposabrazos. Ideal para largas jornadas de trabajo.', 
    280000, 
    NULL, 
    NULL, 
    20, 
    (SELECT id FROM categorias WHERE slug = 'sillas'), 
    '/images/productos/silla-ergonomica.jpg',
    ARRAY['/images/productos/silla-ergonomica-1.jpg', '/images/productos/silla-ergonomica-2.jpg'],
    FALSE,
    FALSE
  ),
  (
    'Estantería Industrial', 
    'Estantería de estilo industrial con estructura metálica y estantes de madera. Perfecta para salones y oficinas.', 
    450000, 
    NULL, 
    NULL, 
    12, 
    (SELECT id FROM categorias WHERE slug = 'almacenamiento'), 
    '/images/productos/estanteria-industrial.jpg',
    ARRAY['/images/productos/estanteria-industrial-1.jpg', '/images/productos/estanteria-industrial-2.jpg'],
    FALSE,
    TRUE
  ),
  (
    'Mesa de Centro Cristal', 
    'Mesa de centro con tapa de cristal templado y estructura metálica. Diseño minimalista que combina con cualquier decoración.', 
    320000, 
    400000, 
    20, 
    10, 
    (SELECT id FROM categorias WHERE slug = 'mesas'), 
    '/images/productos/mesa-centro-cristal.jpg',
    ARRAY['/images/productos/mesa-centro-cristal-1.jpg', '/images/productos/mesa-centro-cristal-2.jpg'],
    TRUE,
    FALSE
  ),
  (
    'Sofá Esquinero Beige', 
    'Sofá esquinero con chaise longue reversible. Tapizado en tela beige de fácil limpieza y cojines desenfundables.', 
    1500000, 
    1800000, 
    17, 
    3, 
    (SELECT id FROM categorias WHERE slug = 'sofas'), 
    '/images/productos/sofa-esquinero-beige.jpg',
    ARRAY['/images/productos/sofa-esquinero-beige-1.jpg', '/images/productos/sofa-esquinero-beige-2.jpg'],
    TRUE,
    FALSE
  ),
  (
    'Cómoda Nórdica', 
    'Cómoda de estilo nórdico con 4 cajones y acabado en madera clara. Perfecta para dormitorios.', 
    380000, 
    NULL, 
    NULL, 
    7, 
    (SELECT id FROM categorias WHERE slug = 'almacenamiento'), 
    '/images/productos/comoda-nordica.jpg',
    ARRAY['/images/productos/comoda-nordica-1.jpg', '/images/productos/comoda-nordica-2.jpg'],
    FALSE,
    TRUE
  ),
  (
    'Sillas Comedor Pack 4', 
    'Pack de 4 sillas de comedor con estructura metálica y asiento acolchado. Diseño moderno y cómodo.', 
    420000, 
    500000, 
    16, 
    6, 
    (SELECT id FROM categorias WHERE slug = 'sillas'), 
    '/images/productos/sillas-comedor-pack.jpg',
    ARRAY['/images/productos/sillas-comedor-pack-1.jpg', '/images/productos/sillas-comedor-pack-2.jpg'],
    TRUE,
    FALSE
  ),
  (
    'Velador Minimalista', 
    'Velador con cajón y repisa inferior. Diseño minimalista que se adapta a cualquier estilo de dormitorio.', 
    150000, 
    NULL, 
    NULL, 
    15, 
    (SELECT id FROM categorias WHERE slug = 'dormitorio'), 
    '/images/productos/velador-minimalista.jpg',
    ARRAY['/images/productos/velador-minimalista-1.jpg', '/images/productos/velador-minimalista-2.jpg'],
    FALSE,
    TRUE
  ),
  (
    'Escritorio Home Office', 
    'Escritorio funcional para home office con cajones y organizador. Ideal para espacios de trabajo en casa.', 
    380000, 
    450000, 
    16, 
    8, 
    (SELECT id FROM categorias WHERE slug = 'mesas'), 
    '/images/productos/escritorio-home-office.jpg',
    ARRAY['/images/productos/escritorio-home-office-1.jpg', '/images/productos/escritorio-home-office-2.jpg'],
    TRUE,
    FALSE
  ),
  (
    'Sillón Reclinable', 
    'Sillón reclinable con reposapiés extensible. Perfecto para momentos de relax en el hogar.', 
    580000, 
    NULL, 
    NULL, 
    4, 
    (SELECT id FROM categorias WHERE slug = 'sofas'), 
    '/images/productos/sillon-reclinable.jpg',
    ARRAY['/images/productos/sillon-reclinable-1.jpg', '/images/productos/sillon-reclinable-2.jpg'],
    TRUE,
    TRUE
  )
ON CONFLICT DO NOTHING;

-- Insertar algunas reseñas de ejemplo
INSERT INTO resenas (producto_id, usuario_id, calificacion, comentario)
VALUES
  (
    (SELECT id FROM productos WHERE nombre = 'Sofá Moderno Gris'),
    '00000000-0000-0000-0000-000000000000',
    5,
    'Excelente sofá, muy cómodo y de gran calidad. La entrega fue rápida y el montaje sencillo.'
  ),
  (
    (SELECT id FROM productos WHERE nombre = 'Mesa de Comedor Roble'),
    '00000000-0000-0000-0000-000000000000',
    4,
    'Mesa muy bonita y robusta. El color es exactamente como en las fotos.'
  ),
  (
    (SELECT id FROM productos WHERE nombre = 'Cama King Size'),
    '00000000-0000-0000-0000-000000000000',
    5,
    'Cama de excelente calidad. Muy cómoda y fácil de montar.'
  )
ON CONFLICT DO NOTHING;

-- Insertar un usuario administrador (la contraseña se manejará con Supabase Auth)
-- Nota: Este insert solo funcionará si ya existe el usuario en auth.users
-- INSERT INTO perfiles (id, nombre, apellido, rol)
-- VALUES ('ID_DEL_USUARIO_AUTH', 'Admin', 'Sistema', 'admin');

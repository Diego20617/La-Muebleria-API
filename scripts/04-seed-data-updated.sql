-- Actualizar productos con las nuevas imágenes
UPDATE productos SET imagen_url = '/images/productos/sofa-moderno-gris.jpg' WHERE nombre = 'Sofá Moderno Gris';
UPDATE productos SET imagen_url = '/images/productos/mesa-comedor-roble.jpg' WHERE nombre = 'Mesa de Comedor Roble';
UPDATE productos SET imagen_url = '/images/productos/cama-king-size.jpg' WHERE nombre = 'Cama King Size';
UPDATE productos SET imagen_url = '/images/productos/silla-ergonomica.jpg' WHERE nombre = 'Silla Ergonómica';
UPDATE productos SET imagen_url = '/images/productos/estanteria-industrial.jpg' WHERE nombre = 'Estantería Industrial';
UPDATE productos SET imagen_url = '/images/productos/mesa-centro-cristal.jpg' WHERE nombre = 'Mesa de Centro Cristal';
UPDATE productos SET imagen_url = '/images/productos/sofa-esquinero-beige.jpg' WHERE nombre = 'Sofá Esquinero Beige';
UPDATE productos SET imagen_url = '/images/productos/comoda-nordica.jpg' WHERE nombre = 'Cómoda Nórdica';
UPDATE productos SET imagen_url = '/images/productos/sillas-comedor-pack.jpg' WHERE nombre = 'Sillas Comedor Pack 4';
UPDATE productos SET imagen_url = '/images/productos/velador-minimalista.jpg' WHERE nombre = 'Velador Minimalista';
UPDATE productos SET imagen_url = '/images/productos/escritorio-home-office.jpg' WHERE nombre = 'Escritorio Home Office';
UPDATE productos SET imagen_url = '/images/productos/sillon-reclinable.jpg' WHERE nombre = 'Sillón Reclinable';

-- Actualizar categorías con imágenes
UPDATE categorias SET imagen_url = '/images/categorias/sofas.jpg' WHERE slug = 'sofas';
UPDATE categorias SET imagen_url = '/images/categorias/mesas.jpg' WHERE slug = 'mesas';
UPDATE categorias SET imagen_url = '/images/categorias/dormitorio.jpg' WHERE slug = 'dormitorio';
UPDATE categorias SET imagen_url = '/images/categorias/sillas.jpg' WHERE slug = 'sillas';
UPDATE categorias SET imagen_url = '/images/categorias/almacenamiento.jpg' WHERE slug = 'almacenamiento';

-- Verificar que el usuario admin existe y tiene el rol correcto
SELECT id, email, rol, created_at 
FROM auth.users 
JOIN perfiles ON auth.users.id = perfiles.id 
WHERE email = 'admin@muebleriasanbernardo.cl';

-- Si no existe, crearlo
DO $$
BEGIN
    -- Verificar si el usuario ya existe
    IF NOT EXISTS (
        SELECT 1 FROM auth.users WHERE email = 'admin@muebleriasanbernardo.cl'
    ) THEN
        -- Insertar usuario en auth.users (esto normalmente se hace a través de Supabase Auth)
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            confirmation_token,
            email_change,
            email_change_token_new,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            gen_random_uuid(),
            'authenticated',
            'authenticated',
            'admin@muebleriasanbernardo.cl',
            crypt('admin123456', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            '',
            '',
            '',
            ''
        );
    END IF;
END $$;

-- Asegurar que el perfil del admin existe con el rol correcto
INSERT INTO perfiles (id, nombre, apellido, email, telefono, direccion, rol, created_at, updated_at)
SELECT 
    u.id,
    'Administrador',
    'Sistema',
    'admin@muebleriasanbernardo.cl',
    '+56912345678',
    'Oficina Central',
    'admin',
    NOW(),
    NOW()
FROM auth.users u
WHERE u.email = 'admin@muebleriasanbernardo.cl'
ON CONFLICT (id) DO UPDATE SET
    rol = 'admin',
    updated_at = NOW();

-- Verificar el resultado
SELECT 
    u.email,
    p.nombre,
    p.apellido,
    p.rol,
    p.created_at
FROM auth.users u
JOIN perfiles p ON u.id = p.id
WHERE u.email = 'admin@muebleriasanbernardo.cl';

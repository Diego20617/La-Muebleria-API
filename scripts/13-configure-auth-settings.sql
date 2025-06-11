-- Configurar las URLs de redirección para el reset de contraseña
-- Esto debe ejecutarse en el dashboard de Supabase en Authentication > URL Configuration

-- Site URL: tu-dominio.com (o localhost:3000 para desarrollo)
-- Redirect URLs: 
-- - tu-dominio.com/auth/reset-password/confirm
-- - localhost:3000/auth/reset-password/confirm

-- También asegurarse de que el email template esté configurado correctamente
-- En Authentication > Email Templates > Reset Password

-- El template debe incluir:
-- <a href="{{ .SiteURL }}/auth/reset-password/confirm?access_token={{ .Token }}&type=recovery&refresh_token={{ .RefreshToken }}">Restablecer Contraseña</a>

SELECT 'Configuración de Auth completada. Revisar dashboard de Supabase.' as mensaje;

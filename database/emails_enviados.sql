-- Crear tabla para almacenar correos enviados
CREATE TABLE IF NOT EXISTS emails_enviados (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message_id VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'sent',
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_emails_enviados_sent_at ON emails_enviados(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_emails_enviados_status ON emails_enviados(status);
CREATE INDEX IF NOT EXISTS idx_emails_enviados_type ON emails_enviados(type);

-- Agregar columna email a la tabla perfiles si no existe
ALTER TABLE perfiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Crear índice para la columna email en perfiles
CREATE INDEX IF NOT EXISTS idx_perfiles_email ON perfiles(email); 
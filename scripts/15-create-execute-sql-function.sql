-- Crear función para ejecutar SQL dinámico
CREATE OR REPLACE FUNCTION execute_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;

-- Dar permisos para ejecutar la función
GRANT EXECUTE ON FUNCTION execute_sql(text) TO authenticated;

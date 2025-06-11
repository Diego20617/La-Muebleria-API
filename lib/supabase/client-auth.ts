import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Cliente específico para autenticación en componentes del cliente
export const createAuthClient = () => {
  return createClientComponentClient()
}

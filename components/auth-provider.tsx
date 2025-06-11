"use client"

import type React from "react"

// Make sure the AuthProvider properly initializes and handles user state

import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setUser(data?.session?.user || null)

        // Set up auth state listener
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          setUser(session?.user || null)
          setLoading(false)
        })

        setLoading(false)

        return () => {
          authListener?.subscription.unsubscribe()
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown authentication error"))
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

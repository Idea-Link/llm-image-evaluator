import { createClient } from '@/utils/supabase/client'
import { env } from '@/config/env'

export interface AuthError {
  message: string
  code?: string
}

export interface AuthResult<T = void> {
  data?: T
  error?: AuthError
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return {
          error: {
            message: error.message,
            code: error.code,
          },
        }
      }

      return { data: undefined }
    } catch {
      return {
        error: {
          message: 'An unexpected error occurred during sign in',
        },
      }
    }
  },

  async signOut(): Promise<AuthResult> {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          error: {
            message: error.message,
            code: error.code,
          },
        }
      }

      return { data: undefined }
    } catch {
      return {
        error: {
          message: 'An unexpected error occurred during sign out',
        },
      }
    }
  },

  async getSession() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        return {
          error: {
            message: error.message,
            code: error.code,
          },
        }
      }

      return { data: data.session }
    } catch {
      return {
        error: {
          message: 'An unexpected error occurred while getting session',
        },
      }
    }
  },

  getAdminEmail(): string {
    return env.auth.adminEmail
  },
}
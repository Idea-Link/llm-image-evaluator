import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  setLoading: (isLoading: boolean) => void
  initialize: () => Promise<void>
  refreshSession: () => Promise<void>
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,

      setUser: (user) => set({ user }),
      
      setSession: (session) => set({ session, user: session?.user || null }),
      
      setLoading: (isLoading) => set({ isLoading }),

      initialize: async () => {
        set({ isLoading: true })
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          set({ 
            session, 
            user: session?.user || null,
            isLoading: false 
          })

          // Set up auth state change listener
          supabase.auth.onAuthStateChange((_event, session) => {
            set({ 
              session, 
              user: session?.user || null 
            })
          })
        } catch (error) {
          console.error('Error initializing auth:', error)
          set({ isLoading: false })
        }
      },

      refreshSession: async () => {
        try {
          const supabase = createClient()
          const { data: { session }, error } = await supabase.auth.refreshSession()
          
          if (error) {
            console.error('Error refreshing session:', error)
            set({ session: null, user: null })
          } else {
            set({ 
              session, 
              user: session?.user || null 
            })
          }
        } catch (error) {
          console.error('Error refreshing session:', error)
          set({ session: null, user: null })
        }
      },

      clearAuth: () => {
        set({ user: null, session: null })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage on the client side
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ 
        user: state.user,
        session: state.session 
      }),
    }
  )
)
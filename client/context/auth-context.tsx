// context/auth-context.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/axios'

const AuthContext = createContext<{
  isLoggedIn: boolean
  setIsLoggedIn: (val: boolean) => void
  loading: boolean
}>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/check-auth')
        setIsLoggedIn(res.data?.authenticated)
      } catch {
        setIsLoggedIn(false)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/lib/axios'

type Role = 'customer' | 'vendor' | 'admin' | null

const AuthContext = createContext<{
  isLoggedIn: boolean
  setIsLoggedIn: (val: boolean) => void
  userRole: Role
  setUserRole: (role: Role) => void
  loading: boolean
  refreshAuth: () => void
  }>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userRole: null,
  setUserRole: () => {},
  loading: true,
  refreshAuth: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const res = await api.get('/check-auth')
      setIsLoggedIn(res.data?.authenticated)
      setUserRole(res.data?.role)
    } catch {
      setIsLoggedIn(false)
      setUserRole(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, userRole, setUserRole, loading, refreshAuth: checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

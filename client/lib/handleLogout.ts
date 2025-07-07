// lib/handleLogout.ts
'use client'

import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export function useHandleLogout() {
  const router = useRouter()
  const { setIsLoggedIn, setUserRole } = useAuth()

  const logout = async () => {
    await api.post('/logout') // your logout API clears cookie
    setIsLoggedIn(false)
    setUserRole(null)
    router.push('/')
  }

  return logout
}

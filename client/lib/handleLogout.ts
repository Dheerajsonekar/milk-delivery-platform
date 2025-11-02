'use client'

import api from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

export function useHandleLogout() {
  const router = useRouter()
  const { setIsLoggedIn, setUserRole } = useAuth()

  const logout = async () => {
    try {
      // Make sure cookies are included in the request
      await api.post('/logout', {}, {
        withCredentials: true, // Ensure cookies are sent
      })
      
      console.log(' Logout API call successful')
      
      // Clear any local storage data
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      sessionStorage.clear()
      
      // Reset authentication state
      setIsLoggedIn(false)
      setUserRole(null)
      
      console.log(' Auth state cleared')
      
      // Force a hard redirect to ensure clean state
      window.location.href = '/'
      
    } catch (error) {
      console.error(' Logout failed:', error)
      
      // Even if API call fails, clear local state
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      sessionStorage.clear()
      
      setIsLoggedIn(false)
      setUserRole(null)
      
      // Still redirect to home page
      window.location.href = '/'
    }
  }

  return logout
}
'use client'

import { useAuth } from '@/context/auth-context'
import PublicNavbar from './PublicNavbar'
import CustomerNavbar from './CustomerNavbar'
import VendorNavbar from './VendorNavbar'
import AdminNavbar from './AdminNavbar'

export default function DynamicNavbar() {
  const { loading, isLoggedIn, userRole } = useAuth()

  if (loading) {
  return (
    <div className="w-full bg-yellow-50 text-center py-2 text-gray-500 text-sm">
      Checking login status...
    </div>
  )
}


  
  if (!isLoggedIn) return <PublicNavbar />
  if (userRole === 'customer') return <CustomerNavbar />
  if (userRole === 'vendor') return <VendorNavbar />
  if (userRole === 'admin') return <AdminNavbar />

  return null
}

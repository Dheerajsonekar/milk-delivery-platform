'use client'

import { useAuth } from '@/context/auth-context'
import PublicNavbar from './PublicNavbar'
import CustomerNavbar from './CustomerNavbar'
import VendorNavbar from './VendorNavbar'
import AdminNavbar from './AdminNavbar'
import DeliveryBoyNavbar from './DeliveryBoyNavbar'

export default function DynamicNavbar() {
  const { loading, isLoggedIn, userRole } = useAuth()

  // While loading, show a lightweight top bar 
  return (
    <>
      {loading ? (
        <div className="w-full bg-yellow-50 py-3 text-center text-gray-500 text-sm animate-pulse">
          Loading...
        </div>
      ) : !isLoggedIn ? (
        <PublicNavbar />
      ) : userRole === 'customer' ? (
        <CustomerNavbar />
      ) : userRole === 'vendor' ? (
        <VendorNavbar />
      ) : userRole === 'admin' ? (
        <AdminNavbar />
      ) : userRole === 'deliveryBoy' ? (
        <DeliveryBoyNavbar />
      ) : null}
    </>
  )
}

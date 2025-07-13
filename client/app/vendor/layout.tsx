'use client'

import { useAuth } from '@/context/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import VendorSidebar from '@/components/VendorSidebar'

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  const { userRole, isLoggedIn, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Protect vendor pages from non-vendors
  useEffect(() => {
    if (!loading && (!isLoggedIn || userRole !== 'vendor')) {
      router.push('/login')
    }
  }, [loading, isLoggedIn, userRole, router])

  if (loading) return <div className="p-6">Checking vendor access...</div>

  if (pathname === '/vendor/login') return children

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex flex-1">
        <VendorSidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

'use client'

import { useAuth } from '@/context/auth-context'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userRole, isLoggedIn, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Protect admin pages from non-admins
  useEffect(() => {
    if (!loading && (!isLoggedIn || userRole !== 'admin')) {
      router.push('/login')
    }
  }, [loading, isLoggedIn, userRole, router])

  if (loading) return <div className="p-6">Checking admin access...</div>

  if (pathname === '/admin/login') return children

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.includes('/admin/login')) return children

  return (
    <div>
      <nav className="bg-black text-white px-6 py-3 flex gap-6">
        <Link href="/admin/dashboard">Dashboard</Link>
        <Link href="/admin/vendors">Vendors</Link>
        <Link href="/admin/customers">Customers</Link>
        <Link href="/admin/products">Products</Link>
        <Link href="/admin/orders">Orders</Link>
        <Link href="/admin/subscriptions">Subscriptions</Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  )
}

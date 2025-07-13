'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function VendorSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`relative bg-blue-600 text-white transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen`}>

      {/* Center Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white text-blue-500 p-1 rounded-full shadow hover:bg-blue-700 hover:text-white z-50"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>



      <nav className={`space-y-3 p-5 ${collapsed ? 'pl-2' : 'pl-6'}`}>


        
        <SidebarLink href="/vendor/dashboard" label="Dashboard" collapsed={collapsed} />
        <SidebarLink href="/vendor/customers" label="Customers" collapsed={collapsed} />
        <SidebarLink href="/vendor/subscription" label="Subscriptions" collapsed={collapsed} />
        <SidebarLink href="/vendor/products" label="Products" collapsed={collapsed} />
        <SidebarLink href="/vendor/orders" label="Orders" collapsed={collapsed} />
        <SidebarLink href="/vendor/payouts" label="Payouts" collapsed={collapsed} />
        <SidebarLink href="/vendor/report" label="Reports" collapsed={collapsed} />

      </nav>
    </div>
  )
}

function SidebarLink({ href, label, collapsed }: { href: string, label: string, collapsed: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 py-2 px-3 rounded hover:bg-white hover:text-blue-500 transition-all duration-200 ${collapsed ? 'justify-center' : 'pl-4'
        }`}
    >
      {/* Icon or first letter */}
      <div className="text-white text-lg first-letter: invisible">{label.charAt(0)}</div>

      {/* Full label only when not collapsed */}
      {!collapsed && <span className="text-sm">{label}</span>}
    </Link>
  )
}

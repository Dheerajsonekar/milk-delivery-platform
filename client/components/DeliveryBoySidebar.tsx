'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  LayoutDashboard,
  Truck,
  MapPinned,
  Wallet,
  FileText,
  User,
  Headphones,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function DeliverySidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`relative bg-slate-700 text-slate-100 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen`}>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white text-blue-600 p-1 rounded-full shadow hover:bg-blue-700 hover:text-white z-50"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <nav className={`space-y-3 p-5 ${collapsed ? 'pl-2' : 'pl-4'}`}>
        <SidebarLink href="/deliveryBoy/dashboard" label="Dashboard" icon={<LayoutDashboard size={20} />} collapsed={collapsed} />
        <SidebarLink href="/deliveryBoy/deliveries" label="My Deliveries" icon={<Truck size={20} />} badge={3} collapsed={collapsed} />
        <SidebarLink href="/deliveryBoy/map" label="Live Map" icon={<MapPinned size={20} />} collapsed={collapsed} />
        <SidebarLink href="/deliveryBoy/payouts" label="Payouts" icon={<Wallet size={20} />} badge="₹1200" collapsed={collapsed} />
        <SidebarLink href="/deliveryBoy/report" label="Reports" icon={<FileText size={20} />} collapsed={collapsed} />
        <SidebarLink href="/deliveryBoy/support" label="Support" icon={<Headphones size={20} />} collapsed={collapsed} />
      </nav>
    </div>
  )
}

function SidebarLink({
  href,
  label,
  icon,
  badge,
  collapsed,
}: {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number | string
  collapsed: boolean
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between py-2 px-3 rounded hover:bg-white hover:text-blue-600 transition-all ${collapsed ? 'justify-center' : 'pl-4'}`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {!collapsed && <span className="text-sm">{label}</span>}
      </div>
      {!collapsed && badge && (
        <span className="text-xs bg-white text-blue-600 font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  )
}

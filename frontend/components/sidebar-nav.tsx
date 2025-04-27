"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
// 1. Importer usePathname
import { usePathname } from 'next/navigation'
import {
  ChevronLeftIcon, ChevronRightIcon, HomeIcon, BellAlertIcon,
  WrenchScrewdriverIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline'

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)
  // 2. Obtenir le chemin actuel
  const pathname = usePathname()

  return (
    <div
      className={`flex flex-col h-screen bg-gradient-to-b from-green-800 to-green-900 text-white shadow-lg transition-width duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header Section (inchangé) */}
      <div className={`flex items-center border-b border-green-700/50 p-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 overflow-hidden">
             <img src="/taqapredict.png" alt="TAQAPredict Logo" className="h-10 w-auto rounded-full object-cover" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full text-green-300 hover:text-white hover:bg-green-700/80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-900 transition-colors duration-150"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {/* 3. Utiliser pathname pour définir 'active' */}
          <NavItem
            href="/"
            icon={<HomeIcon className="h-6 w-6" />}
            label="Tableau de Bord"
            collapsed={collapsed}
            active={pathname === '/'} // Actif si le chemin est exactement "/"
          />
          <NavItem
            href="/alerts"
            icon={<BellAlertIcon className="h-6 w-6" />}
            label="Alertes"
            collapsed={collapsed}
            active={pathname === '/alerts'} // Actif si le chemin est "/alerts"
          />
          <NavItem
            href="/maintenance"
            icon={<WrenchScrewdriverIcon className="h-6 w-6" />}
            label="Maintenance"
            collapsed={collapsed}
            active={pathname === '/maintenance'} // Actif si le chemin est "/maintenance"
          />
          <NavItem
            href="/settings"
            icon={<Cog6ToothIcon className="h-6 w-6" />}
            label="Paramètres"
            collapsed={collapsed}
            active={pathname === '/settings'} // Actif si le chemin est "/settings"
          />
        </ul>
      </nav>
    </div>
  )
}

// --- NavItem Component --- (Version corrigée ci-dessus)
interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  collapsed: boolean
  active?: boolean
}

function NavItem({ href, icon, label, collapsed, active }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 p-3 transition-colors duration-150 group ${
          collapsed ? 'justify-center' : ''
        } rounded-xl ${
          active
            ? "bg-green-600 text-white font-medium shadow-sm" // Style ACTIF distinct
            : "text-green-200 hover:bg-green-700/60 hover:text-white" // Style INACTIF + HOVER
        }`}
        title={collapsed ? label : ""}
      >
        <div className="flex-shrink-0 w-6 h-6">{icon}</div>
        <span
          className={`transition-opacity duration-200 whitespace-nowrap overflow-hidden ${
            collapsed ? 'opacity-0 max-w-0' : 'opacity-100 max-w-full delay-100'
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  )
}
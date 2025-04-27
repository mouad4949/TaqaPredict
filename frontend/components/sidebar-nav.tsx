"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"

export function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`h-screen bg-gradient-to-b from-green-800 to-green-900 text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
            
<div className="flex items-center justify-between p-4 border-b border-green-700">
        <div className="flex items-center gap-4">
          {/* Le div parent aide à contrôler le padding/background si nécessaire */}
          <div className="bg-yellow-400 rounded-full p-1 flex items-center justify-center"> {/* Ajout flex pour centrer si p-1 est retiré */}
            {/* --- MODIFICATION ICI --- */}
            <img
              src="taqapredict.png"
              alt=""
              // Ajout de classes de taille (ex: w-8 h-8) et object-cover
              // Choisissez la taille qui vous convient (w-6, w-8, w-10, etc.)
              className="rounded-full w-24 h-24 object-cover"
            />
             {/* --- FIN DE LA MODIFICATION --- */}
          </div>
          {!collapsed && <span className="font-bold text-2xl"></span>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="text-green-300 hover:text-white">
          {collapsed ? "→" : "←"}
        </button>
      </div>

    

      <nav className="p-4">
        <ul className="space-y-2">
          <NavItem
            href="/"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
            label="Tableau de Bord"
            collapsed={collapsed}
            active
          />
          <NavItem
            href="/alerts"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            }
            label="Alertes"
            collapsed={collapsed}
          />
          <NavItem
            href="/maintenance"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            label="Maintenance"
            collapsed={collapsed}
          />
          <NavItem
            href="/settings"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            label="Paramètres"
            collapsed={collapsed}
          />
        </ul>
      </nav>

      
    </div>
  )
}

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
        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
          active ? "bg-green-700 text-white" : "text-green-200 hover:bg-green-700/50 hover:text-white"
        }`}
      >
        <div>{icon}</div>
        {!collapsed && <span>{label}</span>}
      </Link>
    </li>
  )
}

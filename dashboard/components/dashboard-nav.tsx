"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Building2, Calendar, MessageSquare, Star, User } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/properties", label: "Properties", icon: Building2 },
  { href: "/reservations", label: "Reservations", icon: Calendar },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/settings", label: "Settings", icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-6">
        <h1 className="text-xl font-bold">Hospitable</h1>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <div className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

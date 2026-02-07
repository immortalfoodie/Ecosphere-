"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Scan, Calendar, Trophy, ShoppingBag, BookOpen, BarChart3, Wind, Leaf, Menu, X } from "lucide-react"
import { useState } from "react"

export function MainNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      title: "Scanner",
      href: "/scanner",
      description: "Scan products for eco-ratings",
      icon: Scan,
      badge: "AI Powered",
    },
    {
      title: "Events",
      href: "/events",
      description: "Join local environmental events",
      icon: Calendar,
      badge: "Community",
    },
    {
      title: "Tracker",
      href: "/tracker",
      description: "Monitor your environmental impact",
      icon: BarChart3,
      badge: "Analytics",
    },
    {
      title: "Learn",
      href: "/learn",
      description: "Eco-tips, news, and courses",
      icon: BookOpen,
      badge: "Education",
    },
    {
      title: "Services",
      href: "/services",
      description: "Air quality and recycling centers",
      icon: Wind,
      badge: "Mumbai",
    },
    {
      title: "Profile",
      href: "/profile",
      description: "Rewards and achievements",
      icon: Trophy,
      badge: "Gamified",
    },
    {
      title: "Store",
      href: "/store",
      description: "Eco-friendly marketplace",
      icon: ShoppingBag,
      badge: "₹ Prices",
    },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Leaf className="h-6 w-6 text-green-600 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-bold text-green-600 font-mono">Ecosphere</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                      {navigationItems.slice(0, 6).map((item) => {
                        const Icon = item.icon
                        return (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              href={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-green-50 hover:text-green-900 focus:bg-green-50 focus:text-green-900"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="h-4 w-4 text-green-600" />
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        )
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link href="/store">
              <Button variant="ghost" className="bg-transparent">
                Store
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden bg-transparent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-1 p-4">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

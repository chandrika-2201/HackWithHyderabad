"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calculator, Menu, X, User, LogOut, BarChart3 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function TopNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Calculator className="h-6 w-6 text-primary" />
          <span className="text-balance">CFO Helper</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/planner">Demo</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.usageCount}/{user.maxUsage} scenarios used
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/planner">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Planner</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/usage">
                    <User className="mr-2 h-4 w-4" />
                    <span>Usage Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="#features"
              className="block text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
              <Link href="/planner" onClick={() => setIsMenuOpen(false)}>
                Demo
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
              <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
            </Button>

            {user ? (
              <>
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-muted-foreground text-xs">{user.email}</div>
                  <div className="text-muted-foreground text-xs">
                    {user.usageCount}/{user.maxUsage} scenarios used
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                  <Link href="/usage" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Usage Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
                <Button asChild className="w-full">
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

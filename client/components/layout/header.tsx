"use client";

import React, { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Menu, Moon, Sun, X } from "lucide-react";
import { SidebarNav } from "./sidebar";
import Image from "next/image";
import crmLogo from "../../public/crm-logo.png";
import { useTheme } from "next-themes";
import { Search } from "lucide-react"
import { CommandMenu } from "./command-menu"

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { theme, setTheme } = useTheme()
  const [isCommandOpen, setIsCommandOpen] = useState(false)


  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)

  }, [])

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <>
      <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="text-sm font-medium text-muted-foreground hidden sm:block">
            Welcome back, {user?.name || "User"}!
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            className="text-muted-foreground text-xs flex items-center gap-2 px-3 py-1.5 h-9 rounded-lg border bg-card hover:bg-accent hover:text-accent-foreground transition-all"
            onClick={() => setIsCommandOpen(true)}
          >
            <Search className="w-3.5 h-3.5" />
            <span
              className="hidden sm:inline"
            >Search CRM...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-1">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? 'dark' : 'light')}
          >
            <Sun
              className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />
            <Moon
              className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
            <span
              className="sr-only"
            >Toggle Theme</span>
          </Button>
         {user?.avatar_url ? (
          <img 
          src={user.avatar_url}
          alt={user.name || "User Avatar"}
          className="w-8 h-8 rounded-full object-cover border hidden sm:block"
          referrerPolicy="no-referrer"
          />
         ):(
           <div className="w-8 h-8 rounded-full bg-muted border hidden sm:flex items-center justify-center text-xs font-semibold uppercase text-muted-foreground">
    {user?.name ? user.name.charAt(0) : "U"}
  </div>
         )}
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sliding Drawer */}
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-background border-r shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col">
            <div className="h-16 border-b flex justify-between items-center px-4">
              <div className="flex items-center gap-3">
                <Image src={crmLogo} alt="Flow CRM Logo" width={28} height={28} className="rounded" />
                <h2 className="text-lg font-bold tracking-tight">FlowCRM</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {/* The shared navigation from sidebar.tsx */}
            <div onClick={() => setIsMobileMenuOpen(false)} className="flex-1 flex flex-col">
              <SidebarNav />
            </div>
          </div>
        </div>
      )}
      <CommandMenu open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </>
  );
}

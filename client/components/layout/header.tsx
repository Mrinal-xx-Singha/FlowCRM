"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";
import { Menu, X } from "lucide-react";
import { SidebarNav } from "./sidebar";
import Image from "next/image";
import crmLogo from "../../public/crm-logo.png";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <div className="w-8 h-8 rounded-full bg-muted border hidden sm:block"></div>
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
    </>
  );
}

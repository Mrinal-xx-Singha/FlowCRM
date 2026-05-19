"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth";

export function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="text-sm font-medium text-muted-foreground">
        Welcome back, {user?.name || "User"}!
      </div>
      <div className="flex items-center gap-4">
        {/* Profile Dropdown Placeholder */}
        <div className="w-8 h-8 rounded-full bg-muted border hidden sm:block"></div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}

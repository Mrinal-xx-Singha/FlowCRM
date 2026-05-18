import React from "react";

export function Header() {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="text-sm font-medium text-muted-foreground">
        Welcome back, User!
      </div>
      <div className="flex items-center gap-4">
        {/* Profile Dropdown Placeholder */}
        <div className="w-8 h-8 rounded-full bg-muted border"></div>
      </div>
    </header>
  );
}

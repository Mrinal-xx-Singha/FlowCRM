import React from "react";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-bold">Flow CRM</h2>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        <Link href="/dashboard" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">Dashboard</Link>
        <Link href="/customers" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">Customers</Link>
        <Link href="/jobs" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">Jobs</Link>
        <Link href="/reminders" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">Reminders</Link>
        <Link href="/settings" className="px-3 py-2 rounded-md hover:bg-muted transition-colors mt-auto">Settings</Link>
      </nav>
    </aside>
  );
}

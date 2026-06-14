"use client";
import Link from "next/link";
import Image from "next/image";
import crmLogo from "../../public/crm-logo.png";
import { usePathname } from "next/navigation";
import { Settings,Bell,LayoutDashboard,Users,Briefcase } from "lucide-react";

export function SidebarNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard",icon:LayoutDashboard },
    { href: "/customers", label: "Customers",icon:Users },
    { href: "/jobs", label: "Jobs",icon:Briefcase },
    { href: "/reminders", label: "Reminders",icon:Bell },

  ];
  
  return (
    <nav className="flex flex-col gap-2 p-4 h-full">
      {links.map((link) => {
        const isActive = pathname.startsWith(link.href);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md flex items-center gap-3 transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
          >
            <Icon  className = "w-4 h-4"/>
            {link.label} 
          </Link>
        );
      })}
      <Link
        href="/settings"
        className={`px-3 flex  gap-3 items-center py-2 rounded-md transition-colors mt-auto ${pathname.startsWith('/settings') ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
      >
         <Settings  className="h-4 w-4"/>
        <span>
          
        Settings
        </span>
      </Link>
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background flex-col h-full z-50 hidden md:flex">
      <div className="h-16 border-b flex justify-start gap-3 items-center px-6">
        <Image src={crmLogo} alt="Flow CRM Logo" width={28} height={28} className="rounded" />
        <h2 className="text-lg font-bold tracking-tight">FlowCRM</h2>
      </div>
      <SidebarNav />
    </aside>
  );
}

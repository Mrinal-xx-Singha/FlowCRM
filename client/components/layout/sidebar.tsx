
import Link from "next/link";
import Image from "next/image";
import crmLogo from "../../public/crm-logo.png";

export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background flex flex-col h-full">
      <div className="p-6 border-b flex justify-start gap-3 items-center">
        <Image src={crmLogo} alt="Flow CRM Logo" width={32} height={32} className="rounded" />
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

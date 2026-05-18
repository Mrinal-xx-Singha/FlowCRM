import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders";
import { RecentJobs } from "@/components/dashboard/recent-jobs";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard Overview</h1>
      <DashboardSummary />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentJobs />
        <UpcomingReminders />
      </div>
    </div>
  );
}

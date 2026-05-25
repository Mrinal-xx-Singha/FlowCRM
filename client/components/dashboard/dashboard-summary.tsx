"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export function DashboardSummary() {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
  });

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading analytics...</div>;
  }

  if (isError || !data) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard summary.</div>;
  }

  const metrics = [
    { title: "Total Customers", value: data.total_customers, icon: Users, color: "text-blue-500" },
    { title: "Open Jobs", value: data.total_jobs - data.completed_jobs, icon: Briefcase, color: "text-indigo-500" },
    { title: "In Progress", value: data.in_progress_jobs, icon: Clock, color: "text-amber-500" },
    { title: "Completed Jobs", value: data.completed_jobs, icon: CheckCircle2, color: "text-emerald-500" },
    { title: "Overdue Reminders", value: data.overdue_reminders, icon: AlertCircle, color: "text-red-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value || 0}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

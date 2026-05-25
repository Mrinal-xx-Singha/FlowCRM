"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export function RecentJobs() {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["dashboard", "recent-jobs"],
    queryFn: dashboardApi.getRecentJobs,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="animate-pulse text-sm text-muted-foreground">Loading recent jobs...</CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-red-500">Failed to load recent jobs.</CardContent>
      </Card>
    );
  }

  const jobs = data?.jobs || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-500" />
          Recent Jobs
        </CardTitle>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent jobs found.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <div key={job.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.customer_name || "Unknown Customer"}</p>
                </div>
                <div className="text-xs">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 font-medium ring-1 ring-inset ${
                    job.status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                    job.status === 'in_progress' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                    'bg-gray-50 text-gray-600 ring-gray-500/10'
                  }`}>
                    {job.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

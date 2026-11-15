"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Clock, CheckCircle2, AlertCircle, Sparkles, Loader2, Database } from "lucide-react";
import { PipelineChart } from "./pipeline-chart";
import { Spinner } from "@/components/ui/spinner";
import { ProductivityChart } from "./productivity-chart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DashboardSummary() {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
  });
  const queryClient = useQueryClient()
  const seedMutation = useMutation({
    mutationFn: dashboardApi.seedDemo,
    onSuccess: () => {
      // Refresh all queries so the entire app populates instantly
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["jobs"] })
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["reminders"] })
      toast.success("Sample pipeline loaded! Explore your new deals and metrics.")
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to load sample data.")
    }
  })

  const isAccountEmpty =
    Number(data?.total_customers || 0) === 0 &&
    Number(data?.total_jobs || 0) === 0;

  if (isLoading) {
    return <Spinner size="lg" />;
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
    <div className="flex flex-col gap-6">
      {/* Fresh account welcome and demo seeder banner */}
      {isAccountEmpty && (
        <Card
          className="border-indigo-200 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-50/60 via-background to-background dark:from-indigo-950/20 p-5 rounded-2xl shadow-none"
        >

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles
                  className="h-4 w-4 text-indigo-500"
                />
                <h3
                  className="font-semibold text-sm"
                >Welcome to FlowCRM!</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your pipeline is currently empty. Populate your account with realistic clients, active deals in ₹ INR, and reminders to explore how FlowCRM works.
              </p>
            </div>
            <Button
              onClick={() => seedMutation.mutate()}
              disabled={seedMutation.isPending}
              className="gap-2 shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {seedMutation.isPending ? (
                <Loader2
                  className="h-4 w-4 animate-spin"
                />
              ) : (
                <Database className="h-4 w-4" />
              )}
              Load Sample Pipeline
            </Button>
          </div>
        </Card>
      )}

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
      {/* new chart section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PipelineChart summaryData={data} />
        <ProductivityChart summaryData={data} />
      </div>
    </div>
  );
}

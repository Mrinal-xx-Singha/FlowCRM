"use client";
import React from 'react';
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api";
import { ArrowLeft, Calendar, FileText, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const JobDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getJobById(Number(jobId))
  });
  
  const jobData = jobs?.job;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-24 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (error || !jobData) {
    return <div className="text-destructive p-6">Failed to load job details.</div>;
  }

  // Format the status for the badge
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    in_progress: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200"
  };
  const statusColor = statusColors[jobData.status as keyof typeof statusColors] || statusColors.pending;
  const displayStatus = jobData.status.replace("_", " ").toUpperCase();

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Button 
        variant="ghost" 
        className="w-fit -ml-4 text-muted-foreground hover:text-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <Card className="shadow-sm border-slate-200/60 overflow-hidden">
        <CardHeader className="pb-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl mb-2">{jobData.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Job ID: #{jobData.id} 
                {jobData.customer_id && ` • Customer ID: #${jobData.customer_id}`}
              </CardDescription>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColor} shrink-0 w-fit`}>
              {displayStatus}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 grid gap-6">
          
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex flex-col w-full">
              <span className="text-sm font-medium text-slate-500 mb-1">Job Description</span>
              <p className="text-base text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-24 whitespace-pre-wrap">
                {jobData.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">Due Date</span>
              <span className="text-base font-medium text-slate-900">
                {jobData.due_date ? new Date(jobData.due_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "No deadline"}
              </span>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default JobDetailsPage;
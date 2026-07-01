"use client";

import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api";
import { JobColumn } from "./job-column";
import { Job } from "./job-card";

export function JobsBoard({ searchQuery }: { searchQuery?: string }) {
  const queryClient = useQueryClient();
  const [localJobs, setLocalJobs] = useState<Job[]>([]);
  // update the useQuery hook to include searchQuery in the queryKey and queryFn
  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", searchQuery],
    queryFn: () => jobsApi.getJobs({ search: searchQuery }),
  });

  // Sync local state when server data comes in
  useEffect(() => {
    if (data?.jobs) {
      setLocalJobs(data.jobs);
    }
  }, [data?.jobs]);

  const updateJobMutation = useMutation({
    mutationFn: (vars: { id: number; status: string }) =>
      jobsApi.updateJob({ id: vars.id, status: vars.status }),
    onSuccess: () => {
      // Invalidate queries quietly in the background
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      // Revert to server state on error
      if (data?.jobs) {
        setLocalJobs(data.jobs);
      }
    }
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const jobId = parseInt(draggableId);
    const newStatus = destination.droppableId as Job["status"];

    // Optimistically update local state
    setLocalJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );

    // Fire mutation to server
    if (source.droppableId !== destination.droppableId) {
      updateJobMutation.mutate({ id: jobId, status: newStatus });
    }
  };

  if (isLoading && localJobs.length === 0) {
    return <div className="flex justify-center p-8">Loading board...</div>;
  }

  if (isError) {
    return <div className="flex justify-center p-8 text-red-500">Failed to load jobs.</div>;
  }

  if (localJobs.length === 0 && !isLoading) {
    return (
      <div className="flex h-100 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 text-muted-foreground">
        <p className="text-lg font-medium text-foreground">
          {searchQuery ? "No matching jobs found" : "No jobs yet"}
        </p>
        <p className="text-sm">
          {searchQuery 
            ? `We couldn't find anything matching "${searchQuery}".` 
            : "Click 'Add Job' to create your first deal."}
        </p>
      </div>
    );
  }

  const pendingJobs = localJobs.filter((job) => job.status === "pending");
  const inProgressJobs = localJobs.filter((job) => job.status === "in_progress");
  const completedJobs = localJobs.filter((job) => job.status === "completed");

  return (
    <div className="flex h-full w-full gap-6 overflow-x-auto pb-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <JobColumn id="pending" title="To Do" jobs={pendingJobs} />
        <JobColumn id="in_progress" title="In Progress" jobs={inProgressJobs} />
        <JobColumn id="completed" title="Completed" jobs={completedJobs} />
      </DragDropContext>
    </div>
  );
}

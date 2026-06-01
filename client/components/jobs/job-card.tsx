"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { CalendarIcon, Trash2, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi } from "@/lib/api";
import { toast } from "sonner";

export interface Job {
  id: number;
  customer_id: number;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  due_date?: string;
  customer_name?: string;
}

interface JobCardProps {
  job: Job;
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const queryClient = useQueryClient();

  const deleteMutaion = useMutation({
    mutationFn: (id: number) => jobsApi.deleteJob(id),
    onSuccess: () => {
      // Show success toast
      toast.success("Job deleted successfully!");

      queryClient.invalidateQueries({ queryKey: ["jobs"] });

      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

    },
    onError: () => {
      toast.error("Failed to delete job. Please try again.");
    }
  })


  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      deleteMutaion.mutate(id)
    }
  }
  return (
    <Draggable draggableId={job.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-primary/50 ${snapshot.isDragging ? "rotate-2 scale-105 shadow-xl ring-1 ring-primary/20 cursor-grabbing" : "cursor-grab"
            }`}
        >
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-medium leading-none text-foreground">{job.title}</h4>
            <Button
              onClick={() => handleDelete(job.id)}
              variant="destructive" size="sm">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {job.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">{job.description}</p>
          )}

          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <UserIcon className="h-3.5 w-3.5" />
              <span>{job.customer_name || "Unknown"}</span>
            </div>

            {job.due_date && (
              <div className="flex items-center gap-1.5 font-medium text-foreground/70">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{new Date(job.due_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

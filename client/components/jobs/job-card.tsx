"use client";

import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { CalendarIcon, UserIcon } from "lucide-react";

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
  return (
    <Draggable draggableId={job.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:border-primary/50 ${
            snapshot.isDragging ? "rotate-2 scale-105 shadow-xl ring-1 ring-primary/20 cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-medium leading-none text-foreground">{job.title}</h4>
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

"use client";

import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Job, JobCard } from "./job-card";

interface JobColumnProps {
  id: string;
  title: string;
  jobs: Job[];
}

export function JobColumn({ id, title, jobs }: JobColumnProps) {
  return (
    <div className="flex h-full min-h-125 w-full min-w-75 flex-col rounded-xl bg-zinc-50/50 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-200/50 text-xs font-medium text-zinc-600">
          {jobs.length}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col gap-3 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-zinc-100/80" : ""
            }`}
          >
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

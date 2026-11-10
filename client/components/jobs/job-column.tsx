"use client";

import React, { useMemo } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { Job, JobCard } from "./job-card";

interface JobColumnProps {
  id: string;
  title: string;
  jobs: Job[];
}

export function JobColumn({ id, title, jobs }: JobColumnProps) {
  // 1. Calculate the total ₹ deal value for this column
  const totalValue = useMemo(()=>{
return jobs.reduce((sum,job)=>sum+(job.deal_value || 0),0)
  },[jobs])

  // 2. Format it in Indian Rupees(₹)
  const formattedTotal = useMemo(()=>{
    return new Intl.NumberFormat("en-IN",{
      style:"currency",
      currency:"INR",
      maximumFractionDigits:0,
    }).format(totalValue)

  },[totalValue])
  
  return (
    <div className="flex h-full min-h-75 w-full min-w-75 flex-col rounded-xl bg-zinc-50/70 p-4 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60">
      {/* Column Header: Title, Count Badge, and Total Value */}
      <div className="mb-4 flex items-center justify-between pb-2 border-b border-zinc-200/40 dark:border-zinc-800/40">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-200/60 dark:bg-zinc-800 px-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            {jobs.length}
          </span>
        </div>

        {/* Real-time Rupee Total */}
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          {formattedTotal}
        </span>
      </div>
      
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-1 flex-col gap-3 rounded-lg transition-colors ${
              snapshot.isDraggingOver ? "bg-zinc-100/80 dark:bg-zinc-800/40" : ""
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

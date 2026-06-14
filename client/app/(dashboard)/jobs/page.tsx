"use client";

import React, { useState } from "react";
import { JobsBoard } from "@/components/jobs/jobs-board";
import { JobForm } from "@/components/jobs/job-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function JobsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className=" text-md md:text-2xl font-semibold tracking-tight">Jobs Board</h1>
          <p className="text-sm text-muted-foreground">Manage your deals and projects through the pipeline.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Job</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>Add New Job</DialogTitle>
              <DialogDescription>
                Create a new job and assign it to a customer.
              </DialogDescription>
            </DialogHeader>
            <JobForm onSuccessCallback={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-hidden">
        <JobsBoard />
      </div>
    </div>
  );
}

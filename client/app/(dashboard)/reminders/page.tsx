"use client";

import React, { useState } from "react";
import { ReminderList } from "@/components/reminders/reminder-list";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BellPlus } from "lucide-react";

export default function RemindersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">Manage your tasks and follow-ups.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <BellPlus className="h-4 w-4" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
              <DialogDescription>
                Set a task and optionally link it to a specific customer or job.
              </DialogDescription>
            </DialogHeader>
            <ReminderForm onSuccessCallback={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="max-w-4xl">
        <ReminderList />
      </div>
    </div>
  );
}

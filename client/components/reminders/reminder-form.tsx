import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ReminderForm() {
  return (
    <form className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Title</Label>
        <Input id="title" placeholder="Reminder title" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">Date</Label>
        <Input id="date" type="datetime-local" className="col-span-3" />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save Reminder</Button>
      </div>
    </form>
  );
}

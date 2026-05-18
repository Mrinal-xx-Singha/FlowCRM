import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function JobForm() {
  return (
    <form className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">Title</Label>
        <Input id="title" placeholder="Job title" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Input id="description" placeholder="Brief description" className="col-span-3" />
      </div>
      <div className="flex justify-end">
        <Button type="submit">Save Job</Button>
      </div>
    </form>
  );
}

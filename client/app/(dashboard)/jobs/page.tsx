"use client";

import React, { useEffect, useState } from "react";
import { JobsBoard } from "@/components/jobs/jobs-board";
import { JobForm } from "@/components/jobs/job-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)

    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-6">
      <div className="flex items-center justify-between shrink-0 flex-col md:flex-row gap-10">
        <div>
          <h1 className=" text-md md:text-2xl font-semibold tracking-tight">Jobs Board</h1>
          <p className="text-sm text-muted-foreground">Manage your deals and projects through the pipeline.</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto flex-col md:flex-row">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="search jobs or customers"
              className="pl-8 bg-background"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

          </div>

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
        <JobsBoard searchQuery={debouncedSearch} />
      </div>
    </div>
  );
}

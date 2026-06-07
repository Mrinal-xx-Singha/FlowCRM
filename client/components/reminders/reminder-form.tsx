"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { reminderApi, customerApi, jobsApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  notes: z.string().optional().or(z.literal("")),
  remind_at: z.string().min(1, "Date and time is required"),
  customer_id: z.string().min(1, "Customer is required"),
  job_id: z.string().optional().or(z.literal("")),
});

type ReminderFormValues = z.infer<typeof formSchema>;

interface ReminderFormProps {
  onSuccessCallback?: () => void;
}

export function ReminderForm({ onSuccessCallback }: ReminderFormProps) {
  const queryClient = useQueryClient();

  const { data: customerData } = useQuery<any>({
    queryKey: ["customers"],
    queryFn: customerApi.getCustomers,
  });

  const { data: jobData } = useQuery<any>({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.getJobs(),
  });
  
  const customers = customerData?.customers || [];
  const jobs = jobData?.jobs || [];

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      notes: "",
      remind_at: "",
      customer_id: "",
      job_id: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ReminderFormValues) => reminderApi.createReminder({
      ...data,
      job_id: data.job_id ? data.job_id : undefined, // clean empty string to undefined
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Reminder created successfully!");
      form.reset();
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      form.setError("root", {
        message: error.response?.data?.message || "Failed to create reminder.",
      });
    },
  });

  const onSubmit: import("react-hook-form").SubmitHandler<ReminderFormValues> = (data) => {
    // Convert the naive local datetime string from the input into a strict UTC ISO string
    const utcDate = new Date(data.remind_at).toISOString();

    createMutation.mutate({
      ...data,
      remind_at: utcDate,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      {form.formState.errors.root && (
        <p className="text-sm font-medium text-destructive text-center">
          {form.formState.errors.root.message}
        </p>
      )}
 
      <div className="grid gap-2">
        <Label htmlFor="title">Reminder Title *</Label>
        <Input id="title" placeholder="Follow up email..." {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="remind_at">Date & Time *</Label>
        <Input id="remind_at" type="datetime-local" {...form.register("remind_at")} />
        {form.formState.errors.remind_at && (
          <p className="text-xs text-destructive">{form.formState.errors.remind_at.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="customer_id">Customer *</Label>
          <select 
            id="customer_id" 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...form.register("customer_id")}
          >
            <option value="" disabled>Select...</option>
            {customers.map((c: any) => (
              <option key={c.id} value={c.id.toString()}>{c.name}</option>
            ))}
          </select>
          {form.formState.errors.customer_id && (
            <p className="text-xs text-destructive">{form.formState.errors.customer_id.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="job_id">Link to Job (Optional)</Label>
          <select 
            id="job_id" 
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            {...form.register("job_id")}
          >
            <option value="">None</option>
            {jobs.map((j: any) => (
              <option key={j.id} value={j.id.toString()}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Additional details..." {...form.register("notes")} />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Saving..." : "Create Reminder"}
        </Button>
      </div>
    </form>
  );
}

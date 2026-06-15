"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { jobsApi, customerApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  customer_id: z.string().min(1, "Customer is required"),
  description: z.string().optional().or(z.literal("")),
  due_date: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "in_progress", "completed"]),
});

type JobFormValues = z.infer<typeof formSchema>;

interface JobFormProps {
  onSuccessCallback?: () => void;
}

export function JobForm({ onSuccessCallback }: JobFormProps) {
  const queryClient = useQueryClient();

  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getCustomers,
  });
  
  const customers = customerData?.customers || [];

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      customer_id: "",
      description: "",
      due_date: "",
      status: "pending" as const,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: JobFormValues) => jobsApi.createJob(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job created successfully!");
      form.reset();
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      form.setError("root", {
        message: error.response?.data?.message || "Failed to create job.",
      });
    },
  });

  const onSubmit :SubmitHandler<JobFormValues> = (data) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      {form.formState.errors.root && (
        <p className="text-sm font-medium text-destructive text-center">
          {form.formState.errors.root.message}
        </p>
      )}
 
      <div className="grid gap-2">
        <Label htmlFor="title">Job Title *</Label>
        <Input id="title" placeholder="Website Redesign" {...form.register("title")} />
        {form.formState.errors.title && (
          <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="customer_id">Assign Customer *</Label>
        <select 
          id="customer_id" 
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...form.register("customer_id")}
        >
          <option value="" disabled>Select a customer...</option>
          {customers.map((c: any) => (
            <option key={c.id} value={c.id.toString()}>{c.name}</option>
          ))}
        </select>
        {form.formState.errors.customer_id && (
          <p className="text-xs text-destructive">{form.formState.errors.customer_id.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Input id="due_date" type="date" {...form.register("due_date")} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" placeholder="Project details..." {...form.register("description")} />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Saving..." : "Create Job"}
        </Button>
      </div>
    </form>
  );
}

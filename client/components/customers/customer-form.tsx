"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

type CustomerFormValues = z.infer<typeof formSchema>;

interface CustomerFormProps {
  onSuccessCallback?: () => void;
}

export function CustomerForm({ onSuccessCallback }: CustomerFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      notes: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CustomerFormValues) => customerApi.createCustomer(data),
    onSuccess: () => {
      // Invalidate the customers query so the table instantly refreshes
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      form.reset();
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      console.error("Failed to create customer:", error);
      form.setError("root", {
        message: error.response?.data?.message || "Failed to create customer.",
      });
    },
  });

  const onSubmit = (data: CustomerFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        {form.formState.errors.root && (
          <p className="text-sm font-medium text-destructive text-center">
            {form.formState.errors.root.message}
          </p>
        )}
   
        <div className="grid gap-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" placeholder="John Doe" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john@example.com" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="+91 9876543210" {...form.register("phone")} />
          {form.formState.errors.phone && (
            <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" placeholder="Additional information..." {...form.register("notes")} />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { toast } from "sonner"; // Using Shadcn's default toast (Sonner)

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const queryClient = useQueryClient();

  // Fetch current user data to pre-fill the form
  const { data: user, isLoading } = useQuery<any>({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormValues) => userApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  if (isLoading) return <div className="animate-pulse h-32 bg-muted rounded-xl"></div>;

  return (
    <div className="p-6 bg-card border rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Update your account's profile information and email address.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>

        <Button type="submit" disabled={updateMutation.isPending || !form.formState.isDirty}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

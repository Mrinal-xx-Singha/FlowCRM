"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordForm() {
  const router = useRouter();
  const { logout } = useAuth();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordFormValues) =>
      userApi.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      }),
    onSuccess: () => {
      toast.success("Password changed successfully! Please log in again.");
      form.reset();

      // Force user to log in again for security
      setTimeout(() => {
        logout();
        router.push("/login");
      }, 2000);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to update password";
      toast.error(message);
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    passwordMutation.mutate(data);
  };

  return (
    <div className="p-6 bg-card border rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Update Password</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ensure your account is using a long, random password to stay secure.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current Password</Label>
          <Input id="currentPassword" type="password" {...form.register("currentPassword")} />
          {form.formState.errors.currentPassword && (
            <p className="text-xs text-destructive">{form.formState.errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input id="newPassword" type="password" {...form.register("newPassword")} />
          {form.formState.errors.newPassword && (
            <p className="text-xs text-destructive">{form.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input id="confirmPassword" type="password" {...form.register("confirmPassword")} />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" disabled={passwordMutation.isPending}>
          {passwordMutation.isPending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </div>
  );
}

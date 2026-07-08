"use client";

import React from "react";
import { ProfileForm } from "@/components/settings/profile-form";
import { PasswordForm } from "@/components/settings/password-form";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl pb-10">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col gap-6">
        <ProfileForm />
        <PasswordForm />
      </div>
    </div>
  );
}

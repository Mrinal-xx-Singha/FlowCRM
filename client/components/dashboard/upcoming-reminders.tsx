"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export function UpcomingReminders() {
  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["dashboard", "upcoming-reminders"],
    queryFn: dashboardApi.getUpcomingReminders,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent><Spinner /></CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-red-500">Failed to load reminders.</CardContent>
      </Card>
    );
  }

  const reminders = data?.reminders || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-rose-500" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">You have no upcoming reminders.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map((reminder: any) => (
              <div key={reminder.id} className="flex flex-col gap-1 border-b pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-sm">{reminder.title}</p>
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                    {new Date(reminder.remind_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {reminder.customer_name ? `For: ${reminder.customer_name}` : 'General reminder'}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

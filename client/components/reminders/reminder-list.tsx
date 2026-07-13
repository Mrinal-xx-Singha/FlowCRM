"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reminderApi } from "@/lib/api";
import { Trash2, Bell, Calendar, User, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";

export function ReminderList() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<any>({
    queryKey: ["reminders"],
    queryFn: () => reminderApi.getReminders(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      reminderApi.updateReminder({ id, data: { status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // update dashboard widget too
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reminderApi.deleteReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  if (isLoading) return <Spinner size="lg" />;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load reminders.</div>;

  const reminders = data?.reminders || [];
  
  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-muted-foreground border rounded-xl border-dashed">
        <Bell className="h-10 w-10 mb-4 opacity-20" />
        <p>No reminders found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder: any) => {
        const isCompleted = reminder.status === "sent";
        const isOverdue = !isCompleted && new Date(reminder.remind_at) < new Date();

        return (
          <div 
            key={reminder.id} 
            className={`flex items-start justify-between p-4 border rounded-xl shadow-sm transition-all ${
              isCompleted ? "bg-muted/50 opacity-60" : "bg-card"
            } ${isOverdue ? "border-red-200 bg-red-50/30" : "border-border"}`}
          >
            <div className="flex gap-4">
              <div className="mt-1">
                <Checkbox 
                  checked={isCompleted} 
                  onCheckedChange={(checked) => {
                    updateMutation.mutate({ 
                      id: reminder.id, 
                      status: checked ? "sent" : "pending" 
                    });
                  }} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className={`font-semibold text-base ${isCompleted ? "line-through text-muted-foreground" : ""}`}>
                  {reminder.title}
                </p>
                {reminder.notes && (
                  <p className="text-sm text-muted-foreground max-w-2xl line-clamp-2">{reminder.notes}</p>
                )}
                
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs font-medium">
                  <div className={`flex items-center gap-1.5 ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{new Date(reminder.remind_at).toLocaleString()}</span>
                    {isOverdue && <span className="text-red-600 bg-red-100 px-1.5 rounded text-[10px] uppercase">Overdue</span>}
                  </div>

                  {reminder.customer_name && (
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <User className="h-3.5 w-3.5" />
                      <span>{reminder.customer_name}</span>
                    </div>
                  )}

                  {reminder.job_title && (
                    <div className="flex items-center gap-1.5 text-indigo-600">
                      <Briefcase className="h-3.5 w-3.5" />
                      <span>{reminder.job_title}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 shrink-0"
              onClick={() => deleteMutation.mutate(reminder.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

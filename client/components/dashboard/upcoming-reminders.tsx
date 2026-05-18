import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function UpcomingReminders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">List of upcoming reminders.</p>
      </CardContent>
    </Card>
  );
}

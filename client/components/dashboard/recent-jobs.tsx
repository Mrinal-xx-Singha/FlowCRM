import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function RecentJobs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Jobs</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">List of recent jobs.</p>
      </CardContent>
    </Card>
  );
}

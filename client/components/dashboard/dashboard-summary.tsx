import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function DashboardSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Placeholder for dashboard metrics (total customers, active jobs, etc).</p>
      </CardContent>
    </Card>
  );
}

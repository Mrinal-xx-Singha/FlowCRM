import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function JobsBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">To Do</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">No jobs</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">In Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">No jobs</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">No jobs</div>
        </CardContent>
      </Card>
    </div>
  );
}

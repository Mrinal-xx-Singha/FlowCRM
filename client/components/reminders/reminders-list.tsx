import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function RemindersList() {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="font-medium">Call John Doe</p>
            <p className="text-sm text-muted-foreground">Follow up on recent job</p>
          </div>
          <div className="text-sm text-muted-foreground">Tomorrow</div>
        </CardContent>
      </Card>
    </div>
  );
}

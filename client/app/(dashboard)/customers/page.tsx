import React from "react";
import { CustomerTable } from "@/components/customers/customer-table";
import { Button } from "@/components/ui/button";

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customers and leads.</p>
        </div>
        <Button>Add Customer</Button>
      </div>
      <CustomerTable />
    </div>
  );
}

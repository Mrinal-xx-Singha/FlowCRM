"use client";

import React, { useState } from "react";
import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { customerApi } from "@/lib/api";
import { CustomerForm } from "./customer-form";


interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export function CustomerTable() {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getCustomers,
  });
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: number) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      setEditingCustomer(null);
    },
    onError: (error: any) => {
      console.error("Failed to delete customer:", error);
      alert(error.response?.data?.message || "Failed to delete customer.");
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      mutation.mutate(id);
    }
  }

  const customers = data?.customers ?? [];

  if (isLoading) {
    return <div className="p-4 text-center">Loading customers...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Failed to load customers.</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.notes}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mr-2"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm"
                    onClick={()=>handleDelete(customer.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the details of your customer here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm 
              initialData={editingCustomer} 
              onSuccessCallback={() => setEditingCustomer(null)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

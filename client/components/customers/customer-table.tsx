"use client";

import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import Link from "next/link";
import { Search, Download } from "lucide-react";
import { Input } from "../ui/input";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export function CustomerTable() {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState("")


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

  const filteredCustomers = customers.filter((c: Customer) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.phone && c.phone.includes(searchLower)
    )
  })

  if (isLoading) {
    return <div className="p-4 text-center">Loading customers...</div>;
  }

  if (isError) {
    return <div className="p-4 text-center text-red-500">Failed to load customers.</div>;
  }
  const downloadCSV = (data: Customer[]) => {
    // Create the top row headers
    const headers = ['Name', 'Email', 'Phone', 'Notes']
    // Map through the data and wrap strings in quotes to prevent comma breaks
    const rows = data.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.email.replace(/"/g, '""')}"`,
      `"${(c.phone || '').replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ])
    // create it all into a single text block 
    const csvContent = [headers.join(","),...rows.map(r=>r.join(","))].join("\n");

    // create an invisible download link and click it programmatically
    const blob = new Blob([csvContent],{type:'text/csv;charset=utf8;'})
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href',url)
    link.setAttribute('download','customers_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
    <div className="flex items-center justify-between mb-4">
    {/* Search Bar */}
      <div className="relative w-full mb-4 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search customers...."
          className="pl-9 bg-card"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {/* CSV Download functionality */}
      <Button variant="outline" onClick={()=>downloadCSV(filteredCustomers)}>
        <Download className="mr-2 h-4 w-4"/>
      </Button>
          </div>
      <div className="rounded-md border bg-card">
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
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer: Customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <Link
                      className="hover:underline hover:text-blue-600"
                      href={`/customers/${customer.id}`}>
                      {customer.name}
                    </Link>
                  </TableCell>
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
                      onClick={() => handleDelete(customer.id)}
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
        <DialogContent className="sm:max-w-106.25">
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

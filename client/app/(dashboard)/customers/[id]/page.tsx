"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { customerApi } from "@/lib/api";
import { ArrowLeft, Mail, Phone, StickyNote, UserCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

const CustomerDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerApi.getCustomerById(Number(customerId))
  });
  
  const customerData = customer?.customer;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-8 w-24 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded-xl"></div>
      </div>
    );
  }

  if (error || !customerData) {
    return <div className="text-destructive p-6">Failed to load customer details.</div>;
  }

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <Link 
        href="/customers" 
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-fit -ml-4 text-muted-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Link>

      <Card className="shadow-sm border-slate-200/60">
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <UserCircle className="h-8 w-8" />
            </div>
            <div>
              <CardTitle className="text-2xl">{customerData.name}</CardTitle>
              <CardDescription>Customer ID: #{customerData.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6">
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">Email Address</span>
              <a href={`mailto:${customerData.email}`} className="text-base font-medium text-slate-900 hover:text-blue-600 transition-colors">
                {customerData.email}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500">Phone Number</span>
              <a href={`tel:${customerData.phone}`} className="text-base font-medium text-slate-900 hover:text-blue-600 transition-colors">
                {customerData.phone || "No phone provided"}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center shrink-0">
              <StickyNote className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-500 mb-1">Notes</span>
              <p className="text-base text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-24">
                {customerData.notes || "No notes available."}
              </p>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerDetailsPage;
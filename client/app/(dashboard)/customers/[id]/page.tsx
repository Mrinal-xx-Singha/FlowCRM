"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi, jobsApi } from "@/lib/api";
import { ArrowLeft, Mail, Phone, StickyNote, UserCircle, Briefcase, Calendar, MapPin, Building, Globe, Clock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AiEmailModal } from '@/components/ai/ai-email-modal';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner"
import { Check, Loader2 } from 'lucide-react';

const CustomerDetailsPage = () => {
  const [notes, setNotes] = useState("")
  const queryClient = useQueryClient()

  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerApi.getCustomerById(Number(customerId))
  });

  // Fetch jobs to show linked deals!
  const { data: jobData } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => jobsApi.getJobs(),
  });


  const customerData = customer?.customer;
  const linkedJobs = jobData?.jobs?.filter((j: any) => j.customer_id === Number(customerId)) || [];

  // Sync local notes state whenever server customer data is loaded

  useEffect(() => {
    if (customerData?.notes !== undefined) {
      setNotes(customerData.notes || "")
    }

  }, [customerData?.notes])

  // Mutation to save notes in the background 
  const updateNotesMutation = useMutation({
    mutationFn: (newNotes: string) => customerApi.updateCustomer({ id: Number(customerId), notes: newNotes }),
    onSuccess: () => {
      // Refresh customer cache so other tabs have the updated notes
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] })
      toast.success("Notes saved!")
    },
    onError: () => {
      toast.error("Failed to save notes.")
    }
  })

  // Fires automatically when user clicks away from the textarea
  const handleNotesBlur = () => {
    const currentSavedNotes = customerData?.notes || ""
    // Only fire if the text actually changes
    if (notes !== currentSavedNotes) {
      updateNotesMutation.mutate(notes)
    }
  }
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse w-full max-w-4xl">
        <div className="h-48 bg-muted rounded-xl w-full"></div>
        <div className="h-10 bg-muted rounded-md w-64 mt-4"></div>
        <div className="h-64 bg-muted rounded-xl w-full"></div>
      </div>
    );
  }

  if (error || !customerData) {
    return <div className="text-destructive p-6">Failed to load customer details.</div>;
  }

  return (
    <div className="max-w-5xl flex flex-col gap-6 pb-12">
      <Link
        href="/customers"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit -ml-2 px-2 py-1"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
      </Link>

      {/* Minimal SaaS Header (Cal.com Style) */}
      <div className="relative w-full rounded-2xl overflow-hidden border bg-card shadow-sm">
        <div className="h-24 w-full bg-slate-50 dark:bg-zinc-900 border-b"></div>

        <div className="px-6 pb-6 sm:px-10 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-5">
              <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-zinc-800 border-4 border-background shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                <div className="h-full w-full flex items-center justify-center text-3xl font-bold uppercase text-zinc-900 dark:text-zinc-100">
                  {customerData.name.charAt(0)}
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{customerData.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1 text-sm font-medium">
                  <span>ID: #{customerData.id}</span>
                  <span>•</span>
                  <span>Client since {new Date(customerData.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
              <AiEmailModal
                customerId={customerData.id}
                customerName={customerData.name}
                customerEmail={customerData.email}
              />
              <Button onClick={() => window.location.href = `mailto:${customerData.email}`} className="w-full sm:w-auto gap-2 bg-zinc-950 hover:bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 rounded-md">
                <Mail className="w-4 h-4" /> Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <Tabs defaultValue="overview" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3 max-w-md bg-slate-50 dark:bg-zinc-900 p-1 rounded-full border">
          <TabsTrigger value="overview" className="rounded-full">Overview</TabsTrigger>
          <TabsTrigger value="jobs" className="rounded-full">Active Deals ({linkedJobs.length})</TabsTrigger>
          <TabsTrigger value="notes" className="rounded-full">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-none border bg-slate-50/50 dark:bg-zinc-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-muted-foreground" /> Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Email Address</span>
                  <a href={`mailto:${customerData.email}`} className="text-sm font-medium text-foreground hover:underline">{customerData.email}</a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Phone Number</span>
                  <a href={`tel:${customerData.phone}`} className="text-sm font-medium text-foreground hover:underline">{customerData.phone || "Not provided"}</a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border bg-slate-50/50 dark:bg-zinc-900/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" /> Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Added On</span>
                  <span className="text-sm font-medium">{new Date(customerData.created_at || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">Pipeline Status</span>
                  <span className="text-sm font-medium">
                    {linkedJobs.length > 0 ? <span>{linkedJobs.length} Active Deals</span> : <span className="text-muted-foreground">No active deals</span>}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <Card className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Linked Pipeline Deals</CardTitle>
              <CardDescription>All Kanban jobs associated with this customer.</CardDescription>
            </CardHeader>
            <CardContent>
              {linkedJobs.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border rounded-lg bg-slate-50 dark:bg-zinc-900 border-dashed">
                  No deals linked yet. Create one from the Jobs board!
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {linkedJobs.map((job: any) => (
                    <Link href="/jobs" key={job.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm transition-colors">{job.title}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[250px] sm:max-w-md">{job.description || "No description"}</span>
                      </div>
                      <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-400">
                        {job.status.replace("_", " ")}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card className="shadow-none border bg-slate-50/50 dark:bg-zinc-900/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className='text-sm font-semibold '
                    >Executive Notes</h3>
                    <p
                      className='text-xs text-muted-foreground'
                    >Client preferences, deal requirements, and meetig takeaways</p>
                  </div>
                  {/* Dynamic save status badge */}
                  <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                    {updateNotesMutation.isPending ? (
                      <>
                        <Loader2
                          className='h-3.5 w-3.5 animate-spin text-primary'
                        />
                        <span
                          className='text-primary font-medium'
                        >Saving...</span>
                      </>

                    ) : updateNotesMutation.isSuccess ? (
                      <>
                        <Check
                          className='h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400'
                        />
                        <span
                          className='text-emerald-600 dark:text-emerald-400 font-medium'
                        >Saved</span>
                      </>
                    ) : (
                      <span
                        className='text-[11px] text-muted-foreground/70'
                      >
                        Auto-saves on blur
                      </span>
                    )}

                  </div>

                </div>
                {/* Auto saving Textarea */}
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  placeholder='Click here to type notes for this customer... (saves automatically when you click outside)'
                  className='min-h-48 text-sm leading-relaxed p-4 bg-white dark:bg-zinc-950 border rounded-xl focus-visible:ring-1 focus-visible:ring-primary'
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerDetailsPage;
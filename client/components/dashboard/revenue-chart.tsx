"use client"


import React, { useMemo } from 'react'
import { jobsApi } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';


const RevenueChart = () => {

    const { data, isLoading } = useQuery({
        queryKey: ["jobs"],
        queryFn: () => jobsApi.getJobs()
    })

    const chartData = useMemo(() => {
        if (!data?.jobs) return []
        let pending = 0
        let inProgress = 0
        let completed = 0


        data.jobs.forEach((job: any) => {
            const value = job.deal_value || 0;
            if (job.status === "pending") pending += value
            else if (job.status === "in_progress") inProgress += value
            else if (job.status === "completed") completed += value
        })

        return [
            { name: "To Do", total: pending },
            { name: "In Progress", total: inProgress },
            { name: "Completed", total: completed },
        ]
    }, [data?.jobs])


    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const formattedValue = new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,

            }).format(payload[0].value)

            return (
                <div className='bg-background border rounded-lg shadow-sm p-3'>
                    <p className='font-medium text-sm mb-1'>{label}</p>
                    <p className='text-emerald-600 font-bold'>{formattedValue}</p>
                </div>
            )
        }
        return null
    }

    if (isLoading) {
        return (
            <Card className="col-span-1 md:col-span-2 shadow-sm">
                <CardHeader>
                    <CardTitle>Pipeline Revenue</CardTitle>
                    <CardDescription>Total deal value across all stages</CardDescription>
                </CardHeader>
                <CardContent className="flex h-[350px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className='col-span-1 md:col-span-2 shadow-none border bg-slate-50/50 dark:bg-zinc-900/50'>
            <CardHeader>
                <CardTitle>
                    Pipeline Revenue

                </CardTitle>
                <CardDescription>Total deal value across all stages</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='h-[350px] w-full'>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className='stroke-muted opacity-50' />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                // Formats large numbers cleanly (e.g. 150000 -> 150k)
                                tickFormatter={(value) => value === 0 ? "₹0" : `₹${(value / 1000).toFixed(0)}k`}
                                dx={-10}
                            />
                            <Tooltip
                                content={<CustomTooltip />}
                                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}

                            />
                            <Bar
                                dataKey="total"
                                fill="#10b981"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={60}

                            />

                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </CardContent>
        </Card>
    )
}

export default RevenueChart
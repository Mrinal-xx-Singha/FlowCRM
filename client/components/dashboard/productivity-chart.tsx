'use client'

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { TrendingUp } from "lucide-react"
import { AreaChart, CartesianGrid, ResponsiveContainer,XAxis,Tooltip,Area} from "recharts"


export function ProductivityChart({ summaryData }: { summaryData: any }) {
    const data = summaryData?.productivity_data || []

    return (
        <Card>

            <CardHeader>
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <CardTitle
                        className="text-lg"
                    >Productivity Over Time</CardTitle>
                </div>
                <CardDescription>Completed jobs over the last 6 months</CardDescription>

            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="flex h-75 items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
                        No productivity data available yet
                    </div>
                ) : (
                    <div
                        className="h-75 w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>

                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6b7280' }}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 600 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="jobs_completed"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorJobs)"
                                />
                            </AreaChart>

                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
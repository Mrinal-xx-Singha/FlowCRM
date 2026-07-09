"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader } from "../ui/card"



export function PipelineChart({ summaryData }: { summaryData: any }) {
    const data = [
        { name: "To Do", jobs: summaryData?.pending_jobs || 0, color: "#cd5ei" },
        { name: "In progress", jobs: summaryData?.in_progress_jobs || 0, color: "#f59e0b" },
        { name: "Completed", jobs: summaryData?.completed_jobs || 0, color: "#10b981" },
    ]

    return (
        <Card className="col-span-1">
            <CardHeader>Job Pipeline</CardHeader>
            <CardContent className="pl-0">
                <div className="h-75 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                opacity={0.3}
                            />
                            <XAxis dataKey="name" tickLine={false} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar
                                dataKey="jobs"
                                radius={[4, 4, 0, 0]}
                                shape={(props) => (<Rectangle
                                    {...props}
                                    fill={props.payload.color}
                                    radius={[4, 4, 0, 0]}
                                />)}
                            />
                        </BarChart>

                    </ResponsiveContainer>
                </div>

            </CardContent>

        </Card>
    )
}


"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartSkeleton } from "./chart-skeleton"
import type { BaseInputs, KPIs } from "@/lib/types"
import { projectCash12, formatCompactCurrency } from "@/lib/finance"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface CashProjectionChartProps {
  baseInputs: BaseInputs
  kpis: KPIs
}

export function CashProjectionChart({ baseInputs, kpis }: CashProjectionChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const chartData = useMemo(() => {
    const cashProjection = projectCash12(baseInputs, kpis)
    return cashProjection.map((cash, index) => ({
      month: `Month ${index + 1}`,
      cash: cash,
      formattedCash: formatCompactCurrency(cash),
    }))
  }, [baseInputs, kpis])

  const minCash = Math.min(...chartData.map((d) => d.cash))
  const maxCash = Math.max(...chartData.map((d) => d.cash))
  const cashAtZero = chartData.findIndex((d) => d.cash === 0)

  if (!isClient) {
    return <ChartSkeleton title="Cash Projection (12 Months)" description="Loading chart..." />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cash Projection (12 Months)</CardTitle>
        <CardDescription>
          Projected cash balance over time at current burn rate
          {cashAtZero > 0 && (
            <span className="text-destructive font-medium ml-2">• Cash depleted in month {cashAtZero + 1}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactCurrency(value)}
                domain={[0, maxCash * 1.1]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{label}</p>
                        <p className="text-primary">
                          Cash: <span className="font-bold">{data.formattedCash}</span>
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="cash"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#cashGradient)"
                fillOpacity={1}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="flex justify-between text-sm text-muted-foreground mt-4 pt-4 border-t">
          <div>
            <span className="font-medium">Starting Cash:</span> {formatCompactCurrency(baseInputs.cash)}
          </div>
          <div>
            <span className="font-medium">Ending Cash:</span> {formatCompactCurrency(chartData[11].cash)}
          </div>
          <div>
            <span className="font-medium">Monthly Burn:</span> {formatCompactCurrency(kpis.burn)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

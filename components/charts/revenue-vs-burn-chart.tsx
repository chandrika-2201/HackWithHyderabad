"use client"

import { useMemo, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartSkeleton } from "./chart-skeleton"
import type { BaseInputs, Levers, KPIs } from "@/lib/types"
import { computeKPIs, formatCompactCurrency } from "@/lib/finance"
import { DEFAULT_LEVERS } from "@/lib/mock"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface RevenueVsBurnChartProps {
  baseInputs: BaseInputs
  levers: Levers
  kpis: KPIs
}

export function RevenueVsBurnChart({ baseInputs, levers, kpis }: RevenueVsBurnChartProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const chartData = useMemo(() => {
    const baselineKPIs = computeKPIs(baseInputs, DEFAULT_LEVERS)

    return [
      {
        scenario: "Baseline",
        revenue: baselineKPIs.revenue,
        expenses: baselineKPIs.expenses,
        netCashFlow: baselineKPIs.revenue - baselineKPIs.expenses,
        revenueFormatted: formatCompactCurrency(baselineKPIs.revenue),
        expensesFormatted: formatCompactCurrency(baselineKPIs.expenses),
        netFormatted: formatCompactCurrency(baselineKPIs.revenue - baselineKPIs.expenses),
      },
      {
        scenario: "Current",
        revenue: kpis.revenue,
        expenses: kpis.expenses,
        netCashFlow: kpis.revenue - kpis.expenses,
        revenueFormatted: formatCompactCurrency(kpis.revenue),
        expensesFormatted: formatCompactCurrency(kpis.expenses),
        netFormatted: formatCompactCurrency(kpis.revenue - kpis.expenses),
      },
    ]
  }, [baseInputs, levers, kpis])

  const maxValue = Math.max(...chartData.flatMap((d) => [d.revenue, d.expenses]))

  if (!isClient) {
    return <ChartSkeleton title="Revenue vs Expenses" description="Loading chart..." />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Expenses</CardTitle>
        <CardDescription>Compare your baseline scenario with current adjustments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="scenario" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCompactCurrency(value)}
                domain={[0, maxValue * 1.1]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-background border rounded-lg p-4 shadow-lg">
                        <p className="font-medium mb-2">{label} Scenario</p>
                        <div className="space-y-1 text-sm">
                          <p className="flex justify-between gap-4">
                            <span className="text-primary">Revenue:</span>
                            <span className="font-bold">{data.revenueFormatted}</span>
                          </p>
                          <p className="flex justify-between gap-4">
                            <span className="text-destructive">Expenses:</span>
                            <span className="font-bold">{data.expensesFormatted}</span>
                          </p>
                          <div className="border-t pt-1">
                            <p className="flex justify-between gap-4">
                              <span>Net Cash Flow:</span>
                              <span
                                className={`font-bold ${data.netCashFlow >= 0 ? "text-primary" : "text-destructive"}`}
                              >
                                {data.netFormatted}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend />
              <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Bar
                dataKey="expenses"
                name="Expenses"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Net cash flow indicators */}
        <div className="flex justify-between text-sm mt-4 pt-4 border-t">
          {chartData.map((data, index) => (
            <div key={index} className="text-center">
              <p className="font-medium">{data.scenario}</p>
              <p className={`text-lg font-bold ${data.netCashFlow >= 0 ? "text-primary" : "text-destructive"}`}>
                {data.netCashFlow >= 0 ? "+" : ""}
                {data.netFormatted}
              </p>
              <p className="text-xs text-muted-foreground">{data.netCashFlow >= 0 ? "Profitable" : "Burning Cash"}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

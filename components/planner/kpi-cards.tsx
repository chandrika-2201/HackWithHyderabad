"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrendingUp, TrendingDown, DollarSign, Clock, Target, Info } from "lucide-react"
import type { BaseInputs, Levers } from "@/lib/types"
import { computeKPIs, formatCompactCurrency } from "@/lib/finance"
import { DEFAULT_LEVERS } from "@/lib/mock"

interface KpiCardsProps {
  baseInputs: BaseInputs
  levers: Levers
}

export function KpiCards({ baseInputs, levers }: KpiCardsProps) {
  const currentKPIs = computeKPIs(baseInputs, levers)
  const baselineKPIs = computeKPIs(baseInputs, DEFAULT_LEVERS)

  const kpiData = [
    {
      title: "Monthly Burn Rate",
      description: "Net cash outflow per month",
      icon: DollarSign,
      value: currentKPIs.burn,
      baseline: baselineKPIs.burn,
      format: formatCompactCurrency,
      tooltip: "Monthly expenses minus revenue. Lower is better for cash preservation.",
      color: currentKPIs.burn > baselineKPIs.burn ? "destructive" : "primary",
      gradient: "from-red-500 to-orange-500",
    },
    {
      title: "Cash Runway",
      description: "Months until cash runs out",
      icon: Clock,
      value: currentKPIs.runwayMonths,
      baseline: baselineKPIs.runwayMonths,
      format: (val: number) => `${val.toFixed(1)} months`,
      tooltip: "How long your cash will last at current burn rate. Higher is better.",
      color: currentKPIs.runwayMonths < baselineKPIs.runwayMonths ? "destructive" : "primary",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      title: "Gross Profit",
      description: "Monthly profit after direct costs",
      icon: Target,
      value: currentKPIs.grossProfit,
      baseline: baselineKPIs.grossProfit,
      format: formatCompactCurrency,
      tooltip: "Revenue × gross margin - marketing - infrastructure - 50% of new hire costs.",
      color: currentKPIs.grossProfit < baselineKPIs.grossProfit ? "destructive" : "primary",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpiData.map((kpi, index) => {
          const delta = kpi.value - kpi.baseline
          const deltaPercent = kpi.baseline !== 0 ? (delta / Math.abs(kpi.baseline)) * 100 : 0
          const isPositiveChange = delta > 0
          const isImprovement =
            (kpi.title === "Cash Runway" && isPositiveChange) ||
            (kpi.title === "Gross Profit" && isPositiveChange) ||
            (kpi.title === "Monthly Burn Rate" && !isPositiveChange)

          return (
            <Card
              key={index}
              className={`relative overflow-hidden backdrop-blur-sm bg-white/80 border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-4 duration-700`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <div className={`p-1.5 rounded-full bg-gradient-to-br ${kpi.gradient} shadow-sm`}>
                    <kpi.icon className="h-4 w-4 text-white" />
                  </div>
                  {kpi.title}
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 text-muted-foreground hover:text-primary transition-colors duration-200" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{kpi.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  {kpi.format(kpi.value)}
                </div>
                <CardDescription className="flex items-center justify-between mt-2">
                  <span>{kpi.description}</span>
                  {Math.abs(delta) > 0.01 && (
                    <Badge
                      variant={isImprovement ? "default" : "destructive"}
                      className={`text-xs flex items-center gap-1 transition-all duration-300 hover:scale-110 ${
                        isImprovement
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                      }`}
                    >
                      {isPositiveChange ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(deltaPercent) > 1000
                        ? `${isPositiveChange ? "+" : ""}${delta > 0 ? kpi.format(delta) : kpi.format(Math.abs(delta))}`
                        : `${isPositiveChange ? "+" : ""}${deltaPercent.toFixed(1)}%`}
                    </Badge>
                  )}
                </CardDescription>
              </CardContent>

              {/* Visual indicator with gradient */}
              <div
                className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${
                  isImprovement ? kpi.gradient : "from-red-500 to-rose-500"
                } opacity-60 transition-opacity duration-300 hover:opacity-80`}
              />
            </Card>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
